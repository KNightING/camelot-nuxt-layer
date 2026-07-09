# Input

> 泛型輸入框，依主題（material/scifi/cupertino/aqua）渲染對應風格，並支援下拉選單選取模式。

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
| `after` | — | 輸入框後置內容 |
| `options` | `{ options }` | 自訂整段選項清單 |
| `option` | `{ option }` | 自訂單一選項 |
| `empty-options` | — | 無選項時的顯示內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `inputEl` | 內部 input 元素的 template ref |

## 備註
- 依 `themeMode` 分別渲染 `CamelotScifiInput` / `CamelotCupertinoInput` / `CamelotAquaInput` / `CamelotMaterialInput`。
- 選單依 `target` 底部位置與視窗高度自動判斷向上或向下展開。
- 使用 `onClickOutside` 於點擊外部時關閉選單。
- 選取選項時將 `model` 設為 `option.label` 並關閉選單。

---
[🏠 Wiki](../index.md)
