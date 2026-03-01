<template>
  <CamelotPopupV2
    v-model:open="open"
    :z-index="zIndex"
    :popup-width-mode="popupWidthMode"
    :disabled-close-when-scrolling="disabledCloseWhenScrolling"
    disabled-auto-space
    disabled-shadow
  >
    <slot :selected-data="selectedData">
      <span class="flex-1">{{ selectedData?.value }}</span>
    </slot>
    <template #popup>
      <div class="p-3">
        <div
          ref="optionsContainerEl"
          class="options-container flex flex-col rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 relative"
          :style="[`max-height: ${optionsContainerMaxHeight}px;`]"
        >
          <div class="options-header shrink-0 p-2 ">
            <slot
              name="header"
              :search-value="searchValue"
              :set-search-value="(val:string) => searchValue = val"
            >
              <div
                v-if="searchable"
                class="px-1"
              >
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-secondary-text">🔍</span>
                  <input
                    ref="searchInput"
                    v-model="searchValue"
                    type="text"
                    :placeholder="searchPlaceholder"
                    class="w-full h-[44px] pl-10 pr-4 bg-light-bg/30 border border-stroke rounded-lg outline-none focus:border-primary transition-colors text-body2"
                    @click.stop
                  >
                </div>
              </div>
            </slot>
          </div>
          <CamelotContainer
            class="flex-1 min-h-0 relative bg-inherit"
          >
            <div class="flex flex-col px-2 pb-2">
              <template v-if="filteredOptions && filteredOptions.length > 0">
                <template
                  v-for="(option, index) in filteredOptions"
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
                            class="select-none font-normal my-0.5 leading-normal"
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
          </CamelotContainer>
        </div>
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
  searchable?: boolean
  searchPlaceholder?: string
  filterFunction?: (option: SelectOption<T>, query: string) => boolean
  popupWidthMode?: 'fit-content' | 'min-target' | 'same-target'
}>(), {
  optionsContainerMaxHeight: 160,
  disabledCloseWhenScrolling: true,
  default: true,
  searchable: true,
  searchPlaceholder: '搜尋...',
  popupWidthMode: 'fit-content',
})

const open = defineModel<boolean>('open', { default: false })

const searchValue = ref('')

const filteredOptions = computed(() => {
  if (!props.options) return []
  if (!searchValue.value) {
    return props.options
  }

  if (props.filterFunction) {
    return props.options.filter(option => props.filterFunction!(option, searchValue.value))
  }

  const lowerSearch = searchValue.value.toLowerCase()
  return props.options.filter((opt: SelectOption<T>) => {
    if (!opt) return false
    if (opt.value && opt.value.toString().toLowerCase().includes(lowerSearch)) return true
    if (opt.label && opt.label.toString().toLowerCase().includes(lowerSearch)) return true
    if (opt.name && opt.name.toString().toLowerCase().includes(lowerSearch)) return true
    return false
  })
})

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

const optionsContainerEl = ref<HTMLElement | any>(null)

const containerRefForCssVar = computed(() => optionsContainerEl.value?.$el ?? optionsContainerEl.value)
const optionsContainerBackgroundColorVar = useElCssVar('--cml-c-select-background', containerRefForCssVar as any, { inherit: false })

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
    }
    else {
      model.value = undefined
    }
  }
})
</script>

<style scoped>
.options-container {
  --cml-c-select-background: var(--cml-c-m3-surface);
  background: rgba(var(--cml-c-select-background), 1);
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
}

.options-container :deep(.scroll-container) {
  height: 100%;
}

.option {
  display: flex;
  align-items: center;
}

.options-header {
  background: inherit;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); /* Optional subtle shadow separating head from items */
}
</style>
