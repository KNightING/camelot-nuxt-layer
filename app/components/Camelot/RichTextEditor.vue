<template>
  <div
    class="cml-rte flex w-full flex-col overflow-hidden"
    :data-cml-theme="themeMode"
    :class="[roleColorClass, boxClass, { 'pointer-events-none opacity-60': disabled }]"
  >
    <!-- Toolbar -->
    <div
      class="cml-rte-toolbar sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5"
      :class="toolbarClass"
    >
      <template
        v-for="(g, gi) in groups"
        :key="gi"
      >
        <button
          v-for="b in g"
          :key="b.key"
          type="button"
          :title="tooltip(b)"
          :aria-label="b.title"
          class="cml-rte-btn"
          :class="b.active && b.active() ? activeBtnClass : idleBtnClass"
          @click="b.run(); editor?.commands.focus()"
        >
          <span
            v-if="b.text"
            class="text-sm font-semibold leading-none"
          >{{ b.text }}</span>
          <component
            :is="b.icon"
            v-else
            class="h-5 w-5"
          />
        </button>
        <span
          class="cml-rte-divider"
          :class="dividerClass"
        />
      </template>

      <!-- Link -->
      <div class="relative">
        <button
          type="button"
          :title="`${t.link}（Ctrl+K）`"
          :aria-label="t.link"
          class="cml-rte-btn"
          :class="editor?.isActive('link') ? activeBtnClass : idleBtnClass"
          @click="openLink"
        >
          <IMaterialSymbolsLink class="h-5 w-5" />
        </button>
        <div
          v-if="linkOpen"
          class="cml-rte-pop w-80"
          :class="popClass"
        >
          <label class="mb-1 block text-sm font-medium text-on-surface-variant">{{ t.linkUrl }}</label>
          <input
            ref="linkInputRef"
            v-model="linkUrl"
            type="url"
            placeholder="https://example.com"
            class="cml-rte-input"
            @keydown.enter.prevent="applyLink"
            @keydown.esc="linkOpen = false"
          >
          <div class="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              class="text-sm text-error hover:underline"
              @click="removeLink"
            >
              {{ t.removeLink }}
            </button>
            <div class="flex gap-2">
              <CamelotButton
                :label="t.cancel"
                is-container
                :color="color"
                @click="linkOpen = false"
              />
              <CamelotButton
                :label="t.apply"
                :color="color"
                @click="applyLink"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div class="relative">
        <button
          type="button"
          :title="t.imageHint"
          :aria-label="t.image"
          class="cml-rte-btn"
          :class="idleBtnClass"
          @click="openImage"
        >
          <IMaterialSymbolsImage class="h-5 w-5" />
        </button>
        <div
          v-if="imageOpen"
          class="cml-rte-pop w-96"
          :class="popClass"
        >
          <template v-if="uploadHandler">
            <label class="mb-1 block text-sm font-medium text-on-surface-variant">{{ t.fromComputer }}</label>
            <CamelotImageDropzone
              :color="color"
              :disabled="uploading"
              :preview="false"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              :hint="t.dropHint"
              @select="onDropzoneSelect"
            />
            <div class="my-3 flex items-center gap-2 text-xs text-on-surface-variant/70">
              <span class="h-px flex-1 bg-border" />
              <span>{{ t.or }}</span>
              <span class="h-px flex-1 bg-border" />
            </div>
          </template>

          <label class="mb-1 block text-sm font-medium text-on-surface-variant">{{ t.imageUrl }}</label>
          <input
            ref="imageInputRef"
            v-model="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="cml-rte-input"
            @keydown.enter.prevent="applyImage"
            @keydown.esc="imageOpen = false"
          >
          <p
            v-if="uploadError"
            class="mt-2 text-sm text-error"
          >
            {{ uploadError }}
          </p>
          <div class="mt-3 flex justify-end gap-2">
            <CamelotButton
              :label="t.cancel"
              is-container
              :color="color"
              @click="imageOpen = false"
            />
            <CamelotButton
              :label="t.insertUrl"
              :color="color"
              :disabled="!imageUrl.trim()"
              @click="applyImage"
            />
          </div>
        </div>
      </div>

      <span
        class="cml-rte-divider"
        :class="dividerClass"
      />

      <!-- Paste HTML -->
      <button
        type="button"
        :title="t.pasteHtml"
        :aria-label="t.pasteHtml"
        class="cml-rte-btn"
        :class="idleBtnClass"
        :disabled="pasteHtmlBusy"
        @click="pasteHtmlFromClipboard"
      >
        <IMaterialSymbolsContentPaste class="h-5 w-5" />
      </button>

      <span
        class="cml-rte-divider"
        :class="dividerClass"
      />

      <!-- Undo / Redo -->
      <button
        type="button"
        :title="`${t.undo}（Ctrl+Z）`"
        :aria-label="t.undo"
        class="cml-rte-btn disabled:cursor-not-allowed disabled:opacity-40"
        :class="idleBtnClass"
        :disabled="!editor?.can().undo()"
        @click="editor?.chain().focus().undo().run()"
      >
        <IMaterialSymbolsUndo class="h-5 w-5" />
      </button>
      <button
        type="button"
        :title="`${t.redo}（Ctrl+Shift+Z）`"
        :aria-label="t.redo"
        class="cml-rte-btn disabled:cursor-not-allowed disabled:opacity-40"
        :class="idleBtnClass"
        :disabled="!editor?.can().redo()"
        @click="editor?.chain().focus().redo().run()"
      >
        <IMaterialSymbolsRedo class="h-5 w-5" />
      </button>

      <span
        v-if="uploading || uploadError || hasPending || pasteHtmlError || pasteHtmlBusy"
        class="ml-auto pr-1 text-sm"
        :class="{
          'text-error': uploadError || pasteHtmlError,
          'text-warning': !uploadError && !pasteHtmlError && hasPending && !uploading,
          'text-on-surface-variant': !uploadError && !pasteHtmlError && (uploading || pasteHtmlBusy),
        }"
      >
        <span v-if="pasteHtmlBusy">{{ t.readingClipboard }}</span>
        <span v-else-if="pasteHtmlError">{{ pasteHtmlError }}</span>
        <span v-else-if="uploading">{{ t.uploading }}</span>
        <span v-else-if="uploadError">{{ uploadError }}</span>
        <span v-else-if="hasPending">{{ t.pendingCount(pendingCount) }}</span>
      </span>
    </div>

    <!-- Content -->
    <div class="relative">
      <EditorContent
        :editor="editor"
        class="cml-rte-content"
        :style="{ minHeight }"
      />
      <div
        v-if="uploading"
        class="pointer-events-none absolute inset-0 flex items-start justify-center bg-surface/40 pt-6 text-sm"
      >
        <span class="rounded-full bg-[var(--cml-color-current-color)] px-3 py-1 text-[var(--cml-color-current-on-color)] shadow">{{ t.uploading }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsLink from '~icons/material-symbols/link'
import IMaterialSymbolsImage from '~icons/material-symbols/image'
import IMaterialSymbolsContentPaste from '~icons/material-symbols/content-paste'
import IMaterialSymbolsUndo from '~icons/material-symbols/undo'
import IMaterialSymbolsRedo from '~icons/material-symbols/redo'
import IMaterialSymbolsFormatBold from '~icons/material-symbols/format-bold'
import IMaterialSymbolsFormatItalic from '~icons/material-symbols/format-italic'
import IMaterialSymbolsStrikethroughS from '~icons/material-symbols/strikethrough-s'
import IMaterialSymbolsCode from '~icons/material-symbols/code'
import IMaterialSymbolsFormatListBulleted from '~icons/material-symbols/format-list-bulleted'
import IMaterialSymbolsFormatListNumbered from '~icons/material-symbols/format-list-numbered'
import IMaterialSymbolsFormatQuote from '~icons/material-symbols/format-quote'
import IMaterialSymbolsCodeBlocks from '~icons/material-symbols/code-blocks'
import IMaterialSymbolsHorizontalRule from '~icons/material-symbols/horizontal-rule'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { ResizableImage } from './Internal/editor/resizable-image'
import { PasteSanitize, sanitizePastedHtml } from './Internal/editor/paste-sanitize'
import { TabIndent } from './Internal/editor/tab-indent'

const props = withDefaults(defineProps<{
  color?: CamelotColorRole
  placeholder?: string
  disabled?: boolean
  minHeight?: string
  /** 可插拔上傳：回傳最終可存取的圖片 URL；未提供時僅支援貼圖片網址 */
  uploadHandler?: (file: File) => Promise<string>
}>(), {
  color: 'primary',
  placeholder: '開始撰寫內容…',
  disabled: false,
  minHeight: '320px',
})

const modelValue = defineModel<string>({ required: true })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

// 介面文案（預設繁中；之後可改 i18n）
const t = {
  link: '連結',
  linkUrl: '連結網址',
  removeLink: '移除連結',
  cancel: '取消',
  apply: '套用',
  image: '圖片',
  imageHint: '插入圖片（可直接貼上 / 拖曳）',
  fromComputer: '從電腦選擇',
  dropHint: '點此選擇圖片，或拖曳到此區域',
  or: '或',
  imageUrl: '貼圖片網址',
  insertUrl: '插入網址',
  pasteHtml: '貼上 HTML 原始碼（自動轉成段落）',
  undo: '復原',
  redo: '重做',
  readingClipboard: '讀取剪貼簿…',
  uploading: '圖片上傳中…',
  pendingCount: (n: number) => `有 ${n} 張圖片待儲存時上傳`,
}

const uploading = ref(false)
const uploadError = ref<string | null>(null)

// blob URL -> File（待上傳；flush 時逐張上傳並把 src 換成最終 URL）
const pendingImages = new Map<string, File>()
const pendingCount = ref(0)
const hasPending = computed(() => pendingCount.value > 0)

function stageLocalImage(file: File): string {
  const blobUrl = URL.createObjectURL(file)
  pendingImages.set(blobUrl, file)
  pendingCount.value = pendingImages.size
  return blobUrl
}

function revokeBlob(url: string) {
  pendingImages.delete(url)
  URL.revokeObjectURL(url)
  pendingCount.value = pendingImages.size
}

function insertImageUrl(url: string, pending = false) {
  editor.value?.chain().focus().setImage({
    src: url,
    pending: pending ? '1' : null,
  } as Record<string, unknown>).run()
}

const editor = useEditor({
  content: modelValue.value,
  editable: !props.disabled,
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: () => props.placeholder }),
    ResizableImage,
    PasteSanitize,
    TabIndent,
  ],
  editorProps: {
    attributes: {
      class: 'cml-prose focus:outline-none px-6 py-5',
    },
    handlePaste(_view, event) {
      const files = Array.from(event.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/'))
      if (files.length > 0 && props.uploadHandler) {
        event.preventDefault()
        for (const f of files) insertImageUrl(stageLocalImage(f), true)
        return true
      }
      const textClip = event.clipboardData?.getData('text/plain') ?? ''
      const tagLike = /<([a-z][a-z0-9]*)\b[^>]*>/i
      if (tagLike.test(textClip)) {
        event.preventDefault()
        const cleaned = sanitizePastedHtml(textClip)
        editor.value?.chain().focus().insertContent(cleaned, { parseOptions: { preserveWhitespace: false } }).run()
        return true
      }
      return false
    },
    handleDrop(_view, event) {
      if (!props.uploadHandler) return false
      const dt = (event as DragEvent).dataTransfer
      const files = Array.from(dt?.files ?? []).filter(f => f.type.startsWith('image/'))
      if (files.length === 0) return false
      event.preventDefault()
      for (const f of files) insertImageUrl(stageLocalImage(f), true)
      return true
    },
  },
  onUpdate({ editor }) {
    modelValue.value = editor.getHTML()
  },
})

