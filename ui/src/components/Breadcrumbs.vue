<template>

<Breadcrumb :model="navigationStore.breadcrumbs" />

</template>

<script lang="ts" setup>
import { useNavigationStore } from '../stores/Navigation';
import Breadcrumb from 'primevue/breadcrumb';

const navigationStore = useNavigationStore();

</script>

<style scoped>



</style>