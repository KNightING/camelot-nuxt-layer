<template>
  <CamelotPopupV2
    v-model:open="open"
    :z-index="zIndex"
    :popup-width-mode="popupWidthMode"
    :disabled-close-when-scrolling="disabledCloseWhenScrolling"
    disabled-auto-space
    disabled-shadow
    :popup-class="popupShadowClass"
  >
    <slot :selected-data="selectedData">
      <!-- Sci-fi Trigger Wrapper -->
      <CamelotScifiFrame
        v-if="themeMode === 'scifi'"
        :focused="open"
        :active-reticle="open"
        class="w-full"
      >
        <!-- Searchable Trigger (Input-based) -->
        <div
          v-if="searchable"
          class="relative w-full"
          @click="handleTriggerClick"
        >
          <input
            ref="triggerInput"
            :value="open ? searchValue : selectedLabel"
            type="text"
            :placeholder="selectedLabel || placeholder"
            :disabled="disabled"
            class="w-full bg-transparent outline-none border-none pl-4 pr-10 py-2 text-base text-on-surface"
            @input="(e: any) => handleSearchInput(e.target.value)"
          >
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
              class="text-primary text-xs transition-transform duration-200"
              :class="{ 'rotate-180': open }"
            >
              ▼
            </span>
          </div>
        </div>

        <!-- Static Trigger -->
        <div
          v-else
          class="w-full outline-none px-4 py-2 text-base flex items-center gap-2 text-on-surface"
        >
          <span
            class="flex-1 truncate"
            :class="selectedData ? 'text-on-surface' : 'text-secondary-text'"
          >{{ selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? placeholder }}</span>
          <span
            class="text-primary text-xs transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          >▼</span>
        </div>
      </CamelotScifiFrame>

      <!-- Cupertino / Material / Default Trigger -->
      <template v-else>
        <!-- Searchable Trigger -->
        <div
          v-if="searchable"
          class="relative w-full"
          @click="handleTriggerClick"
        >
          <input
            ref="triggerInput"
            :value="open ? searchValue : selectedLabel"
            type="text"
            :placeholder="selectedLabel || placeholder"
            :disabled="disabled"
            class="w-full outline-none text-base transition-colors"
            :class="[
              themeMode === 'cupertino'
                ? 'rounded-[10px] bg-surface-container-highest border border-outline-variant px-4 py-2 focus:border-primary'
                : themeMode === 'material'
                  ? 'h-[56px] rounded-t-[4px] rounded-b-none bg-surface-container-highest border-b border-t-0 border-x-0 border-outline px-4 focus:border-b-2 focus:border-primary'
                  : themeMode === 'aqua'
                    ? 'aqua-track rounded-full px-4 py-2.5 backdrop-blur-md focus:aqua-glow'
                    : 'border border-stroke rounded-lg px-4 py-2 focus:border-primary',
              open && themeMode !== 'aqua' ? 'border-primary' : '',
              open ? 'pointer-events-auto' : 'pointer-events-none',
              disabled ? 'bg-gray-100! cursor-not-allowed text-secondary-text' : 'text-primary-text',
            ]"
            @input="(e: any) => handleSearchInput(e.target.value)"
          >
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
          class="w-full outline-none text-base flex items-center gap-2 transition-colors"
          :class="[
            themeMode === 'cupertino'
              ? 'rounded-[10px] bg-surface-container-highest border border-outline-variant px-4 py-2'
              : themeMode === 'material'
                ? 'h-[56px] rounded-t-[4px] rounded-b-none bg-surface-container-highest border-b border-t-0 border-x-0 border-outline px-4'
                : themeMode === 'aqua'
                  ? 'aqua-track rounded-full px-4 py-2.5 backdrop-blur-md'
                  : 'border border-stroke rounded-lg px-4 py-2',
            open && themeMode !== 'aqua' ? 'border-primary' : '',
            disabled ? 'bg-gray-100! cursor-not-allowed text-secondary-text' : 'text-primary-text',
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
      </template>
    </slot>
    <template #popup>
      <div
        ref="optionsContainerEl"
        class="options-container relative flex flex-col overflow-hidden"
        :class="[
          optionsContainerClass || (themeMode === 'aqua' ? 'aqua-glass' : 'bg-surface'),
          themeMode === 'cupertino' ? 'rounded-[12px] backdrop-blur-md' : '',
          themeMode === 'aqua' ? 'aqua-options rounded-3xl p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]!' : '',
          themeMode === 'scifi' ? 'scifi-options-panel bg-transparent border-none shadow-none!' : '',
          themeMode === 'material' ? 'rounded-md' : '',
        ]"
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

        <!-- Sci-fi Options View -->
        <template v-if="themeMode === 'scifi'">
          <CamelotScifiFrame
            variant="2-corner"
            :show-grid="false"
            :show-borders="true"
          >
            <div class="options-list-inner max-h-[200px] overflow-y-auto px-1 py-1">
              <template v-if="filteredOptions && filteredOptions.length > 0">
                <button
                  v-for="(option, index) in filteredOptions"
                  :key="index"
                  type="button"
                  class="option-btn scifi-option"
                  :class="{ selected: model === option.value }"
                  @click="(e) => onItemClick(e, option.value)"
                >
                  <slot
                    name="option"
                    :index="index"
                    :data="option"
                    :is-selected="model === option.value"
                  >
                    <span>{{ option.label ?? option.name }}</span>
                  </slot>
                </button>
              </template>
              <template v-else>
                <div class="text-center py-4 text-xs text-primary opacity-60">
                  沒有可選選項
                </div>
              </template>
            </div>
          </CamelotScifiFrame>
        </template>

        <template v-else>
          <!-- 虛擬滾動模式 -->
          <template v-if="virtualScroll">
            <div
              v-if="filteredOptions && filteredOptions.length > 0"
              v-bind="virtualContainerProps"
              class="cml-options-scroll flex-1 min-h-0 relative bg-transparent overflow-auto"
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
                    class="option-btn"
                    :class="{ selected: model === option.value }"
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
                            class="my-0.5 font-normal leading-normal select-none"
                            :class="model === option.value ? 'text-primary' : 'text-on-surface'"
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
              class="flex-1 min-h-0 relative bg-transparent px-2 pb-2"
            >
              <slot name="empty-options">
                <div class="flex flex-col items-center justify-center text-on-surface-variant gap-2 py-2">
                  <span>沒有可選選項</span>
                </div>
              </slot>
            </div>
          </template>

          <!-- 一般模式：原生捲動，套用全站共通 scrollbar 樣式 -->
          <div
            v-else
            class="cml-options-scroll flex-1 min-h-0 relative overflow-y-auto bg-transparent"
          >
            <div class="flex flex-col px-2 pb-2">
              <template v-if="filteredOptions && filteredOptions.length > 0">
                <template
                  v-for="(option, index) in filteredOptions"
                  :key="index"
                >
                  <button
                    type="button"
                    class="option-btn"
                    :class="{ selected: model === option.value }"
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
                            class="my-0.5 font-normal leading-normal select-none"
                            :class="model === option.value ? 'text-primary' : 'text-on-surface'"
                          >{{ option.label ?? option.name }}</span>
                        </CamelotGpu>
                      </slot>
                    </slot>
                  </button>
                </template>
              </template>
              <template v-else>
                <slot name="empty-options">
                  <div class="flex flex-col items-center justify-center text-on-surface-variant gap-2 py-2">
                    <span>沒有可選選項</span>
                  </div>
                </slot>
              </template>
            </div>
          </div>
        </template>
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
  placeholder?: string
  virtualScroll?: boolean
  itemHeight?: number
  overscan?: number
  disabled?: boolean
}>(), {
  optionsContainerMaxHeight: 200,
  disabledCloseWhenScrolling: true,
  default: true,
  searchable: true,
  searchPlaceholder: '搜尋...',
  popupWidthMode: 'same-target',
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

const {
  list: virtualList, containerProps: virtualContainerProps, wrapperProps: virtualWrapperProps, scrollTo,
} = useVirtualList(
  filteredOptions,
  {
    itemHeight: () => props.itemHeight,
    overscan: props.overscan,
  },
)

const { themeMode } = useCamelotTheme()

// 陰影改畫在 popup 外層容器（位於 Expanded 的 overflow-hidden 之外，不會被方形裁切），
// 且圓角需與選單面板一致。面板本身的落影改為移除，僅保留不會被裁切的內高光。
const popupShadowClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'shadow-[0_12px_44px_-8px_rgba(0,0,0,0.30)] rounded-3xl'
    case 'cupertino':
      return 'shadow-2xl rounded-[12px]'
    case 'material':
      return 'shadow-lg rounded-md'
    case 'scifi':
      return ''
    default:
      return 'shadow-xl rounded-lg'
  }
})

