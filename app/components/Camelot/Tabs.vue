<template>
  <ul
    ref="tabsContainerRef"
    class="flex select-none flex-row flex-nowrap items-center overflow-x-auto text-base font-medium transition-all duration-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    :class="[
      roleColorClass,
      {
        'relative inline-flex w-auto max-w-full gap-0 rounded-full p-[5px] aqua-track': themeMode === 'aqua',
        'relative w-full gap-6 border-b border-outline-variant px-2': themeMode === 'material',
        'relative inline-flex w-auto max-w-full gap-0.5 rounded-lg bg-surface-container-highest p-0.5': themeMode === 'cupertino',
        'relative w-full gap-2 p-2': themeMode === 'scifi',
      },
    ]"
  >
    <!-- Sliding indicator (geometry is runtime-measured → stays inline :style) -->
    <div
      class="pointer-events-none absolute left-0 z-0 transition-[transform,width,opacity] duration-300 ease-spring motion-reduce:transition-none"
      :class="{
        'aqua-fill top-[5px] h-[calc(100%-10px)] rounded-full': themeMode === 'aqua',
        'top-0.5 h-[calc(100%-4px)] rounded-md bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)]': themeMode === 'cupertino',
        'bottom-0 h-[3px] rounded-t-full bg-[var(--cml-color-current-color)]': themeMode === 'material',
        'bottom-0 h-[2px] bg-[var(--cml-color-current-color)] shadow-[0_0_8px_var(--cml-color-current-color)]': themeMode === 'scifi',
      }"
      :style="indicatorStyle"
      aria-hidden="true"
    />
    <li
      v-for="(option, index) in options"
      ref="tabsElRefs"
      :key="option.value"
      class="shrink-0 list-none"
      @click="onClick(index, option)"
      @mouseenter="() => trigger === 'hover' && onClick(index, option)"
    >
      <slot
        :item="option"
        :option="option"
        :data="option.data"
        :text="getText(option)"
        :index="index"
        :is-selected="isSelected(option.value)"
      >
        <!-- Aqua Pill Theme Tab -->
        <div
          v-if="themeMode === 'aqua'"
          class="relative z-[1] cursor-pointer rounded-full px-6 py-[9px] text-sm font-semibold whitespace-nowrap transition-[color,transform] duration-200 active:scale-95"
          :class="isSelected(option.value) ? 'text-[var(--cml-color-current-on-color)]' : 'text-on-surface-variant hover:text-[var(--cml-color-current-color)]'"
        >
          {{ getText(option) }}
        </div>

        <!-- Sci-fi HUD Theme Tab -->
        <div
          v-else-if="themeMode === 'scifi'"
          class="relative z-[1] cursor-pointer px-4 py-2 font-mono text-sm tracking-wider uppercase transition-colors duration-200"
          :class="isSelected(option.value)
            ? 'text-[var(--cml-color-current-color)] [text-shadow:0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_60%,transparent)]'
            : 'text-[color-mix(in_srgb,var(--cml-color-current-color)_55%,white)] hover:text-[var(--cml-color-current-color)]'"
        >
          {{ getText(option) }}
        </div>

        <!-- Cupertino Segmented Theme Tab -->
        <div
          v-else-if="themeMode === 'cupertino'"
          class="relative z-[1] cursor-pointer rounded-md px-4 py-1.5 text-center text-sm transition-colors duration-200"
          :class="isSelected(option.value) ? 'font-semibold text-on-surface' : 'text-on-surface-variant'"
        >
          {{ getText(option) }}
        </div>

        <!-- Material Theme Tab (Default) -->
        <CamelotRippleEffect
          v-else
          class="relative z-[1] cursor-pointer rounded-t-md px-5 py-3 text-sm transition-colors duration-200"
          :class="isSelected(option.value) ? 'font-semibold text-[var(--cml-color-current-color)]' : 'text-on-surface-variant hover:text-on-surface'"
        >
          {{ getText(option) }}
        </CamelotRippleEffect>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    options?: SelectOptions<T>
    dataKey?: string
    scrollSmooth?: boolean
    trigger?: 'click' | 'hover' | 'manual'
    color?: CamelotColorRole
  }>(),
  {
    scrollSmooth: true,
    color: 'primary',
  },
)