watch(modelValue, (val) => {
  if (!editor.value) return
  if (val !== editor.value.getHTML()) editor.value.commands.setContent(val || '', { emitUpdate: false })
})

watch(() => props.disabled, (d) => {
  editor.value?.setEditable(!d)
})

onBeforeUnmount(() => {
  for (const url of pendingImages.keys()) URL.revokeObjectURL(url)
  pendingImages.clear()
  editor.value?.destroy()
})

async function flush(): Promise<void> {
  if (pendingImages.size === 0) return
  if (!props.uploadHandler) return
  if (uploading.value) throw new Error('圖片正在上傳中，請稍候')
  uploadError.value = null
  uploading.value = true
  try {
    const ed = editor.value
    if (!ed) return
    const stillUsed: Array<{ blobUrl: string, file: File }> = []
    ed.state.doc.descendants((node) => {
      if (node.type.name !== 'image') return
      const src = node.attrs.src as string | undefined
      if (!src || !pendingImages.has(src)) return
      const file = pendingImages.get(src)
      if (file) stillUsed.push({
        blobUrl: src,
        file,
      })
    })

    for (const url of Array.from(pendingImages.keys())) {
      if (!stillUsed.some(x => x.blobUrl === url)) revokeBlob(url)
    }

    for (const {
      blobUrl, file,
    } of stillUsed) {
      const finalUrl = await props.uploadHandler(file)
      const tr = ed.state.tr
      let changed = false
      ed.state.doc.descendants((node, pos) => {
        if (node.type.name !== 'image') return
        if (node.attrs.src !== blobUrl) return
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: finalUrl,
          pending: null,
        })
        changed = true
      })
      if (changed) ed.view.dispatch(tr)
      revokeBlob(blobUrl)
    }

    modelValue.value = ed.getHTML()
  }
  catch (err: unknown) {
    const msg = (err as Error)?.message || '上傳失敗'
    uploadError.value = msg
    throw new Error(msg)
  }
  finally {
    uploading.value = false
  }
}

