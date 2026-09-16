<template>
  <!-- 熱區放大到 44px 高（觸控最小目標），視覺上只畫中間那條指示條；
       touch-action: none 讓拖曳不被瀏覽器當成頁面捲動 -->
  <div
    class="sheet-handle -mt-4 flex h-11 w-full shrink-0 cursor-grab touch-none items-center justify-center select-none active:cursor-grabbing"
    role="button"
    tabindex="0"
    aria-label="拖曳關閉"
  >
    <div
      class="rounded-full"
      :class="barClass"
    />
  </div>
</template>

<script setup lang="ts">
const { themeMode } = useCamelotTheme()

// 指示條外觀沿用各主題原本的尺寸／顏色（原先各主題自畫的裝飾條）
const barClass = computed(() => {
  switch (themeMode.value) {
    case 'scifi':
      return 'h-1 w-12 bg-primary/30'
    case 'cupertino':
      return 'h-1.5 w-10 bg-slate-400/50'
    case 'aqua':
      return 'h-1.5 w-10 bg-on-surface/20'
    default:
      return 'h-1 w-8 bg-outline-variant'
  }
})
</script>
