# useFileKey

> 依檔案的型別、名稱、大小、修改時間組成一個唯一識別字串。

## 簽章
```ts
useFileKey(file: File): string
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `file` | `File` | — | 來源檔案。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `string` | 格式為 `` `${file.type}_${file.name}_${file.size}_${file.lastModified}` ``。 |

## 用法
```ts
const key = useFileKey(file)
```

## 備註
- 可作為快取或 `useAsyncData` 的 key 使用。

---
[🏠 Wiki](../index.md)
