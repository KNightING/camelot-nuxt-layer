import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * 檔案拖曳/選擇的 headless 核心（ImageDropzone / FileDropzone 共用，亦可單獨使用
 * 將任意元素變成拖曳區並自定義展示）。
 *
 * 用法：
 * ```ts
 * const files = ref<File[] | null>(null)
 * const drop = useCamelotFileDrop({ model: files })
 * ```
 * ```vue
 * <div
 *   @dragover.prevent="drop.onDragOver"
 *   @dragenter.prevent="drop.onDragOver"
 *   @dragleave.prevent="drop.onDragLeave"
 *   @drop.prevent="drop.onDrop"
 *   @click="drop.pick()"
 * >...自定義展示 drop.entries...</div>
 * ```
 */

export type CamelotFileKind = 'image' | 'sheet' | 'pdf' | 'doc' | 'archive' | 'audio' | 'video' | 'file'

export interface CamelotFileEntry {
  file: File
  /** 圖片檔縮圖 objectURL（thumbnails=false 或非圖片為空字串） */
  url: string
  kind: CamelotFileKind
  /** 型別標籤（副檔名大寫，無副檔名時為 mime 或「檔案」） */
  label: string
  /** 人類可讀檔案大小（B / KB / MB / GB） */
  sizeText: string
  /** 型別色塊 class（圖片無縮圖時也適用） */
  colorClass: string
  key: string
}

export interface CamelotFileDropOptions {
  /** 檔案清單（單一真相來源；外部改動會同步 entries） */
  model: Ref<File[] | null>
  /** 接受的檔案型別（同 input accept）；預設不限 */
  accept?: MaybeRefOrGetter<string>
  /** 多選（true 時新檔累加既有清單） */
  multiple?: MaybeRefOrGetter<boolean>
  /** 最多檔數（0＝不限） */
  max?: MaybeRefOrGetter<number>
  disabled?: MaybeRefOrGetter<boolean>
  /** 是否為圖片檔產生縮圖 objectURL（預設 true） */
  thumbnails?: MaybeRefOrGetter<boolean>
  /** 清單變動（選入/移除）時回呼 */
  onSelect?: (files: File[]) => void
}

const KIND_RULES: {
  kind: CamelotFileKind
  colorClass: string
  exts: string[]
  mime?: string
}[] = [
  {
    kind: 'image',
    colorClass: 'bg-purple-600',
    exts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'bmp'],
    mime: 'image/',
  },
  {
    kind: 'sheet',
    colorClass: 'bg-green-600',
    exts: ['csv', 'xls', 'xlsx', 'ods', 'tsv'],
  },
  {
    kind: 'pdf',
    colorClass: 'bg-red-600',
    exts: ['pdf'],
  },
  {
    kind: 'doc',
    colorClass: 'bg-blue-600',
    exts: ['doc', 'docx', 'txt', 'md', 'rtf', 'odt'],
  },
  {
    kind: 'archive',
    colorClass: 'bg-amber-600',
    exts: ['zip', 'rar', '7z', 'gz', 'tar'],
  },
  {
    kind: 'audio',
    colorClass: 'bg-fuchsia-600',
    exts: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
    mime: 'audio/',
  },
  {
    kind: 'video',
    colorClass: 'bg-cyan-600',
    exts: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    mime: 'video/',
  },
]

/** 檔案 → 型別分類/標籤/色塊 */
export const camelotFileMeta = (f: File): Pick<CamelotFileEntry, 'kind' | 'label' | 'colorClass'> => {
  const ext = f.name.includes('.') ? f.name.split('.').pop()!.toLowerCase() : ''
  const rule = KIND_RULES.find(r => r.exts.includes(ext) || (r.mime && f.type.startsWith(r.mime)))
  return {
    kind: rule?.kind ?? 'file',
    label: ext ? ext.toUpperCase() : (f.type || '檔案'),
    colorClass: rule?.colorClass ?? 'bg-slate-500',
  }
}

