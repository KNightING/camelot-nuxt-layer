<template>
  <div
    class="flex flex-col px-4 text-base"
    :class="[roleColorClass, containerClass]"
  >
    <CamelotAccordionItem
      v-for="entry in entries"
      :key="entry.item.value"
      :title="entry.item.title"
      :expanded="entry.isExpanded"
      :disabled="entry.item.disabled"
      @toggle="toggle(entry.item.value)"
    >
      <template #title>
        <slot
          name="title"
          :item="entry.item"
          :expanded="entry.isExpanded"
        >
          {{ entry.item.title }}
        </slot>
      </template>
      <slot
        name="content"
        :item="entry.item"
      >
        {{ entry.item.content }}
      </slot>
    </CamelotAccordionItem>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items?: CamelotAccordionItem[]
    /** 是否允許同時展開多個項目；false 時展開一個會收合其他 */
    multiple?: boolean
    color?: CamelotColorRole
  }>(),
  {
    items: () => [],
    multiple: false,
    color: 'primary',
  },
)

const emit = defineEmits<{
  change: [expandedValues: CamelotAccordionValue[]]
}>()

/** 目前展開的項目 value；單開模式下最多一個元素 */
const modelValue = defineModel<CamelotAccordionValue[]>({ default: () => [] })

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const entries = computed(() =>
  props.items.map(item => ({
    item,
    isExpanded: modelValue.value.includes(item.value),
  })),
)

const containerClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-surface rounded-tactile-panel'
    case 'aqua':
      return 'aqua-glass rounded-aqua-panel'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_35%,transparent)] bg-surface font-mono'
    case 'cupertino':
      return 'rounded-xl bg-surface-container-high'
    default:
      return 'rounded-xl border border-outline-variant bg-surface'
  }
})

const nextExpandedValues = (value: CamelotAccordionValue): CamelotAccordionValue[] => {
  const isExpanded = modelValue.value.includes(value)
  if (isExpanded) return modelValue.value.filter(expandedValue => expandedValue !== value)
  if (props.multiple) return [...modelValue.value, value]
  return [value]
}

const toggle = (value: CamelotAccordionValue) => {
  modelValue.value = nextExpandedValues(value)
  emit('change', modelValue.value)
}
</script>
