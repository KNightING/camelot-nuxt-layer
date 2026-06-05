<template>
  <div
    class="switch-cupertino"
    :class="{ checked: modelValue, disabled }"
    @click="toggle"
  >
    <div class="thumb" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emit = defineEmits<{
  change: [checked: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

const toggle = () => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('change', modelValue.value)
}
</script>

<style scoped>
.switch-cupertino {
  position: relative;
  width: 51px;
  height: 31px;
  background-color: rgba(120, 120, 128, 0.16);
  border-radius: 15.5px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-block;
  vertical-align: middle;
}
.switch-cupertino.checked {
  background-color: var(--cml-color-current-color);
}
.switch-cupertino .thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 27px;
  height: 27px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15), 0 3px 1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.switch-cupertino.checked .thumb {
  transform: translateX(20px);
}
.switch-cupertino.disabled {
  cursor: not-allowed;
  opacity: 0.3;
  filter: grayscale(1);
}
</style>
