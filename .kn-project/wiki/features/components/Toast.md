# Toast

## Summary

全域通知容器：讀取 useCamelotToast 的通知清單，依九種位置分組堆疊顯示，每張卡片有狀態色、標題與訊息、動作按鈕與關閉鈕，進退場只做淡入淡出。整個 App 通常掛一個即可。匯入名稱為 `CamelotToast`（Nuxt 自動匯入）。

## 運作方式

### 位置與堆疊

1. 通知依位置分組，未指定時為 bottom。
2. 支援 top、bottom、left、right、center、top-left、top-right、bottom-left、bottom-right。
3. 底部三個位置由下往上堆疊，其餘由上往下。
4. center 以頂端錨在畫面中央往下堆疊，新增通知時既有通知不會跳動。
5. 容器只在瀏覽器端渲染，並掛到 body 底下。

來源：1. [Toast.vue][]　2. [useCamelotToast.ts][]

### 狀態色

| 通知設定 | 使用的色彩角色 |
|---|---|
| 有指定 color | 指定的色彩角色 |
| type 為 success、error、warning | 同名的狀態色 |
| type 為 info 或未指定 | primary |

來源：1. [Toast.vue][]

### 外觀

1. 卡片左側有 4px 狀態色邊，卡片底下再疊一層 16% 的狀態色，並加上狀態圓點，讓類型一眼可辨。
2. Aqua 主題的通知卡用 55% 不透明度的 surface 底，比一般玻璃面板更透。
3. 有標題時標題在上、訊息用次要文字色；沒有標題時訊息用主要文字色。
4. 預設動作按鈕的文字跟隨色彩角色；點擊時執行動作並關閉該通知。

來源：1. [Toast.vue][]

### 只做淡入淡出的原因

進場與退場只改透明度，不用位移動畫：元素在 transform 期間，backdrop-filter 取樣會失效，毛玻璃會等動畫結束才突然出現。

透明度套在帶模糊的卡片自身，而不是它的祖先。套在祖先上會把卡片隔離在另一個 backdrop root 裡，模糊取樣不到真正的背景。

進場 300ms、退場 260ms。

來源：1. [Toast.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `zIndex` | `number` | `1000` | 容器 z-index。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ toast, type, color }` | 自訂整張卡片；`type` 未指定時為 `'info'`，`color` 依上表推導。 |
| `action` | `{ toast, run, close }` | 自訂動作區；`run()` 執行動作並關閉，`close()` 移除該通知。 |

## 相關頁面

- [useCamelotToast](../composables/useCamelotToast.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Toast.vue | [app/components/Camelot/Toast.vue](../../../../app/components/Camelot/Toast.vue) |
| useCamelotToast.ts | [app/composables/useCamelotToast.ts](../../../../app/composables/useCamelotToast.ts) |

[Toast.vue]: #references
[useCamelotToast.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
