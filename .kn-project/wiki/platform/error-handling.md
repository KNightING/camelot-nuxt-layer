# 錯誤處理系統

## Summary

Camelot 的全域錯誤機制由 `useCamelotError` 的佇列與 `CamelotErrorDialog` 的顯示層組成，可累積多筆錯誤並逐一呈現，管線分為轉換器、攔截器與佇列三段。入口只接受 `CamelotErrorType`，任意原始錯誤必須經由消費端註冊的轉換器轉成該型別，副作用由攔截器負責，因此換一套 API 錯誤格式不需要改動 Layer。Layer 只內建 `FetchError`、`Error`、`string` 三個無業務語意的轉換器；401 導向登入這類行為一律由消費端註冊。

## 運作方式

### 管線

`handle` 是接收原始錯誤的唯一入口，分三段推進。

這張圖回答：一筆原始錯誤從進入到顯示，會經過哪些判斷？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "LR",
  "title": "錯誤處理管線",
  "desc": "原始錯誤先經轉換器鏈轉成統一型別，再經攔截器鏈決定是否靜默，否則入列由錯誤對話框逐一顯示",
  "nodes": [
    {"id": "A", "text": "原始錯誤", "shape": "stadium"},
    {"id": "B", "text": "有轉換器命中?", "shape": "diamond"},
    {"id": "F", "text": "保底錯誤型別"},
    {"id": "C", "text": "攔截器攔下?", "shape": "diamond"},
    {"id": "G", "text": "靜默處理", "kind": "success", "terminal": true},
    {"id": "D", "text": "加入佇列", "kind": "data", "shape": "db"},
    {"id": "E", "text": "對話框逐一顯示", "key": true},
    {"id": "H", "text": "執行動作按鈕"},
    {"id": "I", "text": "關閉並回呼"}
  ],
  "edges": [
    {"from": "A", "to": "B"},
    {"from": "B", "to": "C", "label": "第一個命中者"},
    {"from": "B", "to": "F", "label": "全部落空"},
    {"from": "F", "to": "C"},
    {"from": "C", "to": "G", "label": "回傳 true"},
    {"from": "C", "to": "D", "label": "否"},
    {"from": "D", "to": "E"},
    {"from": "E", "to": "H", "label": "按下按鈕"},
    {"from": "H", "to": "I"}
  ]
}
```

![錯誤處理管線](error-handling.圖1.svg)

保底錯誤型別的等級為 error，原始錯誤放在 data 欄位。

| 階段 | 職責 | 不該做什麼 |
| :--- | :--- | :--- |
| resolve | 純轉換：把 unknown 轉成 `CamelotErrorType` | 不做副作用；轉換器若兼做清權限或導頁，單純轉格式的情境也會觸發 |
| intercept | 副作用：清除權限、記錄 log、掛上 `onConfirm`；回傳 `true` 可攔下不入列 | 不改寫錯誤的顯示語意，那是 resolve 的事 |
| enqueue | 入列並由錯誤對話框逐一呈現 | — |

轉換器與攔截器都可註冊多個，`priority` 數字大者先跑；未指定為 0，內建轉換器為 -100。

註冊表是模組層的 Map，同名視為覆蓋，註冊函式回傳註銷函式。

來源：1. [useCamelotError.ts][]　2. [ErrorDialog.vue][]

### 消費端註冊

以 401 為例，三個需求各自落在管線的一段：

1. 清除權限：在 intercept。
2. 跳出對話框：入列後由錯誤對話框負責。
3. 確認後回登入：掛在 `onConfirm`。

```ts
// plugins/camelotError.ts
export default defineNuxtPlugin(() => {
  const { registerErrorResolver, registerErrorInterceptor } = useCamelotError()

  // 轉換：把後端的 401 轉成統一模型（無副作用）
  registerErrorResolver({
    name: 'unauthorized',
    priority: 100,
    resolve: (raw) => {
      if (!isFetchError(raw) || raw.statusCode !== 401) return undefined
      return { code: 401, message: '登入逾期，請重新登入', data: raw.data }
    },
  })

  // 攔截：清權限（立即），導頁掛到 onConfirm（對話框關閉後才跑）
  registerErrorInterceptor({
    name: 'unauthorized',
    intercept: (error) => {
      if (error.code !== 401) return
      useAuthStore().clear()
      error.onConfirm = () => navigateTo('/login')
    },
  })
})
```

自訂 API 錯誤格式同理，只註冊轉換器即可：

```ts
registerErrorResolver<ApiErrorPayload>({
  name: 'api-error',
  priority: 100,
  resolve: raw => isApiErrorPayload(raw)
    ? { code: raw.errorCode, message: raw.errorMessage, data: raw }
    : undefined,
})
```

來源：1. [useCamelotError.ts][]

### 呼叫端控制

`push`、`handle`、`watch` 共用同一組選項型別 CamelotErrorOptions，讓觸發錯誤的頁面就地決定行為：

```ts
const { error } = await useFetch('/api/orders')

