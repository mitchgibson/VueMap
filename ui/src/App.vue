<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <Async :loading="settingsStore.$loading" :error="settingsStore.$error">
      <div class="flex flex-row w-full h-20 items-center justify-between bg-surface-900">
        <RouterView name="headerLeft" />
        <RouterView name="headerCenter" />
        <RouterView name="headerRight" />
      </div>
      <RouterView name="content" />
    </Async>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { useSettingsStore } from './stores/Settings';
import Async from './components/state/Async.vue';

const settingsStore = useSettingsStore();
settingsStore.init();
</script>