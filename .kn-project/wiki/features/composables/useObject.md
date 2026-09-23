# useObject

## Summary

useObject 提供一組物件工具：diff 遞迴比較新舊物件並只回傳有差異的欄位，用於 RESTful PATCH 差份更新；deepClone 深拷貝物件、陣列、Date、Map 與 Set；另有 isDate、isUndefined、isNotUndefined 判斷函式。全部是純函式，不建立響應式狀態。

## 介面

### 簽章

```ts
const useObject: () => {
  diff: <T>(oldObj: T, newObj: T) => PartialRecursive<T>
  isDate: (val: any) => val is Date
  deepClone: <T>(source: T) => T
  isUndefined: (obj: any) => boolean
  isNotUndefined: (obj: any) => boolean
}

export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<PartialRecursive<U>>
    : T[P] extends object
      ? PartialRecursive<T[P]>
      : T[P];
}
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `diff` | `<T>(oldObj, newObj) => PartialRecursive<T>` | 回傳只含差異欄位的部分物件，巢狀物件也只留差異 |
| `isDate` | `(val) => val is Date` | 以 `instanceof Date` 判斷 |
| `deepClone` | `<T>(source) => T` | 深拷貝物件、陣列、`Date`、Map、Set，其餘值原樣回傳 |
| `isUndefined` | `(obj) => boolean` | 是否為 `undefined` |
| `isNotUndefined` | `(obj) => boolean` | `isUndefined` 的反向 |

來源：1. [useObject.ts][]

## 用法

```ts
const { diff, deepClone } = useObject()

const patch = diff(oldUser, newUser) // 只含變更欄位
const copy = deepClone(oldUser)
```

## 規則

### diff

| 情境 | 結果 |
| --- | --- |
| 只看新物件的鍵 | 舊物件有、新物件沒有的鍵不列入；這類刪除在 RESTful 上改用 DELETE |
| 舊值為 `undefined` | 直接採用新值 |
| 兩邊都是陣列 | 長度不同或任一元素有差異時，整組陣列換成新值 |
| 兩邊都是 `Date` | 以時間戳比較，不同時採用新值 |
| 新值是物件、舊值也是物件 | 遞迴比較，只留有差異的子欄位 |
| 其他值 | 以 `!==` 比較 |
| 舊值為 `null` 或原始值、新值為物件 | 視為整筆變更，採用新值 |

### deepClone

| 情境 | 結果 |
| --- | --- |
| `null`、原始值 | 原樣回傳 |
| `Date` | 複製成新的 `Date` |
| 陣列、一般物件 | 逐項遞迴複製 |
| Map、Set | 建立新的 Map、Set，逐項深拷貝鍵與值 |
| 無原型的物件 | 拋出 `Unable to copy obj! Its type isn't supported.` |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useObject.ts | [app/composables/useObject.ts](../../../../app/composables/useObject.ts) |

[useObject.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