defineExpose({
  flush,
  hasPending,
})

const linkOpen = ref(false)
const linkUrl = ref('')
const linkInputRef = useTemplateRef<HTMLInputElement>('linkInputRef')

const imageOpen = ref(false)
const imageUrl = ref('')
const imageInputRef = useTemplateRef<HTMLInputElement>('imageInputRef')

function openLink() {
  linkUrl.value = (editor.value?.getAttributes('link').href as string) ?? ''
  linkOpen.value = true
  imageOpen.value = false
  nextTick(() => linkInputRef.value?.focus())
}

function applyLink() {
  const url = linkUrl.value.trim()
  if (!url) editor.value?.chain().focus().unsetLink().run()
  else editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  linkOpen.value = false
}

function removeLink() {
  editor.value?.chain().focus().unsetLink().run()
  linkOpen.value = false
}

function openImage() {
  imageUrl.value = ''
  imageOpen.value = true
  linkOpen.value = false
  nextTick(() => imageInputRef.value?.focus())
}

function applyImage() {
  const url = imageUrl.value.trim()
  if (url) insertImageUrl(url)
  imageOpen.value = false
}

// 由 CamelotImageDropzone 選到檔案 → 暫存 blob 並插入，關閉彈窗
function onDropzoneSelect(files: File[]) {
  const file = files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadError.value = '只接受圖片檔案'
    return
  }
  insertImageUrl(stageLocalImage(file), true)
  imageOpen.value = false
}

