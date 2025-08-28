<template>
  <form
    ref="formEl"
    @keydown.shift.tab.exact="onShiftTab"
    @keydown.enter.exact="onEnterDown"
    @keypress.enter.exact="onEnter"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
}>()

const emit = defineEmits<{
  submit: []
}>()

const formEl = ref<HTMLElement | null>(null)

const attributeKey = 'data-idx'

watch(formEl, (nV) => {
  if (nV) {
    const inputs = nV.querySelectorAll('input, select')
    inputs.forEach((item, index) => {
      item.setAttribute(attributeKey, index.toString())
    })
  }
})

let nowIndex = -1

// 中文輸入有衝突，故拆成down and press
const onEnterDown = (event: KeyboardEvent) => {
  const target = event.target
  if (target instanceof HTMLElement) {
    nowIndex = Number.parseInt(target.getAttribute(attributeKey) ?? '')
  }
}

const onEnter = (event: KeyboardEvent) => {
  const target = event.target
  if (target instanceof HTMLElement && formEl.value) {
    // nowIndex = Number.parseInt(target.getAttribute("data-index"));
    const nextEl = formEl.value.querySelector(`[${attributeKey}='${nowIndex + 1}']`)

    if (!nextEl) {
      emit('submit')
      return
    }

    if (nextEl instanceof HTMLElement) {
      nextEl.focus()
      event.preventDefault()
    }
  }
}

const onShiftTab = (event: KeyboardEvent) => {
  const target = event.target
  if (target instanceof HTMLElement && formEl.value) {
    const nowIndex = Number.parseInt(target.getAttribute(attributeKey) ?? '')
    const prevEl = formEl.value.querySelector(`[${attributeKey}='${nowIndex - 1}']`)
    if (prevEl instanceof HTMLElement) {
      prevEl.focus()
      event.preventDefault()
    }
  }
}
</script>

<style scoped></style>
