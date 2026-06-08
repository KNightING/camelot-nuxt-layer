<template>
  <div
    ref="root"
    class="relative"
  >
    <input
      :value="pad(model)"
      type="text"
      inputmode="numeric"
      class="w-10 bg-transparent text-center outline-none font-medium tabular-nums text-[var(--cml-color-current-color)]"
      @focus="open = true"
      @input="onInput"
      @keydown.enter="open = false"
      @keydown.up.prevent="step(1)"
      @keydown.down.prevent="step(-1)"
    >
    <!-- 可選的下拉清單 -->
    <div
      v-if="open"
      class="absolute left-1/2 top-full z-50 mt-1 max-h-40 w-12 -translate-x-1/2 overflow-y-auto rounded-lg border border-outline-variant bg-surface shadow-lg"
    >
      <button
        v-for="v in options"
        :key="v"
        type="button"
        class="block w-full px-2 py-1 text-center text-sm tabular-nums transition-colors hover:bg-surface-container"
        :class="v === model ? 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_14%,transparent)] font-semibold text-[var(--cml-color-current-color)]' : 'text-on-surface'"
        @mousedown.prevent="select(v)"
      >
        {{ pad(v) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    min: number
    max: number
  }>(),
  {},
)

const model = defineModel<number>({ default: 0 })

const root = useTemplateRef<HTMLElement>('root')
const open = ref(false)

onClickOutside(root, () => {
  open.value = false
})

const pad = (v: number) => String(v).padStart(2, '0')

const clamp = (v: number) => Math.min(Math.max(v, props.min), props.max)

const options = computed(() => {
  const out: number[] = []
  for (let i = props.min; i <= props.max; i++) out.push(i)
  return out
})

const onInput = (e: Event) => {
  const n = Number((e.target as HTMLInputElement).value.replace(/\D/g, ''))
  if (!Number.isNaN(n)) model.value = clamp(n)
}
const select = (v: number) => {
  model.value = v
  open.value = false
}
const step = (d: number) => {
  let v = model.value + d
  if (v > props.max) v = props.min
  if (v < props.min) v = props.max
  model.value = v
}
</script>