/** bytes → 人類可讀大小 */
export const camelotFormatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let v = bytes
  let u = -1
  do {
    v /= 1024
    u++
  } while (v >= 1024 && u < units.length - 1)
  return `${v >= 10 ? Math.round(v) : v.toFixed(1)} ${units[u]}`
}

export const useCamelotFileDrop = (options: CamelotFileDropOptions) => {
  const { model } = options
  const accept = computed(() => toValue(options.accept) ?? '*')
  const multiple = computed(() => toValue(options.multiple) ?? true)
  const disabled = computed(() => toValue(options.disabled) ?? false)
  const thumbnails = computed(() => toValue(options.thumbnails) ?? true)

  const maxCount = computed(() => {
    const max = toValue(options.max) ?? 0
    return max > 0 ? max : Number.POSITIVE_INFINITY
  })
  const count = computed(() => (model.value ?? []).length)
  const atMax = computed(() => count.value >= maxCount.value)

  const dragOver = ref(false)
  const dragDepth = ref(0)

  // entries 由 model 衍生（外部改 v-model 也會同步）
  const entries = ref<CamelotFileEntry[]>([])
  watch([model, thumbnails], ([files]) => {
    for (const e of entries.value) {
      if (e.url) URL.revokeObjectURL(e.url)
    }
    entries.value = (files ?? []).map((f, i) => {
      const meta = camelotFileMeta(f)
      return {
        file: f,
        url: thumbnails.value && meta.kind === 'image' ? URL.createObjectURL(f) : '',
        ...meta,
        sizeText: camelotFormatFileSize(f.size),
        key: `${f.name}-${f.size}-${f.lastModified}-${i}`,
      }
    })
  }, { immediate: true })

  const accepts = (f: File) => {
    const tokens = accept.value.split(',').map(s => s.trim()).filter(Boolean)
    if (tokens.length === 0) return true
    return tokens.some((tok) => {
      if (tok === '*' || tok === '*/*') return true
      if (tok.endsWith('/*')) return f.type.startsWith(tok.slice(0, -1))
      if (tok.startsWith('.')) return f.name.toLowerCase().endsWith(tok.toLowerCase())
      return f.type === tok
    })
  }

  const setFiles = (list: File[]) => {
    if (disabled.value) return
    const valid = list.filter(accepts)
    if (valid.length === 0) return
    let next = multiple.value ? [...(model.value ?? []), ...valid] : valid.slice(0, 1)
    if (Number.isFinite(maxCount.value)) next = next.slice(0, maxCount.value)
    model.value = next
    options.onSelect?.(next)
  }

  const removeAt = (i: number) => {
    const files = (model.value ?? []).filter((_, idx) => idx !== i)
    model.value = files
    options.onSelect?.(files)
  }

  /** 開啟檔案選擇器（動態 input，任意觸發點可用） */
  const pick = () => {
    if (disabled.value || atMax.value || typeof document === 'undefined') return
    const input = document.createElement('input')
    input.type = 'file'
    if (accept.value !== '*') input.accept = accept.value
    input.multiple = multiple.value
    input.style.display = 'none'
    input.addEventListener('change', () => {
      setFiles(Array.from(input.files ?? []))
      input.remove()
    })
    document.body.appendChild(input)
    input.click()
  }

  // 搭配 @dragover.prevent / @dragenter.prevent / @dragleave.prevent / @drop.prevent 使用
  const onDragOver = () => {
    if (disabled.value) return
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
    if (disabled.value) return
    setFiles(Array.from(e.dataTransfer?.files ?? []))
  }

  onBeforeUnmount(() => {
    for (const e of entries.value) {
      if (e.url) URL.revokeObjectURL(e.url)
    }
  })

  return {
    dragOver,
    count,
    atMax,
    maxCount,
    entries,
    setFiles,
    removeAt,
    pick,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
