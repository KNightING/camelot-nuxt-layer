<template>
  <div
    class="flex flex-col gap-2 text-base"
    :class="roleColorClass"
  >
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        v-if="label"
        :label="label"
        :required="required"
        class="pl-1"
      />
    </slot>

    <div
      class="flex flex-wrap gap-2"
      :role="multiple ? 'group' : 'radiogroup'"
      :aria-label="label"
    >
      <button
        v-for="chip in chips"
        :key="chip.option.value"
        type="button"
        class="cursor-pointer px-3.5 py-1.5 text-sm font-semibold outline-none focus-visible:tactile-ring disabled:cursor-not-allowed disabled:opacity-40"
        :class="[shapeClass, chip.isSelected ? selectedClass : idleClass]"
        :role="multiple ? undefined : 'radio'"
        :aria-pressed="multiple ? chip.isSelected : undefined"
        :aria-checked="multiple ? undefined : chip.isSelected"
        :disabled="disabled || chip.option.disabled"
        @click="toggle(chip.option)"
      >
        <slot
          name="chip"
          :option="chip.option"
          :selected="chip.isSelected"
        >
          {{ chip.option.label }}
        </slot>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    options?: CamelotGroupOption[]
    /** 允許同時選取多個；false 時選另一個會取代原本的 */
    multiple?: boolean
    color?: CamelotColorRole
    /** 整組停用；逐選項停用請用 option.disabled */
    disabled?: boolean
    label?: string
    required?: boolean
  }>(),
  {
    options: () => [],
    multiple: false,
    color: 'primary',
    disabled: false,
    label: '',
    required: false,
  },
)

const emit = defineEmits<{
  change: [selectedValues: (string | number)[]]
}>()

/** 目前選取的 value；單選模式最多一個 */
const modelValue = defineModel<(string | number)[]>({ default: () => [] })

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const chips = computed(() =>
  props.options.map(option => ({
    option,
    isSelected: modelValue.value.includes(option.value),
  })),
)

const nextSelectedValues = (option: CamelotGroupOption): (string | number)[] => {
  const isSelected = modelValue.value.includes(option.value)
  if (!props.multiple) return isSelected ? modelValue.value : [option.value]
  return isSelected
    ? modelValue.value.filter(value => value !== option.value)
    : [...modelValue.value, option.value]
}

const toggle = (option: CamelotGroupOption) => {
  if (props.disabled || option.disabled) return
  modelValue.value = nextSelectedValues(option)
  emit('change', modelValue.value)
}

const shapeClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'rounded-full transition-[transform,background-color,color] duration-500 ease-tactile active:scale-90 motion-reduce:transition-none'
    case 'aqua':
      return 'rounded-full backdrop-blur-md transition-[transform,color] duration-200 ease-spring active:scale-95'
    case 'scifi':
      return 'rounded-none uppercase tracking-wider transition-colors'
    case 'cupertino':
      return 'rounded-lg transition-[transform,opacity] duration-200 active:scale-95 active:opacity-70'
    default:
      return 'rounded-lg transition-colors'
  }
})

const idleClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-well text-on-surface'
    case 'aqua':
      return 'aqua-track text-on-surface hover:text-[var(--cml-color-current-color)]'
    case 'scifi':
      return 'border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)] text-on-surface hover:text-[var(--cml-color-current-color)]'
    case 'cupertino':
      return 'bg-surface-container-highest text-on-surface'
    default:
      return 'border border-outline text-on-surface-variant hover:bg-surface-container'
  }
})

const selectedClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-fill text-[var(--cml-color-current-on-color)]'
    case 'aqua':
      return 'aqua-fill text-[var(--cml-color-current-on-color)]'
    case 'scifi':
      return 'border border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)] text-[var(--cml-color-current-color)] shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_35%,transparent)]'
    case 'cupertino':
      return 'bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
    default:
      return 'border border-transparent bg-[color-mix(in_srgb,var(--cml-color-current-color)_15%,transparent)] text-[var(--cml-color-current-color)]'
  }
})
</script>
