# useCamelotTheme

## Summary

`useCamelotTheme()` 管理 Camelot 的主題風格、深淺色與品牌色。主題風格有 material、cupertino、scifi、aqua 四種，預設 aqua，存在 localStorage；切換風格、深淺色或色系時，全站顏色以漸變過場。狀態與副作用都是模組層單例，數百個元件同時呼叫也只有一份。

## 運作方式

### 共用狀態

1. 主題風格是一個全站共用的 localStorage ref，鍵為 `cml-theme-mode`，在元件掛載後才讀取，避免 hydration 不一致。
2. 深淺色取自 [useCamelotColorMode](./useCamelotColorMode.md) 的共用實例。
3. 淺色與深色方案取自 [useCustomColorScheme](./useCustomColorScheme.md) 以 html 元素為目標的全域方案。
4. 每次呼叫新建的只有兩個設定色彩的函式，以及全域方案附帶的一個 computed。

主題風格 ref 與全域 watcher 掛在模組層的獨立 effect scope 上，不會因第一個呼叫的元件卸載而失效。

來源：1. [useCamelotTheme.ts][]　2. [useCamelotColorMode.ts][]　3. [useCustomColorScheme.ts][]

### 全域副作用

第一次在瀏覽器端呼叫時註冊兩個 watcher，之後不再重複註冊：

| watcher | 時機 | 動作 |
| --- | --- | --- |
| 主題風格 | 立即執行，之後每次變動 | 寫入 html 的 `--cml-active-ui-style` 與 `data-camelot-theme-mode` |
| 主題風格與深淺色 | 變動時，初次載入不觸發 | 觸發顏色漸變過場 |

來源：1. [useCamelotTheme.ts][]

### 顏色漸變過場

1. 沒有 document，或使用者偏好減少動態時，直接略過。
2. 在 html 加上 `cml-theme-transitioning` class。
3. 360ms 後移除；期間再次觸發只會重設同一個計時器。

設定品牌色或任一色鍵時也會觸發過場。此函式另可獨立匯入使用。

來源：1. [useCamelotTheme.ts][]

## 用法

```ts
const { themeMode, colorMode, setPrimaryColor } = useCamelotTheme()
themeMode.value = 'scifi'
colorMode.value = 'dark'
setPrimaryColor('#3366ff', '#88aaff')
```

## 簽章

```ts
useCamelotTheme(): {
  themeMode: Ref<CamelotThemeMode>
  colorMode: Ref<BasicColorSchema>
  lightColorScheme: Ref<CustomColorScheme>
  darkColorScheme: Ref<CustomColorScheme>
  setPrimaryColor: (lightColor: string, darkColor: string) => void
  setThemeColor: (key: string, lightColor: string, darkColor: string) => void
  triggerThemeTransition: () => void
}

type CamelotThemeMode = 'material' | 'cupertino' | 'scifi' | 'aqua'
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `themeMode` | `Ref<CamelotThemeMode>` | 目前主題風格，全站共用同一個 ref |
| `colorMode` | `Ref<BasicColorSchema>` | 深淺色設定，可為 auto、light、dark |
| `lightColorScheme` | `Ref<CustomColorScheme>` | 全域淺色方案 |
| `darkColorScheme` | `Ref<CustomColorScheme>` | 全域深色方案 |
| `setPrimaryColor` | `(lightColor, darkColor) => void` | 設定品牌主色，等同設定 primary 色鍵 |
| `setThemeColor` | `(key, lightColor, darkColor) => void` | 同時設定某色鍵的淺色與深色值，並觸發過場 |
| `triggerThemeTransition` | `() => void` | 手動觸發顏色漸變過場 |

## 相關頁面

- [主題系統](../../platform/theme-system.md)
- [色彩主題系統](../../platform/color-scheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotTheme.ts | [app/composables/useCamelotTheme.ts](../../../../app/composables/useCamelotTheme.ts) |
| useCamelotColorMode.ts | [app/composables/useCamelotColorMode.ts](../../../../app/composables/useCamelotColorMode.ts) |
| useCustomColorScheme.ts | [app/composables/useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts) |

[useCamelotTheme.ts]: #references
[useCamelotColorMode.ts]: #references
[useCustomColorScheme.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
