# PopupV2

> 可點擊或 hover 開啟的彈出視窗元件，支援自動調整位置與大小、視窗滑動關閉與 Teleport。

**匯入名稱**：`CamelotPopupV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `zIndex` | `number` | — | 彈出層 z-index（預設回退為 `10`） |
| `disabled` | `boolean` | — | 是否停用觸發 |
| `disabledShadow` | `boolean` | — | 關閉陰影 |
| `disabledCloseWhenScrolling` | `boolean` | — | 關閉「window 滑動時自動關閉 popup」 |
| `disabledAutoSpace` | `boolean` | — | 關閉自動調節左右空間 |
| `manual` | `boolean` | — | 手動控制開啟關閉 |
| `verticalPosition` | `'auto' \| 'top' \| 'bottom'` | — | 調整垂直位置 |
| `isClickInside` | `(string \| MaybeElementRef<MaybeElement>)[]` | — | 視為點擊內部（不觸發 click outside 關閉）的元素清單 |
| `disabledClickOutside` | `boolean` | — | 關閉點擊外部自動關閉 |
| `popupWidthMode` | `'fit-content' \| 'min-target' \| 'same-target'` | — | popup 寬度模式 |
| `teleport` | `string \| MaybeElementRef<MaybeElement>` | — | 自訂 Teleport 目標 |
| `popupClass` | `string \| string[] \| Record<string, boolean>` | — | 套用於 popup 容器的 class |
| `triggerMode` | `'click' \| 'hover'` | — | 觸發模式 |
| `hoverDelay` | `number` | — | hover 模式滑鼠移開後延遲關閉時間（ms，預設回退 `200`） |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `open` | `boolean` | 是否開啟（預設 `false`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 觸發用的目標內容 |
| `popup` | — | 彈出視窗內容 |

## 備註
- 使用 `fixed` 定位並透過 `Teleport` 掛載；若目標祖先為 `<dialog>`，會 Teleport 至該 dialog 以避免 top layer 的 z-index 問題。
- 因使用 `fixed` 定位，父元素若設定 `transform`、`perspective`、`filter`、`will-change` 等屬性可能導致定位失效。
- 位置計算依 `useElementBounding` 與 `useWindowSize`；`isBottom`／`isRight` 判斷是否超出視窗以自動翻轉方向。
- 透過 `requestAnimationFrame` 持續更新目標位置；監聽 `visualViewport` 的 scroll／resize 以處理鍵盤彈出等偏移。
- 監聽捲動父層與 window 捲動，於未關閉相關設定時自動關閉 popup。
- hover 模式以原生 `mouseenter`／`mouseleave` 事件實作，並於卸載時清理監聽器與計時器。
- 內容以 `CamelotExpanded` 包裹以取得 `contentWidth`／`contentHeight` 供定位計算。

---
[🏠 Wiki](../index.md)
