import { reactive, readonly, UnwrapRef } from "vue";

export type AsyncOptions = {
  lazy?: boolean;
}

export function useAsync<T>(callback: () => Promise<T>, options: AsyncOptions = {}) {

  const errorHandlers: ((e:unknown) => void)[] = [];
  const successHandlers: ((data:T) => void)[] = [];

  const state = reactive<{
    $loading: boolean;
    $error: boolean;
    $data: T | null;
  }>({
    $loading: false,
    $error: false,
    $data: null,
  });

  async function send() {
    state.$loading = true;
    state.$error = false;
    state.$data = null;

    try {
      const result = await callback();
      state.$data = result as UnwrapRef<T>;
      successHandlers.forEach(handler => handler(state.$data as T));
      state.$loading = false;
    } catch (e) {
      state.$error = true;
      state.$loading = false;
      errorHandlers.forEach(handler => handler(e));
    }
  }

  function onError(callback: (e:unknown) => void) {
    errorHandlers.push(callback);
  }

  function onSuccess(callback: (data:T) => void) {
    successHandlers.push(callback);
  }

  if(!options.lazy) send();
  
  return {
    ...readonly(state),
    onError,
    onSuccess,
    send
  };
}