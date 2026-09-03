<template>
  <div
    class="flex w-full min-w-0 flex-col gap-1.5"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-50': disabled }]"
  >
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-1"
      />
    </slot>

    <CamelotPopupV2
      v-model:open="open"
      :disabled="disabled"
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
                class="text-outline hover:text-[var(--cml-color-current-color)] outline-none focus:outline-none transition-colors"
                @click.stop="searchValue = ''"
              >
                ✕
              </button>
              <span
                v-else
                class="text-[var(--cml-color-current-color)] text-xs transition-transform duration-200"
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
              :class="selectedData ? 'text-on-surface' : 'text-on-surface-variant'"
            >{{ selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? placeholder }}</span>
            <span
              class="text-[var(--cml-color-current-color)] text-xs transition-transform duration-200"
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
                  ? 'rounded-[10px] bg-surface-container-highest border border-outline-variant pl-4 pr-10 py-2 focus:border-[var(--cml-color-current-color)]'
                  : themeMode === 'material'
                    ? 'h-[56px] rounded-t-[4px] rounded-b-none bg-surface-container-highest border-b border-t-0 border-x-0 border-outline pl-4 pr-10 focus:border-b-2 focus:border-[var(--cml-color-current-color)]'
                    : themeMode === 'aqua'
                      ? 'aqua-track rounded-full pl-4 pr-10 py-2.5 backdrop-blur-md focus:aqua-glow'
                      : 'border border-stroke rounded-lg pl-4 pr-10 py-2 focus:border-[var(--cml-color-current-color)]',
                open && themeMode !== 'aqua' ? 'border-[var(--cml-color-current-color)]' : '',
                open ? 'pointer-events-auto' : 'pointer-events-none',
                disabled ? 'text-on-surface-variant' : 'text-on-surface',
              ]"
              @input="(e: any) => handleSearchInput(e.target.value)"
            >
            <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <button
                v-if="open && searchValue"
                type="button"
                class="text-outline hover:text-[var(--cml-color-current-color)] outline-none focus:outline-none transition-colors"
                @click.stop="searchValue = ''"
              >
                ✕
              </button>
              <span
                v-else
                class="text-[var(--cml-color-current-color)] text-xs transition-transform duration-200"
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
              open && themeMode !== 'aqua' ? 'border-[var(--cml-color-current-color)]' : '',
              disabled ? 'text-on-surface-variant' : 'text-on-surface',
            ]"
          >
            <span
              class="min-w-0 flex-1 truncate"
              :class="selectedData ? 'text-on-surface' : 'text-on-surface-variant'"
            >{{ selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? placeholder }}</span>
            <span
              class="text-[var(--cml-color-current-color)] text-xs transition-transform duration-200"
              :class="{ 'rotate-180': open }"
            >▼</span>
          </div>
        </template>
      </slot>
      <template #popup>
        <div
          ref="optionsContainerEl"
          class="options-container relative flex flex-col overflow-hidden text-on-surface"
          :class="[
            roleColorClass,
            optionsContainerClass || (themeMode === 'aqua' ? 'aqua-glass' : 'bg-surface'),
            themeMode === 'cupertino' ? 'rounded-[12px] backdrop-blur-md' : '',
            themeMode === 'aqua' ? 'aqua-options rounded-3xl p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]!' : '',
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
                    :title="option.label ?? option.name"
                    :disabled="option.disable"
                    :data-camelot-selected="model === option.value || undefined"
                    :class="optionButtonClass(model === option.value, option.disable)"
                    @click="(e) => onItemClick(e, option)"
                  >
                    <slot
                      name="option"
                      :index="index"
                      :data="option"
                      :is-selected="model === option.value"
                    >
                      <span class="flex-1 truncate">{{ option.label ?? option.name }}</span>
                    </slot>
                  </button>
                </template>
                <template v-else>
                  <!-- 與其他三個主題一致：空狀態走 #empty-options slot，預設文案改吃 CurrentColor -->
                  <slot name="empty-options">
                    <div class="text-center py-4 text-xs text-[var(--cml-color-current-color)] opacity-60">
                      沒有可選選項
                    </div>
                  </slot>
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
                  class="flex flex-col px-2 py-2"
                >
                  <template
                    v-for="{ data: option, index } in virtualList"
                    :key="index"
                  >
                    <button
                      type="button"
                      :title="option.label ?? option.name"
                      :disabled="option.disable"
                      :data-camelot-selected="model === option.value || undefined"
                      :class="optionButtonClass(model === option.value, option.disable)"
                      @click="(e) => onItemClick(e, option)"
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
                          <span class="flex-1 truncate select-none">{{ option.label ?? option.name }}</span>
                        </slot>
                      </slot>
                    </button>
                  </template>
                </div>
              </div>
              <div
                v-else
                class="flex-1 min-h-0 relative bg-transparent px-2 py-2"
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
              <div class="flex flex-col px-2 py-2">
                <template v-if="filteredOptions && filteredOptions.length > 0">
                  <template
                    v-for="(option, index) in filteredOptions"
                    :key="index"
                  >
                    <button
                      type="button"
                      :title="option.label ?? option.name"
                      :disabled="option.disable"
                      :data-camelot-selected="model === option.value || undefined"
                      :class="optionButtonClass(model === option.value, option.disable)"
                      @click="(e) => onItemClick(e, option)"
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
                          <span class="flex-1 truncate select-none">{{ option.label ?? option.name }}</span>
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
  </div>
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
  color?: CamelotColorRole
  label?: string
  required?: boolean
}>(), {
  optionsContainerMaxHeight: 200,
  disabledCloseWhenScrolling: true,
  default: true,
  searchable: true,
  searchPlaceholder: '搜尋...',
  popupWidthMode: 'min-target',
  placeholder: '請選擇...',
  virtualScroll: false,
  itemHeight: 36,
  overscan: 5,
  disabled: false,
  color: 'primary',
})

