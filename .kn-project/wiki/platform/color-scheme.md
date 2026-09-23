# 色彩主題系統

## Summary

Camelot 的色彩系統（Color Scheme）把 Material Design 3 色票與 Camelot 額外色轉成 CSS 變數注入 DOM，並隨深淺色模式自動切換。以雙變數策略蓋過 Tailwind v4 放在 `:root` 的主題色。全域色彩狀態與其副作用都是模組層單例；區域覆蓋由 `CamelotCustomColorSchemeProvider` 綁定自身元素。核心 composable 是 `useCustomColorScheme`。

## 運作方式

### 架構總覽

這張圖回答：色彩方案從 Provider 到畫面，中間經過哪些單元？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "色彩方案注入",
  "desc": "全域與區域 Provider 都經色彩方案 composable 建立 watcher，再由單向寫入器把 CSS 變數寫到 html 或 Provider 元素",
  "nodes": [
    {"id": "ColorMode", "text": "深淺色單例", "kind": "data"},
    {"id": "GlobalProvider", "text": "全域 Provider", "shape": "stadium"},
    {"id": "ScopedProvider", "text": "區域 Provider", "shape": "stadium"},
    {"id": "useCustom", "text": "色彩方案函式", "key": true},
    {"id": "GlobalWatcher", "text": "全域監聽"},
    {"id": "ScopedWatcher", "text": "逐實例監聽"},
    {"id": "Writer", "text": "單向寫入器"},
    {"id": "Html", "text": "html 樣式"},
    {"id": "El", "text": "Provider 元素"},
    {"id": "Tailwind", "text": "Tailwind 色"}
  ],
  "edges": [
    {"from": "GlobalProvider", "to": "useCustom"},
    {"from": "ScopedProvider", "to": "useCustom"},
    {"from": "ColorMode", "to": "useCustom"},
    {"from": "useCustom", "to": "GlobalWatcher", "label": "全域目標"},
    {"from": "useCustom", "to": "ScopedWatcher", "label": "區域目標"},
    {"from": "GlobalWatcher", "to": "Writer"},
    {"from": "ScopedWatcher", "to": "Writer"},
    {"from": "Writer", "to": "Html"},
    {"from": "Writer", "to": "El"},
    {"from": "Html", "to": "Tailwind"}
  ]
}
```

![色彩方案注入](color-scheme.圖1.svg)

`useMaterial3ColorScheme` 是獨立的並行路徑，值為 r、g、b 三元組，不經過 `useCustomColorScheme`。

來源：1. [useCustomColorScheme.ts][]　2. [useColorSchemeCssVars.ts][]　3. [useMaterial3ColorScheme.ts][]

### 訂閱模型

`useCamelotTheme` 被數十個 Camelot 元件呼叫，單頁可達數百個實例。

下列狀態與副作用一律收斂為模組層單例，否則切換一次深淺色會產生數百份重複工作：

| 項目 | 位置 | 說明 |
| :--- | :--- | :--- |
| `useColorMode` 實例 | [useCamelotColorMode](../features/composables/useCamelotColorMode.md) | VueUse 每個實例都會註冊一份往 html 寫 class 的 watcher |
| 主題風格 storage ref | `useCamelotTheme` | 同分頁兩個 storage 實例不會互相同步，必須共用同一個 ref |
| 主題屬性與漸變過場 watcher | `useCamelotTheme` | 掛在模組層的 detached effect scope |
| 全域色彩方案 watcher | `useCustomColorScheme` | 所有全域呼叫端寫的都是同一個 html 元素 |

CSS 變數寫入是單向動作，由 [useColorSchemeCssVars](../features/composables/useColorSchemeCssVars.md) 直接 setProperty，不為每個變數建立響應式 ref。

來源：1. [useCamelotColorMode.ts][]　2. [useCamelotTheme.ts][]　3. [useCustomColorScheme.ts][]　4. [useColorSchemeCssVars.ts][]

### CSS 變數命名

Tailwind v4 把主題色放在 `:root`，直接修改會被覆蓋，所以採雙變數策略：

1. 內部變數存實際色值：Material3 色鍵前綴 `--cml-c-m3-`，Camelot 與消費端自訂色鍵前綴 `--cml-c-`。
2. 覆蓋變數 `--color-*` 指向內部變數，Tailwind 的色彩 utility 讀它。

| 色鍵 | 內部變數 | 覆蓋變數 |
| :--- | :--- | :--- |
| Material3 的 primary | `--cml-c-m3-primary` | `--color-primary` |
| Camelot 的 rippleColor | `--cml-c-ripple-color` | `--color-ripple-color` |

來源：1. [useColorSchemeCssVars.ts][]

## useCustomColorScheme

把色彩方案物件轉成 CSS 變數，注入指定 DOM 元素或全域 html。呼叫形式為目標元素加上選填設定。

### 參數

| 參數 | 型別 | 說明 |
| :--- | :--- | :--- |
| `targetRef` | `MaybeElementRef` | 目標 DOM 元素；傳入 `document.documentElement` 時視為全域設定 |
| `config.lightColorScheme` | `CustomColorScheme<T>` | 亮色模式色彩方案 |
| `config.darkColorScheme` | `CustomColorScheme<T>` | 暗色模式色彩方案 |
| `config.editable` | `boolean` | 設為 `false` 時不更新 CSS 變數；只對非全域目標生效，因為全域目標是共用的 html |

來源：1. [useCustomColorScheme.ts][]

### 回傳值

| 值 | 說明 |
| :--- | :--- |
| `mode` | 目前色彩模式，來自全站共用的深淺色單例 |
| `lightColorScheme` | 亮色方案 Ref；全域目標共用同一個 |
| `darkColorScheme` | 暗色方案 Ref；全域目標共用同一個 |
| `usedColorScheme` | 依深淺色自動切換的目前方案 Computed |

來源：1. [useCustomColorScheme.ts][]

## 型別定義

### CustomColorScheme

```typescript
type CustomColorScheme<T = any> =
  Material3ColorSchemePartial   // M3 色彩（primary, secondary, error, surface 等）
  & Partial<CamelotColorScheme> // Camelot 額外色彩（rippleColor, maskColor）
  & Partial<T>                  // 消費端自訂擴展
