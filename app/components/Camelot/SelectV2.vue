<template>
  <CamelotPopupV2
    v-model:open="open"
    :z-index="zIndex"
    :popup-width-mode="popupWidthMode"
    :disabled-close-when-scrolling="disabledCloseWhenScrolling"
    disabled-auto-space
    disabled-shadow
    popup-class="shadow-lg rounded-md"
  >
    <slot :selected-data="selectedData">
      <div
        class="w-full border bg-background border-stroke outline-none rounded-lg px-4 py-2 text-base flex items-center gap-2 transition-colors"
        :class="open ? 'border-primary' : 'border-stroke'"
      >
        <span
          class="flex-1 truncate"
          :class="selectedData ? 'text-on-surface' : 'text-secondary-text'"
        >{{ selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? placeholder }}</span>
        <span
          class="text-secondary-text text-xs transition-transform duration-200"
          :class="{ 'rotate-180': open }"
        >▼</span>
      </div>
    </slot>
    <template #popup>
      <div
        ref="optionsContainerEl"
        class="options-container flex flex-col rounded-md overflow-hidden relative"
        :class="optionsContainerClass || 'bg-surface'"
        :style="[`max-height: ${optionsContainerMaxHeight}px;`]"
      >
        <div
          v-if="searchable || $slots.header"
          class="options-header shrink-0 relative z-10"
        >
          <slot
            name="header"
            :search-value="searchValue"
            :set-search-value="(val:string) => searchValue = val"
          >
            <div
              v-if="searchable"
              class="p-2"
            >
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-secondary-text">🔍</span>
                <input
                  ref="searchInput"
                  v-model="searchValue"
                  type="text"
                  :placeholder="searchPlaceholder"
                  class="w-full py-1 pl-10 pr-4 bg-light-bg/30 border border-stroke rounded-lg outline-none focus:border-primary transition-colors text-body2"
                  @click.stop
                >
              </div>
            </div>
          </slot>
        </div>
        <!-- 虛擬滾動模式 -->
        <template v-if="virtualScroll">
          <div
            v-if="filteredOptions && filteredOptions.length > 0"
            v-bind="virtualContainerProps"
            class="flex-1 min-h-0 relative bg-inherit overflow-auto"
          >
            <div
              v-bind="virtualWrapperProps"
              class="flex flex-col px-2 pb-2"
            >
              <template
                v-for="{ data: option, index } in virtualList"
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
            </div>
          </div>
          <div
            v-else
            class="flex-1 min-h-0 relative bg-inherit px-2 pb-2"
          >
            <slot name="empty-options">
              <div class="flex flex-col items-center justify-center text-gray-400 gap-2 py-2">
                <span>沒有可選選項</span>
              </div>
            </slot>
          </div>
        </template>

        <!-- 一般模式 (原有行為) -->
        <CamelotContainer
          v-else
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
    </template>
  </CamelotPopupV2>
</template>

<script setup lang="ts" generic="T">
import { useVirtualList } from '@vueuse/core'

const props = withDefaults(defineProps<{
  options?: SelectOptions<T>
  optionsContainerMaxHeight?: number
  zIndex?: number
  disableCloseWhenSelected?: boolean
  default?: boolean
  disabledCloseWhenScrolling?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  filterFunction?: (option: SelectOption<T>, query: string) => boolean
  popupWidthMode?: 'fit-content' | 'min-target' | 'same-target'
  optionsContainerClass?: string | string[] | Record<string, boolean>
  /** 未選取時的提示文字 */
  placeholder?: string
  /** 是否啟用虛擬滾動，大量選項時建議開啟 */
  virtualScroll?: boolean
  /** 虛擬滾動時每個選項的高度 (px)，需與實際渲染高度一致 */
  itemHeight?: number
  /** 虛擬滾動時可視區域外預渲染的項目數量 */
  overscan?: number
}>(), {
  optionsContainerMaxHeight: 200,
  disabledCloseWhenScrolling: true,
  default: true,
  searchable: true,
  searchPlaceholder: '搜尋...',
  popupWidthMode: 'fit-content',
  placeholder: '請選擇...',
  virtualScroll: false,
  itemHeight: 36,
  overscan: 5,
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

// 虛擬滾動
const { list: virtualList, containerProps: virtualContainerProps, wrapperProps: virtualWrapperProps } = useVirtualList(
  filteredOptions,
  {
    itemHeight: () => props.itemHeight,
    overscan: props.overscan,
  },
)

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
.options-container :deep(.scroll-container) {
  height: 100%;
}

.option {
  display: flex;
  align-items: center;
}
</style>