const emit = defineEmits<{
  click: [index: number, option: SelectOption<T>]
  changed: [index: number, option: SelectOption<T>]
}>()

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const isValidKey = (
  key: string | number | symbol,
  object: object,
): key is keyof typeof object => {
  return key in object
}

const getText = (option: SelectOption<T>) => {
  const data = option.data

  if (data && props.dataKey && typeof data === 'object' && isValidKey(props.dataKey, data as object)) {
    return data[props.dataKey]
  }
  else {
    return option.name
  }
}

const selected = defineModel<string | number>()

const isSelected = (val: string | number) => {
  return val === selected.value
}

const selectedIndex = defineModel<number | undefined>('selectedIndex', {
  get() {
    return props.options?.findIndex(option => option.value === selected.value) ?? undefined
  },
  set(v) {
    if (v !== undefined) {
      const option = props.options?.at(v)
      if (option) {
        selected.value = option.value
      }
    }
    return v
  },
})

const tabsElRefs = ref<HTMLElement[]>([])
const tabsContainerRef = useTemplateRef<HTMLElement>('tabsContainerRef')

// 滑動指示器位置（aqua pill / cupertino 區段 / material 底線共用）。
// 以 getBoundingClientRect 量測，需在字體載入 / resize / 選取或主題變更後重算，
// 故用 ref + updateIndicator 觸發，而非單純 computed 快取首次量測值。
const indicatorStyle = ref<Record<string, string>>({
  opacity: '0',
  width: '0px',
  transform: 'translateX(0px)',
})

const updateIndicator = () => {
  const index = toValue(selectedIndex)
  const tabEl = index === undefined ? undefined : tabsElRefs.value[index]
  const containerEl = tabsContainerRef.value
  if (!tabEl || !containerEl) {
    indicatorStyle.value = {
      opacity: '0',
      width: '0px',
      transform: 'translateX(0px)',
    }
    return
  }

  const containerRect = containerEl.getBoundingClientRect()
  const tabRect = tabEl.getBoundingClientRect()
  // getBoundingClientRect 是視窗座標（已扣掉 scrollLeft），但指示器是絕對定位於可捲動內容內、
  // 會隨內容一起捲動，故需加回 scrollLeft 換算為「內容座標」，否則捲動時位置會偏差。
  const left = tabRect.left - containerRect.left + containerEl.scrollLeft

  indicatorStyle.value = {
    width: `${tabRect.width}px`,
    transform: `translateX(${left}px)`,
    opacity: '1',
  }
}

// 選取 / 選項 / 主題變更後（DOM 更新完成）重算
watch(
  [selected, () => props.options, themeMode],
  () => nextTick(updateIndicator),
  { flush: 'post' },
)

// 容器尺寸變化（含 RWD）時重算
useResizeObserver(tabsContainerRef, updateIndicator)

const onClick = (index: number, option: SelectOption<T>) => {
  emit('click', index, option)

  if (props.trigger === 'manual') {
    return
  }

  if (selectedIndex.value === index) {
    return
  }
  selected.value = option.value
  emit('changed', index, option)
}

const scrollToTab = () => {
  const index = toValue(selectedIndex)
  if (index === undefined || props.options === undefined || index > props.options.length) {
    return
  }

  const tabEl = tabsElRefs.value[index]
  if (!tabEl) {
    return
  }
  const parentEl = tabEl.parentElement
  if (!parentEl) {
    return
  }

  const parentWidth = parentEl.clientWidth
  const tabWidth = tabEl.clientWidth

  let scrollLeft = tabEl.offsetLeft - (parentWidth - tabWidth) / 2

  if (scrollLeft < 0) {
    scrollLeft = 0
  }
  else if (scrollLeft > parentEl.scrollWidth) {
    scrollLeft = parentEl.scrollWidth
  }

  parentEl.scrollTo({
    left: scrollLeft,
    behavior: props.scrollSmooth ? 'smooth' : 'auto',
  })
}

onUpdated(() => {
  scrollToTab()
})

onMounted(() => {
  scrollToTab()
  nextTick(updateIndicator)
  // 字體載入後文字寬度會改變，需重新量測指示器寬度（修正初次進入寬度不符）
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(updateIndicator)
  }
})
</script>
