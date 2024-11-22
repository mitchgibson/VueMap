<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="overflow-y-auto px-4 flex flex-row grow w-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { useComponentsStore } from './stores/Components';
import { onBeforeMount } from 'vue';

const componentsStore = useComponentsStore();

onBeforeMount(() => {
  componentsStore.loadSettings(); // TODO: move settings to its own store
});

</script>