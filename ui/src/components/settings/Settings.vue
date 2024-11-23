<template>

<div class="flex flex-col items-center justify-start w-full h-full p-4">
  <div class="flex flex-col w-full md:w-1/2">
    <h2 class="text-xl">Scopes</h2>
    <p class="text-sm text-surface-400">Scopes are the directories available to crawl from components.</p>
    <div class="flex flex-col w-full gap-y-4 py-4">
      <div v-for="scope in settingsScore.$settings.scopes" class="flex flex-row items-center justify-between p-4 border border-surface-600 rounded">
        <div>
          <p>{{ scope.name }}</p>
          <p class="text-sm text-surface-400">{{ scope.value }}</p>
        </div>
        <div class="flex flex-row items-center justify-end">
          <Button icon="pi pi-trash" severity="danger" class="p-button-text p-button-sm" @click="onRemoveScope(scope)" />
        </div>
      </div>
      <form @submit="addScope" v-if="showNewScope" class="flex flex-row items-center w-full gap-x-2">
        <InputText autofocus v-model="newScope.name" required placeholder="Name" />
        <InputGroup>
          <InputGroupAddon>
              <i class="pi pi-folder-open"></i>
          </InputGroupAddon>
          <InputText v-model="newScope.value" required placeholder="/path/to/scope" />
        </InputGroup>
        <Button type="submit" icon="pi pi-check" class="p-button-text p-button-sm" />
      </form>
    </div>
    <div class="flex flex-row items-center justify-end">
      <Button
          @click="onAddScope"
          size="small"
          outlined
          severity="secondary"
        >
        <i class="pi pi-plus" />Add Scope</Button>
    </div>    
  </div>
</div>

</template>

<script lang="ts" setup>
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import { useSettingsStore } from '../../stores/Settings';
import { reactive, ref } from 'vue';

const settingsScore = useSettingsStore();
const showNewScope = ref<boolean>(false);
const newScope = reactive({ name: '', value: '' });

function onRemoveScope(scope: { name: string, value: string }) {
  settingsScore.updateSettings({
    scopes: settingsScore.$settings.scopes.filter(s => s.name !== scope.name)
  });
}

function onAddScope() {
  showNewScope.value = true;
}

function addScope() {
  settingsScore.updateSettings({
    scopes: [
      ...settingsScore.$settings.scopes,
      { ...newScope }
    ]
  });
  showNewScope.value = false;
  newScope.name = '';
  newScope.value = '';
}

</script>