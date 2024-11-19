import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'
import ComponentList from './components/ComponentList.vue'
import ComponentConnections from './components/ComponentConnections.vue'

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    component: ComponentList ,
  },
  { 
    path: '/component-connections/:id', 
    component: ComponentConnections,
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});