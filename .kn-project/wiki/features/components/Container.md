# Container

## Summary

Container 是帶 Camelot 自訂捲軸的容器，匯入名稱 `CamelotContainer`（Nuxt 自動匯入）。它撐滿父層可用空間，並把內容包進 [Scrollbar](./Scrollbar.md) 的捲動區域，可切換為水平捲動。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `horizontal` | `boolean` | — | 是否開啟水平滾動模式 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 容器內容 |

## 運作方式

1. 外層以 grid 撐滿父層寬高，並允許在 flex 版面中縮小，捲動才會發生在容器內。
2. 內層使用 Scrollbar，並把 `horizontal` 原樣傳下去。

來源：1. [Container.vue](../../../../app/components/Camelot/Container.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
