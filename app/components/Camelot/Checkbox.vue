<template>
  <div :style="checkboxStyle" class="inline-block">
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
    color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'warning' | 'success'
    isContainer?: boolean
    shape?: 'square' | 'circle'
  }>(),
  {
    label: '',
    disabled: false,
    color: 'primary',
    isContainer: false,
    shape: 'square',
  }
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const { themeMode } = useCamelotTheme()

const checkboxStyle = computed(() => {
  const role = props.color
  const isContainer = props.isContainer

  const colorToken = isContainer ? `var(--color-${role}-container)` : `var(--color-${role})`
  const onColorToken = isContainer ? `var(--color-on-${role}-container)` : `var(--color-on-${role})`

  return {
    '--cml-color-current-color': colorToken,
    '--cml-color-current-on-color': onColorToken,
  }
})
</script>
