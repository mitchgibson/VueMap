<template>

<div class="flex flex-row w-full items-center justify-between gap-x-2 py-2 px-2 bg-surface-900 text-sm text-surface-400">
  <div>
    <slot name="left" />
  </div>
  <div>
    <slot name="center" />
  </div>
  <div>
    <slot name="right" />
  </div>
</div>

</template>

<script lang="ts" setup>

</script>