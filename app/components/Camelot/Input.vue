<template>
  <!-- Sci-fi Input Layout -->
  <label
    v-if="themeMode === 'scifi'"
    class="flex w-full min-w-10 flex-col gap-1.5 text-base"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-60': disabled }]"
  >
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-1 transition-all duration-200"
        :class="isFocused
          ? 'text-[var(--cml-color-current-color)] opacity-100 [text-shadow:0_0_8px_color-mix(in_srgb,var(--cml-color-current-color),transparent_50%)]'
          : 'opacity-80'"
      />
    </slot>

    <div
      ref="target"
      class="relative w-full flex-1"
    >
      <CamelotScifiInput
        ref="themeInput"
        v-model="model"
        :placeholder="placeholder"
        :type="effectiveType"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'pointer-events-none select-none': mode === 'only-select' }"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      >
        <template #before>
          <slot name="before">
            <span
              v-if="mark === 'money'"
              class="text-app-secondary-gray mr-1.5"
            >$</span>
          </slot>
        </template>
        <template #after>
          <slot name="after" />
          <CamelotInternalPasswordToggle
            v-if="showPasswordToggle"
            v-model:revealed="isPasswordRevealed"
            :disabled="disabled"
          />
        </template>
      </CamelotScifiInput>

      <!-- Select Options Dropdown -->
      <template v-if="isSelectMode">
        <div
          class="absolute left-0 z-10 w-fit min-w-full"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            class="grid overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0">
              <div
                class="border-app-border flex max-h-[250px] flex-col items-start justify-start overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border bg-white"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="border-app-divider text-app-text flex h-12 min-w-full cursor-pointer items-center justify-start border-b bg-white px-4 py-4 hover:bg-primary/5"
                      :class="{
                        '!bg-primary/10 !text-primary': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-base font-normal text-nowrap">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="text-app-secondary-gray flex w-full flex-col items-center justify-center gap-1 py-2 select-none"
                    >
                      <IMaterialSymbolsErrorCircleRounded class="text-2xl" />
                      無選項
                    </div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </label>

  <!-- Cupertino Input Layout -->
  <label
    v-else-if="themeMode === 'cupertino'"
    class="flex w-full min-w-10 flex-col gap-1.5 text-base"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-40': disabled }]"
  >
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-0.5"
      />
    </slot>

    <div
      ref="target"
      class="relative w-full flex-1"
    >
      <CamelotCupertinoInput
        ref="themeInput"
        v-model="model"
        :placeholder="placeholder"
        :type="effectiveType"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'pointer-events-none select-none': mode === 'only-select' }"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      >
        <template #before>
          <slot name="before">
            <span
              v-if="mark === 'money'"
              class="text-app-secondary-gray mr-1.5"
            >$</span>
          </slot>
        </template>
        <template #after>
          <slot name="after" />
          <CamelotInternalPasswordToggle
            v-if="showPasswordToggle"
            v-model:revealed="isPasswordRevealed"
            :disabled="disabled"
          />
        </template>
      </CamelotCupertinoInput>

      <!-- Select Options Dropdown -->
      <template v-if="isSelectMode">
        <div
          class="absolute left-0 z-10 w-fit min-w-full"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            class="grid overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0">
              <div
                class="border-app-border flex max-h-[250px] flex-col items-start justify-start overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border bg-white"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="border-app-divider text-app-text flex h-12 min-w-full cursor-pointer items-center justify-start border-b bg-white px-4 py-4 hover:bg-primary/5"
                      :class="{
                        '!bg-primary/10 !text-primary': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-base font-normal text-nowrap">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="text-app-secondary-gray flex w-full flex-col items-center justify-center gap-1 py-2 select-none"
                    >
                      <IMaterialSymbolsErrorCircleRounded class="text-2xl" />
                      無選項
                    </div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </label>

  <!-- Aqua Pill Input Layout -->
  <label
    v-else-if="themeMode === 'aqua'"
    class="flex w-full min-w-10 flex-col gap-1.5 text-base"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-40': disabled }]"
  >
    <slot
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-3"
      />
    </slot>

    <div
      ref="target"
      class="relative w-full flex-1"
    >
      <CamelotAquaInput
        ref="themeInput"
        v-model="model"
        :placeholder="placeholder"
        :type="effectiveType"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'pointer-events-none select-none': mode === 'only-select' }"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      >
        <template #before>
          <slot name="before">
            <span
              v-if="mark === 'money'"
              class="text-app-secondary-gray mr-1.5"
            >$</span>
          </slot>
        </template>
        <template #after>
          <slot name="after" />
          <CamelotInternalPasswordToggle
            v-if="showPasswordToggle"
            v-model:revealed="isPasswordRevealed"
            :disabled="disabled"
          />
        </template>
      </CamelotAquaInput>

      <!-- Select Options Dropdown -->
      <template v-if="isSelectMode">
        <div
          class="absolute left-0 z-10 w-fit min-w-full"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            class="grid overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0">
              <div
                class="border-app-border flex max-h-[250px] flex-col items-start justify-start overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border bg-white"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="border-app-divider text-app-text flex h-12 min-w-full cursor-pointer items-center justify-start border-b bg-white px-4 py-4 hover:bg-primary/5"
                      :class="{
                        '!bg-primary/10 !text-primary': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-base font-normal text-nowrap">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="text-app-secondary-gray flex w-full flex-col items-center justify-center gap-1 py-2 select-none"
                    >
                      <IMaterialSymbolsErrorCircleRounded class="text-2xl" />
                      無選項
                    </div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </label>

  <!-- Material Input Layout (Default) -->
  <label
    v-else
    class="relative flex w-full min-w-10 flex-col gap-1.5 text-base"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-50': disabled }]"
  >
    <slot
      v-if="labelMode === 'outside'"
      name="label"
      :label="label"
    >
      <CamelotFieldLabel
        :label="label"
        :required="required"
        class="pl-1"
      />
    </slot>

    <div
      ref="target"
      class="relative w-full flex-1"
    >
      <CamelotMaterialInput
        ref="themeInput"
        v-model="model"
        :label="labelMode === 'floating' ? label : ''"
        :required="required"
        :placeholder="placeholder"
        :type="effectiveType"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'pointer-events-none select-none': mode === 'only-select' }"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      >
        <template #before>
          <slot name="before">
            <span
              v-if="mark === 'money'"
              class="text-app-secondary-gray mr-1.5"
            >$</span>
          </slot>
        </template>
        <template #after>
          <slot name="after" />
          <CamelotInternalPasswordToggle
            v-if="showPasswordToggle"
            v-model:revealed="isPasswordRevealed"
            :disabled="disabled"
          />
        </template>
      </CamelotMaterialInput>

      <!-- Select Options Dropdown -->
      <template v-if="isSelectMode">
        <div
          class="absolute left-0 z-10 w-fit min-w-full"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            class="grid overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="min-h-0">
              <div
                class="border-app-border flex max-h-[250px] flex-col items-start justify-start overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border bg-white"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="border-app-divider text-app-text flex h-12 min-w-full cursor-pointer items-center justify-start border-b bg-white px-4 py-4 hover:bg-primary/5"
                      :class="{
                        '!bg-primary/10 !text-primary': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-base font-normal text-nowrap">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="text-app-secondary-gray flex w-full flex-col items-center justify-center gap-1 py-2 select-none"
                    >
                      <IMaterialSymbolsErrorCircleRounded class="text-2xl" />
                      無選項
                    </div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </label>
