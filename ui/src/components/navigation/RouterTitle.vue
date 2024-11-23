<template>

<h1>{{ navigator.$pageTitle }}</h1>

</template>

<script lang="ts" setup>
import { useNavigator } from '../../stores/Navigator';

const navigator = useNavigator();

</script>