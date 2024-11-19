<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-start p-4">
      <template v-if="!componentsStore.focusComponent">
        <FloatLabel variant="on" class="grow pr-4">
          <MultiSelect id="dir" class="w-full" v-model="componentsStore.directories" :options="componentsStore.directoryOptions" optionLabel="name" optionValue="value" />
          <label for="dir">Directory...</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="component_search" v-model="componentsStore.query" />
          <label for="component_search">Component...</label>
        </FloatLabel>
        <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentsStore.query" class="p-button-text p-button-sm" />
      </template>
    </div>
    <div v-if="!componentsStore.focusComponent" class="w-full flex flex-row items-center justify-end p-4">
      <div class="flex flex-row items-center justify-end gap-x-2">
        <div class="text-sm text-surface-400">Found {{ componentsStore.count }} components</div>
      </div>
    </div>
    <div class="overflow-y-auto px-4 flex flex-row grow w-full">
      <ComponentList v-if="!componentsStore.focusComponent" class="grow" />
      <ComponentConnections v-if="componentsStore.focusComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ComponentList from './components/ComponentList.vue';
import ComponentConnections from './components/ComponentConnections.vue';
import { useComponentsStore } from './stores/Components';
import { onBeforeMount } from 'vue';

const componentsStore = useComponentsStore();

function onClearClick() {
  componentsStore.query = '';
}

onBeforeMount(() => {
  componentsStore.load();
});

</script>