</template>

<script setup lang="ts" generic="T">
import IMaterialSymbolsErrorCircleRounded from '~icons/material-symbols/error-circle-rounded'
import { isClient } from '@vueuse/core'

const props = withDefaults(defineProps<{
  border?: boolean
  size?: 'small' | 'basic'
  mark?: 'money'
  disabled?: boolean
  label?: string
  required?: boolean
  placeholder?: string
  /** 原生 input type，預設 text */
  type?: CamelotInputType
  /** type=password 時是否內建顯示/隱藏切換鈕（預設開） */
  passwordToggle?: boolean
  /**
   * 密碼顯示後的維持策略（預設 hide-on-change）：
   * - hide-on-change：只要數值有異動就自動切回隱碼
   * - persistent：切到顯示後一直保持，直到再次點擊
   */
  passwordRevealMode?: 'persistent' | 'hide-on-change'
  /**
   * label 呈現方式（僅 Material 主題有差異，其他主題一律在框外）：
   * - outside：label 在輸入框上方，框高 42px 起跳，與其他表單控制項並排對齊
   * - floating：Material 浮動 label 收在框內，框高 56px 起跳
   */
  labelMode?: 'outside' | 'floating'
  mode?: 'default' | 'select' | 'only-select'
  options?: SelectOptions<T>
  showOptionOnFocus?: boolean
  hideOptionOnBlur?: boolean
  selectedValue?: string | number
  color?: CamelotColorRole
}>(), {
  border: true,
  size: 'basic',
  type: 'text',
  passwordToggle: true,
  passwordRevealMode: 'hide-on-change',
  labelMode: 'outside',
  mode: 'default',
  showOptionOnFocus: true,
  hideOptionOnBlur: false,
  color: 'primary',
})