// 確認後回上一頁
useCamelotError().watch(error, { onConfirm: () => router.back() })
```

| 欄位 | 合併方式 | 理由 |
| :--- | :--- | :--- |
| 動作欄位 `positive`、`neutral`、`negative` | 呼叫端覆寫錯誤自帶的 | 呼叫端比轉換器更貼近當下情境 |
| `onConfirm` | 串接：呼叫端的先跑，錯誤自帶的後跑 | 攔截器掛的多為導頁這類終結動作，排最後才不會跳過呼叫端邏輯 |

來源：1. [useCamelotError.ts][]

### 多動作按鈕與重試

錯誤可帶 `positive`、`neutral`、`negative` 三顆按鈕，型別為 CamelotErrorAction，直接對映確認對話框的按鈕槽。

按鈕設定 `close: false` 時，按下後不自動關閉，由呼叫端自行控制關閉時機：

```ts
push({
  title: '連線失敗',
  message: '無法取得資料，請稍後再試。',
  positive: { label: '重試', close: false, handler: retry },
  negative: { label: '關閉' },
})

const retry = async () => {
  // 自行關閉，loading 才不會被對話框蓋住
  dismiss()
  const closeLoading = useLoading().open('重新連線中...')
  await request()
  closeLoading()
}
```

playground 首頁的 Global Error Queue 卡片有可操作的示範。

來源：1. [useCamelotError.ts][]　2. [index.vue][]

## 與其他機制的分工

| 機制 | 負責範圍 |
| :--- | :--- |
| useCamelotError | 非致命、可累積、需逐一提示的錯誤 |
| Nuxt 的 `useError` 與 `showError` | 致命錯誤：只承載單一 NuxtError，且會中止當前頁渲染、切換到錯誤頁 |
| [useBaseApi](../features/composables/useBaseApi.md) 的自動刷新 | 可自動回復的 401：在 API 層就地刷新 token 並重送，不進入本管線；刷新也失敗的 401 才由本管線處理 |
| [useCamelotToast](../features/composables/useCamelotToast.md) | 不需要使用者確認的輕量提示 |
| [useErrorRef](../features/composables/useErrorRef.md) | 只把多個錯誤 ref 匯總成一個 ref，不含佇列、轉換與顯示 |

## 相關頁面

- [useCamelotError](../features/composables/useCamelotError.md)
- [ErrorDialog](../features/components/ErrorDialog.md)
- [ConfirmDialog](../features/components/ConfirmDialog.md)
- [API 用戶端](./api-client.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotError.ts | [app/composables/useCamelotError.ts](../../../app/composables/useCamelotError.ts) |
| ErrorDialog.vue | [app/components/Camelot/ErrorDialog.vue](../../../app/components/Camelot/ErrorDialog.vue) |
| index.vue | [.playground/app/pages/index.vue](../../../.playground/app/pages/index.vue) |

[useCamelotError.ts]: #references
[ErrorDialog.vue]: #references
[index.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
