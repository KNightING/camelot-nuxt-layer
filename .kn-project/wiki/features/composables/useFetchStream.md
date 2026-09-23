# useFetchStream

## Summary

useFetchStream 以 fetch 搭配 ReadableStream 讀取串流回應，把收到的 Uint8Array 資料塊累積起來，並提供 onChunk、onFinish、onError 回呼與請求狀態。回傳物件同時可被 await，會等待建立時發出的那次請求。逐行 JSON 的情境改用建在它之上的 useFetchJSONLinesStream。

## 介面

### 簽章

```ts
export const useFetchStream = (
  url: MaybeRefOrGetter<string>,
  options: UseFetchStreamOptions = {},
): Shell & Promise<Shell>

export interface UseFetchStreamOptions {
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  immediate?: boolean
  onChunk?: (chunk: Uint8Array) => Promise<void>
  onFinish?: (fullData: Uint8Array) => Promise<void>
  onError?: (error: Error) => Promise<void>
  keepData?: boolean
}
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `url` | `MaybeRefOrGetter<string>` | 必填 | 請求網址，每次請求時以 `toValue` 取值 |
| `options.method` | `'GET' \| 'POST'` | `'GET'` | HTTP 方法 |
| `options.headers` | `Record<string, string>` | `{}` | 請求標頭 |
| `options.immediate` | `boolean` | `true` | 建立時是否立即發出請求 |
| `options.onChunk` | `(chunk) => Promise<void>` | — | 每收到一塊資料時觸發，會被 await |
| `options.onFinish` | `(fullData) => Promise<void>` | — | 串流讀完時觸發，帶入目前累積的資料 |
| `options.onError` | `(error) => Promise<void>` | — | 非中止的錯誤時觸發，不會被 await |
| `options.keepData` | `boolean` | `true` | 是否把資料塊累積到 `data`；`false` 時只透過 `onChunk` 處理 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `data` | `Ref<Uint8Array>` | 累積的串流資料 |
| `status` | `Ref<'idle' \| 'pending' \| 'success' \| 'aborted' \| 'error'>` | 請求狀態 |
| `isStreaming` | `ComputedRef<boolean>` | `status` 為 `'pending'` 時為 `true` |
| `error` | `ShallowRef<Error \| null>` | 錯誤物件 |
| `abort` | `() => void` | 中止目前請求，狀態設為 `'aborted'` |
| `refresh` | `() => Promise<void>` | 先 `clear` 再重新發送請求；失敗時 reject |
| `clear` | `() => void` | 中止進行中的請求，重置 `data`、`error`，狀態回 `'idle'` |
| `then`、`catch`、`finally` | — | 讓回傳物件可被 await |

來源：1. [useFetchStream.ts][]

## 用法

```ts
const { data, status, isStreaming, abort } = useFetchStream('/api/stream', {
  onChunk: async (chunk) => {
    console.log(new TextDecoder().decode(chunk))
  },
  onFinish: async (full) => {
    console.log('done', full.length)
  },
})
```

```ts
// 等待建立時發出的請求結束；失敗會拋出
await useFetchStream('/api/stream')
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 回應失敗 | 狀態碼非 2xx 拋出 `HTTP error! status: <code>` |
| 沒有 body | 拋出 `Response body is empty.` |
| 中止 | 錯誤名稱為 `AbortError` 時不設錯誤狀態、不呼叫 `onError`、不 reject |
| await 的結果 | `immediate` 為 `true` 時 resolve 為 `undefined`；為 `false` 時直接 resolve 為回傳物件本身 |
| await 的對象 | 永遠是建立時那一次請求；之後呼叫 `refresh` 要 await 它自己的回傳值 |
| 重複請求 | `refresh` 會先中止前一次請求再重新發出 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useFetchStream.ts | [app/composables/useFetchStream.ts](../../../../app/composables/useFetchStream.ts) |

[useFetchStream.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
