# ImageV2

> 具懶載入、載入骨架、錯誤插槽的圖片元件，並可在滑鼠懸停時顯示大圖預覽。

**匯入名稱**：`CamelotImageV2`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `src` | `string` | — | 圖片來源網址 |
| `fullSrc` | `string` | — | 懸停顯示大圖時的來源網址（未提供時使用 `src`） |
| `alt` | `string` | — | 替代文字 |
| `hoverShowFullImage` | `boolean` | `false` | 是否於懸停時顯示大圖預覽 |
| `width` | `number` | — | 圖片寬度（px） |
| `height` | `number` | — | 圖片高度（px） |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'scale-down'` | 圖片填充方式 |
| `immediate` | `boolean` | `false` | 是否立即載入，不等待進入視窗 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `loaded` | `image: HTMLImageElement` | 圖片載入完成時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `error` | — | 載入錯誤時顯示的內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `isLoading` | 是否載入中 |
| `isError` | 是否載入失敗 |
| `isReady` | 是否已載入完成 |

## 備註
- 透過 `useLazyImage` 管理載入狀態；以 `useIntersectionObserver`（threshold 0.5）在進入視窗時觸發載入，載入後停止觀察。
- 載入中顯示 `CamelotSkeleton`，錯誤時渲染 `error` 插槽，成功時渲染 `img` 並套用 `$attrs`。
- 懸停大圖以 `Teleport` 至 `body`，位置依 `useElementBounding` 計算並夾在視窗範圍內；懸停延遲約 400ms 顯示、離開約 100ms 隱藏。
- 未帶 `src` 的 `img` 由 `$attrs` 透傳（`inheritAttrs` 未特別設定）。

---
[🏠 Wiki](../index.md)
