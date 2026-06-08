<template>
  <div
    class="inline-block"
    :class="roleColorClass"
  >
    <CamelotScifiCheckbox
      v-if="themeMode === 'scifi'"
      v-model="modelValue"
      :label="label"
      :disabled="disabled"
      @change="emit('change', $event)"
    />

    <CamelotCupertinoCheckbox
      v-else-if="themeMode === 'cupertino'"
      v-model="modelValue"
      :label="label"
      :disabled="disabled"
      :shape="shape"
      @change="emit('change', $event)"
    />

    <CamelotAquaCheckbox
      v-else-if="themeMode === 'aqua'"
      v-model="modelValue"
      :label="label"
      :disabled="disabled"
      :shape="shape"
      @change="emit('change', $event)"
    />

    <CamelotMaterialCheckbox
      v-else
      v-model="modelValue"
      :label="label"
      :disabled="disabled"
      @change="emit('change', $event)"
    />
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
  }>(),
  {
    label: '',
    disabled: false,
    color: 'primary',
    isContainer: false,
    shape: 'square',
  },
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color, () => props.isContainer)
</script>