const pasteHtmlBusy = ref(false)
const pasteHtmlError = ref('')
async function pasteHtmlFromClipboard() {
  if (pasteHtmlBusy.value) return
  pasteHtmlBusy.value = true
  pasteHtmlError.value = ''
  try {
    if (!navigator.clipboard?.readText) throw new Error('此瀏覽器不支援讀取剪貼簿')
    const text = await navigator.clipboard.readText()
    if (!text?.trim()) throw new Error('剪貼簿是空的')
    const cleaned = sanitizePastedHtml(text)
    if (!cleaned) throw new Error('剪貼簿內容無法解析為 HTML')
    editor.value?.chain().focus().insertContent(cleaned, { parseOptions: { preserveWhitespace: false } }).run()
  }
  catch (err: unknown) {
    const e = err as { message?: string, name?: string }
    pasteHtmlError.value = e?.name === 'NotAllowedError'
      ? '瀏覽器拒絕讀取剪貼簿，請允許網站存取剪貼簿後重試'
      : (e?.message || '貼上失敗')
    setTimeout(() => {
      pasteHtmlError.value = ''
    }, 4000)
  }
  finally {
    pasteHtmlBusy.value = false
  }
}

interface Btn {
  key: string
  title: string
  shortcut?: string
  text?: string
  icon?: unknown
  active?: () => boolean
  run: () => void
}

