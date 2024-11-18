<template>

  <TreeTable :value="data" tableStyle="min-width: 50rem">
      <Column field="label" header="Components">
        <template #body="slotProps">
          <div class="flex flex-row w-full justify-between items-center">
            <div class="flex flex-col gap-y-2">
              <p>{{ slotProps.node.label }}</p>
              <div class="flex flex-row gap-x-4">
                <Badge severity="secondary" :value="`${slotProps.node.data.parents.length} parents`" />
                <Badge severity="secondary" :value="`${slotProps.node.data.children.length} children`" />
              </div>
            </div>
            <div class="flex flex-row justify-end gap-x-2">
              <Button icon="pi pi-copy" @click="copyToClipboard(slotProps.node.data.filename)" title="Copy filename to clipboard" class="p-button-text p-button-sm" />
              <Button icon="pi pi-share-alt" @click="componentLocationStore.focusComponent = slotProps.node.key" class="p-button-text p-button-sm" />
            </div>
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
import Badge from 'primevue/badge';
import { toRefs } from 'vue';
import { useComponentLocationStore } from '../stores/ComponentLocation';

const props = withDefaults(
  defineProps<{
    data: TreeNode[]
  }>(),
  {
    data: () => []
  }
);
const { data } = toRefs(props);
const componentLocationStore = useComponentLocationStore();

const { add: toast } = useToast();

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({ severity: 'success', detail: 'File copied to clipboard', life: 3000 });
  } catch (err) {
    toast({ severity: 'error', detail: 'File copied to clipboard', life: 3000 });
  }
}
</script>