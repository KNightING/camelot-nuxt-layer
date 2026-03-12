# Camelot Nuxt Layer

本專案為一個基於 **Nuxt 4** 的 Layer，旨在為多個專案提供統一的 UI 元件系統（Camelot UI）、狀態管理（Pinia）、多語系（i18n）以及樣式核心（Tailwind CSS v4）。

## 🚀 專案核心技術棧

- **核心框架**: Nuxt 4.x
- **樣式引擎**: Tailwind CSS v4
- **狀態管理**: Pinia (Setup Store 模式)
- **多語系**: Nuxt i18n v10
- **工具庫**: VueUse, Change Case

---

## 📱 設備相容性 (Device Compatibility)

本專案已針對 **iOS 17 及其 WebView** 進行了深度優化，解決了以下常見問題：

### 1. 解決 iOS 17 WebKit 渲染 Bug
- **虛擬滾動修正**: 針對 `SelectV2.vue` 在 iOS 17 下因 Grid 動畫導致虛擬列表不顯示的問題，實作了修正機制。
- **背景遮罩穩定性**: 針對 iOS WebKit 對現代 CSS `rgba(from ...)` 語法的渲染不穩定，我們對 Dialog 與 BottomSheet 採用 `color-mix` 並配合 standard rgba 進行兜底（Fallback），改善透明背景顯示。

### 2. 安全上下文與 API
- **UUID 生成**: 針對 `useCamelotToast` 在 HTTP (非安全上下文) 環境下的支援，當 `crypto.randomUUID()` 不可用時會自動回退到隨機碼。
- **CSS 單位**: 全域 `dvh` / `svh` 單位已針對 iOS 環境進行了優化佈局，並具備相容性 Fallback。

---

## 📦 如何在專案中使用

### 1. 建議依賴 (package.json)

在您的專案 `package.json` 中，建議參考以下依賴配置：

```json
  "devDependencies": {
    "@nuxt/eslint": "^1.0.0",
    "@nuxtjs/i18n": "^10.0.0",
    "@pinia/nuxt": "^0.11.0",
    "@vueuse/nuxt": "^14.0.0",
    "nuxt": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "unplugin-icons": "^23.0.0",
    "unplugin-vue-components": "^31.0.0"
  },
  "dependencies": {
    "pinia": "^3.0.0",
    "pinia-plugin-persistedstate": "^4.0.0",
    "@vueuse/core": "^14.0.0",
    "@vueuse/components": "^14.0.0",
    "@vueuse/integrations": "^14.0.0",
    "change-case": "^5.4.4"
  }
```

### 2. 第一步配置 `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  extends: [
      "github:KNightING/camelot-nuxt-layer", // GitHub 遠端來源
  ],
});
```

---

## 🌍 i18n 語系詳細配置

在您的 `nuxt.config.ts` 中可以參考以下設置：

```ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en-us',
        file: 'en-us.json',
      },
      {
        name: '正體中文',
        code: 'zh-tw',
        file: 'zh-tw.json',
      },
    ],
    lazy: true,
    defaultLocale: 'zh-tw',

    //路由策略 https://v8.i18n.nuxtjs.org/options/routing#strategy
    strategy: 'no_prefix',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      cookieCrossOrigin: true,
      cookieSecure: true,
      redirectOn: 'root',
    },
    vueI18n: './i18n.config.ts',
  },
})
```

並且將 `lang` 資料夾與 `i18n.config.ts` 放置於根目錄。

---

## 🎨 TailwindCSS 佈局規範

專案內建了針對現代瀏覽器與 iOS WebView 的 Reset 樣式：

```css
/* 內建於 tailwind.css 中的核心 Reset */
* {
  box-sizing: border-box;
  min-width: 0;
}

/* 現代文字排版支援 (iOS 17+) */
h1, h2, h3, h4 { text-wrap: balance; }
p { text-wrap: pretty; }
```

---

## 🛠 開發指南 (Drop Code)

本專案提供基於 ESBuild label 的代碼移除功能，可在 `pnpm generate` 或 `pnpm build` 時剔除特定標籤的代碼（不影響 `nuxt dev`）。

### 使用 ESBuild Drop Labels
您可以使用 `DEV:` 標籤來標註僅供開發使用的檢查邏輯：

```js
function example() {
  DEV: doAnExpensiveCheck() // 生產環境會自動移除此行
  return normalCodePath()
}
```

### 構建指令
```bash
pnpm generate --drop-code
```

詳細請參考 [ESBuild 官方文件 - Drop Labels](https://esbuild.github.io/api/#drop-labels)

---
*Last Updated: 2026-03-12*
