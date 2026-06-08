<template>
  <div
    class="inline-block"
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
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    color?: CamelotColorRole
    isContainer?: boolean
  }>(),
  {
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
</script>
