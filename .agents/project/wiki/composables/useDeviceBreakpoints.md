# useDeviceBreakpoints

> 以 Tailwind 斷點提供裝置類型（手機、平板、筆電、桌機）的響應式判斷。

## 簽章
```ts
useDeviceBreakpoints(): {
  isMobile: Ref<boolean>
  isTablet: ComputedRef<boolean>
  isLaptop: ComputedRef<boolean>
  isDesktop: Ref<boolean>
  breakpoints: ReturnType<typeof useBreakpoints>
}
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `isMobile` | `Ref<boolean>` | 小於 `md`。 |
| `isTablet` | `ComputedRef<boolean>` | 大於等於 `md` 且小於 `lg`。 |
| `isLaptop` | `ComputedRef<boolean>` | 大於等於 `lg` 且小於 `xl`。 |
| `isDesktop` | `Ref<boolean>` | 大於等於 `xl`。 |
| `breakpoints` | `ReturnType<typeof useBreakpoints>` | VueUse `useBreakpoints` 實例（`breakpointsTailwind`）。 |

## 用法
```ts
const { isMobile, isDesktop, breakpoints } = useDeviceBreakpoints()
```

## 備註
- 基於 `@vueuse/core` 的 `useBreakpoints` 與 `breakpointsTailwind`。

---
[🏠 Wiki](../index.md)
