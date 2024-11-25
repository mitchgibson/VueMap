<template>

<div class="flex flex-row w-full justify-between items-center">
  <div class="flex flex-col w-full">
    <div class="flex flex-row w-full justify-between items-center pt-4 pb-2">
        <div class="flex flex-col gap-y-2">
          <p>{{ props.item.component_name }}</p>
          <p class="text-sm text-surface-400">{{ props.item.filename }}</p>
          <div class="flex flex-row gap-x-4">
            <Badge severity="secondary" :value="`${props.item.locations.length} parents`" />
            <Badge severity="secondary" :value="`${props.item.children.length} children`" />
          </div>
        </div>
        <div class="flex flex-row justify-end gap-x-2">
          <Button icon="pi pi-copy" @click="emit('copy-filename', props.item.filename)" title="Copy filename to clipboard" class="p-button-text p-button-sm" />
          <Button icon="pi pi-share-alt" @click="emit('connections', props.item)" class="p-button-text p-button-sm" />
        </div>
      </div>
  </div>
</div>

</template>

<script lang="ts" setup>
import { ComponentStruct } from '../../structs/Component';
import Button from 'primevue/button';
import Badge from 'primevue/badge';

const props = defineProps<{
  item: ComponentStruct
}>();

const emit = defineEmits<{
  (event: "copy-filename", value: string): void;
  (event: "connections", value: ComponentStruct): void;
}>();

</script>

<style scoped>



</style>