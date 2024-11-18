<template>

<div class="flex flex-col w-full h-full">
  <VueFlow 
    :nodes="componentLocationsStore.graph.nodes" 
    :edges="componentLocationsStore.graph.edges"
    @node-click="onNodeClick">
    <template #node-special="specialNodeProps">
      <div class="vue-flow__node-default">
        <DefaultNode v-bind="specialNodeProps" />
      </div>
    </template>
    <template #edge-special="specialEdgeProps">
      <DefaultEdge v-bind="specialEdgeProps" />
    </template>
  </VueFlow>
</div>

</template>

<script lang="ts" setup>
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useComponentLocationStore } from '../stores/ComponentLocation';
import DefaultNode from './DefaultNode.vue';
import DefaultEdge from './DefaultEdge.vue';
import { useToast } from 'primevue';

const componentLocationsStore = useComponentLocationStore();
const { add: toast } = useToast();

const { onPaneReady } = useVueFlow();
onPaneReady((instance) => instance.fitView())

function onNodeClick(data: { node: { id: string }}) {
  if(componentLocationsStore.getComponent(data.node.id)) {
    componentLocationsStore.focusComponent = data.node.id;
  } else {
    toast({ severity: 'error', detail: 'Component not found. Likely this component is not referenced in a template', life: 3000 });
  }
}

</script>

<style scoped>



</style>