```

### CamelotColorScheme

```typescript
type CamelotColorScheme = {
  rippleColor: string  // 漣漪點擊效果顏色
  maskColor: string    // 遮罩顏色
}
```

來源：1. [useCustomColorScheme.ts][]

## 元件

### CamelotColorSchemeProvider

全域色彩方案注入元件：對整個應用程式套用 Material3 與 Camelot 預設色彩方案，並隨深淺色自動切換。

```vue
<template>
  <CamelotColorSchemeProvider
    :light-color-scheme="myLightScheme"
    :dark-color-scheme="myDarkScheme"
  >
    <NuxtPage />
  </CamelotColorSchemeProvider>
</template>
```

來源：1. [ColorSchemeProvider.vue][]

### CamelotCustomColorSchemeProvider

區域色彩方案覆蓋元件：在特定 DOM 範圍內套用不同的色彩方案，不影響全域主題。

來源：1. [CustomColorSchemeProvider.vue][]

## Material3 色彩角色對照

常用的 Tailwind 色彩 utility，由全域樣式表定義：

| Tailwind Class | CSS 變數 | 語意 |
| :--- | :--- | :--- |
| `bg-primary` | `--color-primary` | 主要強調色 |
| `text-on-primary` | `--color-on-primary` | Primary 上的文字色 |
| `bg-surface` | `--color-surface` | 背景表面色 |
| `text-on-surface` | `--color-on-surface` | 表面上的文字色 |
| `bg-surface-container` | `--color-surface-container` | 容器背景色，例如 Hover |
| `text-outline` | `--color-outline` | 邊框與次要文字色 |
| `text-error` | `--color-error` | 錯誤與假日色 |

來源：1. [tailwind.css][]

## 相關頁面

- [主題系統](./theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCustomColorScheme.ts | [app/composables/useCustomColorScheme.ts](../../../app/composables/useCustomColorScheme.ts) |
| useColorSchemeCssVars.ts | [app/composables/useColorSchemeCssVars.ts](../../../app/composables/useColorSchemeCssVars.ts) |
| useMaterial3ColorScheme.ts | [app/composables/useMaterial3ColorScheme.ts](../../../app/composables/useMaterial3ColorScheme.ts) |
| useCamelotColorMode.ts | [app/composables/useCamelotColorMode.ts](../../../app/composables/useCamelotColorMode.ts) |
| useCamelotTheme.ts | [app/composables/useCamelotTheme.ts](../../../app/composables/useCamelotTheme.ts) |
| ColorSchemeProvider.vue | [app/components/Camelot/ColorSchemeProvider.vue](../../../app/components/Camelot/ColorSchemeProvider.vue) |
| CustomColorSchemeProvider.vue | [app/components/Camelot/CustomColorSchemeProvider.vue](../../../app/components/Camelot/CustomColorSchemeProvider.vue) |
| tailwind.css | [app/assets/css/tailwind.css](../../../app/assets/css/tailwind.css) |

[useCustomColorScheme.ts]: #references
[useColorSchemeCssVars.ts]: #references
[useMaterial3ColorScheme.ts]: #references
[useCamelotColorMode.ts]: #references
[useCamelotTheme.ts]: #references
[ColorSchemeProvider.vue]: #references
[CustomColorSchemeProvider.vue]: #references
[tailwind.css]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
