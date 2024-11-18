<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-start p-4">
      <Button v-if="componentLocations.focusComponent" variant="text" icon="pi pi-angle-left" @click="componentLocations.focusComponent = ''" />
      <template v-if="!componentLocations.focusComponent">
        <FloatLabel variant="on" class="grow pr-4">
          <MultiSelect id="dir" class="w-full" v-model="componentLocations.directories" :options="componentLocations.directoryOptions" optionLabel="name" optionValue="value" />
          <label for="dir">Directory...</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="component_search" v-model="componentLocations.query" />
          <label for="component_search">Component...</label>
        </FloatLabel>
        <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentLocations.query" class="p-button-text p-button-sm" />
      </template>
    </div>
    <div v-if="!componentLocations.focusComponent" class="w-full flex flex-row items-center justify-end p-4">
      <div class="flex flex-row items-center justify-end gap-x-2">
        <div class="text-sm text-surface-400">Found {{ componentLocations.count }} components</div>
      </div>
    </div>
    <div class="overflow-y-auto px-4 flex flex-row grow w-full">
      <ComponentLocationTable v-if="!componentLocations.focusComponent" class="grow" :data="componentLocations.components" />
      <ComponentConnections v-if="componentLocations.focusComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ComponentLocationTable from './components/ComponentLocationTable.vue';
import ComponentConnections from './components/ComponentConnections.vue';
import { useComponentsStore } from './stores/Components';
import { onBeforeMount } from 'vue';

const componentLocations = useComponentsStore();

function onClearClick() {
  componentLocations.query = '';
}

onBeforeMount(() => {
  componentLocations.load();
});

</script>