<template>
  <!-- Sci-fi Input Layout -->
  <label
    v-if="themeMode === 'scifi'"
    class="flex flex-col w-full min-w-10 gap-1.5"
    :class="{ 'opacity-60 cursor-not-allowed': disabled }"
    :style="inputStyle"
  >
    <slot name="label">
      <span
        v-if="label"
        class="label-text"
        :class="{ 'focused': isFocused }"
      >
        {{ label }}<span
          v-if="required"
          class="text-app-error ml-0.5"
        >*</span>
      </span>
    </slot>
    
    <div
      ref="target"
      class="relative flex-1 w-full"
    >
      <CamelotScifiInput
        v-model="model"
        :placeholder="placeholder"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'select-none pointer-events-none': mode === 'only-select' }"
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
          class="absolute left-0 min-w-full w-fit z-10"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            :class="{
              close: !isOpen,
            }"
            class="expanded-container"
          >
            <div class="min-h-0">
              <div
                class="flex overflow-x-hidden overscroll-contain overflow-y-auto max-h-[250px] bg-white rounded-lg border border-app-border flex-col justify-start items-start"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="cursor-pointer flex justify-start px-4 items-center py-4 min-w-full border-b border-app-divider h-12 text-app-text bg-white hover:bg-primary/5"
                      :class="{
                        '!text-primary !bg-primary/10': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-nowrap text-base font-normal">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="flex flex-col w-full justify-center items-center py-2 gap-1 text-app-secondary-gray select-none"
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
    class="flex flex-col w-full min-w-10 gap-1.5"
    :class="{ 'opacity-40 cursor-not-allowed': disabled }"
    :style="inputStyle"
  >
    <slot name="label">
      <span v-if="label" class="label-text-cupertino">
        {{ label }}<span
          v-if="required"
          class="text-app-error ml-0.5"
        >*</span>
      </span>
    </slot>
    
    <div
      ref="target"
      class="relative flex-1 w-full"
    >
      <CamelotCupertinoInput
        v-model="model"
        :placeholder="placeholder"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'select-none pointer-events-none': mode === 'only-select' }"
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
          class="absolute left-0 min-w-full w-fit z-10"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            :class="{
              close: !isOpen,
            }"
            class="expanded-container"
          >
            <div class="min-h-0">
              <div
                class="flex overflow-x-hidden overscroll-contain overflow-y-auto max-h-[250px] bg-white rounded-lg border border-app-border flex-col justify-start items-start"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="cursor-pointer flex justify-start px-4 items-center py-4 min-w-full border-b border-app-divider h-12 text-app-text bg-white hover:bg-primary/5"
                      :class="{
                        '!text-primary !bg-primary/10': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-nowrap text-base font-normal">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="flex flex-col w-full justify-center items-center py-2 gap-1 text-app-secondary-gray select-none"
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
    class="flex flex-col w-full min-w-10 relative"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    :style="inputStyle"
  >
    <div
      ref="target"
      class="relative flex-1 w-full"
    >
      <CamelotMaterialInput
        v-model="model"
        :label="label"
        :required="required"
        :placeholder="placeholder"
        :disabled="disabled || mode === 'only-select'"
        :class="{ 'select-none pointer-events-none': mode === 'only-select' }"
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
          class="absolute left-0 min-w-full w-fit z-10"
          :class="{
            'bottom-[110%]': isBottom,
            'top-[110%]': !isBottom,
          }"
        >
          <div
            :class="{
              close: !isOpen,
            }"
            class="expanded-container"
          >
            <div class="min-h-0">
              <div
                class="flex overflow-x-hidden overscroll-contain overflow-y-auto max-h-[250px] bg-white rounded-lg border border-app-border flex-col justify-start items-start"
              >
                <template v-if="options && options.length > 0">
                  <slot
                    name="options"
                    :options="options"
                  >
                    <button
                      v-for="(option) in options"
                      :key="option.value"
                      class="cursor-pointer flex justify-start px-4 items-center py-4 min-w-full border-b border-app-divider h-12 text-app-text bg-white hover:bg-primary/5"
                      :class="{
                        '!text-primary !bg-primary/10': option.value === selectedValue,
                      }"
                      @click="() => onOptionSelected(option)"
                    >
                      <slot
                        name="option"
                        :option="option"
                      >
                        <span class="text-nowrap text-base font-normal">
                          {{ option.label }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </template>
                <template v-else>
                  <slot name="empty-options">
                    <div
                      class="flex flex-col w-full justify-center items-center py-2 gap-1 text-app-secondary-gray select-none"
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
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'warning' | 'success'
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

const inputStyle = computed(() => {
  const role = props.color
  const colorToken = `var(--color-${role})`
  return {
    '--cml-color-current-color': colorToken,
  }
})

defineExpose({
  inputEl,
})
</script>

<style scoped>
.expanded-container {
  display: grid;
  overflow: hidden;
  grid-template-rows: 1fr;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 400ms;
}

.close {
  grid-template-rows: 0fr !important;
  opacity: 0 !important;
}



/* Scifi styles */
.label-text {
  font-family: inherit;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--cml-c-m3-on-surface, #1c1b1f);
  opacity: 0.8;
  padding-left: 4px;
  transition: all 0.2s ease;
}
.label-text.focused {
  opacity: 1;
  color: var(--cml-color-current-color, var(--color-primary));
  text-shadow: 0 0 8px color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)), transparent 50%);
}

/* Cupertino styles */
.label-text-cupertino {
  font-size: 0.875rem;
  color: var(--cml-c-m3-on-surface, #1c1b1f);
  padding-left: 2px;
}
</style>
