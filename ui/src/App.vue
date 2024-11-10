<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-end p-4">
      <FloatLabel variant="on" class="grow pr-4">
        <InputText id="dir" v-model="directory" class="w-full" @blur="onSearch" />
        <label for="dir">Directory...</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="component_search" v-model="componentName" @input="onSearch" />
        <label for="component_search">Component...</label>
      </FloatLabel>
      <Button icon="pi pi-bullseye" :severity="searchSeverity" title="Exact match" @click="onExactMatchClick" class="p-button-text p-button-sm" />
      <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentName" class="p-button-text p-button-sm" />
    </div>
    <div class="w-full h-full overflow-y-auto px-4">
      <TreeTable :value="treeNodes" tableStyle="min-width: 50rem">
          <Column field="label" header="Components" expander>
            <template #body="slotProps">
              <div v-if="slotProps.node.data" class="flex flex-row w-full px-4 py-2 items-center justify-between">
                <div>
                  {{ slotProps.node.data.filename }}
                  <div class="text-sm text-surface-400">{{ slotProps.node.data.path }}</div>
                </div>
                <div class="flex flex-row items-center justify-end gap-x-2">
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
import FloatLabel from 'primevue/floatlabel';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { TreeNode } from 'primevue/treenode';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import { computed, onBeforeMount, ref } from 'vue';

const componentName = ref<string>('');
const exactMatch = ref<boolean>(false);
const searchSeverity = computed(() => exactMatch.value ? 'success' : 'secondary');
const directory = ref<string>('/Users/mitchdelachevrotiere/dev/knak/packages/builder/src');
const searchResults = ref<any>({})

const treeNodes = ref<TreeNode[]>([]);
const { add: toast } = useToast();

onBeforeMount(() => {
  onSearch();
});

function onLocationClick(location: {path:string; filename:string}) {
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
  if(!directory.value) {
    alert("Must set valid directory");
    return;
  }
  const results = await fetch(`http://127.0.0.1:8080/nodes?dir=${directory.value}&filter=${componentName.value}&exact=${exactMatch.value}`);
  const data = await results.json();
  searchResults.value = data;

  treeNodes.value = toTreeNodes(data.nodes);
}

function toTreeNodes(data: {[key: string]: {component_name:string, locations: {path:string; filename:string}[]}}): TreeNode[] {
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