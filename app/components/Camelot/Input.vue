<template>
  <label class="flex items-center w-full min-w-10">
    <slot name="label">
      <template v-if="label">
        <span class="textarea-md text-app-secondary-gray w-[14ch]">{{ label }}<span v-if="required"
            class="text-app-error ml-0.5">*</span></span>
      </template>
    </slot>
    <div ref="target" class="relative flex-1">
      <div
        class="w-full flex bg-white text-app-text font-normal justify-start items-center outline-none caret-primary accent-app-primary"
        :class="{
          'border border-app-border rounded-lg focus-within:border-app-primary-hover hover:border-app-primary-hover': border,
          'border-none': !border,
          'h-11 px-4 text-base': size === 'basic',
          'h-9 px-2 text-sm': size === 'small',
          '!bg-app-disabled-bg !border-app-disabled-border !text-app-disabled-text': disabled,
        }" @click="toggle">
        <slot name="before">
          <template v-if="mark === 'money'">
            <span class="text-app-secondary-gray mr-1.5">$</span>
          </template>
        </slot>
        <input ref="input" v-model="model" class="flex-1 outline-none border-none min-w-0 w-full" :class="{
          'select-none pointer-events-none': mode === 'only-select',
        }" :disabled="disabled || mode === 'only-select'" :placeholder="placeholder" @focus="onFocus" @blur="onBlur"
          @input="onInput">
        <slot name="after" />
      </div>
      <template v-if="isSelectMode">
        <div class="absolute left-0 min-w-full w-fit z-10" :class="{
          'bottom-[110%]': isBottom,
          'top-[110%]': !isBottom,
        }">
          <div :class="{
            close: !isOpen,
          }" class="expanded-container">
            <div class="min-h-0">
              <div
                class="flex overflow-x-hidden overscroll-contain overflow-y-auto max-h-[250px] bg-white rounded-lg border border-app-border flex-col justify-start items-start">
                <template v-if="options && options.length > 0">
                  <slot name="options" :options="options">
                    <button v-for="(option) in options" :key="option.value"
                      class="cursor-pointer flex justify-start px-4 items-center py-4 min-w-full border-b border-app-divider h-12 text-app-text bg-white hover:bg-primary/5"
                      :class="{
                        '!text-primary !bg-primary/10': option.value === selectedValue,
                      }" @click="() => onOptionSelected(option)">
                      <slot name="option" :option="option">
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
                      class="flex flex-col w-full justify-center items-center py-2 gap-1 text-app-secondary-gray select-none">
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
}>(), {
  border: true,
  size: 'basic',
  mode: 'default',
  showOptionOnFocus: true,
  hideOptionOnBlur: false,
})

const model = defineModel<string | number>()

const emit = defineEmits<{
  input: [value?: string | number]
  optionSelected: [option: SelectOption<T>]
}>()

const target = useTemplateRef('target')
onClickOutside(target, event => isOpen.value = false)

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

const onFocus = () => {
  if (isSelectMode.value && props.showOptionOnFocus) {
    isOpen.value = true
  }
}

const onBlur = () => {
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
</style>
