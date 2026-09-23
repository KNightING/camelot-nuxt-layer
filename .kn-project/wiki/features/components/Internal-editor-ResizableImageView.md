# ResizableImageView

## Summary

ResizableImageView（匯入名稱 `CamelotInternalEditorResizableImageView`）是 [RichTextEditor](./RichTextEditor.md) 圖片節點的 Tiptap NodeView，屬內部元件。圖片被選中時浮出工具列，可調整對齊、套用預設寬度或拖拉縮放、刪除圖片，並在圖下方編輯說明文字，說明同時作為替代文字。

## Props

props 直接採用 Tiptap 的 NodeViewProps，由 NodeView 渲染器傳入，常用的欄位如下：

| Prop | 型別 | 說明 |
| :--- | :--- | :--- |
| `editor` | `Editor` | Tiptap 編輯器實例 |
| `node` | ProseMirror 節點 | 圖片節點，屬性含 align、width、caption、pending |
| `selected` | `boolean` | 節點是否被選中 |
| `updateAttributes` | `(attrs: Record<string, unknown>) => void` | 更新節點屬性 |
| `deleteNode` | `() => void` | 刪除節點 |

## 運作方式

### 浮動工具列

工具列只在編輯器可編輯且圖片被選中時出現。

| 操作 | 行為 |
| :--- | :--- |
| 對齊 | 靠左文繞圖、置中、靠右文繞圖；再點一次同一個對齊恢復為不對齊 |
| 取消對齊 | 恢復一般圖片，不文繞圖 |
| 預設寬度 | 25%、50%、75%、100%，或「原始」清除寬度 |
| 重設寬度 | 清除寬度，恢復自動 |
| 刪除 | 刪除整個圖片節點 |

工具列掛到 body，避免被編輯區的裁切容器切掉。

1. 預設放在圖片上方，上方空間不足時改放下方。
2. 水平置中對齊圖片，並夾在視窗內。
3. 顯示期間監聽視窗捲動、縮放與圖片尺寸變化，隱藏後解除。

來源：1. [ResizableImageView.vue][]

### 拖拉縮放

圖片被選中時右下角出現縮放把手。

1. 按住把手往右拖變寬、往左拖變窄，最小 48px。
2. 拖曳中只改畫面上的寬度。
3. 放開時把最終寬度寫回節點的 width 屬性。

來源：1. [ResizableImageView.vue][]

### 圖片說明

1. 圖片有說明時，無論是否選中都顯示在圖下方。
2. 選中圖片，或焦點在說明編輯框內時，顯示編輯框。
3. 輸入時同步寫入節點的說明與替代文字；清空時兩者都移除。
4. 編輯框使用本地狀態，打字時不因節點重繪而失焦；外部改動說明時，只在編輯框沒有焦點時同步回來。

來源：1. [ResizableImageView.vue][]

### 節點屬性與樣式

pending 屬性會輸出成 data-pending，沿用既有的上傳暫存機制。元件內含全域樣式，控制編輯區內圖片的文繞圖、對齊與說明外觀。

來源：1. [ResizableImageView.vue][]　2. [resizable-image.ts][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ResizableImageView.vue | [app/components/Camelot/Internal/editor/ResizableImageView.vue](../../../../app/components/Camelot/Internal/editor/ResizableImageView.vue) |
| resizable-image.ts | [app/components/Camelot/Internal/editor/resizable-image.ts](../../../../app/components/Camelot/Internal/editor/resizable-image.ts) |

[ResizableImageView.vue]: #references
[resizable-image.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