watch(open, (isOpen) => {
  if (isOpen) {
    if (props.virtualScroll) {
      nextTick(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('resize'))
        }

        const timer = setInterval(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('resize'))
            scrollTo(0)
          }
        }, 100)

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

const selectedData = computed(() => {
  if (!props.options || props.options.length < 0) {
    return
  }
  return props.options.find(d => d.value === model.value)
})

// 觸發器顯示用文字（已選項的 label/name/value），未選為空字串
const selectedLabel = computed(() => {
  const data = selectedData.value
  if (!data) return ''
  return `${data.label ?? data.name ?? data.value ?? ''}`
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

watch([() => props.options, () => props.default], ([options, isDefault]) => {
  if (isDefault && typeof model.value === 'undefined' && options && options.length > 0 && options[0]) {
    model.value = options[0].value
  }
}, { immediate: true })
</script>

<style scoped>
.option {
  display: flex;
  align-items: center;
}

/* aqua 玻璃面板四周有 4px padding，會使原生捲動條離右緣 4px。
   將捲動容器右緣外推貼齊面板（margin），再以 padding-right 把內容推離捲動條，維持左右對稱 */
.aqua-options .cml-options-scroll {
  margin-right: -4px;
  padding-right: 4px;
}

.option-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.scifi-option {
  padding: 10px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--color-primary) 70%, white);
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
}
.scifi-option:hover {
  background: var(--color-primary);
  border-left-color: var(--color-on-primary);
  color: var(--color-on-primary);
}
.scifi-option.selected {
  background: color-mix(in srgb, var(--color-primary) 40%, transparent);
  border-left-color: var(--color-primary);
  color: var(--color-on-primary);
}

.options-list-inner {
  display: flex;
  flex-direction: column;
}

/* Aqua Frosted Glass 選項：圓角、留白、半透明 hover / selected */
.aqua-options .option-btn {
  border-radius: 12px;
  padding: 8px 12px;
  transition: background-color 0.15s ease;
}
.aqua-options .option-btn:hover {
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
}
.aqua-options .option-btn.selected {
  background-color: color-mix(in srgb, var(--color-primary) 14%, transparent);
}
</style>
