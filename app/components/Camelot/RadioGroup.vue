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
    label?: string
    required?: boolean
  }>(),
  {
    direction: 'horizontal',
    color: 'primary',
    disabled: false,
    label: '',
    required: false,
  },
)

const emit = defineEmits<{
  change: [option: CamelotGroupOption]
}>()

const modelValue = defineModel<string | number>()

const select = (opt: CamelotGroupOption) => {
  if (props.disabled || opt.disabled) return
  modelValue.value = opt.value
  emit('change', opt)
}
</script>
