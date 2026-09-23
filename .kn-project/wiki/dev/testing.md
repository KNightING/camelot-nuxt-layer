# 單元測試

## Summary

本 Layer 以 Vitest 為 composables 寫單元測試，不啟動 Nuxt：設定檔 `vitest.config.ts` 用 unimport 重建 Nuxt 的自動匯入（vue、@vueuse/core 與 `app/composables`），Nuxt 執行期 API（useState、useAsyncData）改由 `tests/nuxt-stubs.ts` 的替身提供，測試環境為 happy-dom。測試檔放在 `tests/composables/*.test.ts`，以 `pnpm test` 執行一次；`pnpm typecheck` 會一併檢查測試檔的型別。

## 運作方式

### 執行測試

```bash
pnpm test
```

指令執行 Vitest 的單次模式，跑完所有測試即結束，不進入監看模式。

來源：1. [package.json][]

### 自動匯入

測試檔與被測的 composables 都直接呼叫 `ref`、`computed`、`useThrottleFn` 等函式而不寫 import，和在 Nuxt 裡一樣。

1. vue 的 API 全部自動匯入。
2. @vueuse/core 的 API 自動匯入，但 `toRef`、`toRefs`、`toValue` 排除，與 Nuxt 相同改用 vue 的版本。
3. Layer 自己的 composables 依名稱自動匯入。
4. `useState`、`useAsyncData` 指到測試替身。

來源：1. [vitest.config.ts][]

### Nuxt 替身

| 替身 | 行為 |
|---|---|
| `useState` | 同一個 key 共用同一個 ref，第一次取用時以初始函式建立 |
| `resetStates` | 清空所有狀態，供測試之間隔離 |
| `useAsyncData` | 立即執行 handler，回傳可 await 的物件，帶 `data` 與 `error` |

替身只模擬測試需要的部分，沒有 Nuxt 的 pending、refresh 與快取行為。

來源：1. [nuxt-stubs.ts][]

### 測試檔位置

1. 每個 composable 一個測試檔，放在測試資料夾的 composables 子目錄，檔名為 composable 名稱加上 test 後綴。
2. 測試檔以 Vitest 的 `describe`、`it`、`expect` 撰寫，需要時自行從 vitest 匯入。
3. 測試環境是 happy-dom，可使用 document、window 等瀏覽器 API。

來源：1. [vitest.config.ts][]　2. [useDrawerCollapsed.test.ts][]

### 模擬伺服器端

happy-dom 預設提供 window；要驗證 composable 在伺服器端呼叫不會出錯，參考無限捲動的測試做法：

1. 以 `createSSRApp` 建立一個在 setup 中呼叫 composable 的元件。
2. 暫時刪除全域的 window，模擬伺服器端沒有 window 的情況。
3. 以 vue 伺服器渲染的 `renderToString` 渲染，預期不拋錯並輸出正確的 HTML。
4. 在 finally 中把 window 還原，避免影響其他測試。

刪除 window 在型別上不被允許，測試以型別忽略註解標明這是刻意的。

來源：1. [useInfinitePage.test.ts][]

### 型別檢查

```bash
pnpm typecheck
```

Nuxt 產生的 tsconfig 涵蓋整個 Layer 目錄，測試檔也在檢查範圍內，因此測試裡的自動匯入也要能通過型別檢查。

來源：1. [package.json][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |

## References

| 來源 | 位置 |
|---|---|
| package.json | [package.json](../../../package.json) |
| vitest.config.ts | [vitest.config.ts](../../../vitest.config.ts) |
| nuxt-stubs.ts | [tests/nuxt-stubs.ts](../../../tests/nuxt-stubs.ts) |
| useDrawerCollapsed.test.ts | [tests/composables/useDrawerCollapsed.test.ts](../../../tests/composables/useDrawerCollapsed.test.ts) |
| useInfinitePage.test.ts | [tests/composables/useInfinitePage.test.ts](../../../tests/composables/useInfinitePage.test.ts) |

[package.json]: #references
[vitest.config.ts]: #references
[nuxt-stubs.ts]: #references
[useDrawerCollapsed.test.ts]: #references
[useInfinitePage.test.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
