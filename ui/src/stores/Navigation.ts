import { defineStore } from 'pinia';
import { reactive, readonly, watch } from 'vue';
import { useComponentsStore } from './Components';

export type Breadcrumb = {
  id: string;
  label: string;
  command?: () => void;
}

export const useNavigationStore = defineStore('Navigation', () => {

  const defaultBreadcrumbs = [{
    id: '',
    label: 'Home',
    command: () => pop(),
  }];

  const breadcrumbs = reactive<Breadcrumb[]>(defaultBreadcrumbs);

  watch(breadcrumbs, () => {
    if(breadcrumbs.length === 0) {
      breadcrumbs.push(...defaultBreadcrumbs);
    }
    useComponentsStore().focusComponent = breadcrumbs[breadcrumbs.length - 1].id;
  });

  function push(breadcrumb: Breadcrumb) {
    breadcrumbs.push({
      ...breadcrumb,
      command: () => pop(),
    });
  }

  function pop() {
    breadcrumbs.pop();
  }

  return {
    breadcrumbs: readonly(breadcrumbs),
    push,
    pop,
  };
});