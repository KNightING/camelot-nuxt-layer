<template>
  <div
    class="inline-flex items-center gap-2 select-none"
    :class="roleColorClass"
  >
    <CamelotScifiCheckbox
      v-if="themeMode === 'scifi'"
      v-model="modelValue"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @change="emit('change', $event)"
    />

    <CamelotCupertinoCheckbox
      v-else-if="themeMode === 'cupertino'"
      v-model="modelValue"
      :disabled="disabled"
      :shape="shape"
      :indeterminate="indeterminate"
      @change="emit('change', $event)"
    />

    <CamelotAquaCheckbox
      v-else-if="themeMode === 'aqua'"
      v-model="modelValue"
      :disabled="disabled"
      :shape="shape"
      :indeterminate="indeterminate"
      @change="emit('change', $event)"
    />

    <CamelotMaterialCheckbox
      v-else
      v-model="modelValue"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @change="emit('change', $event)"
    />

    <span
      v-if="label || $slots.label"
      class="inline-flex items-center"
      :class="disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'"
      @click="toggleByLabel"
    >
      <slot
        name="label"
        :label="label"
      >
        <CamelotFieldLabel
          :label="label"
          class="leading-none"
        />
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    color?: CamelotColorRole
    isContainer?: boolean
    shape?: 'square' | 'circle'
    indeterminate?: boolean
  }>(),
  {
    label: '',
    disabled: false,
    color: 'primary',
    isContainer: false,
    shape: 'square',
    indeterminate: false,
  },
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color, () => props.isContainer)

const toggleByLabel = () => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>
