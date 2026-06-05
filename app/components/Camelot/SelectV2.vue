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
      <!-- Cyber Trigger Wrapper -->
      <div
        v-if="themeMode === 'cyber'"
        class="cyber-select-trigger-wrapper w-full"
        :class="{ focused: open, 'is-disabled': disabled }"
      >
        <div class="cyber-brackets top-left-bracket">[</div>
        <div class="cyber-brackets bottom-right-bracket">]</div>
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
            class="w-full bg-transparent outline-none border-none pl-4 pr-10 py-2.5 text-base font-mono text-white"
            @input="(e: any) => handleSearchInput(e.target.value)"
          >
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <button
              v-if="open && searchValue"
              type="button"
              class="text-gray-400 hover:text-white outline-none focus:outline-none transition-colors"
              @click.stop="searchValue = ''"
            >
              ✕
            </button>
            <span
              v-else
              class="text-xs transition-transform duration-200"
              :class="{ 'rotate-180': open, 'text-[#00f0ff]': open, 'text-gray-400': !open }"
            >
              ▼
            </span>
          </div>
        </div>

        <!-- Static Trigger -->
        <div
          v-else
          class="w-full outline-none px-4 py-2.5 text-base flex items-center gap-2 font-mono text-white"
        >
          <span
            class="flex-1 truncate"
            :class="selectedData ? 'text-white' : 'text-gray-400'"
          >{{ selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? placeholder }}</span>
          <span
            class="text-xs transition-transform duration-200"
            :class="{ 'rotate-180': open, 'text-[#00f0ff]': open, 'text-gray-400': !open }"
          >▼</span>
        </div>
        <div class="cyber-accent-line" />
      </div>

      <!-- Sci-fi Trigger Wrapper -->
      <CamelotScifiFrame
        v-else-if="themeMode === 'scifi'"
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
            :value="open ? searchValue : (selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? '')"
            type="text"
            :placeholder="placeholder"
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
            :value="open ? searchValue : (selectedData?.label ?? selectedData?.name ?? selectedData?.value ?? '')"
            type="text"
            :placeholder="placeholder"
            :disabled="disabled"
            class="w-full outline-none text-base transition-colors"
            :class="[
              themeMode === 'cupertino' 
                ? 'rounded-[10px] bg-surface-container-highest border border-outline-variant px-4 py-2 focus:border-primary' 
                : themeMode === 'material' 
                  ? 'h-[56px] rounded-t-[4px] rounded-b-none bg-surface-container-highest border-b border-t-0 border-x-0 border-outline px-4 pt-4 pb-1 focus:border-b-2 focus:border-primary'
                  : 'border border-stroke rounded-lg px-4 py-2 focus:border-primary',
              open ? 'pointer-events-auto border-primary' : 'pointer-events-none',
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
                : 'border border-stroke rounded-lg px-4 py-2',
            open ? 'border-primary' : '',
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
        class="options-container flex flex-col rounded-md overflow-hidden relative"
        :class="[
          optionsContainerClass || 'bg-surface',
          themeMode === 'cupertino' ? 'rounded-[12px] shadow-2xl backdrop-blur-md' : '',
          themeMode === 'scifi' ? 'scifi-options-panel bg-transparent border-none shadow-none!' : '',
          themeMode === 'cyber' ? 'cyber-options-panel bg-black border border-[#00f0ff] shadow-none! rounded' : ''
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

        <!-- Cyber Options View -->
        <template v-if="themeMode === 'cyber'">
          <div class="options-list-inner max-h-[200px] overflow-y-auto px-1 py-1 font-mono">
            <template v-if="filteredOptions && filteredOptions.length > 0">
              <button
                v-for="(option, index) in filteredOptions"
                :key="index"
                type="button"
                class="option-btn cyber-option"
                :class="{ selected: model === option.value }"
                @click="(e) => onItemClick(e, option.value)"
              >
                <slot
                  name="option"
                  :index="index"
                  :data="option"
                  :is-selected="model === option.value"
                >
                  <span class="flex items-center w-full justify-between">
                    <span>{{ option.label ?? option.name }}</span>
                    <span v-if="model === option.value" class="text-xs">✔</span>
                  </span>
                </slot>
              </button>
            </template>
            <template v-else>
              <div class="text-center py-4 text-xs text-[#00f0ff] opacity-60">沒有可選選項</div>
            </template>
          </div>
        </template>

        <!-- Sci-fi Options View -->
        <template v-else-if="themeMode === 'scifi'">
          <CamelotScifiFrame variant="2-corner" :show-grid="false" :show-borders="true">
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
                <div class="text-center py-4 text-xs text-primary opacity-60">沒有可選選項</div>
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
                    class="option-btn"
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
                    class="option-btn"
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
                    <span>沒有可選選項</span>
                  </div>
                </slot>
              </template>
            </div>
          </CamelotContainer>
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

const { list: virtualList, containerProps: virtualContainerProps, wrapperProps: virtualWrapperProps, scrollTo } = useVirtualList(
  filteredOptions,
  {
    itemHeight: () => props.itemHeight,
    overscan: props.overscan,
  },
)

const { themeMode } = useCamelotTheme()

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
.options-container :deep(.scroll-container) {
  height: 100%;
}

.option {
  display: flex;
  align-items: center;
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
/* Cyber styles */
.cyber-select-trigger-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  --cml-cyber-neon: var(--cml-color-current-color, var(--color-primary, #00f0ff));
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid color-mix(in srgb, var(--cml-cyber-neon) 25%, transparent);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.cyber-select-trigger-wrapper.focused {
  border-color: var(--cml-cyber-neon);
  box-shadow: 0 0 10px color-mix(in srgb, var(--cml-cyber-neon) 30%, transparent);
  background-color: rgba(0, 0, 0, 0.85);
}

.cyber-select-trigger-wrapper .cyber-brackets {
  position: absolute;
  color: var(--cml-cyber-neon);
  font-family: monospace;
  font-size: 1.5rem;
  font-weight: 800;
  pointer-events: none;
  transition: all 0.3s ease;
  line-height: 1;
  opacity: 0.5;
}

.cyber-select-trigger-wrapper .top-left-bracket {
  top: -4px;
  left: -6px;
}

.cyber-select-trigger-wrapper .bottom-right-bracket {
  bottom: -4px;
  right: -6px;
}

.cyber-select-trigger-wrapper.focused .top-left-bracket {
  transform: translate(-2px, -2px);
  opacity: 1;
}

.cyber-select-trigger-wrapper.focused .bottom-right-bracket {
  transform: translate(2px, 2px);
  opacity: 1;
}

.cyber-select-trigger-wrapper .cyber-accent-line {
  position: absolute;
  bottom: -1px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--cml-cyber-neon);
  box-shadow: 0 0 8px var(--cml-cyber-neon);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 15;
}

.cyber-select-trigger-wrapper.focused .cyber-accent-line {
  left: 0;
  width: 100%;
}

.cyber-option {
  padding: 10px 14px;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--cml-cyber-neon, #00f0ff) 70%, white);
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  background: transparent;
}
.cyber-option:hover {
  background: var(--cml-cyber-neon, #00f0ff);
  border-left-color: var(--cml-cyber-on-neon, #000);
  color: var(--cml-cyber-on-neon, #000);
}
.cyber-option.selected {
  background: color-mix(in srgb, var(--cml-cyber-neon, #00f0ff) 40%, transparent);
  border-left-color: var(--cml-cyber-neon, #00f0ff);
  color: #fff;
}

.options-list-inner {
  display: flex;
  flex-direction: column;
}
</style>
