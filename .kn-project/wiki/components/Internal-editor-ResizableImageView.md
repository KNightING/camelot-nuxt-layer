# Internal editor ResizableImageView

> Tiptap 圖片節點的自訂 NodeView，提供對齊、預設／拖拉縮放寬度、caption/alt 編輯與刪除等浮動工具列。<內部實作>

**匯入名稱**：`CamelotInternalEditorResizableImageView`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `editor` | `Editor`（@tiptap/core） | — | Tiptap 編輯器實例 |
| `node` | `ProseMirrorNode`（@tiptap/core 的 `Node`） | — | 對應的 ProseMirror 節點 |
| `selected` | `boolean` | — | 節點是否被選中 |
| `updateAttributes` | `(attrs: Record<string, unknown>) => void` | — | 更新節點屬性的方法 |
| `deleteNode` | `() => void` | — | 刪除節點的方法 |

## 備註
- 為 Tiptap（@tiptap/vue-3）的 NodeView，屬性沿用 `NodeViewProps`；透過 `NodeViewWrapper` 以 `span` 呈現。
- 從 `node.attrs` 衍生 `align`（`none`/`left`/`right`/`center`）、`width`、`pending`、`caption` 等狀態。
- 對齊採 toggle 行為：再次點擊相同對齊會恢復為 `none`。
- 預設寬度：25%、50%、75%、100%、原始（`null`）；亦可從右下角 handle 拖拉縮放（最小 48px），結束後寫回 `width`。
- caption 編輯會同步寫入 `caption` 與 `alt`；使用本地 ref 避免打字時因重繪失焦。
- 浮動工具列 `Teleport` 到 `body`，並監聽 scroll/resize 與 `ResizeObserver` 更新位置，避免被編輯區 `overflow:hidden` 裁切。
- 僅在 `editor.isEditable` 時顯示工具列、resize handle 與編輯面板。
- 內含全域 `<style>`，影響 ProseMirror DOM 中的 `.resizable-image`（文繞字、對齊、caption 樣式等）。

---
[🏠 Wiki](../index.md)