const roleColorClass = useCamelotRoleColorClass(() => props.color)

// 選項列的選中／hover 效果與 CascadeMenu 共用同一核心（四風格、消費 CurrentColor）
const {
  activeClass: optionActiveClass, hoverClass: optionHoverClass,
} = useCamelotMenuItemTheme()
const OPTION_ROW_BASE = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left min-h-[36px] transition-colors'
// 停用列：不套 hover 效果（避免看起來可點），並與其他元件的停用態一致用 0.38 透明度。
// 已選中的停用列仍保留 active 樣式，否則「目前值不可再選」的情境會看不出選在哪。
const OPTION_ROW_DISABLED = 'cursor-not-allowed opacity-[0.38]'
const optionButtonClass = (isSelected: boolean, isDisabled?: boolean) => [
  OPTION_ROW_BASE,
  isDisabled
    ? [OPTION_ROW_DISABLED, isSelected ? optionActiveClass.value : 'text-on-surface']
    : (isSelected ? optionActiveClass.value : optionHoverClass.value),
]

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

// 已選項在目前（過濾後）清單中的位置；不在清單中時為 -1
const selectedIndex = computed(() => {
  const list = filteredOptions.value
  if (!list) return -1
  return list.findIndex(option => option && option.value === model.value)
})

/**
 * 展開時把已選項捲進可視範圍並置中。
 * 清單一長，每次打開都停在頂端就看不出目前選的是哪一個，得自己捲去找。
 *
 * 用 scrollTop 而非 scrollIntoView：後者會連同外層祖先一起捲（浮層在 body 或 <dialog>
 * 底下，會把整個頁面拉走）。這裡只動選項自己的捲動容器。
 */
const scrollSelectedIntoView = () => {
  const root = optionsContainerEl.value as HTMLElement | null
  // 一般 / aqua / cupertino / material 用 .cml-options-scroll；scifi 版面是 .options-list-inner
  const container = root?.querySelector?.('.cml-options-scroll, .options-list-inner') as HTMLElement | null
  const target = root?.querySelector?.('[data-camelot-selected]') as HTMLElement | null
  if (!container || !target) return

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  // 展開動畫未跑完時高度可能還是 0，此時算出來的位移沒有意義，交給下一次重試
  if (!containerRect.height) return

  container.scrollTop += (targetRect.top - containerRect.top)
    - (containerRect.height - targetRect.height) / 2
}

watch(open, (isOpen) => {
  if (!isOpen) {
    searchValue.value = ''
    return
  }

  nextTick(() => {
    if (props.virtualScroll) {
      // useVirtualList 的可視範圍由容器的 ResizeObserver 驅動，會隨展開動畫自行重算——
      // 先前為此派發全域 resize 事件對它無效，只會讓全站監聽者空轉。
      scrollTo(selectedIndex.value > 0 ? selectedIndex.value : 0)
      return
    }

    scrollSelectedIntoView()
    // 展開是 grid-rows 過場，第一幀容器高度還在長；動畫收尾後再校正一次。
    setTimeout(scrollSelectedIntoView, 320)
  })
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

const onItemClick = (e: Event, option: SelectOption<T>) => {
  // 停用項：button 的 disabled 已擋掉使用者點擊，這裡再擋一次，
  // 讓自訂 #option slot 內部自己送出的 click 也無法繞過。
  if (option.disable) return

  const value = option.value
  // disableCloseWhenSelected 讓選單在選取後保持開啟（方便連續比較多個選項），
  // 但「再點一次已經選中的那一項」視為確認，仍然關閉——否則只剩點外面才關得掉。
  const reselectedCurrent = props.disableCloseWhenSelected && model.value === value
  searchValue.value = ''
  nextTick(() => {
    model.value = value
    if (!props.disableCloseWhenSelected || reselectedCurrent) {
      open.value = false
    }
  })
}

watch([() => props.options, () => props.default], ([options, isDefault]) => {
  if (!isDefault || typeof model.value !== 'undefined' || !options) return
  // 預設值取「第一個可選的」而非第一個：首項若是停用中的佔位（例如「請先選擇上層條件」），
  // 直接選它會讓元件一開始就停在一個使用者無法再點選的值上。
  const firstSelectable = options.find(option => option && !option.disable)
  if (firstSelectable) {
    model.value = firstSelectable.value
  }
}, { immediate: true })
</script>

<style scoped>
/* aqua 玻璃面板四周有 4px padding，會使原生捲動條離右緣 4px。
   將捲動容器右緣外推貼齊面板（margin），再以 padding-right 把內容推離捲動條，維持左右對稱 */
.aqua-options .cml-options-scroll {
  margin-right: -4px;
  padding-right: 4px;
}

.options-list-inner {
  display: flex;
  flex-direction: column;
}
</style>
