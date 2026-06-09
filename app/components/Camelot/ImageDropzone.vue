<template>
  <div
    class="cml-dropzone flex w-full flex-col gap-2"
    :data-cml-theme="themeMode"
    :class="roleColorClass"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple || layout === 'grid'"
      class="hidden"
      @change="onInput"
    >

    <!-- grid 多格：縮圖佔格，新增格在右側，達 max 隱藏 -->
    <div
      v-if="layout === 'grid'"
      class="grid gap-2"
      :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
    >
      <div
        v-for="(p, i) in previews"
        :key="p.url"
        class="cml-dropzone-thumb group relative aspect-square overflow-hidden border border-border"
      >
        <slot
          name="thumb"
          :url="p.url"
          :filename="p.name"
          :index="i"
          :remove="() => removeAt(i)"
        >
          <img
            :src="p.url"
            :alt="p.name"
            class="h-full w-full object-cover"
          >
          <button
            type="button"
            class="absolute right-1 top-1 hidden rounded-full bg-[var(--cml-color-current-color)] p-0.5 text-[var(--cml-color-current-on-color)] group-hover:block"
            :aria-label="`移除 ${p.name}`"
            @click.stop="removeAt(i)"
          >
            <IMaterialSymbolsCloseRounded class="h-3.5 w-3.5" />
          </button>
        </slot>
      </div>

      <div
        v-if="!atMax"
        class="cml-dropzone-area flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border border-dashed px-2 text-center text-xs transition"
        :class="areaStateClass"
        @click="pick"
      >
        <slot
          :drag-over="dragOver"
          :count="count"
          :max="maxCount"
          :at-max="atMax"
          :open="pick"
        >
          <slot name="icon">
            <IMaterialSymbolsAddPhotoAlternate class="h-6 w-6 opacity-70" />
          </slot>
          <span class="leading-tight">{{ gridHint }}</span>
        </slot>
      </div>
    </div>

    <!-- stacked（預設）：大區塊 + 下方預覽列 -->
    <template v-else>
      <div
        class="cml-dropzone-area flex cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed px-3 py-4 text-center text-sm transition"
        :style="{ minHeight: height }"
        :class="areaStateClass"
        @click="pick"
      >
        <slot
          :drag-over="dragOver"
          :count="count"
          :max="maxCount"
          :at-max="atMax"
          :open="pick"
        >
          <slot name="icon">
            <IMaterialSymbolsAddPhotoAlternate class="h-7 w-7 opacity-70" />
          </slot>
          <span class="leading-tight">{{ hint }}</span>
        </slot>
      </div>

      <div
        v-if="preview && previews.length"
        class="grid grid-cols-4 gap-2 sm:grid-cols-6"
      >
        <div
          v-for="(p, i) in previews"
          :key="p.url"
          class="cml-dropzone-thumb group relative aspect-square overflow-hidden border border-border"
        >
          <slot
            name="thumb"
            :url="p.url"
            :filename="p.name"
            :index="i"
            :remove="() => removeAt(i)"
          >
            <img
              :src="p.url"
              :alt="p.name"
              class="h-full w-full object-cover"
            >
            <button
              type="button"
              class="absolute right-1 top-1 hidden rounded-full bg-[var(--cml-color-current-color)] p-0.5 text-[var(--cml-color-current-on-color)] group-hover:block"
              :aria-label="`移除 ${p.name}`"
              @click.stop="removeAt(i)"
            >
              <IMaterialSymbolsCloseRounded class="h-3.5 w-3.5" />
            </button>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: CamelotColorRole
  /** 接受的檔案型別（同 input accept）；預設只收圖片 */
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** 版面：stacked＝大區塊+下方預覽（預設）；grid＝多格、新增格在縮圖右側 */
  layout?: 'stacked' | 'grid'
  /** 最多張數（0＝不限）；grid 達上限會隱藏新增格 */
  max?: number
  /** grid 欄數 */
  columns?: number
  /** stacked 區塊最小高度 */
  height?: string
  hint?: string
  /** grid 新增格提示文字 */
  gridHint?: string
  /** stacked 是否在下方顯示縮圖 */
  preview?: boolean
}>(), {
  color: 'primary',
  accept: 'image/*',
  multiple: false,
  disabled: false,
  layout: 'stacked',
  max: 0,
  columns: 4,
  height: '7rem',
  hint: '點此選擇圖片，或拖曳到此區域',
  gridHint: '新增',
  preview: true,
})

