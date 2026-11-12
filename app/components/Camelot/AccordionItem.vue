<template>
  <div class="border-b border-border last:border-b-0">
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left font-semibold text-on-surface outline-none focus-visible:tactile-ring disabled:cursor-not-allowed disabled:opacity-40"
      :aria-expanded="expanded"
      :disabled="disabled"
      @click="emit('toggle')"
    >
      <span class="min-w-0 flex-1">
        <slot name="title">{{ title }}</slot>
      </span>
      <span
        class="inline-flex h-6 w-6 shrink-0 items-center justify-center transition-[transform,background-color,color] duration-500 motion-reduce:transition-none"
        :class="[
          indicatorClass,
          { 'rotate-180': expanded },
        ]"
        aria-hidden="true"
      >
        <IMaterialSymbolsKeyboardArrowDownRounded class="text-xl" />
      </span>
    </button>

    <!-- 以 grid-template-rows 0fr → 1fr 過場，內容高度不需量測 -->
    <div
      class="grid transition-[grid-template-rows] duration-500 ease-ios motion-reduce:transition-none"
      :class="{
        'grid-rows-[1fr]': expanded,
        'grid-rows-[0fr]': !expanded,
      }"
    >
      <div class="min-h-0 overflow-hidden">
        <div class="pb-3 text-on-surface-variant">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 標題文字；需要自訂版面時改用 #title slot */
    title?: string
    /** 是否展開；由 CamelotAccordion 控制 */
    expanded?: boolean
    disabled?: boolean
  }>(),
  {
    title: '',
    expanded: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  toggle: []
}>()

const { themeMode } = useCamelotTheme()

// 展開指示圖示的外觀：tactile / aqua 展開時轉為填滿的圓鈕，其餘風格只變色
const indicatorClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return props.expanded
        ? 'rounded-full tactile-fill text-[var(--cml-color-current-on-color)] ease-tactile'
        : 'rounded-full bg-surface-container-high text-on-surface ease-tactile'
    case 'aqua':
      return props.expanded
        ? 'rounded-full aqua-fill text-[var(--cml-color-current-on-color)] ease-spring [--cml-aqua-fill-gloss:transparent]'
        : 'rounded-full aqua-track text-on-surface ease-spring'
    case 'scifi':
      return props.expanded
        ? 'text-[var(--cml-color-current-color)] [filter:drop-shadow(0_0_4px_var(--cml-color-current-color))]'
        : 'text-on-surface-variant'
    default:
      return props.expanded ? 'text-[var(--cml-color-current-color)]' : 'text-on-surface-variant'
  }
})
</script>
