# Aqua Radio

> Aqua 風格的單選圓鈕元件，支援可取消選取。此為 Aqua 主題實作，通常由單選群組元件依主題載入。

**匯入名稱**：`CamelotAquaRadio`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `deselectable` | `boolean` | `false` | 是否允許點擊已選取項目以取消選取（非必填情境） |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否選取 |

## 備註
- 選取時套用 `aqua-fill`，否則為 `aqua-track`。
- 內部白色圓點以滿版加 `scale` 縮放呈現，避免非整數 DPR 下的半像素偏移。
- 停用時忽略點擊；當已選取且 `deselectable` 為 `false` 時，再次點擊不會取消選取。

---
[🏠 Wiki](../index.md)
