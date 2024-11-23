<template>
<Async :loading="componentsStore.$loading" :error="componentsStore.$error">
      <ComponentListFilters class="py-4" />
      <div class="flex flex-row grow overflow-auto">
        <div class="flex flex-col w-full px-4 pb-4 gap-y-4 divide-y divide-surface-800">
          <div v-for="item in componentsStore.list" class="flex flex-row w-full justify-between items-center">
            <div class="flex flex-col w-full">
              <div class="flex flex-row w-full justify-between items-center pt-4 pb-2">
                  <div class="flex flex-col gap-y-2">
                    <p>{{ item.component_name }}</p>
                    <p class="text-sm text-surface-400">{{ item.filename }}</p>
                    <div class="flex flex-row gap-x-4">
                      <Badge severity="secondary" :value="`${item.locations.length} parents`" />
                      <Badge severity="secondary" :value="`${item.children.length} children`" />
                    </div>
                  </div>
                  <div class="flex flex-row justify-end gap-x-2">
                    <Button icon="pi pi-copy" @click="copyToClipboard(item.filename)" title="Copy filename to clipboard" class="p-button-text p-button-sm" />
                    <Button icon="pi pi-share-alt" @click="onConnectionsClick(item)" class="p-button-text p-button-sm" />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <Footer>
        <template #right>Found {{ componentsStore.count }} components</template>
      </Footer>
    </Async>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import { useComponentsStore } from '../../stores/Components';
import { ComponentStruct } from '../../structs/Component';
import { useNavigator } from '../../stores/navigator/Navigator';
import Async from '../state/Async.vue';
import ComponentListFilters from './ComponentListFilters.vue';
import Footer from '../navigation/Footer.vue';

const componentsStore = useComponentsStore();

const { add: toast } = useToast();
const navigate = useNavigator();

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast({ severity: 'success', detail: 'Filename copied to clipboard', life: 3000 });
  } catch (err) {
    toast({ severity: 'error', detail: 'Copy failed', life: 3000 });
  }
}

function onConnectionsClick(item: ComponentStruct) {
  navigate.next({
    path: `/component-connections/${item.component_name}`,
    label: item.component_name,
    command: () => {
      componentsStore.focusComponent = item.component_name;
    }
  });
}

</script>