const emit = defineEmits<{
  select: [files: File[]]
}>()

const model = defineModel<File[] | null>({ default: null })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const dragOver = ref(false)
const dragDepth = ref(0)
const previews = ref<{ url: string, name: string }[]>([])

const maxCount = computed(() => (props.max && props.max > 0 ? props.max : Number.POSITIVE_INFINITY))
const count = computed(() => (model.value ?? []).length)
const atMax = computed(() => count.value >= maxCount.value)
const showPreview = computed(() => props.preview || props.layout === 'grid')

const areaStateClass = computed(() => [
  dragOver.value
    ? 'border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] text-[var(--cml-color-current-color)]'
    : 'border-border text-on-surface-variant hover:border-[var(--cml-color-current-color)] hover:bg-surface-container',
  { 'pointer-events-none opacity-50': props.disabled },
])

// previews 由 model 衍生（單一真相來源）；外部改 v-model 也會同步
watch(model, (files) => {
  for (const p of previews.value) URL.revokeObjectURL(p.url)
  previews.value = showPreview.value
    ? (files ?? []).map(f => ({
        url: URL.createObjectURL(f),
        name: f.name,
      }))
    : []
}, { immediate: true })

const accepts = (f: File) => {
  const tokens = props.accept.split(',').map(s => s.trim()).filter(Boolean)
  if (tokens.length === 0) return true
  return tokens.some((tok) => {
    if (tok === '*' || tok === '*/*') return true
    if (tok.endsWith('/*')) return f.type.startsWith(tok.slice(0, -1))
    if (tok.startsWith('.')) return f.name.toLowerCase().endsWith(tok.toLowerCase())
    return f.type === tok
  })
}

const setFiles = (list: File[]) => {
  if (props.disabled) return
  const valid = list.filter(accepts)
  if (valid.length === 0) return
  const accumulate = props.layout === 'grid' || props.multiple
  let next = accumulate ? [...(model.value ?? []), ...valid] : valid.slice(0, 1)
  if (Number.isFinite(maxCount.value)) next = next.slice(0, maxCount.value)
  model.value = next
  emit('select', next)
}

const removeAt = (i: number) => {
  const files = (model.value ?? []).filter((_, idx) => idx !== i)
  model.value = files
  emit('select', files)
}

const pick = () => {
  if (!props.disabled && !atMax.value) fileInput.value?.click()
}

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  target.value = '' // 允許重複選同一檔
  setFiles(files)
}

const onDragOver = () => {
  if (props.disabled) return
  dragDepth.value++
  dragOver.value = true
}
const onDragLeave = () => {
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  if (dragDepth.value === 0) dragOver.value = false
}
const onDrop = (e: DragEvent) => {
  dragDepth.value = 0
  dragOver.value = false
  if (props.disabled) return
  setFiles(Array.from(e.dataTransfer?.files ?? []))
}

onBeforeUnmount(() => {
  for (const p of previews.value) URL.revokeObjectURL(p.url)
})
</script>

<style scoped>
/* 形狀依主題識別 */
.cml-dropzone-area { border-radius: 0.5rem; }
.cml-dropzone[data-cml-theme="aqua"] .cml-dropzone-area { border-radius: 1rem; }
.cml-dropzone[data-cml-theme="scifi"] .cml-dropzone-area { border-radius: 0; }
.cml-dropzone[data-cml-theme="cupertino"] .cml-dropzone-area { border-radius: 0.75rem; }

.cml-dropzone-thumb { border-radius: 0.375rem; }
.cml-dropzone[data-cml-theme="scifi"] .cml-dropzone-thumb { border-radius: 0; }
.cml-dropzone[data-cml-theme="aqua"] .cml-dropzone-thumb { border-radius: 0.5rem; }
</style>
