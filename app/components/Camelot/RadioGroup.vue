<template>
  <div class="flex w-fit flex-col gap-2">
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-1"
      />
    </slot>

    <div
      class="flex gap-x-6 gap-y-2"
      :class="direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center'"
    >
      <CamelotRadio
        v-for="opt in options"
        :key="opt.value"
        :model-value="modelValue === opt.value"
        :label="opt.label"
        :disabled="disabled || opt.disabled"
        :deselectable="deselectable"
        :color="color"
        @change="select(opt)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    options: CamelotGroupOption[]
    /** 排列方向（預設水平） */
    direction?: 'horizontal' | 'vertical'
    color?: CamelotColorRole
    /** 整組停用；逐選項停用請用 option.disabled */
    disabled?: boolean
    /** 點擊已選取項可取消選取（非必填情境），取消時 modelValue 為 undefined */
    deselectable?: boolean
    label?: string
    required?: boolean
  }>(),
  {
    direction: 'horizontal',
    color: 'primary',
    disabled: false,
    deselectable: false,
    label: '',
    required: false,
  },
)

const emit = defineEmits<{
  /** deselectable 取消選取時 option 為 undefined */
  change: [option: CamelotGroupOption | undefined]
}>()

const modelValue = defineModel<string | number | undefined>()

const select = (opt: CamelotGroupOption) => {
  if (props.disabled || opt.disabled) return
  if (modelValue.value === opt.value) {
    if (!props.deselectable) return
    modelValue.value = undefined
    emit('change', undefined)
    return
  }
  modelValue.value = opt.value
  emit('change', opt)
}
</script>
