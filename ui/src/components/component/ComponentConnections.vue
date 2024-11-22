<template>
<div class="flex flex-col w-full h-full">
  <Breadcrumbs />
  <VueFlow 
    :nodes="componentsStore.graph.nodes" 
    :edges="componentsStore.graph.edges"
    @node-click="onNodeClick">
    <template #node-special="specialNodeProps">
      <div class="vue-flow__node-default">
        <Node v-bind="specialNodeProps" />
      </div>
    </template>
    <template #edge-special="specialEdgeProps">
      <Edge v-bind="specialEdgeProps" />
    </template>
  </VueFlow>
</div>

</template>

<script lang="ts" setup>
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useComponentsStore } from '../../stores/Components';
import Node from './Node.vue';
import Edge from './Edge.vue';
import { useToast } from 'primevue';
import Breadcrumbs from '../navigation/Breadcrumbs.vue';
import { useNavigator } from '../../stores/Navigator';

const componentsStore = useComponentsStore();
const { add: toast } = useToast();

const { onPaneReady } = useVueFlow();
onPaneReady((instance) => instance.fitView())

function onNodeClick(data: { node: { id: string }}) {
  if(componentsStore.getComponent(data.node.id)) {
    useNavigator().push({
      id: data.node.id,
      label: data.node.id,
    });
  } else {
    toast({ severity: 'error', detail: 'Component not found. Likely this component is not referenced in a template', life: 3000 });
  }
}

</script>

<style scoped>



</style>