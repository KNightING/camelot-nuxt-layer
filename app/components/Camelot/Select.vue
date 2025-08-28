<template>
  <CamelotPopup v-model:open="open" :z-index="zIndex">
    <slot :selected-data="selectedData">
      <div
        class="w-full border bg-background text-black-700 border-black-300 focus:border-primary-500 outline-none rounded-lg px-4 py-2 text-base caret-primary-500 flex">
        <span class="flex-1">{{ selectedData?.value }}</span>
      </div>
    </slot>
    <template #popup>
      <div ref="optionsContainerEl" class="options-container" :style="[`max-height:${optionsContainerMaxHeight}px;`]">
        <template v-for="(option, index) in options" :key="index">
          <button type="button" @click="(e) => onItemClick(e, option.value)">
            <slot name="option" :index="index" :data="option" :is-selected="model === option.value">
              <CamelotGpu class="option">
                <span class="w-5 text-primary">{{ model === option.value ? '✓' : '' }} </span>
                <span :class="{
                  'text-primary': model === option.value,
                }" :style="[
                    'margin-top: 0.25rem;margin-bottom: 0.25rem;font-size: 1rem;line-height: 1.5rem; user-select:none;',
                  ]">{{ option.label ?? option.name }}</span>
              </CamelotGpu>
            </slot>
          </button>
        </template>
      </div>
    </template>
  </CamelotPopup>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
  options: SelectOptions<T>
  optionsContainerMaxHeight?: number
  optionsContainerBackgroundColor?: string
  zIndex?: number
  disableCloseWhenSelected?: boolean
  default?: boolean
}>(), {
  optionsContainerMaxHeight: 160,
  default: true,
})

const open = defineModel<boolean>('open', { default: false })

const model = defineModel<string | number | undefined>()

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

onMounted(() => {
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
  --c-select-background: var(--camelot-m3-background);
  background: rgba(from var(--camelot-c-select-background) r g b / 1);
  display: flex;
  overflow: auto;
  position: relative;
  top: 0;
  left: 0;
  padding: 0.5rem;
  flex-direction: column;
  border-radius: 0.5rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06));
}

.option {
  display: flex;
  align-items: center;
}

.v-enter-active {
  transition: all 0.4s ease;
}

.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
