# Pinia 重置與釋放

## Summary

usePiniaClear 檔案匯出 usePiniaReset 與 usePiniaDispose：讀取目前 active Pinia 已建立的所有 store，產生以 store id 為鍵的方法表，逐一或以 all 一次呼叫 $reset 或 $dispose。常用於登出時清空全站狀態。

## 介面

### 簽章

```ts
const usePiniaReset: () => Record<string | 'all', () => void>
const usePiniaDispose: () => Record<string | 'all', () => void>
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `usePiniaReset()` | `Record<string \| 'all', () => void>` | 每個 store id 對應一個呼叫 `$reset` 的函式；`all` 重置全部 |
| `usePiniaDispose()` | `Record<string \| 'all', () => void>` | 每個 store id 對應一個呼叫 `$dispose` 的函式；`all` 釋放全部 |

來源：1. [usePiniaClear.ts][]

## 用法

```ts
const reset = usePiniaReset()
reset.all() // 重置所有 store
reset.user() // 重置 id 為 user 的 store

const dispose = usePiniaDispose()
dispose.all()
```

## 規則

| 規則 | 說明 |
| --- | --- |
| store 來源 | 以 `getActivePinia` 取得實例，讀取內部的 `_s` 表 |
| 沒有 Pinia | 拋出 `There is no stores` |
| 具名方法的範圍 | 只含呼叫當下已建立的 store；`all` 執行時才遍歷，會涵蓋之後建立的 store |
| `all` 的錯誤 | 每個 store 以 try／catch 包住，錯誤靜默忽略 |
| 具名方法的錯誤 | 不捕捉；setup store 未實作 `$reset`，開發模式下直接呼叫會拋錯 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| usePiniaClear.ts | [app/composables/usePiniaClear.ts](../../../../app/composables/usePiniaClear.ts) |

[usePiniaClear.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
