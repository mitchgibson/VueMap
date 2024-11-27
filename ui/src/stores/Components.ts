import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { DirectoryStruct } from '../structs/Directory';
import { Node, Edge } from '@vue-flow/core';
import { ComponentStruct } from '../structs/Component';
import { useSettingsStore } from './Settings';

export const useComponentsStore = defineStore('ComponentLocation', () => {
  const settingsStore = useSettingsStore();
  const directoryOptions = ref<readonly DirectoryStruct[]>(settingsStore.$settings.scopes);
  
  const directories = ref(directoryOptions.value.map(d => d.value));
  const rawData = ref<{[key: string]: ComponentStruct}>({});
  const query = ref<string>('');
  const focusComponent = ref<string>('');
  const graph = ref<{nodes: Node[], edges: Edge[]}>({ nodes: [], edges: [] });
  const list = ref<ComponentStruct[]>([]);
  const count = computed(() => list.value.length);
  const $loading = ref<boolean>(false);
  const $error = ref<boolean>(false);
  const $empty = computed(() => list.value.length === 0);
  const $searching = computed(() => !!query.value.length);

  watch(focusComponent, () => {
    buildGraph();
  });

  watch(() => settingsStore.$settings.scopes, () => {
    directoryOptions.value = settingsStore.$settings.scopes;
    directories.value = directoryOptions.value.map(d => d.value);
  }, { flush: 'pre' });

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

  async function load() {
    $loading.value = true;
    $error.value = false;
    try {
      if(!directories.value || directories.value.length === 0) {
        rawData.value = {};
        list.value = [];
        $loading.value = false;
        $error.value = false;
        return;
      }
      const results = await fetch(`http://127.0.0.1:3000/api/nodes?dir=${directories.value?.join(',')}&exact=false`);
      const data = await results.json();
      rawData.value = data.nodes;
      search();
    } catch(err) {
      $error.value = true;
    }
    $loading.value = false;
  }

  async function search() {
    if(!directories.value) {
      $loading.value = false;
      $error.value = false;
      return;
    }
    $loading.value = true;
    $error.value = false;
    try {
      const filteredData = Object.keys(rawData.value).filter(key => {
        const lowercaseKey = key.toLowerCase();
        const lowercaseQuery = query.value.toLowerCase();
        const keyStripped = lowercaseKey.replace(/-/g, '');
        const queryStripped = lowercaseQuery.replace(/-/g, '');
        return keyStripped.includes(queryStripped);
      });
      let data = rawData.value;
      if(query.value) {
        data = filteredData.reduce((acc: {[key: string]: ComponentStruct}, key) => {
          acc[key] = rawData.value[key];
          return acc;
        }, {});
      }
      list.value = toList(data);
    } catch(err) {
      $error.value = true;
    }
    $loading.value = false;
  }

  watch(query, () => {
    search();
  });

  watch(directories, () => {
    load();
  });

  function toList(data: {[key: string]: ComponentStruct}) {
    return Object.keys(data).map(key => data[key]);
  }

  function getComponent(key: string) {
    return rawData.value[key];
  }

  return {
    load,
    search,
    query,
    $loading,
    $error,
    $empty,
    $searching,
    directories,
    directoryOptions,
    count,
    focusComponent,
    graph,
    list,
    getComponent,
  }
});