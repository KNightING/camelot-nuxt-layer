# Tooltip

## Summary

提示浮層：滑鼠／觸控筆 hover 顯示、觸控長壓顯示（手指放開即關）、鍵盤 Tab 聚焦（`:focus-visible`）顯示；點擊不觸發。浮層自行找空間——偏好上方、不足時翻到下方，水平置中並夾進視窗內，四主題外觀。

**匯入名稱**：`CamelotTooltip`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `content` | `string` | `''` | 純文字內容；富內容改用 `#content` slot |
| `placement` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | `auto` 偏好上方，上方不夠且下方較寬時翻到下方 |
| `openDelay` | `number` | `150` | hover 開啟延遲（ms） |
| `longPressDuration` | `number` | `500` | 觸控長壓多久顯示（ms） |
| `offset` | `number` | `6` | 與觸發元素的距離（px） |
| `disabled` | `boolean` | `false` | 停用 |
| `zIndex` | `number` | `var(--cml-z-popup)` | 浮層 z-index（[疊層刻度](../layering.md)） |
| `block` | `boolean` | `false` | 觸發器改 `block min-w-0` 排版（預設 `inline-block`），供內含 `truncate` 文字需撐滿寬度的情境 |
| `onlyWhenTruncated` | `boolean` | `false` | 只在觸發器（或其直接子元素）`scrollWidth − clientWidth > 1` 時才顯示；用於截斷文字的完整內容提示 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 觸發元素 |
| `content` | — | 浮層富內容（優先於 `content` prop） |

## 備註
- **觸發**：`pointerenter`（非 touch）延遲後開、`pointerleave` 關；touch `pointerdown` 計時長壓，`pointerup`／`pointercancel`／滑動超過 10px 即取消並關閉；長壓期間 `contextmenu.prevent` 抑制系統長壓選單。`focusin` 只在 `e.target.matches(':focus-visible')` 時開，避免點擊造成的 focus 讓它變成「點一下就出現」。
- **定位**：開啟期間以 `requestAnimationFrame` 每幀重算（觸發元素可能因捲動、動畫、版面重排而位移）。以 `visualViewport` 為邊界（行動裝置鍵盤彈出時才是真正可視範圍），8px 邊距。
- **Teleport**：經 [useCamelotTeleportTarget](../composables/useCamelotTeleportTarget.md) 進最近的 `<dialog>`，否則會被 top layer 壓住；帶 `data-camelot-popup` 讓 [BaseDialogV2](./BaseDialogV2.md) 不把它當遮罩點擊。
- **a11y**：浮層 `role="tooltip"`，開啟時觸發器加 `aria-describedby`。
- 用例：[Internal/Calendar](./Internal-Calendar.md) 日期 label 截斷時以 `block` + `onlyWhenTruncated` 顯示完整文字。

---
[🏠 Wiki](../../index.md)
