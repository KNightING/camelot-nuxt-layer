# Internal SheetHandle

## Summary

BottomSheet 頂部的拖曳把手：44px 高熱區、`touch-action: none`、`cursor: grab`，依主題畫出對應樣式的指示條；本身不含拖曳邏輯，由 [BaseBottomSheetV2](./BaseBottomSheetV2.md) 監聽其 `pointerdown` 起手。內部（Internal）實作。

**匯入名稱**：`CamelotInternalSheetHandle`

## 備註
- `role="button"`、`tabindex="0"`、`aria-label="拖曳關閉"`。
- 指示條尺寸／顏色沿用各主題原本的裝飾條（scifi `bg-primary/30`、cupertino `bg-slate-400/50`、aqua `bg-on-surface/20`、material `bg-outline-variant`）。

---
[🏠 Wiki](../../index.md)