const groups = computed<Btn[][]>(() => {
  const e = editor.value
  if (!e) return []
  return [
    [
      {
        key: 'h1',
        title: '標題 1',
        shortcut: 'Ctrl+Alt+1',
        text: 'H1',
        active: () => e.isActive('heading', { level: 1 }),
        run: () => e.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        key: 'h2',
        title: '標題 2',
        shortcut: 'Ctrl+Alt+2',
        text: 'H2',
        active: () => e.isActive('heading', { level: 2 }),
        run: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        key: 'h3',
        title: '標題 3',
        shortcut: 'Ctrl+Alt+3',
        text: 'H3',
        active: () => e.isActive('heading', { level: 3 }),
        run: () => e.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        key: 'p',
        title: '段落',
        text: 'P',
        active: () => e.isActive('paragraph') && !e.isActive('heading'),
        run: () => e.chain().focus().setParagraph().run(),
      },
    ],
    [
      {
        key: 'bold',
        title: '粗體',
        shortcut: 'Ctrl+B',
        icon: IMaterialSymbolsFormatBold,
        active: () => e.isActive('bold'),
        run: () => e.chain().focus().toggleBold().run(),
      },
      {
        key: 'italic',
        title: '斜體',
        shortcut: 'Ctrl+I',
        icon: IMaterialSymbolsFormatItalic,
        active: () => e.isActive('italic'),
        run: () => e.chain().focus().toggleItalic().run(),
      },
      {
        key: 'strike',
        title: '刪除線',
        shortcut: 'Ctrl+Shift+X',
        icon: IMaterialSymbolsStrikethroughS,
        active: () => e.isActive('strike'),
        run: () => e.chain().focus().toggleStrike().run(),
      },
      {
        key: 'code',
        title: '行內代碼',
        shortcut: 'Ctrl+E',
        icon: IMaterialSymbolsCode,
        active: () => e.isActive('code'),
        run: () => e.chain().focus().toggleCode().run(),
      },
    ],
    [
      {
        key: 'ul',
        title: '項目清單',
        shortcut: 'Ctrl+Shift+8',
        icon: IMaterialSymbolsFormatListBulleted,
        active: () => e.isActive('bulletList'),
        run: () => e.chain().focus().toggleBulletList().run(),
      },
      {
        key: 'ol',
        title: '編號清單',
        shortcut: 'Ctrl+Shift+7',
        icon: IMaterialSymbolsFormatListNumbered,
        active: () => e.isActive('orderedList'),
        run: () => e.chain().focus().toggleOrderedList().run(),
      },
      {
        key: 'quote',
        title: '引言',
        shortcut: 'Ctrl+Shift+B',
        icon: IMaterialSymbolsFormatQuote,
        active: () => e.isActive('blockquote'),
        run: () => e.chain().focus().toggleBlockquote().run(),
      },
      {
        key: 'codeblock',
        title: '程式碼區塊',
        shortcut: 'Ctrl+Alt+C',
        icon: IMaterialSymbolsCodeBlocks,
        active: () => e.isActive('codeBlock'),
        run: () => e.chain().focus().toggleCodeBlock().run(),
      },
      {
        key: 'hr',
        title: '分隔線',
        icon: IMaterialSymbolsHorizontalRule,
        run: () => e.chain().focus().setHorizontalRule().run(),
      },
    ],
  ]
})

function tooltip(b: Btn) {
  return b.shortcut ? `${b.title}（${b.shortcut}）` : b.title
}

// 四主題：外框 / 工具列 / 彈窗 / 分隔線 / 按鈕態
const boxClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'rounded-2xl border border-border bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] backdrop-blur-md text-on-surface shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_40%,transparent)] bg-surface text-on-surface font-mono shadow-[0_0_16px_color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)]'
    case 'cupertino':
      return 'rounded-[14px] border border-border bg-surface-container-high text-on-surface shadow-xl'
    default:
      return 'rounded-xl border border-border bg-surface text-on-surface shadow-sm'
  }
})

const toolbarClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'bg-[color-mix(in_srgb,var(--color-surface-container)_55%,transparent)] backdrop-blur-md'
    case 'scifi':
      return 'bg-surface-container/80'
    case 'cupertino':
      return 'bg-surface-container-high/85 backdrop-blur'
    default:
      return 'bg-surface-container-low'
  }
})

const popClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-glass'
    case 'scifi':
      return 'rounded-none border border-border bg-surface-container'
    default:
      return 'rounded-lg border border-border bg-surface-container-high shadow-lg'
  }
})

const dividerClass = computed(() => 'mx-1 h-6 w-px bg-border')

