<template>

  <TreeTable :value="data" tableStyle="min-width: 50rem">
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

</template>

<script lang="ts" setup>
import { TreeNode } from 'primevue/treenode';
import TreeTable from 'primevue/treetable';
import { useToast } from 'primevue/usetoast';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { toRefs } from 'vue';
import { Location } from '../types/Location';

const props = withDefaults(
  defineProps<{
    data: TreeNode[]
  }>(),
  {
    data: () => []
  }
);
const { data } = toRefs(props);

const { add: toast } = useToast();

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({ severity: 'success', detail: 'File copied to clipboard', life: 3000 });
  } catch (err) {
    toast({ severity: 'error', detail: 'File copied to clipboard', life: 3000 });
  }
}

function onLocationClick(location: Location) {
  emit('location-search', location);
}

const emit = defineEmits<{
  (event: 'location-search', value: Location): void;
}>();

</script>