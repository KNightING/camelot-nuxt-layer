<template>
  <span
    class="cml-tag inline-flex items-center gap-1 font-medium align-middle transition-colors"
    :class="[roleColorClass, shapeClass, sizeClass, variantClass, { 'opacity-50': disabled }]"
  >
    <slot name="icon" />
    <slot>{{ label }}</slot>
    <button
      v-if="closable"
      type="button"
      class="ml-0.5 inline-flex items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
      :disabled="disabled"
      aria-label="remove"
      @click.stop="emit('close')"
    >
      <IMaterialSymbolsCloseRounded class="h-3.5 w-3.5" />
    </button>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    color?: CamelotColorRole
    /** solid 實心 / soft 柔色（預設）/ outline 外框 */
    variant?: 'solid' | 'soft' | 'outline'
    size?: 'sm' | 'md'
    closable?: boolean
    disabled?: boolean
  }>(),
  {
    color: 'primary',
    variant: 'soft',
    size: 'md',
  },
)

const emit = defineEmits<{ close: [] }>()

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const sizeClass = computed(() => (props.size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'))

const shapeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'rounded-full backdrop-blur-md'
    case 'scifi':
      return 'rounded-none [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] uppercase tracking-wider'
    case 'cupertino':
      return 'rounded-lg'
    default:
      return 'rounded-md'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'solid':
      return 'bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
    case 'outline':
      return 'border border-[var(--cml-color-current-color)] text-[var(--cml-color-current-color)]'
    default:
      return themeMode.value === 'scifi'
        ? 'border border-[color-mix(in_srgb,var(--cml-color-current-color)_45%,transparent)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] text-[var(--cml-color-current-color)] shadow-[0_0_6px_color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)]'
        : 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_15%,transparent)] text-[var(--cml-color-current-color)]'
  }
})
</script>
