# Expanded

## Summary

Expanded（匯入名稱 `CamelotExpanded`）是可展開、收合的容器：點 header 區切換展開狀態，內容以高度過場平滑展開，底部另有常駐的 footer 區。展開狀態由 v-model:expanded 控制，並對外公開內容區的寬高。Menu 與 Tree 的子層展開都用它做動畫。

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `expanded` | `boolean`，預設 `false` | 是否展開內容 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `header` | — | 標題區，放開指標時切換展開狀態 |
| `default` | — | 展開、收合的內容 |
| `footer` | — | 底部區，不隨展開狀態隱藏 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `contentHeight` | 內容區的高度 |
| `contentWidth` | 內容區的寬度 |

## 運作方式

### 展開動畫

內容包在一格 grid 裡，展開時列高從 0fr 過場到 1fr，歷時 500ms；收合時內容被裁切隱藏，不需要事先知道內容高度。

header 監聽的是 pointerup，滑鼠、觸控與觸控筆放開時都會切換。

來源：1. [Expanded.vue][]

### 尺寸追蹤

公開的寬高由內建的 ResizeObserver 追蹤內容區尺寸。元件不監聽視窗捲動與縮放，因為那些只影響座標、不影響尺寸。

來源：1. [Expanded.vue][]

## 相關頁面

- [Menu](./Menu.md)
- [Tree](./Tree.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Expanded.vue | [app/components/Camelot/Expanded.vue](../../../../app/components/Camelot/Expanded.vue) |

[Expanded.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
