# useCamelotRouter

> 包裝 Vue Router 並維護自訂歷史堆疊，提供 single（task／only 模式）、路徑物件、返回判斷等進階導覽能力。

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
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `findHistory` | `(to, options?) => CamelotHistory \| undefined` | 於歷史堆疊尋找相符紀錄；`checkName`（預設 `true`）時具名路由以 name 比對，否則以 path 比對。 |
| `syncHistory` | `(to) => void` | 依 `router` 歷史 position 新增或更新（回歸／替換）堆疊紀錄。 |
| `back` | `(inApp = true) => void` | 返回上一頁；`inApp` 且無 App 內歷史時不作用。 |
| `forward` / `push` / `replace` / `go` | Router 原生方法 | 直接轉發自 `useRouter()`。 |
| `single` | `(to, options?) => Promise<void>` | 單例導覽，見下方模式說明。 |
| `canBack` | `() => boolean` | 是否有 `history.state.back`。 |
| `toPath` | `(path) => CamelotPath` | 建立 `CamelotPath` 物件。 |

## `single` 選項
`SingleOptions`：`replace?`（預設 `true`）、`checkName?`（預設 `true`）、`mode?`（`'task' | 'only'`，預設 `'task'`）。

| mode | 行為 |
| --- | --- |
| `task` | 從歷史堆疊找到相符頁，若存在且 `pos` 較淺則 `router.go(delta)` 回退再 `replace`；否則依 `replace` 直接導向。 |
| `only` | 清除歷史堆疊所有紀錄後再跳轉：必要時 hard reset 回退至最深處，清空堆疊，延遲後 `router.replace(to)`。 |

## `CamelotPath` 類別
| 成員 | 說明 |
| --- | --- |
| `constructor(path)` | 正規化路徑（去除重複 `/`、去除尾端 `/`）。 |
| `path` / `fullPath` / `name` | 取路徑／完整 URL（含 origin 與 baseURL）／解析後的路由 name。 |
| `to()` / `replace()` | 以 `navigateTo` 導覽（後者 `replace: true`）。 |
| `single(options?)` | 呼叫 `useCamelotRouter().single`。 |
| `append(path)` | 串接子路徑並回傳新的 `CamelotPath`。 |

## 用法
```ts
const { single, toPath, back } = useCamelotRouter()
await single({ path: '/home' }, { mode: 'only' })
await toPath('/user').append('profile').to({ query: { tab: 'info' } })
```

## 備註
- `historyStack` 為模組層 `ref`，跨呼叫共用。
- `single` 於 `go` 後以 `setTimeout` 延遲約 100ms 再 `replace`，等待歷史回退完成。

---
[🏠 Wiki](../index.md)
