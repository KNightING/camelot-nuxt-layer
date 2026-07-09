# useObject

> 提供物件工具集：遞迴差異比較（`diff`，用於 RESTful PATCH 差份更新）、深拷貝、日期判斷、undefined 判斷。

## 簽章
```ts
export const useObject = () => ({
  diff,
  isDate,
  deepClone,
  isUndefined,
  isNotUndefined,
})

// 內部函式型別
const diff: <T>(oldObj: T, newObj: T) => PartialRecursive<T>
const isDate: (val: any) => val is Date
const deepClone: <T>(source: T) => T
const isUndefined: (obj: any) => boolean
const isNotUndefined: (obj: any) => boolean
```

其中：
```ts
export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<PartialRecursive<U>>
    : T[P] extends object
      ? PartialRecursive<T[P]>
      : T[P];
}
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `diff` | `<T>(oldObj: T, newObj: T) => PartialRecursive<T>` | 比較兩物件差異，回傳僅含差異欄位的（遞迴）部分物件。 |
| `isDate` | `(val: any) => val is Date` | 判斷是否為 `Date` 實例。 |
| `deepClone` | `<T>(source: T) => T` | 深拷貝（支援物件、陣列、`Date`）。 |
| `isUndefined` | `(obj: any) => boolean` | 判斷是否為 `undefined`。 |
| `isNotUndefined` | `(obj: any) => boolean` | `isUndefined` 的反向。 |

## 用法
```ts
const { diff, deepClone } = useObject()

const patch = diff(oldUser, newUser) // 僅含變更欄位
const copy = deepClone(oldUser)
```

## 備註
- `diff` 以 `newObj` 的 key 為主：`oldObj` 有、但 `newObj` 沒有的 key 不會被視為需更新（此類疑似刪除情境請在 RESTful 用 DELETE）。
- 陣列：長度不同或其中任一元素有差異時，整組陣列替換。
- `Date` 以 `getTime()` 比較是否相同。
- `deepClone` 遇到不支援的型別會拋出 `Unable to copy obj! Its type isn't supported.`。

---
[🏠 Wiki](../index.md)
