<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div v-if="loading" class="flex flex-row gap-x-2 w-full justify-center">
      <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
      <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
      <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
    </div>
    <div v-if="error">Error...</div>
    <slot v-if="!loading && !error" />
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import Skeleton from 'primevue/skeleton';

const props = defineProps<{
    loading?: boolean;
    error?: boolean;
  }>();

const { loading, error } = toRefs(props);

</script>