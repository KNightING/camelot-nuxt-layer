# CarouselIndicator

> 輪播指標（圓點）元件，當前點呈膠囊狀凸顯，可點擊切換。

**匯入名稱**：`CamelotCarouselIndicator`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `total` | `number` | — | 指標數量 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `gap` | `number` | `8` | 點與點間距（px） |
| `size` | `number` | `8` | 點尺寸（px） |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number` | 目前選中的索引（預設 `0`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `dot` | `{ index, active, go }` | 自訂單一指標點；`go` 為切換至指定索引的函式 |

## 備註
- 角色色彩由 `useCamelotRoleColorClass` 套用；`themeMode` 為 scifi 時當前點附帶發光陰影。
- 當前點於水平方向加寬、垂直方向加高（約 2.2 倍尺寸）呈膠囊感。

---
[🏠 Wiki](../index.md)
