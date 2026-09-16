# Input

## Summary

泛型輸入框，依主題（material/scifi/cupertino/aqua）渲染對應風格，支援原生 `type`（含密碼內建顯示切換）與下拉選單選取模式。

**匯入名稱**：`CamelotInput`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `border` | `boolean` | `true` | 是否顯示邊框 |
| `size` | `'small' \| 'basic'` | `'basic'` | 尺寸 |
| `mark` | `'money'` | — | 前置標記；`money` 顯示 `$` 符號 |
| `disabled` | `boolean` | — | 是否停用 |
| `label` | `string` | — | 標籤文字 |
| `required` | `boolean` | — | 是否必填 |
| `placeholder` | `string` | — | 佔位文字；未給時依 `label` 產生「請輸入…」 |
| `type` | `CamelotInputType` | `'text'` | 原生 input type（`text`/`password`/`email`/`number`/`tel`/`url`/`search`），下傳至四主題子元件 |
| `passwordToggle` | `boolean` | `true` | `type='password'` 時是否在 `after` 區域內建顯示/隱藏眼睛鈕（`Internal/PasswordToggle`） |
| `passwordRevealMode` | `'hide-on-change' \| 'persistent'` | `'hide-on-change'` | 顯示密碼後的維持策略：`hide-on-change` 數值一異動即自動切回隱碼；`persistent` 保持顯示直到再次點擊 |
| `mode` | `'default' \| 'select' \| 'only-select'` | `'default'` | 模式：一般輸入 / 可輸入＋選單 / 僅選單 |
| `options` | `SelectOptions<T>` | — | 下拉選項 |
| `showOptionOnFocus` | `boolean` | `true` | 聚焦時展開選單 |
| `hideOptionOnBlur` | `boolean` | `false` | 失焦時收起選單 |
| `selectedValue` | `string \| number` | — | 目前選中的選項值（用於高亮） |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `input` | `(value?: string \| number)` | 輸入時觸發（debounce 300ms） |
| `optionSelected` | `(option: SelectOption<T>)` | 選取下拉選項時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string \| number` | 輸入值 |
| `v-model:isOpen` | `boolean` | 下拉選單是否展開（預設 `false`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | `{ label }` | 自訂標籤（material 模式除外，由內部輸入元件處理） |
| `before` | — | 輸入框前置內容；預設在 `mark='money'` 時顯示 `$` |
| `after` | — | 輸入框後置內容（密碼眼睛鈕接在此 slot 之後） |
| `options` | `{ options }` | 自訂整段選項清單 |
| `option` | `{ option }` | 自訂單一選項 |
| `empty-options` | — | 無選項時的顯示內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `inputEl` | 當前主題子元件內的原生 `<input>`（`HTMLInputElement \| null`），供 `focus()` / `select()` 等操作 |

## 備註
- 依 `themeMode` 分別渲染 `CamelotScifiInput` / `CamelotCupertinoInput` / `CamelotAquaInput` / `CamelotMaterialInput`。
- `CamelotInput` 本身不含 `<input>`：四個主題子元件各自持有原生 input 並 `defineExpose({ inputEl })`，父元件以共用的 `themeInput` template ref（同時間只渲染一個）取得後轉接為對外的 `inputEl`。新增主題子元件時務必一併 expose，否則該主題下 `inputEl` 會是 `null`。
- 選單依 `target` 底部位置與視窗高度自動判斷向上或向下展開；該位置只在選單展開期間追蹤（展開當下量測一次，並於展開期間才掛載 window 的 scroll／resize 監聽），收合後不留任何監聽。
- 使用 `onClickOutside` 於點擊外部時關閉選單。
- 選取選項時將 `model` 設為 `option.label` 並關閉選單。
- **密碼顯示**：顯示狀態只在元件內部維持，實際下傳的是 `effectiveType`（顯示中為 `text`）。`hide-on-change` 以 `watch(model)` 實作（`onInput` 有 300ms debounce，不可用）。切換 type 會讓瀏覽器把游標重設到最前面，元件在 input 已聚焦時於下一個 macrotask 還原原本的游標／選取位置（Chromium 在真實滑鼠互動的 task 結尾才重設，`nextTick` 太早）。
- 瀏覽器原生的密碼眼睛／清除鈕（Edge `::-ms-reveal` / `::-ms-clear`）已在 `tailwind.css` `@layer base` 全域關閉，避免與內建眼睛重複。

---
[🏠 Wiki](../../index.md)
