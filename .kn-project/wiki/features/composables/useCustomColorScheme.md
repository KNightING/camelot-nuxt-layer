# useCustomColorScheme

## Summary

`useCustomColorScheme(target, config)` 在指定元素上套用可自訂的色彩方案，內容是 Material 3 色鍵加上 Camelot 的 rippleColor、maskColor，並隨深淺色切換寫入對應的 CSS 變數。目標是 html 元素時視為全域設定，所有全域呼叫端共用同一組方案與同一個 watcher；其他元素各自擁有方案。

## 運作方式

### 全域與區域

| 項目 | 全域：目標為 html 元素 | 區域：其他元素 |
| --- | --- | --- |
| 方案 ref | 模組層共用的淺色、深色方案 | 各自新建，初值為全域方案當下的值再疊上 config |
| config 的方案 | 合併進全域方案，影響全站 | 只套用到此元素 |
| CSS 變數寫入 | 模組層 watcher 只註冊一次 | 每次呼叫各註冊一個 watcher，元素變動時也重寫 |
| editable 為 false | 不生效，仍會寫入 | 不寫入任何變數 |

全域目標是共用的 html，單一呼叫端的唯讀意圖不足以代表其餘呼叫端，所以 editable 只對區域目標有效。全域 watcher 掛在獨立的 effect scope，不隨第一個呼叫的元件卸載而停止。

來源：1. [useCustomColorScheme.ts][]

### 深淺色判定

1. 深淺色來源是共用的 [useCamelotColorMode](./useCamelotColorMode.md)。
2. 設定為 auto 時看系統偏好，否則看設定值是否為 dark。
3. 採用中的方案隨判定結果在淺色與深色方案間切換，並寫入 CSS 變數。

變數命名與寫入方式見[色彩方案變數](./useColorSchemeCssVars.md)。

來源：1. [useCustomColorScheme.ts][]　2. [useCamelotColorMode.ts][]

### 規則

| 規則 | 說明 |
| --- | --- |
| 預設方案 | Material 3 的預設淺色與深色方案，rippleColor 與 maskColor 皆為 #111827 |
| 淺深色都要設定 | 切換方案不會刪除已寫入的變數，只會覆蓋；只設一邊時，另一邊可能留著舊值 |
| 伺服器端 | 三個方案都指向全域深色方案，不寫入任何 DOM |
| 色鍵清單 | 匯出的 `CamelotColorSchemeKeys` 由 Camelot 額外色的鍵推導 |

來源：1. [useCustomColorScheme.ts][]

## 用法

```ts
const el = ref<HTMLElement>()

const { usedColorScheme, mode } = useCustomColorScheme(el, {
  lightColorScheme: { primary: '#6750a4', rippleColor: '#111827' },
  darkColorScheme: { primary: '#d0bcff', rippleColor: '#111827' },
})

useCustomColorScheme(document.documentElement, {
  lightColorScheme: { primary: '#3366ff' },
  darkColorScheme: { primary: '#88aaff' },
})
```

## 簽章

```ts
useCustomColorScheme<T>(
  targetRef: MaybeElementRef,
  config?: {
    lightColorScheme?: CustomColorScheme<T>
    darkColorScheme?: CustomColorScheme<T>
    editable?: boolean
  },
): {
  mode: Ref<BasicColorSchema>
  lightColorScheme: Ref<CustomColorScheme<T>>
  darkColorScheme: Ref<CustomColorScheme<T>>
  usedColorScheme: ComputedRef<CustomColorScheme<T>>
}

type CustomColorScheme<T = any> = Material3ColorSchemePartial
  & Partial<{ rippleColor: string; maskColor: string }>
  & Partial<T>
```

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `targetRef` | `MaybeElementRef` | 必填 | 套用方案的元素；為 html 元素時視為全域 |
| `config.lightColorScheme` | `CustomColorScheme<T>` | `undefined` | 淺色方案 |
| `config.darkColorScheme` | `CustomColorScheme<T>` | `undefined` | 深色方案 |
| `config.editable` | `boolean` | 視為可寫入 | 只有明確為 `false` 時才停用，且僅對區域目標有效 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `mode` | `Ref<BasicColorSchema>` | 共用的深淺色設定，可寫，值為 auto、light、dark |
| `lightColorScheme` | `Ref<CustomColorScheme<T>>` | 淺色方案；全域時為共用 ref |
| `darkColorScheme` | `Ref<CustomColorScheme<T>>` | 深色方案；全域時為共用 ref |
| `usedColorScheme` | `ComputedRef<CustomColorScheme<T>>` | 依目前深淺色採用的方案 |

## 相關頁面

- [色彩方案變數](./useColorSchemeCssVars.md)
- [useMaterial3ColorScheme](./useMaterial3ColorScheme.md)
- [CustomColorSchemeProvider](../components/CustomColorSchemeProvider.md)
- [色彩主題系統](../../platform/color-scheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCustomColorScheme.ts | [app/composables/useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts) |
| useCamelotColorMode.ts | [app/composables/useCamelotColorMode.ts](../../../../app/composables/useCamelotColorMode.ts) |

[useCustomColorScheme.ts]: #references
[useCamelotColorMode.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
