# SheetHandle

## Summary

SheetHandle（匯入名稱 `CamelotInternalSheetHandle`）是底部面板頂端的拖曳把手，屬內部元件：熱區 44px 高、關閉瀏覽器觸控手勢、游標呈抓取狀，中間依主題畫出指示條。它本身不含拖曳邏輯，由 [BaseBottomSheetV2](./BaseBottomSheetV2.md) 監聽它的 pointerdown 開始手勢關閉。

## 運作方式

### 熱區

1. 熱區高 44px，符合觸控最小目標，視覺上只畫中間的指示條。
2. 關閉瀏覽器觸控手勢，拖曳不會被當成頁面捲動。
3. 以負上邊距往上延伸，貼齊面板頂端。

| 無障礙屬性 | 值 |
| :--- | :--- |
| role | button |
| tabindex | 0 |
| aria-label | 拖曳關閉 |

來源：1. [SheetHandle.vue](../../../../app/components/Camelot/Internal/SheetHandle.vue)

### 指示條

| 主題 | 尺寸 | 顏色 |
| :--- | :--- | :--- |
| Sci-Fi | 48 × 4px | 30% 主色 |
| Cupertino | 40 × 6px | 50% 灰 |
| Aqua | 40 × 6px | 20% 前景色 |
| Material | 32 × 4px | 次要外框色 |

來源：1. [SheetHandle.vue](../../../../app/components/Camelot/Internal/SheetHandle.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
