# useFileToDataURL

> 將 `File` 讀取為 Data URL，並以 `useAsyncData` 包裝結果。

## 簽章
```ts
useFileToDataURL(file: File): ReturnType<typeof useAsyncData<string>>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `file` | `File` | — | 要讀取的檔案。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `ReturnType<typeof useAsyncData<string>>` | `useAsyncData` 的結果，`data` 為 Data URL 字串。 |

## 用法
```ts
const { data, pending } = await useFileToDataURL(file)
// data.value 為檔案的 Data URL
```

## 備註
- 以 `useFileKey(file)` 作為 `useAsyncData` 的 key。
- 內部透過 `FileReader.readAsDataURL` 讀取。

---
[🏠 Wiki](../index.md)