// 工具列按鈕的閒置/啟用態依主題各有識別度（形狀由 scoped CSS 依 data-cml-theme 控制）
const idleBtnClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'text-on-surface-variant hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] hover:text-[var(--cml-color-current-color)]'
    case 'scifi':
      return 'text-on-surface-variant hover:text-[var(--cml-color-current-color)] hover:bg-[color-mix(in_srgb,var(--cml-color-current-color)_10%,transparent)]'
    case 'cupertino':
      return 'text-on-surface-variant hover:bg-surface-container/70'
    default:
      return 'text-on-surface-variant hover:bg-surface-container'
  }
})
const activeBtnClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      // 玻璃填滿態：135deg 漸層 + 柔光（aqua-fill），與其他 aqua 選中態一致
      return 'aqua-fill text-[var(--cml-color-current-on-color)]'
    case 'scifi':
      // 霓虹：淡色底 + 角色色字 + 邊框 + 外發光
      return 'text-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_16%,transparent)] border-[color-mix(in_srgb,var(--cml-color-current-color)_55%,transparent)]! shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_35%,transparent)]'
    default:
      // material / cupertino：實心填滿
      return 'bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
  }
})
</script>

<style scoped>
.cml-rte-btn {
  display: inline-flex;
  height: 2.25rem;
  min-width: 2.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent; /* 佔位避免 scifi active 邊框造成位移 */
  border-radius: 0.375rem; /* material 預設 */
  padding-inline: 0.5rem;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
/* 按鈕形狀依主題識別 */
.cml-rte[data-cml-theme="aqua"] .cml-rte-btn { border-radius: 9999px; }
.cml-rte[data-cml-theme="scifi"] .cml-rte-btn { border-radius: 0; }
.cml-rte[data-cml-theme="cupertino"] .cml-rte-btn { border-radius: 0.625rem; }
.cml-rte-pop {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 20;
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
}
.cml-rte-input {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background: transparent;
  padding: 0.375rem 0.625rem;
  font-size: 1rem;
  color: var(--color-on-surface);
  outline: none;
}
.cml-rte-input:focus {
  border-color: var(--cml-color-current-color);
  box-shadow: 0 0 0 1px var(--cml-color-current-color);
}

/* ===== 編輯區（ProseMirror）四主題共用，色彩走主題 token ===== */
.cml-rte-content :deep(.cml-prose) {
  max-width: none;
  min-height: inherit;
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color-on-surface);
  caret-color: var(--cml-color-current-color);
}
.cml-rte-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  color: var(--color-on-surface);
  opacity: 0.4;
}
.cml-rte-content :deep(h1) { font-size: 2rem; font-weight: 700; margin: 1.25rem 0 0.5rem; line-height: 1.25; }
.cml-rte-content :deep(h2) { font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.5rem; line-height: 1.3; }
.cml-rte-content :deep(h3) { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.35; }
.cml-rte-content :deep(p) { margin: 0.5rem 0; }
.cml-rte-content :deep(ul) { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
.cml-rte-content :deep(ol) { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
.cml-rte-content :deep(blockquote) {
  border-left: 4px solid var(--color-border);
  padding-left: 1rem;
  color: var(--color-on-surface-variant);
  margin: 0.75rem 0;
}
.cml-rte-content :deep(code) {
  background: var(--color-surface-container);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
}
.cml-rte-content :deep(pre) {
  background: color-mix(in srgb, var(--color-on-surface) 92%, var(--color-surface));
  color: var(--color-surface);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.75rem 0;
}
.cml-rte-content :deep(pre code) { background: transparent; color: inherit; padding: 0; }
.cml-rte-content :deep(img) { max-width: 100%; height: auto; border-radius: 0.5rem; }
.cml-rte-content :deep(img[data-pending="1"]) {
  outline: 2px dashed var(--color-warning);
  outline-offset: 2px;
  opacity: 0.92;
}
.cml-rte-content :deep(hr) { border-top: 1px solid var(--color-border); margin: 1.25rem 0; }
.cml-rte-content :deep(a) { color: var(--cml-color-current-color); text-decoration: underline; }
.cml-rte-content :deep(.ProseMirror) { min-height: inherit; }
.cml-rte-content :deep(.ProseMirror ::selection) {
  background: color-mix(in srgb, var(--cml-color-current-color) 28%, transparent);
}
</style>
