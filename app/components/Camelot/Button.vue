<template>
  <div
    class="inline-block text-base"
    :class="roleColorClass"
  >
    <CamelotScifiButton
      v-if="themeMode === 'scifi'"
      :disabled="disabled"
      :loading="loading"
      @click="onClick"
    >
      <slot>{{ label }}</slot>
    </CamelotScifiButton>

    <CamelotCupertinoButton
      v-else-if="themeMode === 'cupertino'"
      :disabled="disabled"
      :loading="loading"
      @click="onClick"
    >
      <slot>{{ label }}</slot>
    </CamelotCupertinoButton>

    <CamelotAquaButton
      v-else-if="themeMode === 'aqua'"
      :disabled="disabled"
      :loading="loading"
      @click="onClick"
    >
      <slot>{{ label }}</slot>
    </CamelotAquaButton>

    <CamelotTactileButton
      v-else-if="themeMode === 'tactile'"
      :disabled="disabled"
      :loading="loading"
      @click="onClick"
    >
      <slot>{{ label }}</slot>
    </CamelotTactileButton>

    <CamelotMaterialButton
      v-else
      :disabled="disabled"
      :loading="loading"
      :color="color"
      :is-container="isContainer"
      @click="onClick"
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
    /** 處理中：顯示轉圈並擋下 click 事件 */
    loading?: boolean
    color?: CamelotColorRole
    isContainer?: boolean
  }>(),
  {
    label: 'Button',
    disabled: false,
    loading: false,
    color: 'primary',
    isContainer: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { themeMode } = useCamelotTheme()

// 子元件在 loading 時已關閉滑鼠事件；這裡再擋一次是為了鍵盤（Enter / Space）觸發
const onClick = (event: MouseEvent) => {
  if (props.loading) return
  emit('click', event)
}

const roleColorClass = useCamelotRoleColorClass(() => props.color, () => props.isContainer)
</script>
