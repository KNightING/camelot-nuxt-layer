<template>
  <ul>
    <li
      v-for="(v, index) in data"
      ref="tabsElRefs"
      :key="index"
      @click="onSelected(index, v)"
    >
      <slot
        :data="v"
        :index="index"
        :is-selected="isSelected(index)"
      >
        <CamelotRippleEffect
          class="tab"
          :class="{
            'tab-selected':
              isSelected(index),
          }"
        >
          {{ getDisplayLabel(v) }}
        </CamelotRippleEffect>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    data?: T[]
    displayKey?: string
    modelValue?: number
    scrollSmooth?: boolean
  }>(),
  {
    scrollSmooth: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value?: number]
  'changedWithClick': [value: number]
}>()

const isValidKey = (
  key: string | number | symbol,
  object: object,
): key is keyof typeof object => {
  return key in object
}

const getDisplayLabel = (data?: T) => {
  if (data && props.displayKey && typeof data === 'object' && isValidKey(props.displayKey, data as object)) {
    return data[props.displayKey]
  } else {
    return data
  }
}

const isSelected = (index: number) => {
  return index === selectedIndex.value
}

const selectedIndex = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const tabsElRefs = ref<HTMLElement[]>([])

const onSelected = (index: number, data: T) => {
  if (selectedIndex.value === index) {
    return
  }
  selectedIndex.value = index
  emit('changedWithClick', index)
}

watch(selectedIndex, (nV) => {
  if (nV === undefined) {
    return
  }
  const tabEl = tabsElRefs.value[nV]
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
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 1rem;
  padding-right: 1rem;
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
