<template>

<div class="w-full flex flex-row items-center justify-start">
  <FloatLabel variant="on" class="grow pr-4">
      <MultiSelect id="dir" class="w-full" v-model="componentsStore.directories" :options="componentsStore.directoryOptions" optionLabel="name" optionValue="value" />
      <label for="dir">Directory...</label>
    </FloatLabel>
    <FloatLabel variant="on">
      <InputText id="component_search" v-model="componentsStore.query" />
      <label for="component_search">Component...</label>
    </FloatLabel>
    <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentsStore.query" class="p-button-text p-button-sm" />
</div>

</template>

<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';
import { useComponentsStore } from '../../stores/Components';

const componentsStore = useComponentsStore();

function onClearClick() {
  componentsStore.query = '';
}

</script>

<style scoped>



</style>