<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="px-4 w-full h-full">
      <Async :loading="settingsStore.$loading" :error="settingsStore.$error">
        <RouterView />
      </Async>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { useSettingsStore } from './stores/Settings';
import Async from './components/state/Async.vue';

const settingsStore = useSettingsStore();
settingsStore.init();
</script>