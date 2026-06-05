<template>
  <div :style="switchStyle" class="inline-block">
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

    <CamelotMaterialSwitch
      v-else
      v-model="modelValue"
      :disabled="disabled"
      @change="emit('change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'warning' | 'success'
    isContainer?: boolean
  }>(),
  {
    disabled: false,
    color: 'primary',
    isContainer: false,
  }
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const { themeMode } = useCamelotTheme()

const switchStyle = computed(() => {
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
