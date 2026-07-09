# SlideTransitionGroup

> 以左右滑動轉場切換單一顯示項目的容器，支援上一項／下一項導覽。

**匯入名稱**：`CamelotSlideTransitionGroup`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `Items<T>` | — | 項目清單（泛型 `T`），每項需含 `key` 與 `data` |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number` | 目前顯示項目的索引（預設 `0`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, data, index }` | 目前項目、其 `data` 與索引 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `prev` | 切換至上一項（索引減 1，向右滑入） |
| `next` | 切換至下一項（索引加 1，向左滑入） |

## 備註
- 使用 `TransitionGroup` 搭配 `slide-left` / `slide-right` 轉場名稱。
- `prev` 於索引 `<= 0`、`next` 於索引 `>= items.length` 時不作動。

---
[🏠 Wiki](../index.md)
