# TimeField

## Summary

TimeField（匯入名稱 `CamelotInternalTimeField`）是單一時間數字欄位，屬內部元件，用於時、分或秒：可直接輸入兩位數，也可從下拉清單挑選，並支援方向鍵循環增減。[TimeRow](./Internal-TimeRow.md) 以它組成時間列，下拉清單會送出父容器外，不會被彈窗裁切。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `min` | `number` | — | 數值下限，必填 |
| `max` | `number` | — | 數值上限，必填 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number`，預設 `0` | 目前數值，顯示時補零成兩位 |

## 運作方式

### 輸入與鍵盤

| 操作 | 行為 |
| :--- | :--- |
| 聚焦 | 開啟下拉清單 |
| 輸入 | 去掉非數字後夾在 min 與 max 之間寫回 |
| 上方向鍵 | 加 1，超過 max 回到 min |
| 下方向鍵 | 減 1，低於 min 回到 max |
| Enter | 關閉清單 |
| 點清單項目 | 寫回該值並關閉清單 |
| 點外部 | 關閉清單 |

清單列出 min 到 max 的每個整數。點清單項目時阻止預設行為，焦點不會離開輸入框。

來源：1. [TimeField.vue][]

### 下拉清單定位

1. 清單經 [useCamelotTeleportTarget](../composables/useCamelotTeleportTarget.md) 送進最近的 dialog，沒有則送到 body，脫離父層的裁切容器。
2. 在 dialog 內若送到 body，會落在 top layer 之下，看不見也點不到。
3. 開啟時量測欄位位置，上方有 168px 以上空間就向上展開，否則向下，水平置中對齊欄位。
4. 清單送出去後脫離色彩角色的作用範圍，開啟時把欄位當下的角色色帶進清單樣式。

來源：1. [TimeField.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| TimeField.vue | [app/components/Camelot/Internal/TimeField.vue](../../../../app/components/Camelot/Internal/TimeField.vue) |

[TimeField.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
