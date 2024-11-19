import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNavigator } from "./Navigator";
import { useRouter } from "vue-router";
import { nextTick, reactive } from "vue";

const routerPushMock = vi.fn();
let componentsStoreMock = reactive({
  focusComponent: '',
});

// Mock vue-router
vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => ({
    push: routerPushMock,
  })),
}));

// Mock the ComponentsStore
vi.mock('./Components', () => ({
  useComponentsStore: vi.fn(() => componentsStoreMock),
}));

describe("Navigator", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.useFakeTimers();
    componentsStoreMock.focusComponent = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("instantiates with default breadcrumbs", () => {
    const navigator = useNavigator();
    expect(navigator.breadcrumbs).toEqual([
      {
        id: "",
        label: "Home",
      },
    ]);
  });

  test("push adds breadcrumbs", () => {
    const navigator = useNavigator();
    navigator.push({
      id: "test",
      label: "Test",
    });
    expect(navigator.breadcrumbs).toEqual([
      {
        id: "",
        label: "Home",
      },
      {
        id: "test",
        label: "Test",
      },
    ]);
  });

  test("pop removes breadcrumbs", () => {
    const navigator = useNavigator();
    navigator.push({
      id: "test",
      label: "Test",
    });
    navigator.pop();
    expect(navigator.breadcrumbs).toEqual([
      {
        id: "",
        label: "Home",
      },
    ]);
  });

  test("popTo removes breadcrumbs", () => {
    const navigator = useNavigator();
    navigator.push({
      id: "test",
      label: "Test",
    });
    navigator.push({
      id: "test2",
      label: "Test2",
    });
    navigator.push({
      id: "test3",
      label: "Test3",
    });
    navigator.popTo("test");
    expect(navigator.breadcrumbs).toEqual([
      {
        id: "",
        label: "Home",
      },
      {
        id: "test",
        label: "Test",
      },
    ]);
  });

  test("popTo does nothing if id not found", () => {
    const navigator = useNavigator();
    navigator.push({
      id: "test",
      label: "Test",
    });
    navigator.popTo("test2");
    expect(navigator.breadcrumbs).toEqual([
      {
        id: "",
        label: "Home",
      },
      {
        id: "test",
        label: "Test",
      },
    ]);
  });

  test("navigates to component connections page when breadcrumbs change", async () => {
    const navigator = useNavigator();
    const router = useRouter();

    navigator.push({
      id: "test",
      label: "Test",
    });

    vi.runAllTimers();
    await nextTick();

    expect(router.push).toHaveBeenCalledWith("/component-connections/test");
  });

  test("navigates to home page when breadcrumbs are empty", async () => {
    const navigator = useNavigator();
    const router = useRouter();

    navigator.pop();

    vi.runAllTimers();
    await nextTick();

    expect(router.push).toHaveBeenCalledWith("/");
  });

  test("sets focus component when breadcrumbs change", async () => {
    const navigator = useNavigator();

    navigator.push({
      id: "test",
      label: "Test",
    });

    vi.runAllTimers();
    await nextTick();

    expect(componentsStoreMock.focusComponent).toBe("test");
  });

  test("sets focus component to empty string when breadcrumbs are empty", async () => {
    const navigator = useNavigator();

    navigator.pop();

    vi.runAllTimers();
    await nextTick();

    expect(componentsStoreMock.focusComponent).toBe("");
  });
});
