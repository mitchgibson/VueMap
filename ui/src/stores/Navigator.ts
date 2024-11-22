import { defineStore } from "pinia";
import { reactive, readonly, watch } from "vue";
import { useComponentsStore } from "./Components";
import { useRouter } from "vue-router";

export type Breadcrumb = {
  id: string;
  label: string;
  command?: () => void;
};

export const useNavigator = defineStore("Navigation", () => {
  const router = useRouter();
  const componentsStore = useComponentsStore();

  const defaultBreadcrumbs = [
    {
      id: "",
      label: "Home",
    },
  ];

  const breadcrumbs = reactive<Breadcrumb[]>([...defaultBreadcrumbs]);

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

  return {
    breadcrumbs: readonly(breadcrumbs),
    push,
    pop,
    popTo,
  };
});
