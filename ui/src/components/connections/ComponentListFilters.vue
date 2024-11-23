<template>

<div class="w-full flex flex-col items-start justify-center">
  <div class="flex flex-row flex-wrap w-full items-center justify-start gap-x-2 gap-y-2 px-6">
    <FloatLabel variant="on">
      <MultiSelect id="dir" class="w-96" v-model="componentsStore.directories" :options="componentsStore.directoryOptions" optionLabel="name" optionValue="value" />
      <label for="dir">Directory...</label>
    </FloatLabel>
    <div class="flex flex-row">
      <FloatLabel variant="on" class="grow">
        <InputText class="w-96" id="component_search" v-model="componentsStore.query" />
        <label for="component_search">Component...</label>
      </FloatLabel>
      <Button icon="pi pi-times-circle" @click="onClearClick" :disabled="!componentsStore.query" class="p-button-text p-button-sm" />
    </div>
  </div>
</div>

</template>

<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import { useComponentsStore } from '../../stores/Components';

const componentsStore = useComponentsStore();

function onClearClick() {
  componentsStore.query = '';
}

</script>

<style scoped>



</style>