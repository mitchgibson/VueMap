<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-end p-4">
      <FloatLabel variant="on">
      <InputText id="component_search" v-model="componentName" @keydown.enter="onSearch" />
      <label for="component_search">Search...</label>
    </FloatLabel>
    </div>
    <div class="w-full h-full overflow-y-auto">
      <TreeTable :value="treeNodes" tableStyle="min-width: 50rem">
          <Column field="label" header="Component" expander style="width: 30%">
            <template #body="slotProps">
            {{ slotProps.node.label }}
          </template>
          </Column>
      </TreeTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FloatLabel, InputText, TreeTable, Column} from 'primevue';
import { ref } from 'vue';
import { TreeNode } from 'primevue/treenode';

const componentName = ref<string>('');

const searchResults = ref<any>({})

const treeNodes = ref<TreeNode[]>([]);

async function onSearch() {
  const results = await fetch(`http://127.0.0.1:8080/nodes?dir=/Users/mitchdelachevrotiere/dev/knak/packages/builder/src&filter=${componentName.value}`);
  const data = await results.json();
  searchResults.value = data;

  treeNodes.value = toTreeNodes(data.nodes);

  console.log(treeNodes.value)
}

function toTreeNodes(data: {[key: string]: {componentName:string, locations: string[]}}): TreeNode[] {
  return Object.keys(data).map(key => {
    return {
      key: key,
      label: data[key].componentName,
      children: data[key].locations.map(location => {
        return {
          key: location,
          label: location
        }
      })
    }
  });
}

</script>