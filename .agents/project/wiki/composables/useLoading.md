# useLoading

> 以標籤（tag）為基礎的全域載入狀態管理；搭配 `useLoadingFn` / `useDebounceLoadingFn` / `useThrottleLoadingFn` 包裝非同步函式並自動開關載入狀態。

## 簽章
```ts
export const useLoading = () => {
  open,
  close,
  isOpening,
  isOpen,
  run,
  watch,
}

export const useLoadingFn: <T, P = void>(
  tag: string,
  fn: (params?: P) => Promise<T>,
  errorFn?: ErrorFn,
  pending?: Ref<boolean>,
) => (params?: P) => Promise<T | undefined>

export const useDebounceLoadingFn: <T, P = void>(...) => ...
export const useThrottleLoadingFn: <T, P = void>(...) => ...

export const running: <R = void>(
  fn: () => Promise<R | undefined>,
  errorFn?: ErrorFn,
  finallyFn?: VoidFunction,
  pending?: Ref<boolean>,
) => Promise<R | undefined>
```

其中 `type ErrorFn = (ex: unknown) => Promise<void> | void`。

## 回傳（useLoading）
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `open` | `(tag: string) => LoadingCloseable` | 開啟指定標籤的載入，回傳可關閉該標籤的函式。 |
| `close` | `(tag?: string) => void` | 關閉指定標籤；未帶 tag 則清空所有標籤。 |
| `isOpening` | `ComputedRef<boolean>` | 是否有任何標籤處於載入中。 |
| `isOpen` | `(tag: string) => boolean` | 指定標籤是否載入中。 |
| `run` | `<R>(tag, fn, errorFn?, pending?) => Promise<R \| undefined>` | 執行 `fn` 期間開啟載入，結束後關閉；委派給 `running`。 |
| `watch` | `(tag, refs: Ref<boolean> \| Ref<boolean>[], options?) => void` | 監聽 boolean ref（或陣列）自動開關載入標籤。 |

## 參數（useLoadingFn 等）
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `tag` | `string` | （必填） | 載入標籤。 |
| `fn` | `(params?: P) => Promise<T>` | （必填） | 要包裝的非同步函式。 |
| `errorFn` | `ErrorFn` | `undefined` | 錯誤處理回呼。 |
| `pending` | `Ref<boolean>` | 內部 `ref(false)` | 反映執行中狀態的 ref。 |
| `ms` | `MaybeRefOrGetter<number>` | `undefined` | （debounce/throttle 版）延遲毫秒。 |
| `options` | `DebounceFilterOptions` | `undefined` | （debounce 版）debounce 選項。 |
| `trailing` / `leading` / `rejectOnCancel` | `boolean` | `undefined` | （throttle 版）throttle 選項。 |

## 用法
```ts
const { isOpening, run, watch } = useLoading()

// 直接執行
await run('save', async () => api.save())

// 包裝函式
const submit = useLoadingFn('submit', async (payload) => api.post(payload))
await submit(data)

// 監聽外部 ref
watch('fetching', isFetching)
```

## 備註
- 載入狀態 `state` 為模組層級單例，跨元件共用同一組標籤。
- `watch` 傳入陣列時，會為每個 ref 各自產生 `tag:${index}` 標籤（忽略傳入的 tag）。
- `run` 透過 `running` 實作：開始設 `pending = true`，`finally` 中執行 `finallyFn` 並設 `pending = false`；捕捉錯誤交給 `errorFn`。
- `watchToggle` / `watch` 的 `immediate` 預設為 `true`。

---
[🏠 Wiki](../index.md)
