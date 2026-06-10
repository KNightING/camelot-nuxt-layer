<template>
  <!-- Sci-fi Input Layout -->
  <label
    v-if="themeMode === 'scifi'"
    class="flex w-full min-w-10 flex-col gap-1.5"
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
        v-model="model"
        :placeholder="placeholder"
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
                      <i-material-symbols-error-circle-rounded class="text-2xl" />
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
    class="flex w-full min-w-10 flex-col gap-1.5"
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
        v-model="model"
        :placeholder="placeholder"
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
                      <i-material-symbols-error-circle-rounded class="text-2xl" />
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
    class="flex w-full min-w-10 flex-col gap-1.5"
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
        v-model="model"
        :placeholder="placeholder"
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
                      <i-material-symbols-error-circle-rounded class="text-2xl" />
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
    class="relative flex w-full min-w-10 flex-col"
    :class="[roleColorClass, { 'cursor-not-allowed opacity-50': disabled }]"
  >
    <div
      ref="target"
      class="relative w-full flex-1"
    >
      <CamelotMaterialInput
        v-model="model"
        :label="label"
        :required="required"
        :placeholder="placeholder"
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
                      <i-material-symbols-error-circle-rounded class="text-2xl" />
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
import { isClient } from '@vueuse/core'

const props = withDefaults(defineProps<{
  border?: boolean
  size?: 'small' | 'basic'
  mark?: 'money'
  disabled?: boolean
  label?: string
  required?: boolean
  placeholder?: string
  mode?: 'default' | 'select' | 'only-select'
  options?: SelectOptions<T>
  showOptionOnFocus?: boolean
  hideOptionOnBlur?: boolean
  selectedValue?: string | number
  color?: CamelotColorRole
}>(), {
  border: true,
  size: 'basic',
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

const { bottom } = useElementBounding(target)

const inputEl = useTemplateRef('input')

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
