<template>

<VueFlow :nodes="componentLocationsStore.graph.nodes" :edges="componentLocationsStore.graph.edges">
  <template #node-special="specialNodeProps">
    <div class="vue-flow__node-default">
      <DefaultNode v-bind="specialNodeProps" />
    </div>
  </template>
  <template #edge-special="specialEdgeProps">
    <DefaultEdge v-bind="specialEdgeProps" />
  </template>
</VueFlow>

</template>

<script lang="ts" setup>
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useComponentLocationStore } from '../stores/ComponentLocation';
import DefaultNode from './DefaultNode.vue';
import DefaultEdge from './DefaultEdge.vue';

const componentLocationsStore = useComponentLocationStore();

const { onPaneReady } = useVueFlow();
onPaneReady((instance) => instance.fitView())

const emit = defineEmits<{
  // (event: string, value: unknown): void;
}>();



</script>

<style scoped>



</style>