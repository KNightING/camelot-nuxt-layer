# Input

## Summary

Input（匯入名稱 `CamelotInput`）是泛型文字輸入框，依目前主題渲染 Material、Cupertino、Aqua 或 Sci-Fi 的輸入元件。支援原生 type 與密碼內建顯示切換、金額前置符號，也能切成可輸入加下拉選單或僅選單的模式；四主題最低高度 42px，標題預設由 FieldLabel 畫在框外。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `mark` | `'money'` | — | 前置標記；`money` 顯示金額符號 |
| `disabled` | `boolean` | — | 是否停用 |
| `label` | `string` | — | 標題文字 |
| `required` | `boolean` | — | 是否必填，標題旁顯示星號 |
| `placeholder` | `string` | — | 佔位文字；未給時依 label 產生「請輸入…」 |
| `type` | `CamelotInputType` | `'text'` | 原生 input type：text、password、email、number、tel、url、search |
| `passwordToggle` | `boolean` | `true` | type 為 password 時是否內建顯示／隱藏眼睛鈕 |
| `passwordRevealMode` | `'hide-on-change' \| 'persistent'` | `'hide-on-change'` | 顯示密碼後的維持策略，見下方「密碼顯示」 |
| `labelMode` | `'outside' \| 'floating'` | `'outside'` | 標題呈現方式；只有 Material 有差別，見下方「標題與高度」 |
| `mode` | `'default' \| 'select' \| 'only-select'` | `'default'` | 一般輸入、可輸入加選單、僅選單 |
| `options` | `SelectOptions<T>` | — | 下拉選項 |
| `showOptionOnFocus` | `boolean` | `true` | 聚焦時展開選單 |
| `hideOptionOnBlur` | `boolean` | `false` | 失焦時收起選單 |
| `selectedValue` | `string \| number` | — | 目前選中的選項值，用於高亮 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `input` | `(value?: string \| number)` | 輸入時觸發，debounce 300ms |
| `optionSelected` | `(option: SelectOption<T>)` | 選取下拉選項時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string \| number` | 輸入值 |
| `v-model:isOpen` | `boolean` | 下拉選單是否展開，預設 `false` |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label }` | 自訂標題；Material 在 floating 模式下不渲染此 slot |
| `before` | — | 輸入框前置內容；預設在 mark 為 money 時顯示金額符號 |
| `after` | — | 輸入框後置內容，密碼眼睛鈕接在其後 |
| `options` | `{ options }` | 自訂整段選項清單 |
| `option` | `{ option }` | 自訂單一選項 |
| `empty-options` | — | 無選項時的顯示內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `inputEl` | 目前主題元件內的原生 input，型別 `HTMLInputElement \| null`，供 focus、select 等操作 |

## 運作方式

### 主題分派

Input 本身不含原生 input，而是依主題渲染對應的主題輸入元件：

| 主題 | 渲染元件 |
| :--- | :--- |
| Material | [Material Input](./Material-Input.md) |
| Cupertino | [Cupertino Input](./Cupertino-Input.md) |
| Aqua | [Aqua Input](./Aqua-Input.md) |
| Sci-Fi | [Sci-Fi Input](./Scifi-Input.md) |

1. 四個主題元件各自持有原生 input 並對外公開 inputEl。
2. 同一時間只渲染其中一個，Input 以共用的 template ref 取得後轉成自己的 inputEl。
3. 新增主題元件時必須一併公開 inputEl，否則該主題下 inputEl 會是 null。

來源：1. [Input.vue][]

### 標題與高度

| 主題與模式 | 標題位置 | 最低高度 |
| :--- | :--- | :--- |
| Cupertino、Aqua、Sci-Fi | 框外上方，由 FieldLabel 渲染 | 42px |
| Material，labelMode 為 outside | 框外上方，由 FieldLabel 渲染 | 42px |
| Material，labelMode 為 floating | 框內浮動 label，聚焦或有值時上浮 | 56px |

字級 1rem 設在根節點，外部 CSS 可以覆蓋；字級變大時欄位跟著變高，42px 只是下限。

來源：1. [Input.vue][]　2. [Material/Input.vue][]

### 下拉選單

mode 為 select 或 only-select 時，輸入框下方掛一個下拉選單，最高 250px、超過可捲動。

1. 聚焦時依 showOptionOnFocus 展開，失焦時依 hideOptionOnBlur 收起，點外部一律收起。
2. 展開當下量一次欄位位置，下方空間不足 250px 時改向上展開。
3. 展開期間才監聽視窗捲動與縮放以更新方向，收合後不留監聽。
4. 選取選項時把選項的 label 寫進 v-model、收起選單並觸發 optionSelected。

only-select 模式的原生 input 設為停用且不接收指標事件，只能從選單選取。

來源：1. [Input.vue][]

### 密碼顯示

type 為 password 且 passwordToggle 開啟時，after 區域尾端出現 [PasswordToggle](./Internal-PasswordToggle.md) 眼睛鈕。

| 策略 | 行為 |
| :--- | :--- |
| hide-on-change | 顯示中只要數值異動，立刻切回隱碼 |
| persistent | 維持顯示，直到再按一次眼睛鈕 |

顯示狀態只存在元件內部，實際傳給原生 input 的 type 在顯示中為 text。hide-on-change 直接監看 v-model，不經過有 debounce 的 input 事件。

切換 type 會讓瀏覽器把游標重設到最前面。輸入框原本有焦點時，元件在下一個 macrotask 還原游標與選取範圍，因為 Chromium 要到滑鼠事件的 task 結尾才重設游標。

瀏覽器原生的密碼顯示與清除鈕已在全域樣式關閉，避免與內建眼睛鈕重複。

來源：1. [Input.vue][]　2. [PasswordToggle.vue][]　3. [tailwind.css][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Input.vue | [app/components/Camelot/Input.vue](../../../../app/components/Camelot/Input.vue) |
| Material/Input.vue | [app/components/Camelot/Material/Input.vue](../../../../app/components/Camelot/Material/Input.vue) |
| PasswordToggle.vue | [app/components/Camelot/Internal/PasswordToggle.vue](../../../../app/components/Camelot/Internal/PasswordToggle.vue) |
| tailwind.css | [app/assets/css/tailwind.css](../../../../app/assets/css/tailwind.css) |

[Input.vue]: #references
[Material/Input.vue]: #references
[PasswordToggle.vue]: #references
[tailwind.css]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
