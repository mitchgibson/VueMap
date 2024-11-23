import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useNavigator } from './Navigator';
import { setActivePinia, createPinia } from 'pinia'
import { reactive, ref } from 'vue';

const routerPushMock = vi.fn();
const componentsStoreMock = reactive({
  focusComponent: '',
});
const routerMock = {
  push: routerPushMock,
  currentRoute: ref({
    meta: {
      title: 'Home',
    }
  })
}

// Mock vue-router
vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => routerMock),
}));

// Mock the ComponentsStore
vi.mock('./Components', () => ({
  useComponentsStore: vi.fn(() => componentsStoreMock),
}));

describe('Navigator', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.useFakeTimers();
    componentsStoreMock.focusComponent = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /* 
  TODO: Update functionality to:
  - go: push route to stack, navigate to route
  - popTo: pop stack to route, navigate to route
  - no more breadcrumbs, instead use route stack for breadcrumbs
  - breadcrumbs: computed value of array of routes with breadcrumbs
  */

  it('should always have a default history containing home', () => {
    const navigator = useNavigator();
    expect(navigator.history.length).toBe(1);
    expect(navigator.history[0]).toEqual({
      path: '/',
      meta: {
        title: 'Home',
      }
    });
  });

  describe('go', async () => {
    it('should add a new route to the end of the route stack', () => {
      const navigator = useNavigator();
      navigator.next({
        path: '/test',
        breadcrumbs: [
          {
            id: 'test',
            label: 'Test',
          }
        ]
      });
      expect(navigator.history.length).toBe(2);
      expect(navigator.history[1].path).toBe('/test');
    });

    it('should return to a previous route in the route stack', () => {
      const navigator = useNavigator();

      const routeHistory = [1,2,3].map((i) => {
        const route = {
          path: `/test${i}`,
          breadcrumbs: [
            {
              id: `test${i}`,
              label: `Test${i}`,
            }
          ]
        };
        navigator.next(route);
        return route;
      });

      expect(navigator.history.length).toBe(4);

      navigator.prev(routeHistory[1]);
      expect(navigator.history.length).toBe(1);
      expect(navigator.history[2].path).toBe('/test1');
    });
  });
});