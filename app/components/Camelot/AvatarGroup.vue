<template>
  <div
    class="group inline-flex items-center"
    :class="spacingClass.container"
  >
    <span
      v-for="item in visibleItems"
      :key="item.name"
      class="inline-flex rounded-full transition-[margin,transform] duration-500 hover:-translate-y-1 motion-reduce:transition-none"
      :class="[spacingClass.item, easeClass, ringClass]"
    >
      <CamelotAvatar
        :name="item.name"
        :src="item.src"
        :size="size"
        :color="item.color ?? color"
      />
    </span>
    <span
      v-if="overflowCount > 0"
      class="inline-flex items-center justify-center bg-surface-container-highest font-semibold text-on-surface transition-[margin] duration-500 motion-reduce:transition-none"
      :class="[spacingClass.item, easeClass, ringClass, overflowSizeClass, overflowShapeClass]"
    >
      +{{ overflowCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items?: CamelotAvatarItem[]
    /** 最多顯示幾個頭像，超過的以「+N」表示 */
    max?: number
    size?: CamelotAvatarSize
    /** 項目未指定 color 時的預設色彩角色 */
    color?: CamelotColorRole
  }>(),
  {
    items: () => [],
    max: 5,
    size: 'md',
    color: 'primary',
  },
)

const { themeMode } = useCamelotTheme()

const visibleItems = computed(() => props.items.slice(0, props.max))

const overflowCount = computed(() => Math.max(0, props.items.length - props.max))

// 重疊量跟著尺寸走；滑過整組時展開成不重疊
const spacingClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        container: 'pl-2',
        item: '-ml-2 group-hover:-ml-0.5',
      }
    case 'lg':
      return {
        container: 'pl-3.5',
        item: '-ml-3.5 group-hover:-ml-1',
      }
    default:
      return {
        container: 'pl-2.5',
        item: '-ml-2.5 group-hover:-ml-0.5',
      }
  }
})

const overflowSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 w-8 text-xs'
    case 'lg':
      return 'h-14 w-14 text-base'
    default:
      return 'h-10.5 w-10.5 text-sm'
  }
})

const isSciFi = computed(() => themeMode.value === 'scifi')

// 用外框把相鄰頭像切開；scifi 的頭像是切角方塊，不畫圓形外框
const ringClass = computed(() => (isSciFi.value ? '' : 'ring-2 ring-surface'))

const overflowShapeClass = computed(() => (isSciFi.value ? 'rounded-none font-mono' : 'rounded-full'))

const easeClass = computed(() => (themeMode.value === 'tactile' ? 'ease-tactile' : 'ease-spring'))
</script>
