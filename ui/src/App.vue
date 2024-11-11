<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-end p-4">
      <FloatLabel variant="on" class="grow pr-4">
        <MultiSelect id="dir" class="w-full" v-model="selectedDirectories" @change="onSearch" :options="directories" optionLabel="name" optionValue="value" />
        <label for="dir">Directory...</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="component_search" v-model="componentName" @input="onSearch" />
        <label for="component_search">Component...</label>
      </FloatLabel>
      <Button icon="pi pi-bullseye" :severity="searchSeverity" title="Exact match" @click="onExactMatchClick" class="p-button-text p-button-sm" />
      <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentName" class="p-button-text p-button-sm" />
    </div>
    <div class="w-full flex flex-row items-center justify-end p-4">
      <div class="flex flex-row items-center justify-end gap-x-2">
        <div class="text-sm text-surface-400">Found {{ searchResults.count }} components</div>
      </div>
    </div>
    <div class="w-full overflow-y-auto px-4">
      <TreeTable :value="treeNodes" tableStyle="min-width: 50rem">
          <Column field="label" header="Components" expander>
            <template #body="slotProps">
              <div v-if="slotProps.node.data" class="flex flex-row w-full px-4 py-2 items-start justify-between">
                <div class="flex flex-col">
                  <div class="text-base text-surface-300">{{ slotProps.node.data.filename }}</div>
                  <div class="text-sm text-surface-400 capitalize">{{ slotProps.node.data.package }}</div>
                  <div class="text-sm text-surface-400 mt-2">{{ slotProps.node.data.path }}</div>
                </div>
                <div class="flex flex-row items-start justify-end gap-x-2">
                  <Button icon="pi pi-copy" @click="copyToClipboard(slotProps.node.data.filename)" class="p-button-text p-button-sm" />
                  <Button icon="pi pi-search" @click="onLocationClick(slotProps.node.data)" class="p-button-text p-button-sm" />
                </div>
              </div>
              <div v-else>
                {{ slotProps.node.label }} ({{ slotProps.node.children.length }})
              </div>
            </template>
          </Column>
      </TreeTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { TreeNode } from 'primevue/treenode';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, ref } from 'vue';

type Location = {
  path: string;
  filename: string;
  package: string;
}

type Directory = {
  name: string;
  value: string;
}

const componentName = ref<string>('');
const exactMatch = ref<boolean>(true);
  const searchResults = ref<any>({})
const searchSeverity = computed(() => exactMatch.value ? 'success' : 'secondary');
const directories:Directory[] = [
  { name: 'Builder', value: '/Users/mitchdelachevrotiere/dev/knak/packages/builder/src' },
  { name: 'Kui', value: '/Users/mitchdelachevrotiere/dev/knak/packages/kui/src' },
  { name: 'Enterprise', value: '/Users/mitchdelachevrotiere/dev/knak/packages/enterprise/resources' },
];
const selectedDirectories = ref(directories.map(d => d.value));

const treeNodes = ref<TreeNode[]>([]);
const { add: toast } = useToast();

onBeforeMount(() => {
  onSearch();
});

function onLocationClick(location: Location) {
  componentName.value = location.filename.split('.')[0];
  onSearch();
}

function onClearClick() {
  componentName.value = '';
  onSearch();
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({ severity: 'success', detail: 'File copied to clipboard', life: 3000 });
  } catch (err) {
    toast({ severity: 'error', detail: 'File copied to clipboard', life: 3000 });
  }
}

function onExactMatchClick() {
  exactMatch.value = !exactMatch.value;
  onSearch();
}

async function onSearch() {
  if(!selectedDirectories.value) {
    return;
  }
  const results = await fetch(`http://127.0.0.1:8080/nodes?dir=${selectedDirectories.value?.join(',')}&filter=${componentName.value}&exact=${exactMatch.value}`);
  const data = await results.json();
  searchResults.value = data;

  treeNodes.value = toTreeNodes(data.nodes);
}

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

</script>