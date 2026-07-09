# CascadeMenuPanel

> 串聯（多層）選單的單層面板，內部實作，遞迴渲染子選單並負責飛出定位。

**匯入名稱**：`CamelotInternalCascadeMenuPanel`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `CamelotCascadeMenuItem[]` | — | 本層選單項目 |
| `anchor` | `HTMLElement \| null` | — | 定位錨點元素（觸發器或父列） |
| `level` | `number` | — | 層級深度（用於 z-index 疊加） |
| `placement` | `'root' \| 'submenu'` | — | 定位方式：根面板貼觸發器下緣 / 子面板出現在列右側 |

## 備註
- 為內部元件，透過 `CAMELOT_CASCADE_MENU_KEY` 注入 `CamelotCascadeMenuContext`（提供 select、maxHeight、submenuTrigger、openDelay、baseZIndex、註冊面板等）。
- 子選單開合支援 hover 延遲（`openDelay`）與 click 切換兩種觸發模式。
- 使用 `Teleport` 至 body 並以 `fixed` 定位；掛載與 `resize` 時量測一次並凍結位置，避免抖動或飛到左上角。
- 定位越界時自動翻轉：根面板右/下不足時翻轉，子面板右側不足翻左、下方不足上移。
- 外觀依 `themeMode`（aqua/scifi/cupertino/default）套用不同表面樣式。
- 每層透過 `<CamelotInternalCascadeMenuPanel>` 遞迴渲染展開中的子項。

---
[🏠 Wiki](../index.md)
