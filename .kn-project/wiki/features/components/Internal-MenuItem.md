# MenuItem

## Summary

MenuItem（匯入名稱 `CamelotInternalMenuItem`）是 [Menu](./Menu.md) 側邊選單的單一項目，屬內部元件。有子項時點擊切換展開，並遞迴渲染下一層項目；沒有子項時點擊即選取。選中、祖先與一般狀態各有外觀，選中樣式依主題而異。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `item` | `CamelotMenuItem` | — | 選單項目資料 |
| `level` | `number` | `0` | 層級深度；第 0 層字重較重，其他層文字較淡 |

本元件沒有插槽，項目內容固定為文字與展開箭頭。

## 運作方式

### 點擊與狀態

選中、祖先、展開等判斷都由 Menu 注入的 context 提供，項目本身不存狀態。

| 狀態 | 外觀 |
| :--- | :--- |
| 選中 | 依主題的選中樣式，見下表 |
| 選中項目的祖先 | 中等字重、角色色文字 |
| 一般 | 懸停時淡底 |
| 停用 | 半透明、不可點 |

有子項時右側顯示箭頭，展開時轉 90 度；子層以 [Expanded](./Expanded.md) 做展開動畫。

來源：1. [MenuItem.vue][]　2. [menu.ts][]

### 選中樣式

| 主題 | 選中樣式 |
| :--- | :--- |
| Aqua | 角色色實心填色 |
| Sci-Fi | 18% 角色色底、角色色文字與光暈 |
| Cupertino | 10% 角色色底、粗體角色色文字 |
| Material | 10% 角色色底、中等字重角色色文字 |

來源：1. [MenuItem.vue][]

### 階層導引線

子層向右縮排，左側畫一條垂直導引線，止於最後一個子項的中線，並以 L 形轉角指向它。子層保留內距，讓選中項的陰影不被裁切。

來源：1. [MenuItem.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| MenuItem.vue | [app/components/Camelot/Internal/MenuItem.vue](../../../../app/components/Camelot/Internal/MenuItem.vue) |
| menu.ts | [shared/types/menu.ts](../../../../shared/types/menu.ts) |

[MenuItem.vue]: #references
[menu.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
