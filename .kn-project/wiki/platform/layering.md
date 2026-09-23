# 疊層刻度

## Summary

Camelot 的疊層刻度（Layering）讓 Drawer、BottomSheet、Popup 等浮動元件以一組具名 CSS 變數 `--cml-z-*` 決定 z-index，而不是各自硬編碼數字。刻度定義在全域樣式表的一般 `:root`，元件一律以 `var(--cml-z-*)` 引用。浮層要在原生 dialog 內可見，還必須先 teleport 進該對話框，層級只在同一堆疊脈絡內才有意義。

## 運作方式

### 刻度

| 變數 | 值 | 使用者 |
| :--- | ---: | :--- |
| `--cml-z-drawer` | 50 | [Drawer](../features/components/Drawer.md) floating 模式的 Teleport 容器 |
| `--cml-z-sheet` | 60 | [BaseBottomSheetV2](../features/components/BaseBottomSheetV2.md) 的面板容器 |
| `--cml-z-popup` | 70 | [PopupV2](../features/components/PopupV2.md) 與 [Tooltip](../features/components/Tooltip.md) 浮層的預設層級 |

| 疊在 popup 之上的浮層 | 層級 |
| :--- | :--- |
| [CascadeMenu](../features/components/CascadeMenu.md) 面板 | popup 刻度加上所在層數，逐層加 1 |
| TimeV2、DateV2 的時分秒清單 | popup 刻度加 1 |

來源：1. [tailwind.css][]　2. [PopupV2.vue][]　3. [Tooltip.vue][]　4. [CascadeMenuPanel.vue][]　5. [TimeField.vue][]

### 為什麼 popup 必須高於 sheet 與 drawer

popup 概念的元件會把浮層 Teleport 進最近的原生 dialog，沒有 dialog 時回落 body，以繞開 dialog 的 top layer 限制。

PopupV2 自行尋找最近的 dialog；Tooltip、CascadeMenu 面板與時間欄位清單經由 [useCamelotTeleportTarget](../features/composables/useCamelotTeleportTarget.md) 取得目標。

此時浮層與 BottomSheet 的面板容器是同一個堆疊脈絡下的兄弟節點，純粹比 z-index 大小。popup 若低於面板，Sheet 內的下拉選單就會被面板蓋住。

> [!IMPORTANT]
> 兩者有先後關係：沒有先 teleport 進 dialog，調高 z-index 完全無效。body 底下的內容永遠在對話框 top layer 之下，開到多大都一樣。

這張圖回答：BottomSheet 裡開啟下拉選單時，誰蓋在誰上面？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "dialog 內的疊層",
  "desc": "Sheet 面板與 teleport 進來的 popup 浮層同在 dialog 的 top layer 內，popup 刻度較高所以在上",
  "nodes": [
    {"id": "Dialog", "text": "原生 dialog", "shape": "round"},
    {"id": "Wrapper", "text": "Sheet 面板 60"},
    {"id": "Popup", "text": "Popup 浮層 70", "key": true}
  ],
  "edges": [
    {"from": "Dialog", "to": "Wrapper"},
    {"from": "Dialog", "to": "Popup", "label": "teleport 進來"}
  ]
}
```

![dialog 內的疊層](layering.圖1.svg)

來源：1. [PopupV2.vue][]　2. [useCamelotTeleportTarget.ts][]　3. [BaseBottomSheetV2.vue][]

## 規則

| 規則 | 說明 |
| :--- | :--- |
| 不寫死 z-index 數字 | 元件一律引用刻度變數；popup 概念的元件都已收斂 |
| 既有硬編碼 | 非 popup 類仍有固定值：Loading 1100、Toast 1000、Carousel 150；新增或修改時優先改用刻度 |
| 疊在同層之上用 calc | 例如浮層內的子清單寫 popup 刻度加 1；相同 z-index 會退回以 DOM 順序決定，多個浮層並存時不可預測 |
| 刻度放一般 `:root` | 不要移進 `@theme`：Tailwind v4 會 tree-shake 掉未被引用的變數，預留刻度在首次被引用前不存在 |
| 個別覆寫 | 使用端可透過元件的 `zIndex` prop 覆寫單一實例 |

來源：1. [tailwind.css][]　2. [Loading.vue][]　3. [Toast.vue][]　4. [Carousel.vue][]

## 相關頁面

- [BaseDialogV2](../features/components/BaseDialogV2.md)
- [元件清單](../features/components.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| tailwind.css | [app/assets/css/tailwind.css](../../../app/assets/css/tailwind.css) |
| PopupV2.vue | [app/components/Camelot/PopupV2.vue](../../../app/components/Camelot/PopupV2.vue) |
| Tooltip.vue | [app/components/Camelot/Tooltip.vue](../../../app/components/Camelot/Tooltip.vue) |
| CascadeMenuPanel.vue | [app/components/Camelot/Internal/CascadeMenuPanel.vue](../../../app/components/Camelot/Internal/CascadeMenuPanel.vue) |
| TimeField.vue | [app/components/Camelot/Internal/TimeField.vue](../../../app/components/Camelot/Internal/TimeField.vue) |
| useCamelotTeleportTarget.ts | [app/composables/useCamelotTeleportTarget.ts](../../../app/composables/useCamelotTeleportTarget.ts) |
| BaseBottomSheetV2.vue | [app/components/Camelot/BaseBottomSheetV2.vue](../../../app/components/Camelot/BaseBottomSheetV2.vue) |
| Loading.vue | [app/components/Camelot/Loading.vue](../../../app/components/Camelot/Loading.vue) |
| Toast.vue | [app/components/Camelot/Toast.vue](../../../app/components/Camelot/Toast.vue) |
| Carousel.vue | [app/components/Camelot/Carousel.vue](../../../app/components/Camelot/Carousel.vue) |

[tailwind.css]: #references
[PopupV2.vue]: #references
[Tooltip.vue]: #references
[CascadeMenuPanel.vue]: #references
[TimeField.vue]: #references
[useCamelotTeleportTarget.ts]: #references
[BaseBottomSheetV2.vue]: #references
[Loading.vue]: #references
[Toast.vue]: #references
[Carousel.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
