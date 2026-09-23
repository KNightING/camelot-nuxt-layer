<template>
  <!-- Sci-Fi 主題：表單欄位共用的 HUD 外框（與 Sci-Fi Input 同一組設定）；其他主題直接渲染內容 -->
  <CamelotScifiFrame
    v-if="themeMode === 'scifi'"
    :focused="focused"
    :show-scanline="!disabled"
    :show-shine="isHovered && !disabled"
    :active-reticle="focused || isHovered"
    :show-grid="false"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <slot />
  </CamelotScifiFrame>
  <slot v-else />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    focused?: boolean
    disabled?: boolean
  }>(),
  {
    focused: false,
    disabled: false,
  },
)

const { themeMode } = useCamelotTheme()

const isHovered = ref(false)
</script>
