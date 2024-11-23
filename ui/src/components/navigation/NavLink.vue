<template>

<div @click="onClick">
  <slot></slot>
</div>

</template>

<script lang="ts" setup>
import { useNavigator } from '../../stores/navigator/Navigator';

const props = defineProps<{
  to: string;
  label?: string;
}>();

const navigator = useNavigator();

function onClick() {
  navigator.next({
    path: props.to,
    label: props.label,
  });
}

</script>