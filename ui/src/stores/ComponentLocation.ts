import { defineStore } from 'pinia';
import { TreeNode } from 'primevue/treenode';
import { computed, ref, watch } from 'vue';
import { Location } from '../types/Location';
import { Directory } from '../types/Directory';
import { Node, Edge } from '@vue-flow/core';
import { Component } from '../types/Component';

export const useComponentLocationStore = defineStore('ComponentLocation', () => {
  const directoryOptions:Directory[] = [
    { name: 'Builder', value: '/Users/mitchdelachevrotiere/dev/knak/packages/builder/src' },
    { name: 'Kui', value: '/Users/mitchdelachevrotiere/dev/knak/packages/kui/src' },
    { name: 'Enterprise', value: '/Users/mitchdelachevrotiere/dev/knak/packages/enterprise/resources' },
  ];

  const directories = ref(directoryOptions.map(d => d.value));
  const rawData = ref<{[key: string]: Component}>({});
  const query = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const exactMatch = ref<boolean>(true);
  const components = ref<TreeNode[]>([]);
  const count = computed(() => components.value.length);
  const focusComponent = ref<string>('');
  const graph = ref<{nodes: Node[], edges: Edge[]}>({ nodes: [], edges: [] });

  watch(focusComponent, () => {
    if(focusComponent.value) {
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
          data: { label: location.filename },
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
  });

  async function search() {
    if(!directories.value) {
      return;
    }
    loading.value = true;
    error.value = false;
    try {
      const results = await fetch(`http://127.0.0.1:3000/nodes?dir=${directories.value?.join(',')}&filter=${query.value}&exact=${exactMatch.value}`);
      const data = await results.json();
      rawData.value = data.nodes;
      components.value = toTreeNodes(data.nodes); 
    } catch(err) {
      error.value = true;
    }
    loading.value = false;
  }
  search();
  watch(query, () => {
    search();
  });
  watch(exactMatch, () => {
    search();
  });
  watch(directories, () => {
    search();
  });

  function toTreeNodes(data: {[key: string]: {component_name:string, locations: Location[]}}): TreeNode[] {
    return Object.keys(data).map(key => {
      return {
        key: key,
        label: data[key].component_name,
        children: data[key].locations.map(location => {
          return {
            key: location.path,
            label: location.filename,
            data: location
          }
        })
      }
    });
  }

  return {
    components,
    search,
    exactMatch,
    query,
    loading,
    error,
    directories,
    directoryOptions,
    count,
    focusComponent,
    graph
  }
});