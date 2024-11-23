import { defineStore } from "pinia";
import { computed, reactive, unref } from "vue";
import { RouteRecord, useRouter } from "vue-router";

export type NavRecord = Partial<RouteRecord> & {
  path: string;
  label?: string;
  command?: () => void;
}
export const useNavigator = defineStore('Navigator', () => {
  const router = useRouter();
  const history = reactive<NavRecord[]>([
    {
      path: '/',
      label: 'Home',
    }
  ]);

  const pageTitle = computed(() => {
    return router.currentRoute.value.meta.title;
  });
  
  function next(route: NavRecord) {
    go(route);
  }

  function prev(item: NavRecord) {    
    const index = history.findIndex((r) => r === item);
    history.length = index + 1;
    go(item);
  }

  function go(route: NavRecord) {
    route = {
      ...route, 
      meta: {
        ...route.meta || {},
        title: route.label,
      }
    };
    if(route.path === history[history.length - 1].path) {
      history.splice(history.length - 1, 1, route);
    } else {
      history.push(route);
    }
    if(route.command) {
      route.command();
    }
    router.push(route as RouteRecord);
  }

  return {
    next,
    prev,
    history,
    pageTitle
  }
});
