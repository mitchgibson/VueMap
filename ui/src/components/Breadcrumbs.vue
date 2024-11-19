<template>

<Breadcrumb :model="navigationStore.breadcrumbs">
  <template #item="{ item }">
    <div class="cursor-pointer" @click="onClick(item as NavBreadcrumb)">{{ item.label }}</div>
  </template>
</Breadcrumb>

</template>

<script lang="ts" setup>
import { Breadcrumb as NavBreadcrumb, useNavigationStore } from '../stores/Navigation';
import Breadcrumb from 'primevue/breadcrumb';

const navigationStore = useNavigationStore();

function onClick(item: NavBreadcrumb) {
  navigationStore.popTo(item.id);
}

</script>