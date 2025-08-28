<template>
  <CamelotPopupV2
    v-model:open="open"
    :z-index="zIndex"
    width-with-target
    :disabled-close-when-scrolling="disabledCloseWhenScrolling"
    disabled-auto-space
  >
    <slot :selected-data="selectedData">
      <span class="flex-1">{{ selectedData?.value }}</span>
    </slot>
    <template #popup>
      <div
        ref="optionsContainerEl"
        class="options-container"
        :style="[`max-height:${optionsContainerMaxHeight}px;`]"
      >
        <template v-if="options && options.length > 0">
          <template
            v-for="(option, index) in options"
            :key="index"
          >
            <button
              type="button"
              @click="(e) => onItemClick(e, option.value)"
            >
              <slot
                :name="`option-${option.value}`"
                :index="index"
                :data="option"
                :is-selected="model === option.value"
              >
                <slot
                  name="option"
                  :index="index"
                  :data="option"
                  :is-selected="model === option.value"
                >
                  <CamelotGpu class="option">
                    <span class="w-5 text-primary">{{ model === option.value ? '✓' : '' }} </span>
                    <span
                      :class="{
                        'text-primary': model === option.value,
                      }"
                      :style="[
                        'margin-top: 0.25rem;margin-bottom: 0.25rem;font-size: 1rem;line-height: 1.5rem; user-select:none;',
                      ]"
                    >{{ option.label ?? option.name }}</span>
                  </CamelotGpu>
                </slot>
              </slot>
            </button>
          </template>
        </template>
        <template v-else>
          <slot name="empty-options">
            <div class="flex flex-col items-center justify-center text-gray-400 gap-2 py-2">
              <!-- <i-material-symbols-cancel-outline-rounded class="text-4xl" /> -->
              <span>沒有可選選項</span>
            </div>
          </slot>
        </template>
      </div>
    </template>
  </CamelotPopupV2>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
  options?: SelectOptions<T>
  optionsContainerMaxHeight?: number
  optionsContainerBackgroundColor?: string
  zIndex?: number
  disableCloseWhenSelected?: boolean
  default?: boolean
  disabledCloseWhenScrolling?: boolean
}>(), {
  optionsContainerMaxHeight: 160,
  disabledCloseWhenScrolling: true,
  default: true,
})

const open = defineModel<boolean>('open', { default: false })

const model = defineModel<string | number>()

const emit = defineEmits<{
  changed: [SelectOption<T>]
}>()

// 檢查model目前的值是否存在options,不存在則設為空值
// if (model.value) {
//   const defaultModel = props.options.find(o => o.value === model.value)
//   if (!defaultModel) {
//     model.value = null
//   }
// }

const selectedData = computed(() => {
  if (!props.options || props.options.length < 0) {
    return
  }
  return props.options.find(d => d.value === model.value)
})

watch(selectedData, (selectedData) => {
  if (selectedData) {
    emit('changed', selectedData)
  }
})

const optionsContainerEl = ref<HTMLElement | null>(null)

const optionsContainerBackgroundColorVar = useElCssVar('--c-select-background', optionsContainerEl, { inherit: false })

watch([optionsContainerEl, props], ([el, props]) => {
  if (el && props) {
    const optionsContainerBackgroundColor = props.optionsContainerBackgroundColor
    if (optionsContainerBackgroundColor) {
      const rgba = useColor().hexToRgbaArray(optionsContainerBackgroundColor)
      if (rgba) {
        optionsContainerBackgroundColorVar.value = `${rgba[0]},${rgba[1]},${rgba[2]}`
      }
    }
  }
})

const onItemClick = (e: Event, value: string | number) => {
  model.value = value
  if (!props.disableCloseWhenSelected) {
    open.value = false
  }
}

onUpdated(() => {
  if (!props.options || props.options.length < 0) {
    return
  }

  // 如果model為空值, 則預設為第一個option
  if (props.default && typeof model.value === 'undefined') {
    if (props.options.length > 0 && props.options[0]) {
      model.value = props.options[0].value
    } else {
      model.value = undefined
    }
  }
})
</script>

<style scoped>
.options-container {
  --c-select-background: var(--camelot-m3-surface);
  background: rgba(var(--c-select-background), 1);
  background: white;
  display: flex;
  overflow: auto;
  position: relative;
  top: 0;
  left: 0;
  padding: 0.5rem;
  flex-direction: column;
  border-radius: 0.5rem;
}

.option {
  display: flex;
  align-items: center;
}
</style>
