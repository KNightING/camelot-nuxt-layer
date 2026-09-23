# useDeviceBreakpoints

## Summary

`useDeviceBreakpoints()` 以 Tailwind 預設斷點判斷裝置類型，回傳手機、平板、筆電、桌機四個響應式布林值，以及底層的 VueUse breakpoints 實例。每次呼叫都建立新的 breakpoints 實例。

## 運作方式

以 VueUse 的 useBreakpoints 搭配 Tailwind 斷點表，四個類型互斥：

| 類型 | 條件 | 寬度 |
| --- | --- | --- |
| 手機 | 小於 md | 未滿 768px |
| 平板 | 大於等於 md 且小於 lg | 768px 到未滿 1024px |
| 筆電 | 大於等於 lg 且小於 xl | 1024px 到未滿 1280px |
| 桌機 | 大於等於 xl | 1280px 以上 |

來源：1. [useDeviceBreakpoints.ts][]

## 用法

```ts
const { isMobile, isDesktop, breakpoints } = useDeviceBreakpoints()
const isWide = breakpoints.greaterOrEqual('2xl')
```

## 簽章

```ts
useDeviceBreakpoints(): {
  isMobile: ComputedRef<boolean>
  isTablet: ComputedRef<boolean>
  isLaptop: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  breakpoints: ReturnType<typeof useBreakpoints>
}
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isMobile` | `ComputedRef<boolean>` | 手機寬度 |
| `isTablet` | `ComputedRef<boolean>` | 平板寬度 |
| `isLaptop` | `ComputedRef<boolean>` | 筆電寬度 |
| `isDesktop` | `ComputedRef<boolean>` | 桌機寬度 |
| `breakpoints` | `ReturnType<typeof useBreakpoints>` | 以 Tailwind 斷點建立的 VueUse 實例，可自行查詢其他斷點 |

## 相關頁面

- [Breakpoints](../components/Breakpoints.md)
- [DateV2](../components/DateV2.md)
- [DateRangeV2](../components/DateRangeV2.md)
- [TimeV2](../components/TimeV2.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useDeviceBreakpoints.ts | [app/composables/useDeviceBreakpoints.ts](../../../../app/composables/useDeviceBreakpoints.ts) |

[useDeviceBreakpoints.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
