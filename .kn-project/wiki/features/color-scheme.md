# 🎨 Color Scheme / 色彩主題系統

## Summary

Camelot 的色彩系統把 Material Design 3 色票（含 Camelot 額外色）轉成 CSS 變數注入 DOM，並隨深淺色模式自動切換。採雙變數策略以覆蓋 Tailwind v4 的 `:root` 主題色。全域色彩狀態與其副作用皆為**模組層單例**，區域覆蓋則由 Provider 綁定自身元素。

---

## 架構總覽

```mermaid
graph TD
    ColorMode["useCamelotColorMode()\n(模組層單例)"]
    GlobalProvider["ColorSchemeProvider\n(target = documentElement)"]
    ScopedProvider["CustomColorSchemeProvider\n(target = 自身元素)"]
    useCustom["useCustomColorScheme()"]
    GlobalWatcher["全域單例 watcher"]
    ScopedWatcher["per-instance watcher"]
    Writer["applyColorSchemeCssVars()\n單向寫入"]
    Html["&lt;html&gt; inline style"]
    El["Provider 元素 inline style"]
    Tailwind["Tailwind CSS v4\n(tailwind.css)"]

    GlobalProvider --> useCustom
    ScopedProvider --> useCustom
    ColorMode --> useCustom
    useCustom --> GlobalWatcher
    useCustom --> ScopedWatcher
    GlobalWatcher --> Writer
    ScopedWatcher --> Writer
    Writer --> Html
    Writer --> El
    Html --> Tailwind
```

`useMaterial3ColorScheme` 是獨立的並行路徑（值為 `r,g,b` 三元組），不在 `useCustomColorScheme` 之下。

---

## 訂閱模型（重要）

`useCamelotTheme()` 被 35 個 Camelot 元件檔呼叫，單頁可達數百個實例。因此下列狀態與副作用**一律收斂為模組層單例**，否則切換一次深淺色會產生數百份重複工作：

| 項目 | 位置 | 說明 |
| :--- | :--- | :--- |
| `useColorMode` 實例 | [useCamelotColorMode](./composables/useCamelotColorMode.md) | VueUse 每個實例都會註冊一份往 `<html>` 寫 class 的 watcher |
| `themeMode` storage ref | `useCamelotTheme` | 同分頁兩個 `useStorage` 實例不會互相同步，必須共用同一個 ref |
| 主題屬性 / 漸變過場 watcher | `useCamelotTheme` | 掛在 `globalThemeScope`（`effectScope(true)`） |
| 全域色彩方案 watcher | `useCustomColorScheme` | 所有全域呼叫端寫的都是同一個 `<html>` |

CSS 變數寫入本身是**單向**動作，由 [useColorSchemeCssVars](./composables/useColorSchemeCssVars.md) 直接 `setProperty`，不為每個變數建立響應式 ref。

---

## 核心 Composable

### `useCustomColorScheme<T>(targetRef, config?)`

**用途**：將色彩方案物件轉換為 CSS 自訂屬性 (CSS Variables)，並注入至指定 DOM 元素或全域 `:root`。

**參數**：

| 參數 | 型別 | 說明 |
| :--- | :--- | :--- |
| `targetRef` | `MaybeElementRef` | 目標 DOM 元素；傳入 `document.documentElement` 時視為全域設定 |
| `config.lightColorScheme` | `CustomColorScheme<T>` | 亮色模式色彩方案 |
| `config.darkColorScheme` | `CustomColorScheme<T>` | 暗色模式色彩方案 |
| `config.editable` | `boolean` | 預設 `true`；設為 `false` 時不更新 CSS 變數（唯讀模式）。**僅對非全域目標生效**——全域目標是共用的 `<html>`，單一呼叫端的唯讀意圖不足以代表其餘呼叫端 |

**回傳值**：

