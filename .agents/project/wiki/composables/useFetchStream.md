# useFetchStream

> 以 `fetch` + `ReadableStream` 讀取串流回應，累積 `Uint8Array` 資料並提供 `onChunk` / `onFinish` / `onError` 回呼；回傳物件同時是可 await 的 Promise。

## 簽章
```ts
export const useFetchStream = (
  url: MaybeRefOrGetter<string>,
  options: UseFetchStreamOptions = {},
): UseFetchStreamReturn<Shell>

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

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `url` | `MaybeRefOrGetter<string>` | （必填） | 請求 URL，透過 `toValue` 解析。 |
| `options.method` | `'GET' \| 'POST'` | `'GET'` | HTTP 方法。 |
| `options.headers` | `Record<string, string>` | `{}` | 請求標頭。 |
| `options.immediate` | `boolean` | `true` | 是否於建立時立即發送請求。 |
| `options.onChunk` | `(chunk: Uint8Array) => Promise<void>` | `undefined` | 每收到一塊資料時觸發。 |
| `options.onFinish` | `(fullData: Uint8Array) => Promise<void>` | `undefined` | 串流結束（`done`）時觸發，帶入目前累積資料。 |
| `options.onError` | `(error: Error) => Promise<void>` | `undefined` | 非中止的錯誤時觸發。 |
| `options.keepData` | `boolean` | `true` | 是否將每塊資料累積到 `data`；`false` 則不保留（僅透過 `onChunk` 處理）。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `data` | `Ref<Uint8Array>` | 累積收到的串流資料（`keepData` 為 `true` 時）。 |
| `status` | `Ref<'idle' \| 'pending' \| 'success' \| 'aborted' \| 'error'>` | 請求狀態。 |
| `isStreaming` | `ComputedRef<boolean>` | `status === 'pending'` 時為 `true`。 |
| `error` | `ShallowRef<Error \| null>` | 錯誤物件。 |
| `abort` | `() => void` | 中止目前請求（狀態設為 `'aborted'`）。 |
| `refresh` | `() => Promise<void>` | 重新發送請求（會先 `clear`）。 |
| `clear` | `() => void` | 中止並重置 `data` / `error` / `status`。 |
| `then` / `catch` / `finally` | — | 使物件可作為 Promise 被 await。 |

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

// 或直接 await
await useFetchStream('/api/stream', { immediate: true })
```

## 備註
- 回應 `!ok` 會拋出 `HTTP error! status: <code>`；`response.body` 為空會拋出 `Response body is empty.`。
- 錯誤名稱為 `AbortError` 時不視為錯誤（不設 `error` 狀態、不呼叫 `onError`、不 reject）。
- `immediate` 為 `true` 時建立即刻執行 `refresh()`；否則初始 Promise 直接 resolve 為 shell。
- 內部以 `concatUint8Arrays` 串接資料塊。

---
[🏠 Wiki](../index.md)
