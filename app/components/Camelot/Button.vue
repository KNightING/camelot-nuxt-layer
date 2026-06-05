<template>
  <div :style="buttonStyle" class="inline-block">
    <CamelotScifiButton
      v-if="themeMode === 'scifi'"
      :disabled="disabled"
      @click="emit('click', $event)"
    >
      <slot>{{ label }}</slot>
    </CamelotScifiButton>

    <CamelotCupertinoButton
      v-else-if="themeMode === 'cupertino'"
      :disabled="disabled"
      @click="emit('click', $event)"
    >
      <slot>{{ label }}</slot>
    </CamelotCupertinoButton>

    <CamelotMaterialButton
      v-else
      :disabled="disabled"
      :color="color"
      :is-container="isContainer"
      @click="emit('click', $event)"
    >
      <slot>{{ label }}</slot>
    </CamelotMaterialButton>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'warning' | 'success'
    isContainer?: boolean
  }>(),
  {
    label: 'Button',
    disabled: false,
    color: 'primary',
    isContainer: false,
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { themeMode } = useCamelotTheme()

const buttonStyle = computed(() => {
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
