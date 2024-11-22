<template>
  <Breadcrumb :model="navigator.breadcrumbs">
    <template #item="{ item }">
      <div class="cursor-pointer" @click="onClick(item as NavBreadcrumb)">{{ item.label }}</div>
    </template>
</Breadcrumb>
</template>

<script lang="ts" setup>
import { Breadcrumb as NavBreadcrumb, useNavigator } from '../stores/Navigator';
import Breadcrumb from 'primevue/breadcrumb';

const navigator = useNavigator();

function onClick(item: NavBreadcrumb) {
  navigator.popTo(item.id);
}

</script>

<style>
.p-breadcrumb {
  @apply bg-transparent;
}
</style>