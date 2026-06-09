<template>
  <NodeViewWrapper
    ref="wrapperEl"
    :as="'span'"
    class="resizable-image"
    :class="{
      'is-selected': selected && editable,
      'is-floating': align === 'left' || align === 'right',
      'is-align-left': align === 'left',
      'is-align-right': align === 'right',
      'is-align-center': align === 'center',
    }"
    :data-align="align === 'none' ? null : align"
    :data-drag-handle="editable ? '' : undefined"
  >
    <img
      ref="imgEl"
      :src="node.attrs.src"
      :alt="node.attrs.alt || ''"
      :data-align="align === 'none' ? null : align"
      :data-pending="pending || undefined"
      :style="widthStyle"
      draggable="false"
    >

    <!-- 浮動工具列：對齊 + 寬度。Teleport 到 body 避免被編輯卡片的 overflow:hidden 切掉 -->
    <Teleport
      v-if="toolbarVisible"
      to="body"
    >
      <span
        ref="toolbarEl"
        class="image-toolbar"
        :class="{ 'is-below': toolbarPlacedBelow }"
        contenteditable="false"
        :style="{ top: `${toolbarTop}px`, left: `${toolbarLeft}px` }"
        @mousedown.stop
      >
        <button
          type="button"
          title="文繞字（靠左）"
          :class="{ 'is-active': align === 'left' }"
          @click="setAlign('left')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ><rect
            x="3"
            y="5"
            width="9"
            height="7"
            rx="1"
          /><line
            x1="14"
            y1="6"
            x2="21"
            y2="6"
          /><line
            x1="14"
            y1="10"
            x2="21"
            y2="10"
          /><line
            x1="3"
            y1="16"
            x2="21"
            y2="16"
          /><line
            x1="3"
            y1="20"
            x2="21"
            y2="20"
          /></svg>
        </button>
        <button
          type="button"
          title="置中（區塊）"
          :class="{ 'is-active': align === 'center' }"
          @click="setAlign('center')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ><rect
            x="7"
            y="4"
            width="10"
            height="8"
            rx="1"
          /><line
            x1="4"
            y1="16"
            x2="20"
            y2="16"
          /><line
            x1="6"
            y1="20"
            x2="18"
            y2="20"
          /></svg>
        </button>
        <button
          type="button"
          title="文繞字（靠右）"
          :class="{ 'is-active': align === 'right' }"
          @click="setAlign('right')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ><rect
            x="12"
            y="5"
            width="9"
            height="7"
            rx="1"
          /><line
            x1="3"
            y1="6"
            x2="10"
            y2="6"
          /><line
            x1="3"
            y1="10"
            x2="10"
            y2="10"
          /><line
            x1="3"
            y1="16"
            x2="21"
            y2="16"
          /><line
            x1="3"
            y1="20"
            x2="21"
            y2="20"
          /></svg>
        </button>
        <button
          type="button"
          title="取消對齊（恢復一般圖片，不文繞字）"
          class="text-btn"
          :class="{ 'is-active': align === 'none' }"
          @click="setAlign('none')"
        >
          無對齊
        </button>

        <span class="bg-border h-px" />

        <button
          v-for="p in presetWidths"
          :key="p.label"
          type="button"
          :title="`寬度 ${p.label}`"
          :class="{ 'is-active': (p.value === null && !widthAttr) || widthAttr === p.value }"
          class="text-btn"
          @click="setPresetWidth(p.value)"
        >
          {{ p.label }}
        </button>

        <span class="bg-border h-px" />

        <button
          type="button"
          title="重設寬度（恢復自動）"
          class="text-btn"
          @click="clearWidth"
        >
          重設
        </button>
        <button
          type="button"
          title="刪除圖片"
          class="danger"
          @click="deleteNode"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /></svg>
        </button>
      </span>
    </Teleport>

    <!-- 右下角 resize handle（選中時才顯示） -->
    <span
      v-if="editable && selected"
      class="resize-handle"
      contenteditable="false"
      title="拖拉縮放（按住等比例）"
      @mousedown="onResizeStart"
    />

    <!-- 圖片下方 caption 顯示（無論選中與否，只要 caption 有值就顯示） -->
    <span
      v-if="captionAttr"
      class="img-caption"
      contenteditable="false"
    >{{ captionAttr }}</span>

    <!-- 選中或面板內有焦點時：caption 編輯面板（alt 同步） -->
    <span
      v-show="panelVisible"
      ref="panelEl"
      class="image-meta-editor"
      contenteditable="false"
      @mousedown.stop
      @focusin="onPanelFocusIn"
      @focusout="onPanelFocusOut"
    >
      <label>
        <span class="meta-label">圖片說明（會作為 alt 文字並顯示在圖下方）</span>
        <input
          ref="captionInputEl"
          type="text"
          :value="captionInput"
          placeholder="例：▲ Google 發布 Gemini 3.5 Flash！(圖：Shutterstock)"
          @input="onCaptionInputEvent"
        >
      </label>
    </span>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import type { Editor, Node as ProseMirrorNode } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/vue-3'

