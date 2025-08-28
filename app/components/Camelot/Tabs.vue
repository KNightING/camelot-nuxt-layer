<template>
  <ul>
    <li
      v-for="(option, index) in options"
      ref="tabsElRefs"
      :key="option.value"
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
        <CamelotRippleEffect
          class="tab"
          :class="{
            'tab-selected':
              isSelected(index),
          }"
        >
          {{ getText(option) }}
        </CamelotRippleEffect>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
import type { SelectOptions } from '../../types/selectOptions'

const props = withDefaults(
  defineProps<{
    options?: SelectOptions<T>
    dataKey?: string
    scrollSmooth?: boolean
    trigger?: 'click' | 'hover' | 'manual'
  }>(),
  {
    scrollSmooth: true,
  },
)

const emit = defineEmits<{
  click: [index: number, option: SelectOption<T>]
  changed: [index: number, option: SelectOption<T>]
}>()

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
  } else {
    return option.name
  }
}

const selected = defineModel<string | number>()

const isSelected = (index: string | number) => {
  return index === selected.value
}

const selectedIndex = defineModel<number | undefined>('selectedIndex', {
  get(v) {
    return props.options?.findIndex(option => option.value === selected.value) ?? undefined
  },
  set(v) {
    if (v) {
      const option = props.options?.at(v)
      if (option) {
        selected.value = option.value
      }
    }
    return v
  },
})

const tabsElRefs = ref<HTMLElement[]>([])

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
  } else if (scrollLeft > parentEl.scrollWidth) {
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
})
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

ul {
  display: flex;
  overflow-x: auto;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1.25rem;
  align-items: flex-start;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.tab {
  padding-top: 0.375rem !important;
  padding-bottom: 0.375rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  border-radius: 9999px;
  border-width: 1px;
  height: 100%;
  white-space: nowrap;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  user-select: none;
  background-color: rgba(from var(--camelot-m3-surface) r g b / 1);
  color: rgba(from var(--camelot-m3-on-surface) r g b / 1);
}

.tab-selected {
  background-color: rgba(from var(--camelot-m3-primary-container) r g b / 1) !important;
  color: rgba(from var(--camelot-m3-on-primary-container) r g b / 1) !important;
  border-color: rgba(from var(--camelot-m3-primary-container) r g b / 1) !important;
}
</style>
