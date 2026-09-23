# useBlobDownload

## Summary

`useBlobDownload(obj, fileName)` 把一個 Blob 或 MediaSource 以指定檔名立即下載：為它建立物件網址，指給一個暫時的 `<a>` 元素後點擊。呼叫即觸發下載，只能在瀏覽器端使用。

## 運作方式

1. 以 createObjectURL 為物件建立網址。
2. 建立 `<a>` 元素，設定下載檔名與網址，不掛進 DOM。
3. 呼叫 click 觸發下載，回傳值為 `undefined`。
4. 下一輪事件循環釋放物件網址。

| 規則 | 說明 |
| --- | --- |
| 物件網址 | 觸發下載後自動釋放，不會常駐記憶體 |
| 執行環境 | 需要 document 與 URL，伺服器端呼叫會出錯 |

來源：1. [useBlobDownload.ts][]

## 用法

```ts
const blob = new Blob([csvText], { type: 'text/csv' })
useBlobDownload(blob, 'report.csv')
```

## 簽章

```ts
useBlobDownload(obj: Blob | MediaSource, fileName: string): void
```

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `obj` | `Blob \| MediaSource` | — | 要下載的物件 |
| `fileName` | `string` | — | 下載時使用的檔名 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useBlobDownload.ts | [app/composables/useBlobDownload.ts](../../../../app/composables/useBlobDownload.ts) |

[useBlobDownload.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
