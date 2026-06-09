import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ResizableImageView from './ResizableImageView.vue'

/** 圖片對齊／文繞字模式 */
export type ImageAlign = 'none' | 'left' | 'right' | 'center'

/**
 * 擴充 Tiptap 預設 Image：
 *  - `width` 屬性（字串，例如 "320px" / "60%"）→ HTML 序列化為 style="width:..."
 *  - `align` 屬性（none/left/right/center）→ HTML 序列化為 data-align="..."
 *  - `pending` 屬性（"1" or null）→ HTML 序列化為 data-pending="1"（沿用既有上傳暫存機制）
 *  - 內部使用 camelCase key，避免 ProseMirror 對 hyphen 屬性的不穩定行為
 *  - 用 Vue NodeView 提供 corner resize handle + 對齊工具列
 */
export const ResizableImage = Image.extend({
  name: 'image',
  inline: true,
  group: 'inline',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          const style = (el as HTMLElement).style?.width
          if (style) return style
          const attr = el.getAttribute('width')
          return attr ? (attr.endsWith('%') ? attr : `${parseInt(attr, 10)}px`) : null
        },
        renderHTML: (attrs) => {
          if (!attrs.width) return {}
          return { style: `width: ${attrs.width}` }
        },
      },
      align: {
        default: 'none',
        parseHTML: el => (el as HTMLElement).getAttribute('data-align') || 'none',
        renderHTML: (attrs) => {
          if (!attrs.align || attrs.align === 'none') return {}
          return { 'data-align': attrs.align }
        },
      },
      pending: {
        default: null,
        parseHTML: el => (el as HTMLElement).getAttribute('data-pending'),
        renderHTML: (attrs) => {
          if (!attrs.pending) return {}
          return { 'data-pending': attrs.pending }
        },
      },
      caption: {
        default: null,
        parseHTML: el => (el as HTMLElement).getAttribute('data-caption'),
        renderHTML: (attrs) => {
          if (!attrs.caption) return {}
          return { 'data-caption': attrs.caption }
        },
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ResizableImageView)
  },
})
