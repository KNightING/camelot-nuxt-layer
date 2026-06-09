<template>
  <div
    class="cml-dropzone flex w-full flex-col gap-2"
    :data-cml-theme="themeMode"
    :class="roleColorClass"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden"
      @change="onInput"
    >
    <div
      class="cml-dropzone-area flex cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed px-3 py-4 text-center text-sm transition"
      :style="{ minHeight: height }"
      :class="[
        dragOver
          ? 'border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] text-[var(--cml-color-current-color)]'
          : 'border-border text-on-surface-variant hover:border-[var(--cml-color-current-color)] hover:bg-surface-container',
        { 'pointer-events-none opacity-50': disabled },
      ]"
      @click="pick"
      @dragover.prevent="dragOver = true"
      @dragenter.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <slot :drag-over="dragOver">
        <slot name="icon">
          <IMaterialSymbolsAddPhotoAlternate class="h-7 w-7 opacity-70" />
        </slot>
        <span class="leading-tight">{{ hint }}</span>
      </slot>
    </div>

    <!-- 選取預覽 -->
    <div
      v-if="preview && previews.length"
      class="grid grid-cols-4 gap-2 sm:grid-cols-6"
    >
      <div
        v-for="(p, i) in previews"
        :key="p.url"
        class="cml-dropzone-thumb group relative aspect-square overflow-hidden border border-border"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: CamelotColorRole
  /** 接受的檔案型別（同 input accept）；預設只收圖片 */
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** 拖放區最小高度 */
  height?: string
  hint?: string
  /** 是否在區塊下方顯示已選取縮圖 */
  preview?: boolean
}>(), {
  color: 'primary',
  accept: 'image/*',
  multiple: false,
  disabled: false,
  height: '7rem',
  hint: '點此選擇圖片，或拖曳到此區域',
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
const previews = ref<{ url: string, name: string }[]>([])

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

const clearPreviews = () => {
  for (const p of previews.value) URL.revokeObjectURL(p.url)
  previews.value = []
}

const setFiles = (list: File[]) => {
  const valid = list.filter(accepts)
  if (valid.length === 0) return
  const files = props.multiple ? valid : valid.slice(0, 1)
  clearPreviews()
  if (props.preview) {
    previews.value = files.map(f => ({
      url: URL.createObjectURL(f),
      name: f.name,
    }))
  }
  model.value = files
  emit('select', files)
}

const removeAt = (i: number) => {
  const p = previews.value[i]
  if (p) URL.revokeObjectURL(p.url)
  previews.value = previews.value.filter((_, idx) => idx !== i)
  const files = (model.value ?? []).filter((_, idx) => idx !== i)
  model.value = files
  emit('select', files)
}

const pick = () => {
  if (!props.disabled) fileInput.value?.click()
}

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  target.value = '' // 允許重複選同一檔
  setFiles(files)
}

const onDrop = (e: DragEvent) => {
  dragOver.value = false
  if (props.disabled) return
  setFiles(Array.from(e.dataTransfer?.files ?? []))
}

onBeforeUnmount(clearPreviews)
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