| 值 | 說明 |
| :--- | :--- |
| `mode` | 當前色彩模式 (`'light' \| 'dark' \| 'auto'`)，使用 VueUse `useColorMode` |
| `lightColorScheme` | 亮色方案 Ref |
| `darkColorScheme` | 暗色方案 Ref |
| `usedColorScheme` | 根據 `mode` 自動切換的當前方案 Computed |

**CSS 變數命名規則**：

```
Material3 鍵值 (e.g., primary)
  → --cml-c-m3-primary    (內部變數)
  → --color-primary       (Tailwind 覆蓋變數)

自訂 Camelot 鍵值 (e.g., rippleColor)
  → --cml-c-ripple-color  (內部變數)
  → --color-ripple-color  (Tailwind 覆蓋變數)
```

> [!NOTE]
> 因 Tailwind CSS v4 將主題色彩放置於 `:root`，直接修改會被覆蓋。Layer 採用雙變數策略：內部變數 (`--cml-c-*`) 儲存值，覆蓋變數 (`--color-*`) 指向內部變數。

---

## 型別定義

### `CustomColorScheme<T>`

```typescript
type CustomColorScheme<T = any> = 
  Material3ColorSchemePartial   // M3 色彩（primary, secondary, error, surface 等）
  & Partial<CamelotColorScheme> // Camelot 額外色彩（rippleColor, maskColor）
  & Partial<T>                  // 消費端自訂擴展
```

### `CamelotColorScheme`

```typescript
type CamelotColorScheme = {
  rippleColor: string  // 漣漪點擊效果顏色
  maskColor: string    // 遮罩顏色
}
```

---

## 元件說明

### `CamelotColorSchemeProvider`

**用途**：全域色彩方案注入元件，對整個應用程式套用 Material3 + Camelot 預設色彩方案，並支援亮/暗模式自動切換。

**使用方式**（消費端）：
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

### `CamelotCustomColorSchemeProvider`

**用途**：區域色彩方案覆蓋元件，可在特定 DOM 範圍內套用不同的色彩方案（支援 Scoped CSS 變數），而不影響全域主題。

---

## Material3 色彩角色對照

主要使用的 Tailwind CSS 色彩 Utility（由 `tailwind.css` 定義）：

| Tailwind Class | CSS 變數 | 語意 |
| :--- | :--- | :--- |
| `bg-primary` | `--color-primary` | 主要強調色 |
| `text-on-primary` | `--color-on-primary` | Primary 上的文字色 |
| `bg-surface` | `--color-surface` | 背景表面色 |
| `text-on-surface` | `--color-on-surface` | 表面上的文字色 |
| `bg-surface-container` | `--color-surface-container` | 容器背景色（Hover 等） |
| `text-outline` | `--color-outline` | 邊框/次要文字色 |
| `text-error` | `--color-error` | 錯誤/假日色 |

---

## 相關檔案

| 檔案 | 說明 |
| :--- | :--- |
| [app/composables/useCustomColorScheme.ts](../../../app/composables/useCustomColorScheme.ts) | 色彩方案核心 Composable |
| [app/composables/useMaterial3ColorScheme.ts](../../../app/composables/useMaterial3ColorScheme.ts) | Material Design 3 色彩生成工具 |
| [app/composables/useCamelotColorMode.ts](../../../app/composables/useCamelotColorMode.ts) | 全站共用的深淺色模式單一實例 |
| [app/composables/useColorSchemeCssVars.ts](../../../app/composables/useColorSchemeCssVars.ts) | CSS 變數單向寫入器 |
| [app/assets/css/tailwind.css](../../../app/assets/css/tailwind.css) | Tailwind v4 主題變數定義 |
| [app/components/Camelot/ColorSchemeProvider.vue](../../../app/components/Camelot/ColorSchemeProvider.vue) | 全域 Provider 元件 |
| [app/components/Camelot/CustomColorSchemeProvider.vue](../../../app/components/Camelot/CustomColorSchemeProvider.vue) | 區域 Provider 元件 |

---

[🏠 Wiki](../index.md)
