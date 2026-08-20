# Camelot Nuxt Layer

以 **Nuxt 4 Layer** 形式封裝的 UI 元件函式庫，為多個專案提供統一的 UI 元件系統（Camelot UI）、Composables、狀態管理（Pinia）、多語系（i18n）與樣式核心（Tailwind CSS v4）。

> 套件名稱 `camelot-nuxt3-layer`。**版本、依賴版本一律以 [`package.json`](./package.json) 為準**，本文件不重複標示版本號。

## 🚀 技術棧

| 項目 | 內容 |
| :--- | :--- |
| 框架 | Nuxt 4 + Vue 3（Composition API、`<script setup>`） |
| 樣式 | Tailwind CSS v4（主題定義於 `app/assets/css/tailwind.css`） |
| 狀態管理 | Pinia + `pinia-plugin-persistedstate` |
| 多語系 | `@nuxtjs/i18n`（Layer 提供 `en` / `zh` 語言層級基底） |
| 日期處理 | date-fns |
| 富文本 | TipTap |
| 圖示 | unplugin-icons（Material Symbols / IC） |
| 工具集 | VueUse、change-case |
| 套件管理 | pnpm |

---

## 📦 在專案中使用

### 1. 設定 `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  extends: [
    'github:KNightING/camelot-nuxt-layer', // GitHub 遠端來源
  ],
})
```

### 2. 安裝必要依賴（**必裝，非選配**）

> [!IMPORTANT]
> `extends: ['github:...']` 由 c12/giget 將 Layer 原始碼抓進消費端的 `.c12/` 目錄，**該目錄不會安裝 Layer 自己的依賴**。Layer 的程式碼是沿著 `node_modules` 向上解析到**消費端專案**的。
>
> 因此以下被 Layer 原始碼直接 import 的套件，**消費端必須自行宣告**。少裝任何一項都不會在安裝階段報錯，而是**等到用到該元件被編譯時才爆**（延遲失敗，最難排查）。

```jsonc
{
  "devDependencies": {
    "@nuxt/eslint": "^1.17.0",
    "@nuxt/kit": "^4.0.0",          // 必要：modules/ 由 jiti 以 CJS require.resolve 載入
    "@nuxtjs/i18n": "^10.6.0",
    "@pinia/nuxt": "^1.0.0",
    "@vueuse/nuxt": "^14.4.0",
    "nuxt": "^4.5.0",
    "typescript": "^6.0.0",
    "unplugin-icons": "^23.0.0",
    "unplugin-vue-components": "^32.0.0"
  },
  "dependencies": {
    "@iconify-json/ic": "^1.2.4",
    "@iconify-json/material-symbols": "^1.2.88",
    "@tailwindcss/vite": "^4.3.0",  // 必要：Layer 的 nuxt.config.ts 直接 import
    "@tiptap/core": "^3.30.0",
    "@tiptap/extension-image": "^3.30.0",
    "@tiptap/extension-link": "^3.30.0",
    "@tiptap/extension-placeholder": "^3.30.0",
    "@tiptap/pm": "^3.30.0",
    "@tiptap/starter-kit": "^3.30.0",
    "@tiptap/vue-3": "^3.30.0",
    "@vueuse/components": "^14.4.0",
    "@vueuse/core": "^14.4.0",
    "@vueuse/integrations": "^14.4.0",
    "change-case": "^5.4.4",
    "date-fns": "^4.4.0",
    "pinia": "^4.0.0",
    "pinia-plugin-persistedstate": "^4.7.0",
    "tailwindcss": "^4.3.0"
  }
}
```

各套件的來源對照：

| 套件 | 被誰 import |
| :--- | :--- |
| `@tailwindcss/vite` | Layer 的 `nuxt.config.ts`（載入 Layer config 當下就需要） |
| `@nuxt/kit` | `modules/buildHook.ts`、`modules/echartModule.ts`、`modules/tappay.ts` |
| `@tiptap/*` | `app/components/Camelot/RichTextEditor.vue` |
| `date-fns` | 日期元件（`DateV2` / `DateRangeV2` / `TimeV2`）與相關 composables |
| `change-case` | composables |
| `@iconify-json/material-symbols`、`@iconify-json/ic` | 元件內的 `~icons/...` 虛擬模組 |
| `pinia`、`pinia-plugin-persistedstate`、`@vueuse/*` | stores 與 composables |

### 3. 常見整合失敗與排查

| 症狀 | 原因 | 解法 |
| :--- | :--- | :--- |
| `pnpm dev` 啟動即中止：`Cannot find module '@nuxt/kit'` | `modules/*.ts` 由 jiti 以 CJS `require.resolve('@nuxt/kit')` 載入。pnpm 嚴格 `node_modules` 不提升傳遞依賴，消費端未直接宣告時解析不到。 | 在消費端 `package.json` 明確加入 `@nuxt/kit`。 |
| 某個頁面/元件首次渲染時才報 Cannot find module | Layer 依賴不隨 `extends` 安裝，缺的套件要到該元件被編譯時才觸發解析。 | 對照上方必裝清單補齊，別只裝報錯的那一個。 |
| Tailwind 樣式完全沒套用 | 消費端缺 `@tailwindcss/vite` 或 `tailwindcss`。 | 兩者都要裝。 |

---

## 🌍 i18n 語系配置

Layer 只提供**語言層級基底**（`i18n/locales/en.json`、`zh.json`，`zh` 為繁體），區域語系（CLDR 代碼如 `zh-Hant-TW`、`zh-Hans-CN`）由消費端註冊並 fallback 回基底。Layer 自身的 `nuxt.config.ts` 宣告 `locales: []`、`defaultLocale: undefined`，由消費端決定。

消費端 `nuxt.config.ts` 範例：

```ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      { name: 'English', code: 'en-US', language: 'en-US', file: 'en-US.json' },
      // 區域語系需排在通用基底之前：
      // 瀏覽器語系（如 zh-TW）以語言前綴比對時，取清單中第一個命中者
      { name: '正體中文（台灣）', code: 'zh-Hant-TW', language: 'zh-Hant-TW', file: 'zh-Hant-TW.json' },
      { name: '繁體中文（香港）', code: 'zh-Hant-HK', language: 'zh-Hant-HK', file: 'zh-Hant-HK.json' },
    ],
    defaultLocale: 'zh-Hant-TW',
    restructureDir: 'i18n',
    langDir: 'locales',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },
})
```

完整可跑的範例（含 fallback 鏈設定）見 [`.playground/i18n/`](./.playground/i18n/)。

> [!WARNING]
> **已知限制：Layer 的基底字典目前不會被註冊。**
>
> `@nuxtjs/i18n` 的跨 layer 合併以 **locale code 為鍵**，且每個 layer 的 `file` / `files` 只在**該 layer 自己的 `langDir`** 內解析。本 Layer 宣告 `locales: []`，不貢獻任何 code，因此 `i18n/locales/{en,zh}.json` **永遠不會進入合併結果**；消費端若寫 `files: ['zh.json', ...]` 想疊加 Layer 的基底字典，該路徑會用**消費端的** `langDir` 解析而 ENOENT。
>
> 這是 Layer 端的缺陷，消費端無法繞過。**目前的因應方式是消費端自帶完整詞條**，不要依賴 Layer 的基底字典。修復需在 Layer 的 `nuxt.config.ts` 補回 `{ code: 'zh', file: 'zh.json' }` / `{ code: 'en', file: 'en.json' }`，已另案追蹤。

詳見 [i18n 語系系統 Wiki](./.kn-project/wiki/features/i18n-locales.md)。

---

## 🎨 主題系統

所有 Camelot 元件支援四種視覺風格，**預設為 `aqua`（Frosted Glass）**：

| 風格 | 說明 |
| :--- | :--- |
| `aqua` | 玻璃擬態（預設），hairline 邊框 |
| `material` | Material Design |
| `cupertino` | iOS 風格 |
| `scifi` | 科幻風格 |

風格為全站單一狀態，透過 `useCamelotTheme()` 切換並持久化於 `localStorage`（鍵 `cml-theme-mode`）。色彩主題（明暗、色系）另由 `useCustomColorScheme` / `useCamelotColorMode` 管理。

完整說明見 [主題系統 Wiki](./.kn-project/wiki/features/theme-system.md) 與 [色彩主題 Wiki](./.kn-project/wiki/features/color-scheme.md)。

---

## 🧩 Layer 提供的內容

### Nuxt 模組（`modules/`）

| 模組 | 說明 |
| :--- | :--- |
| `tappay` | 依 `runtimeConfig` 條件注入 TapPay SDK |
| `googleFont` | 自動注入 Noto Sans TC Google Fonts（預設啟用） |
| `buildHook` | 建置期 Hook |
| `echartModule` | ECharts 整合 |

### Server（`server/`）

| 項目 | 說明 |
| :--- | :--- |
| `plugins/securityPlugin` | CSP Headers、Nonce 注入、安全 HTTP 標頭 |
| `api/version` | `GET /api/version` — 回傳應用程式版本號 |
| `api/health` | `GET /api/health` — 健康檢查 |

### Middleware（`app/middleware/`）

| 項目 | 說明 |
| :--- | :--- |
| `00.replacePath` | 移除路徑結尾斜線並重定向；由 `runtimeConfig.public.replaceEndSplash` 控制（預設 `true`） |

### Runtime Config

Layer 定義了 `tappay`、`googlePay`、`googleFont`、`securityPlugin` 以及 `public.{version,env,replaceEndSplash}` 的預設值，由消費端以 `nuxt.config.ts` 或 `NUXT_*` 環境變數覆寫。

完整環境變數表見 [環境變數 Wiki](./.kn-project/wiki/environment.md)。

---

## 📚 文件導覽

深度文件統一維護在 [`.kn-project/wiki/`](./.kn-project/wiki/)，本 README 僅作入口：

| 入口 | 內容 |
| :--- | :--- |
| [🏠 Wiki 首頁](./.kn-project/wiki/index.md) | 架構圖、主題頁清單、模組總覽 |
| [🧩 元件清單矩陣](./.kn-project/wiki/features/components.md) | 全部元件，每個一頁（Props / Emits / v-model / Slots / Exposed） |
| [🪝 Composable 清單矩陣](./.kn-project/wiki/features/composables.md) | 全部 composables，每個一頁（簽章 / 回傳） |
| [⚙️ 環境變數](./.kn-project/wiki/environment.md) | 全部 Runtime Config 與 `NUXT_*` 對照 |

> 主題頁（Calendar、OverlayScrollbar、FileDropzone、Timeline…）的完整清單由 [Wiki 首頁](./.kn-project/wiki/index.md) 維護，此處不重複列出以免失同步。

---

## 🛠 開發

本 repo 以 `.playground/` 作為開發與展示環境，所有指令皆指向它。

```bash
pnpm dev
```

| 指令 | 說明 |
| :--- | :--- |
| `pnpm dev` | 啟動 `.playground` 開發伺服器 |
| `pnpm build` | 建置 `.playground` |
| `pnpm generate` | 靜態產生 `.playground` |
| `pnpm preview` | 預覽建置結果 |
| `pnpm lint` / `pnpm fix` | ESLint 檢查 / 自動修正 |

### Drop Code（生產環境移除開發用程式碼）

建置時可剔除 `console`、`debugger` 與標記為 `DEV:` 的程式碼（**不影響 `nuxt dev`**）。Client 端由 Oxc / Rolldown 的壓縮階段處理（`dropConsole` / `dropDebugger` / `dropLabels`），Nitro 端由 esbuild 的 `drop` 處理。

```js
function example() {
  DEV: doAnExpensiveCheck() // 生產建置會移除此行
  return normalCodePath()
}
```

```bash
pnpm generate --drop-code
```

參考 [ESBuild — Drop Labels](https://esbuild.github.io/api/#drop-labels)。

---

## 📱 iOS 相容性

已針對 **iOS 17 及其 WebView** 做過以下處理：

- **背景遮罩穩定性**：iOS WebKit 對 `rgba(from ...)` 語法渲染不穩定，遮罩改用 `color-mix(in srgb, ...)` 並以標準 `rgba()` 兜底（`app/components/Camelot/BaseDialogV2.vue`；`BottomSheetV2` 內嵌於同一個 Dialog 基底，一併受惠）。
- **非安全上下文可用**：`useCamelotToast` 的識別碼以 `Math.random()` 產生，不依賴 `crypto.randomUUID()`，在 HTTP（非安全上下文）環境下同樣可用。
- **CSS 單位**：全域佈局使用 `dvh` 並具備 Fallback（`app/assets/css/tailwind.css`）。

---

## 🎨 Tailwind Reset

Layer 內建於 `app/assets/css/tailwind.css` 的核心 Reset：

```css
* {
  box-sizing: border-box;
  min-width: 0;
}

/* 現代文字排版支援 (iOS 17+) */
h1, h2, h3, h4 { text-wrap: balance; }
p { text-wrap: pretty; }
```
