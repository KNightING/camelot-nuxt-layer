# TagGroup

> 可新增/刪除的標籤群組，支援行內輸入、去重、鎖定項與數量上限。

**匯入名稱**：`CamelotTagGroup`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `color` | `CamelotColorRole` | `'primary'` | 群組預設顏色；逐項可用物件 `item.color` 覆寫 |
| `variant` | `CamelotTagVariant` | `'soft'` | 群組預設外觀；逐項可用物件 `item.variant` 覆寫 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `disabled` | `boolean` | `false` | 整組停用：隱藏新增按鈕並移除刪除鈕 |
| `addable` | `boolean` | `true` | 是否顯示新增按鈕 |
| `allowDuplicate` | `boolean` | `false` | 是否允許重複值 |
| `continuousAdd` | `boolean` | `true` | 連續新增模式：true 新增後維持輸入；false 新增一個即關閉輸入框 |
| `max` | `number` | - | 最多可新增的標籤數，`undefined` 表示不限制 |
| `placeholder` | `string` | `'新增標籤…'` | 輸入框 placeholder |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `add` | `value: string` | 新增一個標籤時觸發 |
| `remove` | `value: string, index: number` | 移除一個標籤時觸發 |
| `change` | `values: CamelotTagInput[]` | 群組內容變動（新增/移除）時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `CamelotTagInput[]` | 標籤清單（純字串或物件；預設 `[]`） |

## 備註
- 逐項可為純字串或物件；物件可帶 `label` / `color` / `variant` / `locked`，未給則沿用群組預設。
- `locked: true` 的項目不可刪除（無關閉鈕、Backspace 也不會移除）。
- 輸入框為空時按 Backspace 會移除最後一個標籤（鎖定項除外）。
- 按 Enter 提交、Esc 取消、blur 亦視為提交。
- 已達 `max` 時隱藏新增按鈕，且新增後自動關閉輸入框。
- 非 `allowDuplicate` 時，輸入重複值會清空輸入但不新增。

---
[🏠 Wiki](../index.md)
