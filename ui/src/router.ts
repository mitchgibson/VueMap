import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'
import ComponentList from './components/component/ComponentList.vue'
import ComponentConnections from './components/component/ComponentConnections.vue'

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