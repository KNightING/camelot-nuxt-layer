<template>
  <div
    class="cml-carousel-indicator flex"
    :class="[direction === 'vertical' ? 'flex-col' : 'flex-row', roleColorClass]"
    :style="{ gap: `${gap}px` }"
    role="tablist"
  >
    <button
      v-for="i in total"
      :key="i - 1"
      type="button"
      :aria-selected="(i - 1) === current"
      :aria-label="`go to ${i}`"
      @click="select(i - 1)"
    >
      <slot
        name="dot"
        :index="i - 1"
        :active="(i - 1) === current"
        :go="select"
      >
        <span
          class="block rounded-full transition-all duration-200"
          :class="(i - 1) === current ? activeDotClass : 'bg-on-surface/30 hover:bg-on-surface/50'"
          :style="dotSizeStyle((i - 1) === current)"
        />
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 指標數量 */
    total: number
    direction?: 'horizontal' | 'vertical'
    /** 點與點間距（px） */
    gap?: number
    /** 點尺寸（px） */
    size?: number
    color?: CamelotColorRole
  }>(),
  {
    direction: 'horizontal',
    gap: 8,
    size: 8,
    color: 'primary',
  },
)

const current = defineModel<number>({ default: 0 })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const select = (index: number) => {
  current.value = index
}

// 當前點略長（膠囊感），其餘為圓點
const dotSizeStyle = (active: boolean) => {
  const s = props.size
  if (props.direction === 'vertical') {
    return {
      width: `${s}px`,
      height: `${active ? s * 2.2 : s}px`,
    }
  }
  return {
    width: `${active ? s * 2.2 : s}px`,
    height: `${s}px`,
  }
}

const activeDotClass = computed(() =>
  themeMode.value === 'scifi'
    ? 'bg-[var(--cml-color-current-color)] shadow-[0_0_6px_var(--cml-color-current-color)]'
    : 'bg-[var(--cml-color-current-color)]',
)
</script>
