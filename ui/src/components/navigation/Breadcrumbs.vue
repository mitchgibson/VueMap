<template>
  <Breadcrumb :model="breadcrumbs" class="!bg-transparent !p-0" v-if="breadcrumbs.length > 1">
    <template #item="{ item }">
      <div class="cursor-pointer" @click="onClick(item as NavRecord)">{{ item.label }}</div>
    </template>
</Breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NavRecord, useNavigator } from '../../stores/navigator/Navigator';
import Breadcrumb from 'primevue/breadcrumb';

const navigator = useNavigator();

const breadcrumbs = computed(() => {
  return navigator.history.filter((r) => {
    return !!r.label;
  });
})

function onClick(item: NavRecord) {
  navigator.prev(item);
}
</script>