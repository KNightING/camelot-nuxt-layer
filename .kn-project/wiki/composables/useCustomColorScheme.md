# useCustomColorScheme

> 在指定元素（或全域 `document.documentElement`）上套用可自訂的 Material 3 色彩配置與 Camelot 額外色（rippleColor / maskColor），並隨明暗模式切換為對應 CSS 變數。

## 簽章
```ts
export const useCustomColorScheme = <T>(
  targetRef: MaybeElementRef,
  config?: {
    lightColorScheme?: CustomColorScheme<T>
    darkColorScheme?: CustomColorScheme<T>
    editable?: boolean
  },
) => {
  mode,
  lightColorScheme,
  darkColorScheme,
  usedColorScheme,
}
```

其中：
```ts
type CamelotColorScheme = {
  rippleColor: string
  maskColor: string
}

export type CustomColorScheme<T = any> = Material3ColorSchemePartial
  & Partial<CamelotColorScheme>
  & Partial<T>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `targetRef` | `MaybeElementRef` | （必填） | 套用色彩配置的目標元素。當等於 `document.documentElement` 時視為全域設定（`isGlobal`）。 |
| `config.lightColorScheme` | `CustomColorScheme<T>` | `undefined` | 淺色模式色彩配置。全域時會合併進 `globalLightColorScheme`；非全域時只套用到此 target。 |
| `config.darkColorScheme` | `CustomColorScheme<T>` | `undefined` | 深色模式色彩配置。全域時會合併進 `globalDarkColorScheme`；非全域時只套用到此 target。 |
| `config.editable` | `boolean` | `true`（僅在 `=== false` 時停用） | 為 `false` 時不寫入任何 CSS 變數。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `mode` | `useColorMode().store` | 目前色彩模式（`'auto' \| 'light' \| 'dark'`）的可寫 ref。 |
| `lightColorScheme` | `Ref<CustomColorScheme<T>>` | 淺色模式色彩配置 ref（全域時為共用的 `globalLightColorScheme`）。 |
| `darkColorScheme` | `Ref<CustomColorScheme<T>>` | 深色模式色彩配置 ref（全域時為共用的 `globalDarkColorScheme`）。 |
| `usedColorScheme` | `ComputedRef<CustomColorScheme<T>>` | 依目前模式（`auto` 時看系統偏好）計算出實際採用的色彩配置。 |

## 用法
```ts
const el = ref<HTMLElement>()

const { usedColorScheme, mode } = useCustomColorScheme(el, {
  lightColorScheme: {
    primary: '#6750a4',
    rippleColor: '#111827',
  },
  darkColorScheme: {
    primary: '#d0bcff',
    rippleColor: '#111827',
  },
})

// 全域設定
useCustomColorScheme(document.documentElement, { /* ... */ })
```

## 備註
- 建議自訂顏色時 light / dark 兩種模式都要設定，因為切換主題不會刪除已設定過的變數，只會以覆蓋方式更新。
- 屬於 `Material3ColorSchemeKeys` 的鍵會寫入 `--cml-c-m3-<kebab>`；其餘鍵寫入 `--cml-c-<kebab>`。
- 因 Tailwind V4 會將變數放到 `:root` 導致無法覆蓋，故對每個鍵另外設定 `--color-<kebab>: var(<cssVarKey>)` 以覆蓋 Tailwind。
- CSS 變數以 `inherit: false` 讀取（僅讀 inline style）。
- 非客戶端（SSR）情況下回傳的三個 scheme 皆為 `globalDarkColorScheme`，且不進行任何 DOM 寫入。
- `CamelotColorSchemeKeys` 由 `CamelotColorScheme` 的鍵推導而得。

---
[🏠 Wiki](../index.md)
