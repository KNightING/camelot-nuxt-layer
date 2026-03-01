<template>
  <div class="relative flex-1 min-w-0 min-h-0 grid w-full h-full">
    <AppBaseScrollbar :horizontal="horizontal">
      <slot />
    </AppBaseScrollbar>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** 是否開啟水平滾動模式 */
  horizontal?: boolean
}>()
</script>
