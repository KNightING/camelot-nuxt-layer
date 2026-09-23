# useLoading

## Summary

useLoading 是以標籤為單位的全域載入狀態管理：開啟任一標籤即進入載入中，全部關閉才結束，並可為每個標籤附上提示文字。同檔另匯出 useLoadingFn、useDebounceLoadingFn、useThrottleLoadingFn 與 running，把非同步函式包成自動開關載入的版本。狀態是模組層級單例，全站共用，由全域 Loading 元件顯示。

## 介面

### 簽章

```ts
const useLoading: () => {
  open: (tag: string, text?: string) => LoadingCloseable
  close: (tag?: string) => void
  setText: (tag: string, text: string) => void
  text: ComputedRef<string>
  isOpening: ComputedRef<boolean>
  isOpen: (tag: string) => boolean
  run: <R = void>(tag, fn, errorFn?, pending?) => Promise<R | undefined>
  watch: (tag, refs: Ref<boolean> | Ref<boolean>[], options?) => void
}

const useLoadingFn: <T, P = void>(
  tag: string,
  fn: (params?: P) => Promise<T>,
  errorFn?: ErrorFn,
  pending?: Ref<boolean>,
) => (params?: P) => Promise<T | undefined>

const useDebounceLoadingFn: <T, P = void>(
  tag, fn, errorFn?, pending?,
  ms?: MaybeRefOrGetter<number>,
  options?: DebounceFilterOptions,
) => …

const useThrottleLoadingFn: <T, P = void>(
  tag, fn, errorFn?, pending?,
  ms?: MaybeRefOrGetter<number>,
  trailing?: boolean,
  leading?: boolean,
  rejectOnCancel?: boolean,
) => …

const running: <R = void>(
  fn: () => Promise<R | undefined>,
  errorFn?: ErrorFn,
  finallyFn?: VoidFunction,
  pending?: Ref<boolean>,
) => Promise<R | undefined>

type ErrorFn = (ex: unknown) => Promise<void> | void
type LoadingCloseable = () => void
```

### useLoading 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `open` | `(tag, text?) => LoadingCloseable` | 開啟標籤，回傳關閉該標籤的函式；`text` 為提示文字 |
| `close` | `(tag?) => void` | 關閉標籤並清掉它的文字；不帶標籤時清空全部 |
| `setText` | `(tag, text) => void` | 更新標籤的提示文字，只對開著的標籤生效 |
| `text` | `ComputedRef<string>` | 目前顯示的提示文字，取最後開啟且有文字的標籤 |
| `isOpening` | `ComputedRef<boolean>` | 是否有任何標籤開著 |
| `isOpen` | `(tag) => boolean` | 指定標籤是否開著 |
| `run` | `(tag, fn, errorFn?, pending?) => Promise` | 執行期間開啟標籤，結束後關閉；委派給 `running` |
| `watch` | `(tag, refs, options?) => void` | 監聽 boolean ref 自動開關標籤，`immediate` 預設 `true` |

### 包裝函式參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `tag` | `string` | 必填 | 載入標籤 |
| `fn` | `(params?: P) => Promise<T>` | 必填 | 要包裝的非同步函式 |
| `errorFn` | `ErrorFn` | — | 錯誤處理回呼 |
| `pending` | `Ref<boolean>` | 內部建立 | 反映執行中狀態的 ref |
| `ms` | `MaybeRefOrGetter<number>` | — | debounce、throttle 版的間隔毫秒 |
| `options` | `DebounceFilterOptions` | — | debounce 版選項 |
| `trailing`、`leading`、`rejectOnCancel` | `boolean` | — | throttle 版選項，原樣傳給 VueUse |

來源：1. [useLoading.ts][]

## 用法

```ts
const { isOpening, run, watch } = useLoading()

// 直接執行
await run('save', async () => api.save())

// 包裝函式
const submit = useLoadingFn('submit', async payload => api.post(payload))
await submit(data)

// 監聽外部 ref
watch('fetching', isFetching)
```

## 提示文字與分階段

文字由狀態驅動而非 prop。[Loading](../components/Loading.md) 是全域單例，文字必須跟著「哪一次載入」走，不能寫死在掛載點。

```ts
const { open, setText } = useLoading()
const tag = 'sync-orders'

const close = open(tag, '正在連線…')
try {
  await connect()
  setText(tag, '下載資料中…')
  await download()
  setText(tag, '整理結果…')
  await transform()
}
finally {
  close()
}
```

| 規則 | 說明 |
| --- | --- |
| 一次載入開一次 | 同一個標籤從頭到尾只開一次，中途只換文字；重開會讓指示器閃爍重來 |
| 只改開著的標籤 | 已關閉的標籤若還能寫入，文字會殘留到下一次開啟 |
| 關閉即清文字 | 關閉標籤時一併清掉它的文字，不需手動重設 |
| 沒有文字 | Loading 不渲染文字段落，版面不會多出空位 |
| 不並行同一標籤 | 關閉會移除該標籤的所有進行中項目，先結束的那次會把後開的一起關掉；並行時用不同標籤 |

## 規則

| 規則 | 說明 |
| --- | --- |
| 單例 | 狀態在模組層級，所有呼叫端共用同一組標籤 |
| `run` 不帶文字 | `run` 與包裝函式開啟標籤時不附提示文字，需要時另呼叫 `setText` |
| 錯誤會被吞掉 | `running` 捕捉所有例外交給 `errorFn`；沒給 `errorFn` 時錯誤被靜默忽略，回傳 `undefined` |
| 結束順序 | `running` 在 finally 先執行 `finallyFn`，再把 `pending` 設回 `false` |
| 監聽陣列 | `watch` 傳陣列時忽略傳入的標籤，改用字面字串 `tag:0`、`tag:1`… 作標籤，不同呼叫端會撞名 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useLoading.ts | [app/composables/useLoading.ts](../../../../app/composables/useLoading.ts) |

[useLoading.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
