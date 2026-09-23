# Pagination

## Summary

`CamelotPagination` 是分頁導覽列：上一頁、頁碼、下一頁，並可選擇顯示總筆數、每頁筆數下拉選單與跳頁輸入框。它只負責分頁列、不持有資料，父層依目前頁碼與每頁筆數自行切出當頁資料。頁碼過多時以省略號折疊，外觀依主題切換。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `total` | `number` | — | 總筆數；與 `totalPages` 擇一，兩者都給時以 `totalPages` 為準 |
| `totalPages` | `number` | — | 總頁數；未給時由 `total` 除以每頁筆數無條件進位 |
| `siblingCount` | `number` | `1` | 目前頁左右各顯示幾個頁碼 |
| `boundaryCount` | `number` | `1` | 首尾各固定顯示幾個頁碼 |
| `showTotal` | `boolean` | — | 是否顯示「共 N 筆」；沒給 `total` 時 N 會顯示總頁數 |
| `showJumper` | `boolean` | — | 是否顯示跳頁輸入框 |
| `showPageSize` | `boolean` | — | 是否顯示每頁筆數下拉選單 |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 每頁筆數選項 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `disabled` | `boolean` | — | 停用整個分頁列 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number` | 目前頁碼（預設 `1`） |
| `pageSize` | `number` | 每頁筆數（預設 `10`） |

## 運作方式

### 搭配資料清單

父層依頁碼與每頁筆數切出當頁資料，例如搭配 [Table](./Table.md)：

```ts
const rows = computed(() => data.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
```

總頁數最少為 1；兩者都沒給時也視為 1 頁。

來源：1. [Pagination.vue][]

### 頁碼折疊

1. 固定顯示首尾各 `boundaryCount` 個頁碼。
2. 固定顯示目前頁左右各 `siblingCount` 個頁碼。
3. 其餘頁碼折疊，相鄰頁碼間有缺口時顯示一個「…」。

來源：1. [Pagination.vue][]

### 換頁規則

| 規則 | 說明 |
| :--- | :--- |
| 夾限 | 點頁碼、上下頁、跳頁輸入都會夾在 1 到總頁數之間 |
| 跳頁 | 輸入框的值確定變更（失焦或按 Enter）時才換頁 |
| 超出總頁數 | 每頁筆數或總頁數變動、目前頁超出時，自動退回最後一頁 |
| 首頁與末頁 | 上一頁在第 1 頁、下一頁在最後一頁時停用 |
| 停用 | 所有按鈕停用，點擊不換頁 |

每頁筆數選單使用關閉搜尋的 [SelectV2](./SelectV2.md)，選項顯示為「N / 頁」。

來源：1. [Pagination.vue][]

### 各主題頁碼樣式

| 主題 | 形狀 | 目前頁 |
| :--- | :--- | :--- |
| aqua | 圓形玻璃軌道 | 玻璃填滿底 |
| scifi | 切角方塊、淡角色色框線 | 角色色底加光暈 |
| cupertino | 8px 圓角，hover 顯示淺底 | 角色色底 |
| material | 6px 圓角，hover 顯示淺底 | 角色色底 |

來源：1. [Pagination.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Pagination.vue | [app/components/Camelot/Pagination.vue](../../../../app/components/Camelot/Pagination.vue) |

[Pagination.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
