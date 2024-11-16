import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Directory } from '../types/Directory';

export const useComponentMapStore = defineStore('ComponentMap', () => {
  const directoryOptions:Directory[] = [
    { name: 'Builder', value: '/Users/mitchdelachevrotiere/dev/knak/packages/builder/src' },
    { name: 'Kui', value: '/Users/mitchdelachevrotiere/dev/knak/packages/kui/src' },
    { name: 'Enterprise', value: '/Users/mitchdelachevrotiere/dev/knak/packages/enterprise/resources' },
  ];

  const directories = ref(directoryOptions.map(d => d.value));
  const query = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const exactMatch = ref<boolean>(true);
  const graph = ref<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] });
  const count = computed(() => graph.value.nodes.length);

  async function search() {
    if(!directories.value) {
      return;
    }
    loading.value = true;
    error.value = false;
    try {
      const results = await fetch(`http://127.0.0.1:3000/nodes?dir=${directories.value?.join(',')}&filter=${query.value}&exact=${exactMatch.value}`);
      const data = await results.json();
      graph.value = data.graph; 
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

  return {
    graph,
    search,
    exactMatch,
    query,
    loading,
    error,
    directories,
    directoryOptions,
    count
  }
});