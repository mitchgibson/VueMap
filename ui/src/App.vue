<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex flex-row items-center justify-end p-4">
      <FloatLabel variant="on">
      <InputText id="component_search" v-model="componentName" @keydown.enter="onSearch" />
      <label for="component_search">Search...</label>
    </FloatLabel>
    </div>
    <div class="w-full h-full overflow-y-auto">
      <DataTable :value="searchResults.nodes" class="w-full">
        <Column field="componentName" header="Component Name"></Column>
        <Column field="locations" header="Locations">
          <template #body="slotProps">
            <ul>
              <li v-for="location in slotProps.data.locations" :key="location">{{location}}</li>
            </ul>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FloatLabel} from 'primevue';
import {InputText} from 'primevue';
import {DataTable} from 'primevue';
import {Column} from 'primevue';
import { ref } from 'vue';

const componentName = ref<string>('');

const searchResults = ref<any>({})

async function onSearch() {
  const results = await fetch(`http://127.0.0.1:8080/nodes?dir=/Users/mitchdelachevrotiere/dev/knak/packages/builder/src&filter=${componentName.value}`);
  const data = await results.json();
  searchResults.value = data;
}

</script>