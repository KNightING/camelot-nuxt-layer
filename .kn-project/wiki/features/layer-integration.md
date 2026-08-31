# 📦 Layer 整合與必裝依賴 (Consumer Integration)

## Summary

消費端以 `extends: ['github:KNightING/camelot-nuxt-layer']` 引入本 Layer 時的必裝依賴清單、整合失敗模式，以及 Layer 端的型別放置規則與品質門檻。
c12/giget 只把原始碼抓進消費端的 `.c12/` 目錄，**不在該目錄安裝 Layer 的依賴**；Layer 的 import 沿 `node_modules` 向上解析到消費端，因此被直接 import 的套件都必須由**消費端自行宣告**。
另一類只在消費端浮現的失敗是 Layer 的 `shared/` 誤用 DOM 型別——該目錄的 TS project 刻意不載入 DOM lib。

## 依賴解析模型

```mermaid
graph TD
    A["消費端 package.json<br/>node_modules/"] -->|"向上解析的終點"| R["實際被 import 的套件"]
    B["nuxt.config.ts<br/>extends: ['github:...']"] --> C["c12 / giget"]
    C -->|"下載原始碼"| D[".c12/camelot-nuxt-layer/"]
    D -.->|"❌ 不執行安裝<br/>此處沒有 node_modules"| X["Layer 自己的 package.json"]
    D -->|"Layer 程式碼的 import<br/>沿 node_modules 上溯"| A
```

**推論**：Layer 的 `package.json` 對消費端**完全沒有約束力**——它既不是 peer dependency 宣告，也不會被安裝。消費端必須自己重建這份清單。

## 必裝依賴清單

| 套件 | 被誰直接 import | 缺少時的症狀 |
| :--- | :--- | :--- |
| `@tailwindcss/vite` | `nuxt.config.ts:8` | Layer config 載入即失敗 |
| `@nuxt/kit` | `modules/buildHook.ts:1`、`modules/echartModule.ts:1`、`modules/tappay.ts:1` | **啟動立即中止**：`Cannot find module '@nuxt/kit'` |
| `@tiptap/core`、`/pm`、`/starter-kit`、`/vue-3`、`/extension-image`、`/extension-link`、`/extension-placeholder` | `app/components/Camelot/RichTextEditor.vue` | 使用 RichTextEditor 的頁面編譯時才報錯 |
| `date-fns` | `DateV2` / `DateRangeV2` / `TimeV2` 及相關 composables | 使用日期元件的頁面編譯時才報錯 |
| `change-case` | composables | 引用時才報錯 |
| `@iconify-json/material-symbols`、`@iconify-json/ic` | 元件內的 `~icons/...` 虛擬模組（如 `app/components/Camelot/Breadcrumb.vue:50`） | 圖示解析失敗 |
| `pinia`、`pinia-plugin-persistedstate` | stores | Pinia 模組載入失敗 |
| `@vueuse/core`、`@vueuse/nuxt`、`@vueuse/components`、`@vueuse/integrations` | composables 與元件 | 引用時才報錯 |
| `nuxt`、`tailwindcss`、`unplugin-icons`、`unplugin-vue-components`、`@nuxtjs/i18n`、`@pinia/nuxt`、`@nuxt/eslint` | Layer `nuxt.config.ts` 的 `modules` / `vite.plugins` | 啟動失敗 |

> 具體版本以 Layer 的 `package.json` 為準；README 的安裝章節載有可直接複製的 `package.json` 片段。

## 失敗模式

整合失敗分兩類，**後者最難排查**：

| 類型 | 觸發時機 | 代表 |
| :--- | :--- | :--- |
| **立即中止** | Nuxt 啟動的模組解析階段 | `@nuxt/kit`、`@tailwindcss/vite` |
| **延遲失敗** | 用到該元件的頁面**被編譯時**才爆 | `@tiptap/*`、`date-fns`、`@iconify-json/*` |
| **只在消費端 type check 浮現** | 消費端跑 `nuxt typecheck` 時 | Layer 的 `shared/` 誤用 DOM 型別（見下節） |

延遲失敗的後果是：`pnpm dev` 看似正常，直到某個頁面第一次被存取才報 Cannot find module。**補齊時要照整份清單補，不要只裝報錯的那一個。**

### `@nuxt/kit` 為何是硬性中止點

`modules/*.ts` 由 jiti 以 CJS `require.resolve('@nuxt/kit')` 載入，發生在 Nuxt 啟動的模組解析階段。pnpm 的嚴格 `node_modules` 不提升傳遞依賴，消費端未直接宣告時解析不到，`pnpm dev` 立刻中止。

> Layer 自身的 `package.json` 也未宣告 `@nuxt/kit`（僅由 `nuxt` 傳遞取得），屬同一類脆弱性，尚未處理。

## 型別放置規則：`shared/` 不得依賴 DOM

Nuxt 4 為 `shared/` 產生**獨立的 TS project**（`.nuxt/tsconfig.shared.json`），其 `compilerOptions` 為 `target: ESNext`、`types: []`、**不指定 `lib`**——因為 `shared/` 同時被 client 與 Nitro server 匯入，刻意不假設有 DOM。

該 project 的 `include` 涵蓋 `../../shared/**/*`，也就是**Layer 的 `shared/` 會被消費端的 shared project 一起編譯**。因此 Layer 的 `shared/` 一旦出現 `HTMLElement`、`Event` 等 DOM 型別，錯誤只會在**消費端**浮現：

```
Cannot find name 'HTMLElement'.
```

| 型別性質 | 放置位置 | 例 |
| :--- | :--- | :--- |
| 跨環境資料契約（純資料、client/server 皆可用） | `shared/types/` | `CamelotCascadeMenuItem`、`CamelotTreeNode` |
| 僅瀏覽器端成立（含 DOM 型別、provide/inject 上下文、元件實例） | `app/types/` | `CamelotCascadeMenuContext`、`CamelotCascadeMenuPanelParent` |

`app/types/` 的型別同樣會被自動匯入——`nuxt.config.ts` 的 `imports.dirs` 已含 `app/**`，元件不需手動 import。

> [!WARNING]
> **本 repo 的 `pnpm typecheck` 擋不住這一條。** 實測 `tsc --listFiles` 確認，本專案的 shared project 是經相依套件的 `/// <reference lib="dom" />` **間接**載入了 `lib.dom.d.ts`，屬碰巧通過；消費端相依圖不同就會失敗。新增 `shared/` 型別時請人工確認未引入 DOM 型別。

## 品質門檻

| 指令 | 涵蓋範圍 |
| :--- | :--- |
| `pnpm typecheck` | `nuxt typecheck .playground`——app / server / shared 全部 TS project |
| `pnpm lint` | `eslint .`——含 `.playground/` |

兩者目前皆為**零錯誤**，可直接作為 CI 門檻。

## References

- 計畫歸檔：`../../archive/2608190042-readme-refresh-and-wiki-links.md`
- 型別解耦與門檻建立：`../../archive/2608311144-shared-types-dom-decoupling.md`
- i18n 註冊分工與已知缺陷：[i18n 語系系統](./i18n-locales.md)
- [c12 — extends](https://github.com/unjs/c12#extending-configuration)

---

[🌐 i18n 語系系統](./i18n-locales.md) | [⚙️ 環境變數](../environment.md) | [🏠 Wiki](../index.md)
