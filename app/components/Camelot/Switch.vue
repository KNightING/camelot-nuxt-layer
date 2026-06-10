<template>
  <div
    class="inline-flex items-center gap-2 select-none"
    :class="roleColorClass"
  >
    <CamelotScifiSwitch
      v-if="themeMode === 'scifi'"
      v-model="modelValue"
      :disabled="disabled"
      @change="emit('change', $event)"
    />

    <CamelotCupertinoSwitch
      v-else-if="themeMode === 'cupertino'"
      v-model="modelValue"
      :disabled="disabled"
      @change="emit('change', $event)"
    />

    <CamelotAquaSwitch
      v-else-if="themeMode === 'aqua'"
      v-model="modelValue"
      :disabled="disabled"
      @change="emit('change', $event)"
    />

    <CamelotMaterialSwitch
      v-else
      v-model="modelValue"
      :disabled="disabled"
      @change="emit('change', $event)"
    />

    <span
      v-if="label || $slots.label"
      :class="disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'"
      @click="toggleByLabel"
    >
      <slot
        name="label"
        :label="label"
      >
        <CamelotFieldLabel :label="label" />
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
  }>(),
  {
    label: '',
    disabled: false,
    color: 'primary',
    isContainer: false,
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
