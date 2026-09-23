# useCamelotRouter

## Summary

`useCamelotRouter()` 包裝 Vue Router，並維護一份模組層的 App 內歷史堆疊，提供 single 單例導覽、CamelotPath 路徑物件與返回判斷。single 有 task 與 only 兩種模式。堆疊由 Layer 內建的 camelotRouter plugin 在每次導覽完成後自動同步，使用端不必自行呼叫同步函式。

## 運作方式

### 歷史堆疊同步

1. plugin 在 router 的 afterEach 呼叫同步函式，此時網址與瀏覽器歷史狀態都已更新。
2. 以 router 歷史狀態的 position 作為這筆紀錄的位置。
3. 堆疊裡已有同一位置：視為返回或替換，截掉它之後的紀錄，並把路徑更新為含 query 的完整路徑。
4. 沒有同一位置：新增一筆，記錄路徑、路由名稱與位置。

來源：1. [useCamelotRouter.ts][]　2. [camelotRouter.ts][]

### single 單例導覽

目前位置取自瀏覽器歷史狀態的 position，沒有時視為 0。

| 模式 | 行為 |
| --- | --- |
| task | 在堆疊找相符頁；找到且位置比目前淺，就退回該位置，等 100ms 後 replace 成目標；否則依 replace 選項直接 replace 或 push |
| only | 堆疊有紀錄且目前位置比第一筆深時，先退回第一筆的位置；接著清空堆疊，等 100ms 後 replace 成目標 |

| 選項 | 預設 | 說明 |
| --- | --- | --- |
| `replace` | `true` | task 模式找不到相符頁時，以 replace 還是 push 導向 |
| `checkName` | `true` | 比對時具名路由以名稱為準，忽略 params 差異 |
| `mode` | `'task'` | 導覽模式 |

比對規則：開啟名稱比對且目標有路由名稱時先比名稱，否則比對路徑或解析後的路徑。

來源：1. [useCamelotRouter.ts][]

### 返回

1. canBack 讀 router 歷史狀態的 back 欄位，有值才算可返回。
2. back 預設只在可返回時呼叫 router.back；傳入 false 時不檢查、直接返回。

來源：1. [useCamelotRouter.ts][]

### CamelotPath

| 成員 | 說明 |
| --- | --- |
| 建構子 | 把連續兩個斜線合併成一個，並去掉結尾斜線，根路徑除外 |
| `path` | 正規化後的路徑 |
| `fullPath` | origin 加上 app.baseURL 再加路徑，路徑的開頭斜線會去掉 |
| `name` | 以 router 解析出的路由名稱 |
| `to(queryAndHash?)` | 以 navigateTo 導向 |
| `replace(queryAndHash?)` | 以 navigateTo 取代目前紀錄 |
| `single(options?)` | 呼叫 single，options 可另帶 queryAndHash |
| `append(path)` | 串接子路徑，回傳新的 CamelotPath |

來源：1. [useCamelotRouter.ts][]

## 用法

```ts
const { single, toPath, back } = useCamelotRouter()
await single({ path: '/home' }, { mode: 'only' })
await toPath('/user').append('profile').to({ query: { tab: 'info' } })
```

## 簽章

```ts
useCamelotRouter(): {
  findHistory: (to: RouteLocationRaw, options?: { checkName?: boolean }) => CamelotHistory | undefined
  syncHistory: (to: RouteLocationNormalized) => void
  back: (inApp?: boolean) => void
  forward: Router['forward']
  push: Router['push']
  replace: Router['replace']
  go: Router['go']
  single: (to: RouteLocationRaw, options?: SingleOptions) => Promise<void>
  canBack: () => boolean
  toPath: (path: string) => CamelotPath
}

type CamelotHistory = { path: string; name?: string | symbol | null; pos: number }
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `findHistory` | `(to, options?) => CamelotHistory \| undefined` | 在堆疊中尋找相符紀錄 |
| `syncHistory` | `(to) => void` | 依目前歷史位置新增或更新堆疊紀錄，plugin 已自動呼叫 |
| `back` | `(inApp = true) => void` | 返回上一頁 |
| `forward`、`push`、`replace`、`go` | Router 原生方法 | 直接轉發 useRouter 的方法 |
| `single` | `(to, options?) => Promise<void>` | 單例導覽 |
| `canBack` | `() => boolean` | 是否有上一頁 |
| `toPath` | `(path) => CamelotPath` | 建立路徑物件 |

## 相關頁面

- [BaseDialogV2](../components/BaseDialogV2.md)：關閉以 query 綁定的對話框時，以 canBack 決定返回上一頁或改為移除 query。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotRouter.ts | [app/composables/useCamelotRouter.ts](../../../../app/composables/useCamelotRouter.ts) |
| camelotRouter.ts | [app/plugins/camelotRouter.ts](../../../../app/plugins/camelotRouter.ts) |

[useCamelotRouter.ts]: #references
[camelotRouter.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
