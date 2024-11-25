<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <Async :loading="settingsStore.$loading" :error="settingsStore.$error">
      <div class="flex flex-col w-full py-2">
        <div class="flex flex-row w-full items-center justify-between px-2">
          <div class="pl-3 flex flex-row items-center justify-start">
            <RouterTitle />
            <RouterView name="headerLeft" />
          </div>
          <div class="flex flex-row items-center justify-end">
            <RouterView name="headerRight" />
            <SettingsButton severity="secondary" variant="text" />
          </div>
        </div>
        <div class="px-5 pb-2 text-xs">
          <Breadcrumb />
        </div>
      </div>
      <RouterView name="content" />
    </Async>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { useSettingsStore } from './stores/Settings';
import Async from './components/state/Async.vue';
import RouterTitle from './components/navigation/RouterTitle.vue';
import Breadcrumb from './components/navigation/Breadcrumbs.vue';
import SettingsButton from './components/settings/SettingsButton.vue';

const settingsStore = useSettingsStore();
import { useNavigator } from './stores/navigator/Navigator';
settingsStore.init().then(() => {
  useNavigator();
});
</script>