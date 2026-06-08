<template>
  <label
    class="flex w-full min-w-10 flex-col gap-1.5"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-50': disabled }]"
  >
    <slot name="label">
      <span
        v-if="label"
        class="pl-1 text-sm font-medium text-on-surface"
        :class="themeMode === 'scifi' ? 'text-xs uppercase tracking-[0.1em]' : ''"
      >{{ label }}<span
        v-if="required"
        class="ml-0.5 text-error"
      >*</span></span>
    </slot>

    <textarea
      ref="textareaRef"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      class="w-full text-base text-on-surface caret-[var(--cml-color-current-color)] outline-none transition-colors placeholder:text-on-surface/50"
      :class="[themeClass, autosize ? 'resize-none overflow-hidden' : resizeClass]"
      @input="resize"
    />

    <div
      v-if="showCount && maxlength"
      class="pr-1 text-right text-xs text-on-surface-variant tabular-nums"
    >
      {{ (model?.length ?? 0) }} / {{ maxlength }}
    </div>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    rows?: number
    /** 隨內容自動增高 */
    autosize?: boolean
    /** 自動增高的最大列數 */
    maxRows?: number
    resize?: 'none' | 'vertical' | 'both'
    maxlength?: number
    showCount?: boolean
    color?: CamelotColorRole
  }>(),
  {
    rows: 3,
    autosize: false,
    resize: 'vertical',
    showCount: false,
    color: 'primary',
  },
)

const model = defineModel<string>({ default: '' })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef')

const resize = () => {
  const el = textareaRef.value
  if (!el || !props.autosize) return
  el.style.height = 'auto'
  let h = el.scrollHeight
  if (props.maxRows) {
    const line = Number.parseFloat(getComputedStyle(el).lineHeight) || 20
    const pad = el.offsetHeight - el.clientHeight + (Number.parseFloat(getComputedStyle(el).paddingTop) + Number.parseFloat(getComputedStyle(el).paddingBottom))
    h = Math.min(h, props.maxRows * line + pad)
  }
  el.style.height = `${h}px`
}

watch(model, () => nextTick(resize))
onMounted(() => nextTick(resize))

const resizeClass = computed(() => {
  switch (props.resize) {
    case 'none':
      return 'resize-none'
    case 'both':
      return 'resize'
    default:
      return 'resize-y'
  }
})

const themeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-track rounded-2xl px-4 py-3 backdrop-blur-md focus:aqua-glow'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)] bg-surface-container-lowest px-4 py-3 font-mono focus:border-[var(--cml-color-current-color)] focus:shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_40%,transparent)]'
    case 'cupertino':
      return 'rounded-[10px] border border-outline-variant bg-surface-container-highest px-4 py-3 focus:border-[var(--cml-color-current-color)]'
    default:
      return 'rounded-t-[4px] border-b border-outline bg-surface-container-highest px-4 py-3 focus:border-b-2 focus:border-[var(--cml-color-current-color)]'
  }
})
</script>
