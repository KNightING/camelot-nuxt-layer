# useDrawerCollapsed

> 提供跨元件共享的抽屜收合狀態（全域單例 ref）。

## 簽章
```ts
useDrawerCollapsed(): Ref<boolean>
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `Ref<boolean>` | 共享的收合狀態，預設 `true`（收合）。 |

## 用法
```ts
const collapsed = useDrawerCollapsed()
collapsed.value = false // 展開抽屜
```

## 備註
- `drawerCollapsed` 為模組層級的單一 `ref`，所有呼叫共享同一份狀態。

---
[🏠 Wiki](../index.md)
