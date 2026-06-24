<template>
  <div
    class="cml-tag-group flex flex-wrap items-center gap-2"
    :class="roleColorClass"
  >
    <CamelotTag
      v-for="(tag, index) in modelValue"
      :key="`${tag}-${index}`"
      :label="tag"
      :color="color"
      :variant="variant"
      :size="size"
      :closable="!disabled && !isLocked(tag)"
      :disabled="disabled"
      @close="removeAt(index)"
    />

    <!-- 編輯中：行內輸入框 -->
    <input
      v-if="editing"
      ref="add-input"
      v-model="draft"
      type="text"
      :placeholder="placeholder"
      class="cml-tag-group-input min-w-24 bg-transparent outline-none"
      :class="[shapeClass, sizeClass, inputBorderClass]"
      @keydown.enter.prevent="commit"
      @keydown.esc="cancel"
      @keydown.backspace="onBackspace"
      @blur="commit"
    >

    <!-- 新增按鈕 -->
    <button
      v-else-if="addable && !disabled && !reachedMax"
      type="button"
      class="cml-tag-group-add inline-flex items-center justify-center border border-dashed opacity-70 transition-opacity hover:opacity-100"
      :class="[shapeClass, sizeClass, addBorderClass]"
      aria-label="add tag"
      @click="startEditing"
    >
      <IMaterialSymbolsAddRounded class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: CamelotColorRole
    /** 傳遞給 Tag 的外觀：solid 實心 / soft 柔色（預設）/ outline 外框 */
    variant?: 'solid' | 'soft' | 'outline'
    size?: 'sm' | 'md'
    /** 整組停用：隱藏新增按鈕並移除刪除鈕 */
    disabled?: boolean
    /** 是否顯示新增按鈕（預設 true） */
    addable?: boolean
    /** 是否允許重複值（預設 false） */
    allowDuplicate?: boolean
    /** 鎖定（不可刪除）的標籤值，可與一般可刪除標籤混和 */
    locked?: string[]
    /** 連續新增模式：true（預設）新增後維持輸入；false 新增一個即關閉輸入框 */
    continuousAdd?: boolean
    /** 最多可新增的標籤數，undefined 表示不限制 */
    max?: number
    /** 輸入框 placeholder */
    placeholder?: string
  }>(),
  {
    color: 'primary',
    variant: 'soft',
    size: 'md',
    disabled: false,
    addable: true,
    allowDuplicate: false,
    locked: () => [],
    continuousAdd: true,
    placeholder: '新增標籤…',
  },
)

const emit = defineEmits<{
  add: [value: string]
  remove: [value: string, index: number]
  change: [values: string[]]
}>()

const modelValue = defineModel<string[]>({ default: () => [] })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const editing = ref(false)
const draft = ref('')
const addInputRef = useTemplateRef<HTMLInputElement>('add-input')

const reachedMax = computed(() => props.max !== undefined && modelValue.value.length >= props.max)

const isLocked = (tag: string) => props.locked.includes(tag)

const sizeClass = computed(() => (props.size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'))

const shapeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'rounded-full'
    case 'scifi':
      return 'rounded-none uppercase tracking-wider'
    case 'cupertino':
      return 'rounded-lg'
    default:
      return 'rounded-md'
  }
})

const addBorderClass = 'border-[color-mix(in_srgb,var(--cml-color-current-color)_45%,transparent)] text-[var(--cml-color-current-color)]'
const inputBorderClass = 'border border-solid border-[var(--cml-color-current-color)] text-[var(--cml-color-current-color)]'

const startEditing = () => {
  if (props.disabled || reachedMax.value) return
  editing.value = true
  draft.value = ''
  nextTick(() => addInputRef.value?.focus())
}

const commit = () => {
  if (!editing.value) return
  const value = draft.value.trim()

  if (value === '') {
    cancel()
    return
  }
  if (reachedMax.value) {
    cancel()
    return
  }
  if (!props.allowDuplicate && modelValue.value.includes(value)) {
    draft.value = ''
    return
  }

  const next = [...modelValue.value, value]
  modelValue.value = next
  emit('add', value)
  emit('change', next)

  draft.value = ''
  // 非連續新增模式或已達上限時，新增後關閉輸入框
  if (!props.continuousAdd || reachedMax.value) cancel()
}

const cancel = () => {
  editing.value = false
  draft.value = ''
}

const removeAt = (index: number) => {
  if (props.disabled) return
  const removed = modelValue.value[index]
  if (removed === undefined || isLocked(removed)) return
  const next = modelValue.value.filter((_, i) => i !== index)
  modelValue.value = next
  emit('remove', removed, index)
  emit('change', next)
}

/** 輸入框為空時按 Backspace 移除最後一個標籤 */
const onBackspace = () => {
  if (draft.value !== '' || modelValue.value.length === 0) return
  removeAt(modelValue.value.length - 1)
}
</script>
