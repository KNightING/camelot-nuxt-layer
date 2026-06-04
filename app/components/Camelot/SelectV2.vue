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
      <!-- Searchable Trigger (Input-based) -->
      <div
        v-if="searchable"
        class="relative w-full"
        @click="handleTriggerClick"
      >
        <input
          ref="triggerInput"
          :value="open ? searchValue : (selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? '')"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full border bg-background border-stroke outline-none rounded-lg pl-4 pr-10 py-2 text-base transition-colors focus:border-primary"
          :class="[
            open ? 'pointer-events-auto border-primary' : 'pointer-events-none border-stroke',
            disabled ? 'bg-gray-100! cursor-not-allowed text-secondary-text' : 'bg-background text-primary-text',
          ]"
          @input="(e: any) => handleSearchInput(e.target.value)"
        >
        <!-- Suffix: Clear search button or Arrow -->
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <button
            v-if="open && searchValue"
            type="button"
            class="text-secondary-text hover:text-primary-text outline-none focus:outline-none transition-colors"
            @click.stop="searchValue = ''"
          >
            ✕
          </button>
          <span
            v-else
            class="text-secondary-text text-xs transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          >
            ▼
          </span>
        </div>
      </div>

      <!-- Static Trigger -->
      <div
        v-else
        class="w-full border outline-none rounded-lg px-4 py-2 text-base flex items-center gap-2 transition-colors"
        :class="[
          open ? 'border-primary' : 'border-stroke',
          disabled ? 'bg-gray-100! cursor-not-allowed text-secondary-text' : 'bg-background text-primary-text',
        ]"
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
          v-if="$slots.header"
          class="options-header shrink-0 relative z-10"
        >
          <slot
            name="header"
            :search-value="searchValue"
            :set-search-value="(val: string) => searchValue = val"
          />
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
  /** 是否禁用 */
  disabled?: boolean
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
  disabled: false,
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
const { list: virtualList, containerProps: virtualContainerProps, wrapperProps: virtualWrapperProps, scrollTo } = useVirtualList(
  filteredOptions,
  {
    itemHeight: () => props.itemHeight,
    overscan: props.overscan,
  },
)

// FIX: iOS 17 以下版本的虛擬滾動顯示問題
// 當 open 改變時，手動觸發 resize 事件及滾動位置更新，確保虛擬滾動計算正確
watch(open, (isOpen) => {
  if (isOpen) {
    if (props.virtualScroll) {
      nextTick(() => {
        if (typeof window !== 'undefined') {
          // 模擬 resize 觸發 useVirtualList 重新計算大小
          window.dispatchEvent(new Event('resize'))
        }

        // 在動畫過程中與結束後再次觸發，確保在 iOS 上能正確渲染
        const timer = setInterval(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('resize'))
            scrollTo(0)
          }
        }, 100)

        // 500ms 動畫結束後停止，多給 100ms 緩衝
        setTimeout(() => {
          clearInterval(timer)
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('resize'))
          }
        }, 600)
      })
    }
  }
  else {
    searchValue.value = ''
  }
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
const triggerInput = useTemplateRef<HTMLInputElement>('triggerInput')

const handleTriggerClick = (e: MouseEvent) => {
  if (open.value) {
    e.stopPropagation()
    triggerInput.value?.focus?.()
  }
}

const handleSearchInput = (val: string) => {
  if (open.value) {
    searchValue.value = val
  }
}

const onItemClick = (e: Event, value: string | number) => {
  searchValue.value = ''
  nextTick(() => {
    model.value = value
    if (!props.disableCloseWhenSelected) {
      open.value = false
    }
  })
}

// 處理預設值初始化
watch([() => props.options, () => props.default], ([options, isDefault]) => {
  if (isDefault && typeof model.value === 'undefined' && options && options.length > 0 && options[0]) {
    model.value = options[0].value
  }
}, { immediate: true })
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
