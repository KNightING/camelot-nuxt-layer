# Drawer

## Summary

側邊抽屜元件，支援浮動（floating）遮罩滑入與固定（fixed）行內展開兩種型態。

**匯入名稱**：`CamelotDrawer`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `position` | `'left' \| 'right'` | `'left'` | 抽屜出現的位置 |
| `variant` | `'floating' \| 'fixed'` | `'floating'` | 型態：浮動（Teleport + 遮罩滑入）或固定（行內佔位、寬度展開/收合） |
| `width` | `string` | `'320px'` | 抽屜寬度 |
| `closeByMask` | `boolean` | `true` | 是否可透過點擊遮罩或按 Esc 關閉 |
| `zIndex` | `number` | `undefined` | 浮動型態的容器層級；未指定時回落到疊層刻度的 `--cml-z-drawer`（見 [Layering](../layering.md)）。調高超過 `--cml-z-popup` 會讓 Drawer 內的 Select / Popup 被面板蓋住 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `close` | — | 透過遮罩點擊或 Esc 關閉時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `open` | `boolean`（預設 `false`） | 抽屜是否開啟 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `header` | — | 抽屜頂部區塊 |
| `default` | — | 抽屜主要內容（可捲動） |
| `footer` | — | 抽屜底部區塊 |

## 備註
- 面板樣式依 `useCamelotTheme()` 的 `themeMode` 而異：`aqua`（半透明玻璃模糊）、`scifi`（光暈陰影）、`cupertino`（一般陰影）與其他預設值。
- 浮動型態開啟時會鎖定 `body` 捲動；卸載前會還原。多層 Drawer 共用一個模組層級的計數器，只有全部關閉才解除鎖定——否則關掉內層會把外層的鎖一併清掉，背景又能捲動。
- 浮動型態支援 Esc 關閉（需 `closeByMask` 為 `true`）。
- 尊重 `prefers-reduced-motion`，減少動態時停用過場動畫。

---
[🏠 Wiki](../../index.md)
