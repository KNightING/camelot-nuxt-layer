# usePiniaReset / usePiniaDispose

> 取得目前 active Pinia 的所有 store，提供逐一或整體重置（`$reset`）與釋放（`$dispose`）的方法集合。

## 簽章
```ts
const usePiniaReset: () => Record<string | 'all', () => void>
const usePiniaDispose: () => Record<string | 'all', () => void>
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `usePiniaReset()` | `Record<string \| 'all', () => void>` | 以 store 名稱為鍵，各自呼叫 `store.$reset()`；`all` 一次重置所有 store。 |
| `usePiniaDispose()` | `Record<string \| 'all', () => void>` | 以 store 名稱為鍵，各自呼叫 `store.$dispose()`；`all` 一次釋放所有 store。 |

## 用法
```ts
const reset = usePiniaReset()
reset.all()        // 重置所有 store
reset.user()       // 重置名為 user 的 store

const dispose = usePiniaDispose()
dispose.all()
```

## 備註
- 透過 `getActivePinia()` 取得 Pinia 實例並讀取內部 `_s`（`Map<string, Store>`）。
- 若無 active Pinia，會拋出 `Error('There is no stores')`。
- 建立各 store 方法及執行 `all` 時皆以 try/catch 包裹，錯誤會被靜默忽略。

---
[🏠 Wiki](../index.md)
