<template>
  <Toast />
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-end p-4">
      <FloatLabel variant="on" class="grow pr-4">
        <MultiSelect id="dir" class="w-full" v-model="componentLocations.directories" :options="componentLocations.directoryOptions" optionLabel="name" optionValue="value" />
        <label for="dir">Directory...</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="component_search" v-model="componentLocations.query" />
        <label for="component_search">Component...</label>
      </FloatLabel>
      <Button icon="pi pi-bullseye" :severity="searchSeverity" title="Exact match" @click="componentLocations.exactMatch = !componentLocations.exactMatch" class="p-button-text p-button-sm" />
      <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentLocations.query" class="p-button-text p-button-sm" />
    </div>
    <div class="w-full flex flex-row items-center justify-end p-4">
      <div class="flex flex-row items-center justify-end gap-x-2">
        <div class="text-sm text-surface-400">Found {{ componentLocations.count }} components</div>
      </div>
    </div>
    <div class="w-full overflow-y-auto px-4 flex flex-row grow">
      <!-- <ComponentLocationTable v-if="componentLocations.components.length > 1" :data="componentLocations.components" @location-search="onLocationSearch" /> -->
      <ComponentConnections v-if="componentLocations.graph.nodes.length > 0" :data="componentLocations.graph" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { computed } from 'vue';
import { Location } from './types/Location';;
import ComponentLocationTable from './components/ComponentLocationTable.vue';
import ComponentConnections from './components/ComponentConnections.vue';
// import { useComponentLocationStore } from './stores/ComponentLocation';
import { useComponentMapStore } from './stores/ComponentMap';

const componentLocations = useComponentMapStore();

const searchSeverity = computed(() => componentLocations.exactMatch ? 'success' : 'secondary');

function onLocationSearch(location: Location) {
  componentLocations.query = location.filename.split('.')[0];
}

function onClearClick() {
  componentLocations.query = '';
}

</script>