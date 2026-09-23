# BaseDialogV2

## Summary

BaseDialogV2 是以原生 dialog 元素為基底的模態對話框，匯入名稱 `CamelotBaseDialogV2`。它依當前主題提供四種內容框，支援點遮罩或按 Esc 關閉，並可把開關狀態同步到網址查詢字串。本元件不提供內建關閉按鈕，需要標準按鈕列時改用 [ConfirmDialog](./ConfirmDialog.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `closeByMask` | `boolean` | `true` | 點擊遮罩（內容框之外）或按 Esc 是否關閉 |
| `backdropProgress` | `number` | `0` | 遮罩褪去進度 0–1，遮罩不透明度為 1 減進度；[BaseBottomSheetV2](./BaseBottomSheetV2.md) 拖曳時回寫 |
| `backdropImmediate` | `boolean` | `false` | 為 true 時關閉遮罩 transition，讓進度逐幀即時反映（拖曳中） |
| `tag` | `string` | — | 對話框 id；亦作為預設的網址查詢字串值 |
| `zIndex` | `number` | — | 對話框 z-index |
| `query` | `CamelotDialogQuery` | — | 自訂網址查詢字串同步設定（優先於 `tag`） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `cancel` | — | 透過遮罩或 Esc 關閉時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:open` | `boolean` | 是否開啟（預設 `false`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `wrapper` | — | 覆寫整個全螢幕置中容器；自訂後遮罩判斷改為點在 dialog 本身 |
| `default` | — | 對話框內容（置於各主題內容框內） |

## 運作方式

### 開啟與關閉

1. 開啟時呼叫原生 showModal，產生背景遮罩並進入 top layer。
2. 依主題呈現內容框：scifi 四角框、cupertino、aqua 毛玻璃，其他一律 material。
3. 關閉時先播淡出動畫，延遲 400ms 再關閉原生 dialog。
4. 開啟期間鎖定頁面捲動；全站保留捲軸空間，所以鎖定時版面寬度不跳動。

`closeByMask` 設為 false 會連帶停用 Esc 關閉，用於強制決策的對話框；此時使用端必須自行提供關閉途徑。

來源：1. [BaseDialogV2.vue][]　2. [tailwind.css][]

### 遮罩點擊判斷

點在本對話框的內容框之外就關閉並送出 cancel，但以下情形先排除：

| 情形 | 為什麼排除 |
|---|---|
| 點在帶 popup 標記的浮層內 | [PopupV2](./PopupV2.md) 把浮層傳送進本對話框，位置落在內容框外，不排除會選不到選項 |
| 事件目標已脫離文件 | 巢狀對話框選取後先被移除，外層才收到事件，會被誤判成點遮罩 |
| 點在巢狀對話框內 | 交由內層自行處理遮罩與關閉 |
| 內容框屬於巢狀對話框 | 只認屬於本對話框的內容框；否則自訂外層的 Sheet 會誤用內層的內容框而整個被關掉 |

來源：1. [BaseDialogV2.vue][]

### 網址同步

1. 設定 `tag` 或 `query` 後才啟用。
2. 開啟時 push 查詢字串，並附帶 isDialog 為 true。
3. 關閉時若能返回上一頁就 back，否則 replace 移除這兩個查詢參數。
4. 監聽路由變化反向同步開關：查詢字串符合就開啟，否則關閉。

來源：1. [BaseDialogV2.vue][]

### 裁切方式

對話框用 clip 而非 hidden 裁切溢出。GPU transform 讓對話框成為內部固定定位元素的定位基準，例如 BottomSheet 的面板；hidden 仍是可捲動容器，showModal 自動聚焦時會把內容往上捲，Sheet 就浮離視窗底部。clip 不建立捲動容器，捲動位置恆為 0。

來源：1. [BaseDialogV2.vue][]

## 相關頁面
- [Drawer](./Drawer.md)：另一個鎖定頁面捲動的元件

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| BaseDialogV2.vue | [app/components/Camelot/BaseDialogV2.vue](../../../../app/components/Camelot/BaseDialogV2.vue) |
| tailwind.css | [app/assets/css/tailwind.css](../../../../app/assets/css/tailwind.css) |

[BaseDialogV2.vue]: #references
[tailwind.css]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
