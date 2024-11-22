import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'
import ComponentList from './components/connections/ComponentList.vue'
import ComponentConnections from './components/connections/ComponentConnections.vue'
import Breadcrumbs from './components/navigation/Breadcrumbs.vue';

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    components: {
      content: ComponentList,
    },
  },
  { 
    path: '/component-connections/:id', 
    components: {
      content: ComponentConnections,
      headerLeft: Breadcrumbs,
    },
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});