<template>
<Async :loading="componentsStore.$loading" :error="componentsStore.$error">
      <ComponentListFilters v-if="!componentsStore.$empty || componentsStore.$searching" class="py-4" />
      <div class="flex flex-row grow overflow-auto">
        <div class="flex flex-col w-full px-4 pb-4 gap-y-4 divide-y divide-surface-800">
          <div v-if="componentsStore.$empty" class="flex flex-col w-full h-full items-center justify-center text-sm text-surface-400">
            <i class="pi pi-exclamation-circle !text-4xl" />
            <p class="text-lg mt-4">No components found</p>
            <p v-if="!componentsStore.$searching">Try adding a directory scope in Settings.</p>
            <p v-if="componentsStore.$searching">Try a different search query or adding more directory scopes in Settings.</p>
            <SettingsButton class="mt-4" variant="outlined">Settings</SettingsButton>
          </div>
          <div v-else class="px-4">
            <template v-for="item in componentsStore.list">
              <ComponentListItem :item="item" @copy-filename="copyToClipboard" @connections="onConnectionsClick" />
            </template>
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
import { useComponentsStore } from '../../stores/Components';
import { ComponentStruct } from '../../structs/Component';
import { useNavigator } from '../../stores/navigator/Navigator';
import Async from '../state/Async.vue';
import ComponentListFilters from './ComponentListFilters.vue';
import Footer from '../navigation/Footer.vue';
import ComponentListItem from './ComponentListItem.vue';
import SettingsButton from '../settings/SettingsButton.vue';
import { onMounted } from 'vue';

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

onMounted(() => {
  console.log("calling load");
  componentsStore.load();
});

</script>