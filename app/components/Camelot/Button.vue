<template>
  <div
    class="inline-block"
    :class="roleColorClass"
  >
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

    <CamelotAquaButton
      v-else-if="themeMode === 'aqua'"
      :disabled="disabled"
      @click="emit('click', $event)"
    >
      <slot>{{ label }}</slot>
    </CamelotAquaButton>

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
    color?: CamelotColorRole
    isContainer?: boolean
  }>(),
  {
    label: 'Button',
    disabled: false,
    color: 'primary',
    isContainer: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color, () => props.isContainer)
</script>
