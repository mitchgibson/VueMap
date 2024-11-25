<template>
<NavLink to="/settings" label="Settings">
  <Button v-bind="$attrs" title="Settings" class="p-button-sm">
    <i class="pi pi-cog text-sm" />
    <slot></slot>
  </Button>
</NavLink>

</template>

<script lang="ts" setup>
import Button from 'primevue/button';
import NavLink from '../navigation/NavLink.vue';
</script>