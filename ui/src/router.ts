import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'
import ComponentList from './components/connections/ComponentList.vue'
import ComponentConnections from './components/connections/ComponentConnections.vue'

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    components: {
      content: ComponentList,
    },
    meta: {
      title: 'Home'
    }
  },
  { 
    path: '/component-connections/:id', 
    components: {
      content: ComponentConnections,
    },
    meta: {
      title: 'Component Connections'
    }
  },
  {
    path: '/settings',
    components: {
      content: () => import('./components/settings/Settings.vue'),
    },
    meta: {
      title: 'Settings'
    }
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});