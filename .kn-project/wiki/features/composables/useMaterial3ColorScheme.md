# M3 色彩配置

## Summary

useMaterial3ColorScheme 管理 Material 3 的淺色與深色色彩配置，依目前色彩模式選出採用中的一組，寫進目標元素的 --cml-c-m3-* CSS 變數，值為 r,g,b 三元組。未傳目標元素時改走 useGlobalMaterial3ColorScheme，只更新全站共用的配置 ref，不寫任何 CSS 變數。同檔匯出預設色票與色鍵清單。

## 介面

### 簽章

```ts
const useMaterial3ColorScheme: (
  target?: MaybeElementRef,
  config?: Material3ColorSchemeConfig,
) => {
  mode, lightColorScheme, darkColorScheme, usedColorScheme,
}

const useGlobalMaterial3ColorScheme: (
  config?: Material3ColorSchemeConfig,
) => { mode, lightColorScheme, darkColorScheme, usedColorScheme }

type Material3ColorSchemeConfig = {
  lightColorScheme?: Material3ColorSchemePartial
  darkColorScheme?: Material3ColorSchemePartial
  editMode?: boolean
}

export type Material3ColorScheme = { /* primary、onPrimary、surface… 完整 M3 色票 */ }
export type Material3ColorSchemePartial = Partial<Material3ColorScheme>
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `target` | `MaybeElementRef` | — | 寫入 CSS 變數的元素；未傳時改走全域版本 |
| `config.lightColorScheme` | `Material3ColorSchemePartial` | 全域淺色配置 | 淺色模式配置 |
| `config.darkColorScheme` | `Material3ColorSchemePartial` | 全域深色配置 | 深色模式配置 |
| `config.editMode` | `boolean` | 視為 `true` | 明確為 `false` 時不寫 CSS 變數；只在有 `target` 時有作用 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `mode` | 色彩模式的可寫 ref | 來自 useCamelotColorMode 的 `store` |
| `lightColorScheme` | `Ref<Material3ColorSchemePartial>` | 淺色配置；全域版本回傳共用 ref |
| `darkColorScheme` | `Ref<Material3ColorSchemePartial>` | 深色配置；全域版本回傳共用 ref |
| `usedColorScheme` | `ComputedRef<Material3ColorSchemePartial>` | 依模式採用的配置；`auto` 時看系統偏好 |

### 匯出常數

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `defaultColorScheme` | `Material3ColorScheme` | 預設淺色 M3 色票 |
| `defaultDarkColorScheme` | `Material3ColorScheme` | 預設深色 M3 色票 |
| `Material3ColorSchemeKeys` | `(keyof Material3ColorScheme)[]` | 所有 M3 色鍵名 |

來源：1. [useMaterial3ColorScheme.ts][]　2. [useColorSchemeCssVars.ts][]

## 用法

```ts
// 更新全站共用配置（不寫 CSS 變數）
useMaterial3ColorScheme(undefined, {
  lightColorScheme: { primary: '#6750a4' },
  darkColorScheme: { primary: '#d0bcff' },
})

// 套用到特定元素
const el = ref<HTMLElement>()
useMaterial3ColorScheme(el, { lightColorScheme: { primary: '#005ac1' } })
```

Material3Provider 元件在掛載後以自己的容器為目標呼叫它，把 props 的淺深色配置套用到容器內。

來源：1. [Material3Provider.vue][]

## 規則

| 規則 | 說明 |
| --- | --- |
| 寫入時機 | 有目標元素時，以 immediate 監聽採用中的配置與目標元素，任一變動就重寫 |
| 寫入方式 | 委派給 `applyMaterial3CssVars`，hex 轉成 `r,g,b` 三元組，無法解析時寫入原值 |
| 變數命名 | `--cml-c-m3-` 加上色鍵的 kebab-case |
| 與自訂配色的差異 | useCustomColorScheme 寫原始色值，兩者各用一支寫入函式，只共用鍵名轉換快取 |
| 初始配置 | 有目標元素時，淺深色各取 `config` 值，沒有就取當下的全域值 |
| 深淺色來源 | 共用 useCamelotColorMode，不各自建立 useColorMode |
| 全域版本 | 傳入的配置直接取代模組層級的共用 ref，整站共用 |

## 相關頁面

- [useColorSchemeCssVars](./useColorSchemeCssVars.md)：CSS 變數單向寫入器。
- [useCamelotColorMode](./useCamelotColorMode.md)：共用色彩模式。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useMaterial3ColorScheme.ts | [app/composables/useMaterial3ColorScheme.ts](../../../../app/composables/useMaterial3ColorScheme.ts) |
| useColorSchemeCssVars.ts | [app/composables/useColorSchemeCssVars.ts](../../../../app/composables/useColorSchemeCssVars.ts) |
| Material3Provider.vue | [app/components/Camelot/Material3Provider.vue](../../../../app/components/Camelot/Material3Provider.vue) |

[useMaterial3ColorScheme.ts]: #references
[useColorSchemeCssVars.ts]: #references
[Material3Provider.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
