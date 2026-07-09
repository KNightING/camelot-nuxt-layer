# Expanded

> 可展開／收合的容器，點擊 header 切換內容，並以 grid-rows 過場動畫平滑展開。

**匯入名稱**：`CamelotExpanded`

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `expanded` | `boolean`（預設 `false`） | 是否展開內容 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `header` | — | 標題區塊，點擊（pointerup）可切換展開狀態 |
| `default` | — | 展開／收合的內容 |
| `footer` | — | 底部區塊 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `contentHeight` | 內容區塊的高度（來自 `useElementBounding`） |
| `contentWidth` | 內容區塊的寬度（來自 `useElementBounding`） |

## 備註
- 展開動畫透過 `grid-rows-[1fr]` 與 `grid-rows-[0fr]` 切換，搭配 500ms 的 cubic-bezier 過場。

---
[🏠 Wiki](../index.md)
