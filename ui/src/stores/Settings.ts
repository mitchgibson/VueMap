import { defineStore } from 'pinia';
import { Settings, SettingsStruct } from '../structs/Settings';
import { readonly, ref } from 'vue';
import { useAsync } from '../lib/async/Async';
import { useLogger } from '../lib/logger/Logger';

export const useSettingsStore = defineStore('Settings', () => {
  const logger = useLogger();

  const $settings = ref<SettingsStruct>(Settings());
  const $loading = ref<boolean>(false);
  const $error = ref<boolean>(false);

  async function loadSettings(): Promise<SettingsStruct> {
    const results = await fetch(`http://127.0.0.1:3000/settings`);
    const data = await results.json();
    return data;
  }

  async function update(data: SettingsStruct) {
    await fetch(`http://127.0.0.1:3000/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  function init(): Promise<void> {
    $loading.value = true;
    $error.value = false;
    const { onSuccess, onError, send } = useAsync<SettingsStruct>(loadSettings, { lazy: true });
    onSuccess((data) => {
      $settings.value = Settings(data);
      $loading.value = false;
    })
    onError((e) => {
      $error.value = true;
      $loading.value = false;
      logger.error(e);
    })
    return send();
  }

  function updateSettings(data: SettingsStruct) {
    $settings.value = data;
    update(data);
  }

  return {
    $settings: readonly($settings),
    $loading,
    $error,
    init,
    updateSettings
  }
});