# CascadeMenuPanel

## Summary

CascadeMenuPanel（匯入名稱 `CamelotInternalCascadeMenuPanel`）是 [CascadeMenu](./CascadeMenu.md) 串聯選單的單層面板，屬內部元件。每層面板各自飛出定位，展開中的子項再遞迴渲染下一層面板；它負責子選單的 hover 或 click 開合、越界翻轉，以及 hover 模式下跨層的延遲收合。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `CamelotCascadeMenuItem[]` | — | 本層選單項目，可含分隔線 |
| `anchor` | `HTMLElement \| null` | — | 定位錨點：根面板為觸發器，子面板為父列 |
| `level` | `number` | — | 層級深度，疊加在 z-index 上 |
| `placement` | `'root' \| 'submenu'` | — | 根面板貼觸發器下緣，子面板出現在父列右側 |

## 運作方式

### 共用設定

面板從 CascadeMenu 注入的 context 取得選取函式、最大高度、子選單觸發方式、開啟與收合延遲、基礎層級，並向它註冊自己的 DOM，讓外部點擊判斷能涵蓋所有層。

選項區最大高度取設定值與「視窗高減 16px」的較小者，超過時內部捲動。

來源：1. [CascadeMenuPanel.vue][]　2. [cascadeMenu.ts][]

### 子選單開合

| 觸發方式 | 含子項的列 | 葉節點列 |
| :--- | :--- | :--- |
| hover | 滑入後等開啟延遲才展開；點擊不收合也不關閉選單 | 滑入時收起同層已展開的子選單；點擊即選取 |
| click | 點擊切換展開 | 點擊即選取 |

停用的列不回應滑入與點擊。

來源：1. [CascadeMenuPanel.vue][]

### 跨層延遲收合

每層面板都 Teleport 出去，子面板在 DOM 上不是父面板的後代，所以滑鼠移進子面板時父面板必定收到 mouseleave。為了不誤收，每層會向子面板提供一組取消收合、排定收合的函式。

1. 滑出某層面板時，排定收合本層的子選單，並通知祖先各自排定收合。
2. 滑入子面板時，沿祖先鏈逐層取消待收合。
3. 移進子面板的情況下，第 2 步緊接在第 1 步之後發生，整條鏈都不會收起。
4. click 模式下這兩個處理器直接略過。

來源：1. [CascadeMenuPanel.vue][]

### 定位

面板經 [useCamelotTeleportTarget](../composables/useCamelotTeleportTarget.md) 送進最近的 dialog，沒有則送到 body，以 fixed 定位。

1. 掛載當下同步量測錨點並凍結位置，首幀即正確；量到之前先隱藏，避免在左上角閃一下。
2. 視窗縮放時重新量測；捲動時整個選單會關閉，所以不監聽捲動。
3. 根面板右側不足時改為右對齊觸發器，下方不足時翻到上方。
4. 子面板右側不足時翻到左側，下方不足時往上移進視窗。

層級未指定基礎值時為 popup 層級加上 level，每深一層高一級。

來源：1. [CascadeMenuPanel.vue][]

### 外觀

| 主題 | 面板表面 |
| :--- | :--- |
| Aqua | 共用玻璃面板 |
| Sci-Fi | 直角、半透明深底、角色色細框與等寬字 |
| Cupertino | 半透明表面加背景模糊 |
| Material | 表面色、細框與陰影 |

列的選中與懸停效果與 SelectV2 的選項共用同一套主題樣式，展開中的父列以選中樣式呈現。

來源：1. [CascadeMenuPanel.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| CascadeMenuPanel.vue | [app/components/Camelot/Internal/CascadeMenuPanel.vue](../../../../app/components/Camelot/Internal/CascadeMenuPanel.vue) |
| cascadeMenu.ts | [app/types/cascadeMenu.ts](../../../../app/types/cascadeMenu.ts) |

[CascadeMenuPanel.vue]: #references
[cascadeMenu.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