type Align = 'none' | 'left' | 'right' | 'center'

// NodeViewProps from @tiptap/vue-3
const props = defineProps<{
  editor: Editor
  node: ProseMirrorNode
  selected: boolean
  updateAttributes: (attrs: Record<string, unknown>) => void
  deleteNode: () => void
}>()

const imgEl = ref<HTMLImageElement | null>(null)
const wrapperEl = ref<HTMLElement | null>(null)

const editable = computed(() => props.editor.isEditable)
const align = computed<Align>(() => ((props.node.attrs.align as Align) || 'none'))
const widthAttr = computed<string | null>(() => (props.node.attrs.width as string | null) ?? null)
const pending = computed<string | null>(() => (props.node.attrs.pending as string | null) ?? null)
const captionAttr = computed<string>(() => (props.node.attrs.caption as string) ?? '')

const widthStyle = computed(() => widthAttr.value ? { width: widthAttr.value } : {})

function setAlign(a: Align) {
  // 點同一個對齊鈕第二次 → 自動解除回 'none'（toggle 行為）
  const current = (props.node.attrs.align as Align) || 'none'
  const next = current === a ? 'none' : a
  props.updateAttributes({ align: next })
}

function clearWidth() {
  props.updateAttributes({ width: null })
}

// ─────────── caption 編輯（alt 自動 = caption） ───────────
// 用 local ref 避免每次按鍵都因 ProseMirror 重新渲染 NodeView 而失去焦點
const captionInput = ref<string>(captionAttr.value)
const captionInputEl = ref<HTMLInputElement | null>(null)
const panelEl = ref<HTMLSpanElement | null>(null)
const metaFocused = ref(false)

watch(captionAttr, (val) => {
  // 外部變更才同步回本地（例如載入時、AI 翻譯等）；
  // 避免使用者打字時自己被覆蓋
  if (val !== captionInput.value && document.activeElement !== captionInputEl.value) {
    captionInput.value = val
  }
})

function onCaptionInputEvent(e: Event) {
  const v = (e.target as HTMLInputElement).value
  captionInput.value = v
  // caption + alt 同步寫入 node attrs
  props.updateAttributes({
    caption: v || null,
    alt: v || null,
  })
}

function onPanelFocusIn() {
  metaFocused.value = true
}
function onPanelFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Element | null
  if (next && panelEl.value?.contains(next)) return
  metaFocused.value = false
}

// 顯示編輯面板的條件：節點被選中 或 面板內元素有焦點
const panelVisible = computed(() => editable.value && (props.selected || metaFocused.value))

// ─────────── Resize ───────────
const resizing = ref(false)
const resizeStart = reactive({
  x: 0,
  w: 0,
  h: 0,
  ratio: 1,
})

function onResizeStart(e: MouseEvent) {
  if (!editable.value || !imgEl.value) return
  e.preventDefault()
  e.stopPropagation()
  const rect = imgEl.value.getBoundingClientRect()
  resizeStart.x = e.clientX
  resizeStart.w = rect.width
  resizeStart.h = rect.height
  resizeStart.ratio = rect.height > 0 ? rect.width / rect.height : 1
  resizing.value = true
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  if (!resizing.value) return
  // 右下角拖：dx 增加 = 變寬
  const dx = e.clientX - resizeStart.x
  const newWidth = Math.max(48, Math.round(resizeStart.w + dx))
  if (imgEl.value) {
    imgEl.value.style.width = `${newWidth}px`
  }
}

function onResizeEnd(e: MouseEvent) {
  if (!resizing.value) return
  resizing.value = false
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
  const finalWidth = imgEl.value?.style.width
  if (finalWidth) {
    props.updateAttributes({ width: finalWidth })
  }
  e.preventDefault()
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
  detachToolbarTracking()
})

// ─────────── 浮動工具列定位（Teleport 到 body，避免被編輯區 overflow:hidden 切掉） ───────────
const toolbarEl = ref<HTMLSpanElement | null>(null)
const toolbarTop = ref(0)
const toolbarLeft = ref(0)
const toolbarPlacedBelow = ref(false)
const toolbarVisible = computed(() => editable.value && props.selected)

function updateToolbarPos() {
  if (!imgEl.value || !toolbarEl.value) return
  const imgRect = imgEl.value.getBoundingClientRect()
  const tbWidth = toolbarEl.value.offsetWidth
  const tbHeight = toolbarEl.value.offsetHeight
  const margin = 8

  // 預設放在圖片上方；若空間不足放下方
  let top = imgRect.top - tbHeight - margin
  let placedBelow = false
  if (top < margin) {
    top = imgRect.bottom + margin
    placedBelow = true
  }

  // 水平置中，但夾在 viewport 內
  let left = imgRect.left + imgRect.width / 2 - tbWidth / 2
  left = Math.max(margin, Math.min(left, window.innerWidth - tbWidth - margin))

  toolbarTop.value = top
  toolbarLeft.value = left
  toolbarPlacedBelow.value = placedBelow
}

