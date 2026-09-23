# JSON Lines 串流

## Summary

useFetchJSONLinesStream 建在 useFetchStream 之上，把串流回應依換行切成一行一筆，逐行解析成物件並累積為陣列。適合後端以 JSON Lines（NDJSON）逐筆推送資料的端點。每解析一行觸發回呼，串流結束時帶入整份陣列；狀態、錯誤與中止沿用底層 useFetchStream。

## 介面

### 簽章

```ts
const useFetchJSONLinesStream: <T>(
  url: MaybeRefOrGetter<string>,
  options?: UseFetchJSONLinesStreamOptions<T>,
) => {
  // 其餘沿用 useFetchStream：status、isStreaming、error、abort、then 等
  data: Ref<T[]>
  refresh: () => Promise<void>
  clear: () => void
}

type BaseOptions = Omit<UseFetchStreamOptions, 'onChunk' | 'onFinish'>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `url` | `MaybeRefOrGetter<string>` | 必填 | 串流請求網址 |
| `options` | `UseFetchJSONLinesStreamOptions<T>` | `{}` | 選項物件，見下表 |

### options

| 選項 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `onLineParsed` | `(data: T) => void` | — | 一行解析成功時觸發 |
| `onParseError` | `(error: Error, line: string) => void` | — | 一行解析失敗時觸發，帶入錯誤與原始行 |
| `onFinish` | `(data: T[]) => void` | — | 串流結束時觸發，帶入累積的陣列 |
| `decoder` | `TextDecoder` | UTF-8 解碼器 | 把二進位資料塊解碼成文字 |
| `lineBreak` | `string` | `'\n'` | 分行符號 |
| `parse` | `(line: string) => T \| null` | `JSON.parse` | 單行解析函式 |
| `finishOnParseError` | `boolean` | 實際為不中止 | 明確傳 `true` 時，解析失敗會中止串流 |
| `keepData` | `boolean` | `true` | 是否把解析結果累積到 `data` |
| `method`、`headers`、`immediate`、`onError` | — | 同 useFetchStream | 原樣傳給底層 useFetchStream |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `data` | `Ref<T[]>` | 累積的解析結果，取代底層的位元組資料 |
| `refresh` | `() => Promise<void>` | 先清空，再重新發送請求 |
| `clear` | `() => void` | 清空 `data` 與行緩衝，並中止、重置底層串流 |
| 其餘 | — | 展開自底層 useFetchStream，含 `status`、`isStreaming`、`error`、`abort` |

來源：1. [useFetchJSONLinesStream.ts][]　2. [useFetchStream.ts][]

## 用法

```ts
const { data, refresh } = useFetchJSONLinesStream<MyItem>('/api/stream', {
  immediate: false,
  onLineParsed: item => console.log(item),
  onParseError: (err, line) => console.warn(err, line),
})
await refresh()
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 行緩衝 | 每收到一塊資料就解碼接到緩衝尾端，依分行符號切開，最後一段不完整的行留在緩衝 |
| 空行 | 只有空白的行直接略過 |
| 結尾沒有換行 | 串流結束時殘留在緩衝的最後一行不會被解析，後端須以分行符號結尾 |
| 解析失敗 | 預設只呼叫 `onParseError` 並繼續；`finishOnParseError` 明確為 `true` 才中止 |
| 底層資料 | 底層 useFetchStream 的 `keepData` 固定為 `false`，不累積位元組 |
| 錯誤轉交 | 底層的 `onError` 轉呼叫使用者傳入的 `onError` |
| 立即請求 | 未傳 `immediate` 時沿用底層預設，建立當下就發出請求 |

## 相關頁面

- [useFetchStream](./useFetchStream.md)：底層的位元組串流讀取。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useFetchJSONLinesStream.ts | [app/composables/useFetchJSONLinesStream.ts](../../../../app/composables/useFetchJSONLinesStream.ts) |
| useFetchStream.ts | [app/composables/useFetchStream.ts](../../../../app/composables/useFetchStream.ts) |

[useFetchJSONLinesStream.ts]: #references
[useFetchStream.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
