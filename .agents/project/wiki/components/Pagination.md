# Pagination

> 分頁導覽列：頁碼、上一頁/下一頁、可選的總筆數、每頁筆數與跳頁輸入。

**匯入名稱**：`CamelotPagination`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `total` | `number` | - | 總筆數（與 `totalPages` 擇一；兩者皆給時以 `totalPages` 為準） |
| `totalPages` | `number` | - | 總頁數（未給則由 `total / pageSize` 計算） |
| `siblingCount` | `number` | `1` | 當前頁左右各顯示幾個頁碼 |
| `boundaryCount` | `number` | `1` | 首尾各固定顯示幾個頁碼 |
| `showTotal` | `boolean` | - | 是否顯示「共 N 筆」 |
| `showJumper` | `boolean` | - | 是否顯示跳頁輸入框 |
| `showPageSize` | `boolean` | - | 是否顯示每頁筆數下拉選單 |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 每頁筆數選項 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `disabled` | `boolean` | - | 停用整個分頁列 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model`（預設） | `number` | 當前頁碼（預設 `1`） |
| `v-model:pageSize` | `number` | 每頁筆數（預設 `10`） |

## 備註
- 頁碼以省略號（…）呈現缺口：首尾邊界（`boundaryCount`）+ 當前頁左右 `siblingCount` 之外的頁碼會被折疊。
- 跳頁輸入與點選頁碼皆會夾限於 `1 ~ totalPages` 範圍。
- 當 `pageSize` 或 `totalPages` 變動導致當前頁超出總頁數時，會自動回退至最後一頁。
- 每頁筆數選單使用 `CamelotSelectV2`（關閉搜尋），選項顯示為「N / 頁」。
- 依主題（`aqua` / `scifi` / `cupertino` / 預設）套用不同的頁碼形狀與選中/閒置樣式。

---
[🏠 Wiki](../index.md)