const model = defineModel<string | number>()

const emit = defineEmits<{
  input: [value?: string | number]
  optionSelected: [option: SelectOption<T>]
}>()

const target = useTemplateRef('target')
onClickOutside(target, () => isOpen.value = false)

const isBottom = computed(() => {
  if (isClient) {
    return bottom.value + 250 > window.innerHeight
  }
  return false
})

// bottom 只供 isBottom 判斷下拉方向，未展開時算出來無人讀取；
// 故關掉常駐的 window 監聽，改由下方在展開期間才掛載（見 trackedWindowWhileOpen）。
const {
  bottom, update: updateBounding,
} = useElementBounding(target, {
  windowScroll: false,
  windowResize: false,
})

/**
 * 四個主題子元件各自持有原生 input 並 expose 出來；同一時間只渲染其中一個，
 * 故共用同一個 ref 名稱，再由此轉接成 CamelotInput 對外的 inputEl。
 */
const themeInput = useTemplateRef<{ inputEl: HTMLInputElement | null }>('themeInput')

const inputEl = computed(() => themeInput.value?.inputEl ?? null)

const placeholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder
  }
  if (props.label) {
    return `請輸入${props.label}`
  }
  return ''
})

const isSelectMode = computed(() => {
  return props.mode === 'select' || props.mode === 'only-select'
})

const isOpen = defineModel<boolean>('isOpen', { default: false })

// 目標為 null 時 useEventListener 不會掛載任何監聽，展開／收合即自動掛上與解除
const trackedWindowWhileOpen = computed(() => (isClient && isOpen.value ? window : null))

useEventListener(trackedWindowWhileOpen, 'scroll', updateBounding, {
  passive: true,
  capture: true,
})
useEventListener(trackedWindowWhileOpen, 'resize', updateBounding, { passive: true })

watch(isOpen, (opened) => {
  // 展開當下先量一次，方向判斷才不會沿用上次收合前的位置
  if (opened) updateBounding()
})

const toggle = () => {
  if (props.disabled) {
    isOpen.value = false
    return
  }

  if (props.mode === 'only-select') {
    isOpen.value = !isOpen.value
  }
}

// Styles state
const { themeMode } = useCamelotTheme()
const isFocused = ref(false)

const roleColorClass = useCamelotRoleColorClass(() => props.color)

// 密碼顯示狀態只在元件內部維持；effectiveType 才是實際下傳給原生 input 的 type
const isPasswordRevealed = ref(false)
const showPasswordToggle = computed(() => props.type === 'password' && props.passwordToggle)
const effectiveType = computed<CamelotInputType>(() =>
  props.type === 'password' && isPasswordRevealed.value ? 'text' : props.type,
)

// hide-on-change：數值一有異動就切回隱碼（用 watch 而非 onInput，因 onInput 有 debounce）
watch(model, () => {
  if (props.passwordRevealMode === 'hide-on-change' && isPasswordRevealed.value) {
    isPasswordRevealed.value = false
  }
})

// 切換 type 會讓瀏覽器把游標重設到最前面；切換後把游標放回原位（原本無選取時即字尾）。
// 只在 input 本來就有焦點時處理，避免點眼睛把焦點硬拉進輸入框。
watch(isPasswordRevealed, () => {
  const el = inputEl.value
  if (!el || document.activeElement !== el) {
    return
  }
  const len = String(el.value ?? '').length
  const start = el.selectionStart ?? len
  const end = el.selectionEnd ?? len
  // 真實滑鼠點擊時，Chromium 會在同一個 task 結尾才重設游標，nextTick（microtask）太早；
  // 因此排到下一個 macrotask 再還原。
  nextTick(() => {
    setTimeout(() => el.setSelectionRange(start, end), 0)
  })
})

const onFocus = () => {
  isFocused.value = true
  if (isSelectMode.value && props.showOptionOnFocus) {
    isOpen.value = true
  }
}

const onBlur = () => {
  isFocused.value = false
  if (isSelectMode.value && props.hideOptionOnBlur) {
    isOpen.value = false
  }
}

const onInput = useDebounceFn(() => {
  emit('input', model.value)
}, 300)

const onOptionSelected = (option: SelectOption<T>) => {
  model.value = option.label
  isOpen.value = false
  emit('optionSelected', option)
}

defineExpose({
  inputEl,
})
</script>