let toolbarObserver: ResizeObserver | null = null

function attachToolbarTracking() {
  // 等到 DOM 真的 mount 後再算一次
  nextTick(() => updateToolbarPos())
  window.addEventListener('scroll', updateToolbarPos, true)
  window.addEventListener('resize', updateToolbarPos)
  if (imgEl.value && typeof ResizeObserver !== 'undefined') {
    toolbarObserver = new ResizeObserver(updateToolbarPos)
    toolbarObserver.observe(imgEl.value)
  }
}

function detachToolbarTracking() {
  window.removeEventListener('scroll', updateToolbarPos, true)
  window.removeEventListener('resize', updateToolbarPos)
  toolbarObserver?.disconnect()
  toolbarObserver = null
}

watch(toolbarVisible, (v) => {
  if (v) attachToolbarTracking()
  else detachToolbarTracking()
})

const presetWidths: Array<{ label: string, value: string | null }> = [
  {
    label: '25%',
    value: '25%',
  },
  {
    label: '50%',
    value: '50%',
  },
  {
    label: '75%',
    value: '75%',
  },
  {
    label: '100%',
    value: '100%',
  },
  {
    label: '原始',
    value: null,
  },
]

function setPresetWidth(v: string | null) {
  props.updateAttributes({ width: v })
}
</script>

<style>
/* 設成全域以便 ProseMirror DOM 中的 .resizable-image 都受影響 */
.resizable-image {
  position: relative;
  display: inline-block;
  width: fit-content;
  line-height: 0;
  max-width: 100%;
  vertical-align: top;
}
.resizable-image img {
  display: inline-block;
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
.resizable-image.is-selected img {
  outline: 2px solid var(--cml-color-current-color, var(--color-primary));
  outline-offset: 2px;
}
/* 圖片浮動工具列（Teleport 到 body，所以用 position:fixed + 直接套用 top/left） */
.image-toolbar {
  position: fixed;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  background: var(--color-inverse-surface);
  color: var(--color-inverse-on-surface);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  line-height: 1;
  font-size: 12px;
}
.image-toolbar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
  cursor: pointer;
}
.image-toolbar button:hover {
  background: rgba(255, 255, 255, 0.12);
}
.image-toolbar button.is-active {
  background: var(--cml-color-current-color, var(--color-primary));
}
.image-toolbar button.text-btn {
  width: auto;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 500;
}
.image-toolbar button.danger:hover {
  background: var(--color-error);
}
.image-toolbar svg {
  width: 16px;
  height: 16px;
}
.image-toolbar .divider {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: rgba(255, 255, 255, 0.2);
}
.resizable-image .resize-handle {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-surface);
  background: var(--cml-color-current-color, var(--color-primary));
  border-radius: 50%;
  cursor: nwse-resize;
  z-index: 25;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 60%, transparent);
}

/* 圖片下方 caption：純文字、無背景，與公開頁同步 */
.resizable-image .img-caption {
  display: block;
  color: var(--color-on-surface-variant);
  padding: 6px 8px 2px;
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
  font-style: italic;
  user-select: none;
}

/* 選中時下方出現 alt / caption 編輯面板 */
.resizable-image .image-meta-editor {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--color-surface-container-high);
  border: 1px solid var(--color-border);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-on-surface);
}
.resizable-image .image-meta-editor label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.resizable-image .image-meta-editor .meta-label {
  font-size: 11px;
  color: var(--color-on-surface-variant);
}
.resizable-image .image-meta-editor input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-on-surface);
  background: var(--color-surface);
  outline: none;
}
.resizable-image .image-meta-editor input:focus {
  border-color: var(--cml-color-current-color, var(--color-primary));
  background: var(--color-surface);
}
/* 編輯面板會把後面段落往下推；用 contenteditable=false 避免影響游標 */

/* 文繞字：套用到 wrapper（編輯器中）。用 class + data-align 雙保險，
   並用 !important 確保不被其他 CSS 蓋掉；align='none' 不渲染 data-align
   屬性，CSS 也不對其產生 float / margin。 */
.ProseMirror .resizable-image.is-align-left,
.ProseMirror .resizable-image[data-align="left"] {
  float: left !important;
  margin: 0.25rem 1.25rem 0.75rem 0 !important;
  clear: left !important;
}
.ProseMirror .resizable-image.is-align-right,
.ProseMirror .resizable-image[data-align="right"] {
  float: right !important;
  margin: 0.25rem 0 0.75rem 1.25rem !important;
  clear: right !important;
}
.ProseMirror .resizable-image.is-align-center,
.ProseMirror .resizable-image[data-align="center"] {
  display: block !important;
  margin: 0.75rem auto !important;
  float: none !important;
  text-align: center !important;
}
/* 無對齊（align=none）→ 強制 block + 換行，圖片自己佔一行、上下都沒文字 */
.ProseMirror .resizable-image:not([data-align]) {
  display: block !important;
  margin: 0.75rem 0 !important;
  float: none !important;
}
</style>
