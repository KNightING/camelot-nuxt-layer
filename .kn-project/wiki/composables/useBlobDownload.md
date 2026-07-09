# useBlobDownload

> 以指定檔名觸發下載一個 Blob 或 MediaSource 物件。

## 簽章
```ts
useBlobDownload(obj: Blob | MediaSource, fileName: string): void
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `obj` | `Blob \| MediaSource` | — | 要下載的物件，會透過 `URL.createObjectURL` 產生連結。 |
| `fileName` | `string` | — | 下載時使用的檔名。 |

## 用法
```ts
useBlobDownload(myBlob, 'report.csv')
```

## 備註
- 內部建立 `<a>` 元素，設定 `download` 與 `href` 後立即呼叫 `click()`。
- 呼叫即觸發下載，僅能在瀏覽器環境（client）使用。
- 回傳值為 `link.click()` 的結果（`void`）。

---
[🏠 Wiki](../index.md)
