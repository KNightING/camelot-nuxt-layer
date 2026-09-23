# useCamelotError

## Summary

`useCamelotError()` 是全域單例的錯誤佇列，可累積多筆非致命錯誤，由錯誤對話框一次顯示一則。入列只接受 `CamelotErrorType`；任意原始錯誤先經可註冊的轉換器轉成統一格式，再經攔截器處理副作用後入列。與 Nuxt 的 `useError` 互補：後者承載單一致命錯誤並切換到錯誤頁。管線總覽見錯誤處理系統頁。

## 運作方式

### 處理管線

1. handle 收到原始錯誤；值為 null 或 undefined 時直接略過。
2. 轉換：依優先權由高到低逐一嘗試轉換器，第一個有回傳結果的勝出。
3. 全部落空時產生保底錯誤：等級為 error，data 掛原始物件，不會靜默吞錯。
4. 攔截：依優先權執行攔截器，任一個回傳 true 即視為已處理，不入列、handle 回傳 undefined。
5. 入列：補上隨機 id 並回傳，顯示層一次呈現佇列第一筆。

來源：1. [useCamelotError.ts][]

### 轉換器與攔截器規則

| 規則 | 說明 |
| --- | --- |
| 優先權 | 數字大者先跑，未指定為 0 |
| 同名註冊 | 視為覆蓋 |
| 註冊表 | 模組層 Map，不用 useState；兩者都是函式，無法通過 SSR 序列化 |
| 排序快取 | 排序結果會快取，註冊或註銷時失效 |
| 註冊函式 | 可從 composable 取得，也可直接具名匯入 |

內建三個不含業務語意的轉換器，優先權皆為 -100，確保消費端註冊的一律先試：

| 名稱 | 命中條件 | 產出 |
| --- | --- | --- |
| `camelot:fetch-error` | 物件且有 `statusCode` 欄位 | code 取狀態碼，message 取 statusMessage 或 message，data 取回應資料 |
| `camelot:native-error` | 是 Error 實例 | message 取錯誤訊息，data 為錯誤本身 |
| `camelot:string` | 是字串 | message 為該字串 |

來源：1. [useCamelotError.ts][]

### 呼叫端選項與關閉

1. 呼叫端選項的三個動作欄位會覆寫錯誤自帶的同名動作。
2. onConfirm 則是串接：呼叫端的先跑，錯誤自帶的後跑，讓攔截器掛上的導頁留在最後。
3. only 為 true 時先清空佇列，只保留這一筆。
4. dismiss 先把錯誤移出佇列，再執行它的 onConfirm。
5. runAction 先執行按鈕 handler；除非 close 明確為 false，否則接著 dismiss。

來源：1. [useCamelotError.ts][]

## 用法

```ts
const { push, handle, watch } = useCamelotError()

push({
  title: '連線失敗',
  message: '無法取得資料。',
  positive: { label: '重試', close: false, handler: retry },
  negative: { label: '關閉' },
})

handle(rawError)

const { error } = await useFetch('/api/orders')
watch(error, { onConfirm: () => router.back() })
```

## 簽章

```ts
useCamelotError(): {
  errors: Ref<CamelotErrorType[]>
  currentError: ComputedRef<CamelotErrorType | null>
  push: (error: CamelotErrorType, options?: CamelotErrorOptions) => string
  handle: (raw: unknown, options?: CamelotErrorOptions) => string | undefined
  dismiss: (id?: string) => void
  runAction: (action: CamelotErrorAction, id?: string) => void
  clear: () => void
  registerErrorResolver: <TData>(resolver: CamelotErrorResolver<TData>) => () => void
  registerErrorInterceptor: <TData>(interceptor: CamelotErrorInterceptor<TData>) => () => void
  watch: (errors: Ref<unknown> | Ref<unknown>[], options?: CamelotErrorOptions) => void
}
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `errors` | `Ref<CamelotErrorType[]>` | 錯誤佇列，以 useState 的 `Camelot:Errors` 保存 |
| `currentError` | `ComputedRef<CamelotErrorType \| null>` | 佇列第一筆；沒有則為 `null` |
| `push` | `(error, options?) => string` | 入列一筆已是統一格式的錯誤，回傳補上的 id |
| `handle` | `(raw, options?) => string \| undefined` | 原始錯誤的入口：轉換、攔截、入列；被攔下時回傳 `undefined` |
| `dismiss` | `(id?) => void` | 移除錯誤並執行其 onConfirm；未指定 id 時移除目前顯示的那筆 |
| `runAction` | `(action, id?) => void` | 執行動作按鈕，視 close 決定是否一併關閉 |
| `clear` | `() => void` | 清空佇列，不執行 onConfirm |
| `registerErrorResolver` | `(resolver) => () => void` | 註冊轉換器，回傳註銷函式 |
| `registerErrorInterceptor` | `(interceptor) => () => void` | 註冊攔截器，回傳註銷函式 |
| `watch` | `(errors, options?) => void` | 立即監看單一或多個錯誤 ref，值為 truthy 時送進 handle |

## 型別

| 型別 | 欄位 |
| --- | --- |
| `CamelotErrorType<TData = unknown>` | `id?`、`title?`、`message?`、`messageHtml?`、`code?`、`level?`、`data?`、`onConfirm?`、`positive?`、`neutral?`、`negative?`、`zIndex?` |
| `CamelotErrorLevel` | `'error' \| 'warning' \| 'info'`；未指定時顯示層視為 error |
| `CamelotErrorAction` | `{ label: string; color?: CamelotColorRole; close?: boolean; handler?: () => void }` |
| `CamelotErrorResolver<TData>` | `{ name: string; priority?: number; resolve: (raw: unknown) => CamelotErrorType<TData> \| undefined }` |
| `CamelotErrorInterceptor<TData>` | `{ name: string; priority?: number; intercept: (error: CamelotErrorType<TData>) => boolean \| undefined }` |
| `CamelotErrorOptions` | `only?`、`onConfirm?`、`positive?`、`neutral?`、`negative?` |

| 欄位規則 | 說明 |
| --- | --- |
| `messageHtml` | 富文字內容，與 message 二擇一；內容必須來自可信來源 |
| `neutral`、`negative` | 未指定則不顯示該按鈕 |
| `positive` | 未指定時沿用顯示層的預設確認鈕 |
| `close: false` | 對話框留著，由呼叫端決定何時 dismiss，例如重試流程 |

## 相關頁面

- [錯誤處理系統](../../platform/error-handling.md)：管線總覽與消費端註冊範例。
- [ErrorDialog](../components/ErrorDialog.md)：顯示佇列的對話框元件。
- [useErrorRef](./useErrorRef.md)：只把多個錯誤 ref 匯總成一個，不含佇列、轉換與顯示。
- [Composables 清單](../composables.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotError.ts | [app/composables/useCamelotError.ts](../../../../app/composables/useCamelotError.ts) |

[useCamelotError.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
