<template>
  <div class="vue-flow__node-default">
    <Handle type="source" :position="Position.Top" />
    <div class="text-sm break-all">{{ props.data.label }}</div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Position, type NodeProps } from '@vue-flow/core'
  
const props = defineProps<NodeProps>()
</script>

<style>
.vue-flow__node {
  word-wrap: break-word;
}
</style>