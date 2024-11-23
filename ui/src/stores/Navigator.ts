import { defineStore } from "pinia";
import { reactive, readonly, ref, watch } from "vue";
import { useComponentsStore } from "./Components";
import { RouteRecord, useRouter } from "vue-router";

/* 
TODO: Update functionality to:
- go: push route to stack, navigate to route
- popTo: pop stack to route, navigate to route
- no more breadcrumbs, instead use route stack for breadcrumbs
- breadcrumbs: computed value of array of routes with breadcrumbs
*/

export type Breadcrumb = {
  id: string;
  label: string;
  command?: () => void;
};

export type NavigatorRoute = Partial<RouteRecord> & {
  path: string;
  meta?: {
    title?: string;
  };
  breadcrumbs?: Breadcrumb[];
}

export const useNavigator = defineStore("Navigation", () => {
  const defaultBreadcrumbs = [
    {
      id: "",
      label: "Home",
    },
  ];

  const router = useRouter();
  const componentsStore = useComponentsStore();
  const $pageTitle = ref<string>("");
  const breadcrumbs = reactive<Breadcrumb[]>([...defaultBreadcrumbs]);

  watch(router.currentRoute, () => {
    setPageTitle(router.currentRoute.value.meta['title'] as string || '');
  }, { immediate: true, flush: 'pre'});

  watch(breadcrumbs, () => {
    if (breadcrumbs.length === 0) {
      breadcrumbs.push(...defaultBreadcrumbs);
    }
    componentsStore.focusComponent = breadcrumbs[breadcrumbs.length - 1].id;
    componentsStore.focusComponent === ""
      ? router.push("/")
      : router.push(`/component-connections/${componentsStore.focusComponent}`);
  });

  function push(breadcrumb: Breadcrumb) {
    const index = breadcrumbs.findIndex((b) => b.id === breadcrumb.id);
    if (index > 0 && index === breadcrumbs.length - 1) {
      return;
    }
    breadcrumbs.push({
      ...breadcrumb,
    });
  }

  function pop() {
    breadcrumbs.pop();
  }

  function popTo(id: string) {
    const index = breadcrumbs.findIndex((b) => b.id === id);
    if (index > -1) {
      breadcrumbs.splice(index + 1);
    }
  }

  function setPageTitle(title:string) {
    $pageTitle.value = title;
  }

  function go(route: NavigatorRoute) {
    router.push(route);
    if(route.meta?.title) setPageTitle(route.meta?.title || '');
    if(route?.breadcrumbs) setBreadcrumbs(route.breadcrumbs);
  }

  function setBreadcrumbs(crumbs: Breadcrumb[]) {
    breadcrumbs.length = 0;
    breadcrumbs.push(...crumbs);
  }

  return {
    breadcrumbs: readonly(breadcrumbs),
    push,
    pop,
    popTo,
    $pageTitle,
    setPageTitle,
    go,
  };
});
