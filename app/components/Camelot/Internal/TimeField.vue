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
      @focus="openList"
      @input="onInput"
      @keydown.enter="open = false"
      @keydown.up.prevent="step(1)"
      @keydown.down.prevent="step(-1)"
    >
    <!-- 下拉清單以 Teleport 脫離 Popup 的 overflow-hidden 容器，避免超出彈窗時被裁切；
         依 trigger 上下可用空間決定向上或向下展開 -->
    <Teleport to="body">
      <div
        v-if="open"
        ref="listRef"
        class="fixed z-[1000] max-h-40 w-12 -translate-x-1/2 overflow-y-auto rounded-lg border border-outline-variant bg-surface shadow-lg"
        :style="listStyle"
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
    </Teleport>
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
const listRef = useTemplateRef<HTMLElement>('listRef')
const open = ref(false)
const listStyle = ref<Record<string, string>>({})

// max-h-40 = 160px + 間距
const LIST_MAX_HEIGHT = 168

const openList = () => {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const style: Record<string, string> = {
    left: `${rect.left + rect.width / 2}px`,
  }
  if (rect.top >= LIST_MAX_HEIGHT) {
    style.bottom = `${window.innerHeight - rect.top + 4}px`
  }
  else {
    style.top = `${rect.bottom + 4}px`
  }
  // Teleport 至 body 後脫離 color role 注入範圍，將當前色帶入
  const currentColor = getComputedStyle(el).getPropertyValue('--cml-color-current-color')
  if (currentColor) {
    style['--cml-color-current-color'] = currentColor
  }
  listStyle.value = style
  open.value = true
}

onClickOutside(root, () => {
  open.value = false
}, { ignore: [listRef] })

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
