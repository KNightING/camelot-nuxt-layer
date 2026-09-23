# Breadcrumb

## Summary

Breadcrumb 是麵包屑導覽列，匯入名稱 `CamelotBreadcrumb`。它依序顯示層級路徑，項目之間以分隔符號隔開；最後一項代表目前頁面，以角色色加粗顯示且不可點擊，其餘項目點擊時送出 select 事件。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `BreadcrumbItem[]` | —（必填） | 麵包屑項目陣列 |
| `separator` | `string` | — | 自訂分隔字元；留空則用 chevron 圖示 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩，用於目前頁與 hover 文字色 |

### BreadcrumbItem
| 欄位 | 型別 | 說明 |
| :--- | :--- | :--- |
| `label` | `string` | 顯示文字 |
| `value` | `string \| number` | 選填；有值時作為列表 key |
| `href` | `string` | 選填；有值時渲染為連結 |
| `disabled` | `boolean` | 選填；為 true 時點擊不送出 select |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `(item: BreadcrumbItem, index: number)` | 點擊非最後一項且未停用時觸發 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `item` | `{ item, index, isLast }` | 自訂單一項目內容；預設顯示項目文字 |
| `separator` | — | 自訂分隔符號；預設 chevron 圖示或 `separator` 字元 |

## 運作方式

| 規則 | 說明 |
|---|---|
| 元素 | 有 href 的項目渲染為連結，否則為按鈕 |
| 最後一項 | 標記為目前頁面，停用滑鼠事件，不送出 select |
| 停用項目 | 仍照常顯示，點擊不送出 select |
| Scifi 主題 | 改用等寬字體、全大寫與加寬字距 |

來源：1. [Breadcrumb.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Breadcrumb.vue | [app/components/Camelot/Breadcrumb.vue](../../../../app/components/Camelot/Breadcrumb.vue) |

[Breadcrumb.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
