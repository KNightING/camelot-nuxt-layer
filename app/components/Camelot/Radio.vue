<template>
  <div
    class="inline-flex items-center gap-2 select-none"
    :class="roleColorClass"
  >
    <CamelotScifiRadio
      v-if="themeMode === 'scifi'"
      v-model="modelValue"
      :disabled="disabled"
      :deselectable="deselectable"
      @change="emit('change', $event)"
    />

    <CamelotCupertinoRadio
      v-else-if="themeMode === 'cupertino'"
      v-model="modelValue"
      :disabled="disabled"
      :deselectable="deselectable"
      @change="emit('change', $event)"
    />

    <CamelotAquaRadio
      v-else-if="themeMode === 'aqua'"
      v-model="modelValue"
      :disabled="disabled"
      :deselectable="deselectable"
      @change="emit('change', $event)"
    />

    <CamelotMaterialRadio
      v-else
      v-model="modelValue"
      :disabled="disabled"
      :deselectable="deselectable"
      @change="emit('change', $event)"
    />

    <span
      v-if="label || $slots.label"
      class="inline-flex items-center"
      :class="disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'"
      @click="selectByLabel"
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
    /** 點擊已選取項可取消選取（非必填情境） */
    deselectable?: boolean
    color?: CamelotColorRole
    isContainer?: boolean
  }>(),
  {
    label: '',
    disabled: false,
    deselectable: false,
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

const selectByLabel = () => {
  if (props.disabled) return
  if (modelValue.value && !props.deselectable) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>
