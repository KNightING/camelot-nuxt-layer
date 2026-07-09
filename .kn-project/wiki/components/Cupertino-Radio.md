# CupertinoRadio

> Cupertino（iOS）風格的單選圓鈕視覺實作。內部主題實作，通常由 `CamelotRadio` 依主題選用。

**匯入名稱**：`CamelotCupertinoRadio`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用。 |
| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境）。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 選取狀態切換時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否為選取狀態。 |

## 備註
- `toggle` 於停用時不作用；已選取且非 `deselectable` 時再次點擊不會取消。
- 選取時填滿 `--cml-color-current-color`，內部白點以 `scale-[0.4]` 呈現。

---
[🏠 Wiki](../index.md)
