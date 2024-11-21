import { defineStore } from 'pinia';
import { TreeNode } from 'primevue/treenode';
import { computed, ref, watch } from 'vue';
import { Directory } from '../types/Directory';
import { Node, Edge } from '@vue-flow/core';
import { Component } from '../types/Component';

export const useComponentsStore = defineStore('ComponentLocation', () => {
  let directoryOptions:Directory[] = [
    { name: 'Builder', value: '/Users/mitchdelachevrotiere/dev/knak/packages/builder/src' },
    { name: 'Kui', value: '/Users/mitchdelachevrotiere/dev/knak/packages/kui/src' },
    { name: 'Enterprise', value: '/Users/mitchdelachevrotiere/dev/knak/packages/enterprise/resources' },
  ];
  
  const directories = ref(directoryOptions.map(d => d.value));
  const rawData = ref<{[key: string]: Component}>({});
  const query = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const components = ref<TreeNode[]>([]);
  const count = computed(() => components.value.length);
  const focusComponent = ref<string>('');
  const graph = ref<{nodes: Node[], edges: Edge[]}>({ nodes: [], edges: [] });
  const list = ref<Component[]>([]);

  watch(focusComponent, () => {
    buildGraph();
  });

  function buildGraph() {
    graph.value = { nodes: [], edges: [] };
    const focalPoint = rawData.value[focusComponent.value];
    if(!focalPoint) return;

    graph.value.nodes.push({
      id: focalPoint.component_name,
      type: 'default',
      position: { x: 0, y: 300 },
      data: { label: focalPoint.component_name },
    });

    const parentCount = focalPoint.locations.length;
    const parentMiddleIndex = Math.floor(parentCount / 2);
    const parentMiddleX = (parentMiddleIndex * 200);

    for(let i = 0; i < focalPoint.locations.length; i++) {
      const location = focalPoint.locations[i];
      graph.value.nodes.push({
        id: location.component,
        type: 'input',
        position: { x: (i * 200) - parentMiddleX, y: 200 },
        data: { label: location.component },
      });
      graph.value.edges.push({
        id: `${location.component}->${focalPoint.component_name}`,
        source: location.component,
        target: focalPoint.component_name,
        animated: true,
      });
    }

    const childCount = focalPoint.children.length;
    const childMiddleIndex = Math.floor(childCount / 2);
    const childMiddleX = (childMiddleIndex * 200);

    for(let i = 0; i < focalPoint.children.length; i++) {
      const child = focalPoint.children[i];
      graph.value.nodes.push({
        id: child,
        type: 'output',
        position: { x: (i * 200) - childMiddleX, y: 400 },
        data: { label: child },
      });
      graph.value.edges.push({
        id: `${focalPoint.component_name}->${child}`,
        source: focalPoint.component_name,
        target: child,
        animated: true
      });
    }
  }

  async function loadSettings() {
    const results = await fetch(`http://127.0.0.1:3000/settings`);
    const data = await results.json();
    if(!data || !data.scopes || data.scopes.length === 0) {
      await fetch(`http://127.0.0.1:3000/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scopes: directoryOptions
        })
      });
    }
    directoryOptions = data.scopes as Directory[];
    directories.value = directoryOptions.map(d => d.value);
  }

  async function load() {
    loading.value = true;
    error.value = false;
    try {
      if(!directories.value || directories.value.length === 0) {
        return;
      }
      const results = await fetch(`http://127.0.0.1:3000/nodes?dir=${directories.value?.join(',')}&exact=false`);
      const data = await results.json();
      rawData.value = data.nodes;
      search();
    } catch(err) {
      error.value = true;
    }
    loading.value = false;
  }

  async function search() {
    if(!directories.value) {
      return;
    }
    loading.value = true;
    error.value = false;
    try {
      const filteredData = Object.keys(rawData.value).filter(key => key.includes(query.value));
      let data = rawData.value;
      if(query.value) {
        data = filteredData.reduce((acc: {[key: string]: Component}, key) => {
          acc[key] = rawData.value[key];
          return acc;
        }, {});
      }
      components.value = toTreeNodes(data);
      list.value = toList(data);
    } catch(err) {
      error.value = true;
    }
    loading.value = false;
  }

  watch(query, () => {
    search();
  });

  watch(directories, () => {
    load();
  });

  function toTreeNodes(data: {[key: string]: Component}): TreeNode[] {
    return Object.keys(data).map(key => {
      return {
        key: key,
        label: data[key].component_name,
        data: {
          filename: data[key].filename,
          parents: data[key].locations.map(location => {
            return {
              key: location.path,
              label: location.filename,
              data: location
            }
          }),
          children: data[key].children
        }
      }
    });
  }

  function toList(data: {[key: string]: Component}) {
    return Object.keys(data).map(key => data[key]);
  }

  function getComponent(key: string) {
    return rawData.value[key];
  }

  return {
    loadSettings,
    search,
    query,
    loading,
    error,
    directories,
    directoryOptions,
    count,
    focusComponent,
    components,
    graph,
    list,
    getComponent
  }
});