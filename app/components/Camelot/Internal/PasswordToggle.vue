<template>
  <button
    type="button"
    class="ml-2 flex shrink-0 cursor-pointer items-center text-on-surface-variant transition-colors hover:text-[var(--cml-color-current-color)] disabled:cursor-not-allowed disabled:opacity-40"
    :aria-label="revealed ? '隱藏密碼' : '顯示密碼'"
    :aria-pressed="revealed"
    :disabled="disabled"
    @mousedown.prevent
    @click="revealed = !revealed"
  >
    <IMaterialSymbolsVisibilityOffOutlineRounded
      v-if="revealed"
      class="h-5 w-5"
    />
    <IMaterialSymbolsVisibilityOutlineRounded
      v-else
      class="h-5 w-5"
    />
  </button>
</template>

<script setup lang="ts">
import IMaterialSymbolsVisibilityOutlineRounded from '~icons/material-symbols/visibility-outline-rounded'
import IMaterialSymbolsVisibilityOffOutlineRounded from '~icons/material-symbols/visibility-off-outline-rounded'

// 密碼顯示切換鈕；mousedown.prevent 讓點擊不奪走 input 焦點
defineProps<{
  disabled?: boolean
}>()

const revealed = defineModel<boolean>('revealed', { default: false })
</script>
