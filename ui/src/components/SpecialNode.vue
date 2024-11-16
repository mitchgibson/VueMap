<script setup lang="ts">
import { Position, type NodeProps } from '@vue-flow/core'
  
const props = defineProps<NodeProps>()

console.log('special-nodes', props);
</script>

<template>
  <div class="vue-flow__node-default">
    <div>{{ data.label }}</div>

    <div>
      {x} {y}
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>