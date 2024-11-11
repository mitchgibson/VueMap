import { defineStore } from 'pinia';
import { TreeNode } from 'primevue/treenode';
import { computed, ref, watch } from 'vue';
import { Location } from '../types/Location';
import { Directory } from '../types/Directory';

export const useComponentLocationStore = defineStore('ComponentLocation', () => {
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
  const components = ref<TreeNode[]>([]);
  const count = computed(() => components.value.length);

  async function search() {
    if(!directories.value) {
      return;
    }
    loading.value = true;
    error.value = false;
    try {
      const results = await fetch(`http://127.0.0.1:8080/nodes?dir=${directories.value?.join(',')}&filter=${query.value}&exact=${exactMatch.value}`);
      const data = await results.json();
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
    count
  }
});