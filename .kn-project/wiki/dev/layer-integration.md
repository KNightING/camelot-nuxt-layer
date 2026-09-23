# Layer 整合

## Summary

Layer 整合規範說明消費端以 `extends: ['github:KNightING/camelot-nuxt-layer']` 引入本 Layer 時的必裝依賴清單、整合失敗模式、Layer 端的型別放置規則與品質門檻。c12 與 giget 只把原始碼抓進消費端的 `.c12/` 目錄，不在該目錄安裝 Layer 的依賴；Layer 的 import 沿 `node_modules` 向上解析到消費端，所以被直接 import 的套件都必須由消費端自行宣告。另一類只在消費端浮現的失敗，是 Layer 的 `shared/` 誤用 DOM 型別。

## 運作方式

### 依賴解析模型

這張圖回答：Layer 程式碼裡的 import，最後是從哪裡解析到套件？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "Layer 依賴解析",
  "desc": "消費端的 extends 讓 c12 下載 Layer 原始碼但不安裝依賴，Layer 的 import 沿 node_modules 上溯到消費端",
  "nodes": [
    {"id": "B", "text": "消費端 extends", "shape": "stadium"},
    {"id": "C", "text": "c12 下載", "kind": "ext"},
    {"id": "D", "text": "Layer 原始碼副本"},
    {"id": "X", "text": "Layer 依賴清單", "kind": "data"},
    {"id": "A", "text": "消費端依賴", "shape": "db", "key": true},
    {"id": "R", "text": "被 import 的套件"}
  ],
  "edges": [
    {"from": "B", "to": "C"},
    {"from": "C", "to": "D", "label": "下載原始碼"},
    {"from": "D", "to": "X", "label": "不執行安裝", "kind": "fail"},
    {"from": "D", "to": "A", "label": "import 上溯"},
    {"from": "A", "to": "R", "label": "解析終點"}
  ]
}
```

![Layer 依賴解析](layer-integration.圖1.svg)

Layer 自己的依賴宣告對消費端沒有約束力：它不是 peer dependency，也不會被安裝。消費端必須自己重建這份清單。

來源：1. [nuxt.config.ts][]　2. [package.json][]

### 必裝依賴清單

| 套件 | 被誰直接使用 | 缺少時的症狀 |
| :--- | :--- | :--- |
| `@tailwindcss/vite` | Layer 的 Nuxt 設定 | Layer 設定載入即失敗 |
| `@nuxt/kit` | Layer 的三個自訂 Nuxt 模組 | 啟動立即中止，找不到該模組 |
| `@tiptap` 系列：core、pm、starter-kit、vue-3、extension-image、extension-link、extension-placeholder | RichTextEditor | 使用 RichTextEditor 的頁面編譯時才報錯 |
| `date-fns` | DateV2、DateRangeV2、TimeV2 與日曆 | 使用日期元件的頁面編譯時才報錯 |
| `change-case` | 色彩 CSS 變數寫入器 | 引用時才報錯 |
| `@iconify-json/material-symbols`、`@iconify-json/ic` | 元件內的 icons 虛擬模組，例如 Breadcrumb | 圖示解析失敗 |
| `pinia`、`pinia-plugin-persistedstate` | Nuxt 模組清單與 usePiniaClear | Pinia 模組載入失敗 |
| `@vueuse/core`、`@vueuse/nuxt`、`@vueuse/components`、`@vueuse/integrations` | composables 與元件 | 引用時才報錯 |
| `nuxt`、`tailwindcss`、`unplugin-icons`、`unplugin-vue-components`、`@nuxtjs/i18n`、`@pinia/nuxt`、`@nuxt/eslint` | Layer Nuxt 設定的模組與 vite 外掛 | 啟動失敗 |

具體版本以 Layer 的依賴宣告為準；README 的安裝章節有可直接複製的片段。

來源：1. [package.json][]　2. [nuxt.config.ts][]　3. [buildHook.ts][]　4. [RichTextEditor.vue][]　5. [DateV2.vue][]　6. [useColorSchemeCssVars.ts][]　7. [Breadcrumb.vue][]　8. [usePiniaClear.ts][]

### 失敗模式

整合失敗分三類，延遲失敗最難排查：

| 類型 | 觸發時機 | 代表 |
| :--- | :--- | :--- |
| 立即中止 | Nuxt 啟動的模組解析階段 | `@nuxt/kit`、`@tailwindcss/vite` |
| 延遲失敗 | 用到該元件的頁面被編譯時才爆 | `@tiptap` 系列、`date-fns`、`@iconify-json` 系列 |
| 只在消費端 type check 浮現 | 消費端跑 `nuxt typecheck` 時 | Layer 的 shared 目錄誤用 DOM 型別，見型別放置規則 |

延遲失敗的後果是 `pnpm dev` 看似正常，直到某個頁面第一次被存取才報 Cannot find module。

補齊時要照整份清單補，不要只裝報錯的那一個。

來源：1. [nuxt.config.ts][]

### @nuxt/kit 為何是硬性中止點

Layer 的自訂模組由 jiti 以 CJS 的 require.resolve 載入 @nuxt/kit，發生在 Nuxt 啟動的模組解析階段。

pnpm 的嚴格 node_modules 不提升傳遞依賴，消費端未直接宣告時解析不到，`pnpm dev` 立刻中止。

Layer 自身的依賴宣告也沒有列 @nuxt/kit，只由 nuxt 傳遞取得，屬同一類脆弱性。

來源：1. [buildHook.ts][]　2. [echartModule.ts][]　3. [tappay.ts][]　4. [package.json][]

## 型別放置規則

### shared 目錄不得依賴 DOM

Nuxt 4 為 shared 目錄產生獨立的 TS project：target 為 ESNext、types 為空、不指定 lib。

shared 同時被 client 與 Nitro server 匯入，所以刻意不假設有 DOM。

該 project 的 include 涵蓋 Layer 的 shared 目錄，會被消費端一起編譯。Layer 的 shared 一旦出現 HTMLElement、Event 等 DOM 型別，錯誤只會在消費端浮現：

```
Cannot find name 'HTMLElement'.
```

| 型別性質 | 放置位置 | 例 |
| :--- | :--- | :--- |
| 跨環境資料契約：純資料，client 與 server 皆可用 | shared 型別目錄 | `CamelotCascadeMenuItem`、`CamelotTreeNode` |
| 只在瀏覽器端成立：含 DOM 型別、provide 與 inject 上下文、元件實例 | app 型別目錄 | `CamelotCascadeMenuContext`、`CamelotCascadeMenuPanelParent` |

app 型別目錄的型別同樣會被自動匯入：Nuxt 設定的 imports.dirs 已涵蓋整個 app 目錄，元件不需手動 import。

來源：1. [shared/types/cascadeMenu.ts][]　2. [app/types/cascadeMenu.ts][]　3. [nuxt.config.ts][]

> [!WARNING]
> 本 repo 的 `pnpm typecheck` 擋不住這一條。本專案的 shared project 經相依套件的 dom reference 指令間接載入了 DOM lib，屬碰巧通過；消費端相依圖不同就會失敗。
> 新增 shared 型別時請人工確認未引入 DOM 型別。

## 品質門檻

| 指令 | 涵蓋範圍 |
| :--- | :--- |
| `pnpm typecheck` | 對 playground 跑 nuxt typecheck，涵蓋 app、server、shared 全部 TS project |
| `pnpm lint` | 對整個 repo 跑 eslint，含 playground |

兩者可直接作為 CI 門檻。

來源：1. [package.json][]

## 相關頁面

- [i18n 語系系統](../platform/i18n-locales.md)：i18n 註冊分工與已知缺陷
- [c12 extends 說明](https://github.com/unjs/c12#extending-configuration)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| nuxt.config.ts | [nuxt.config.ts](../../../nuxt.config.ts) |
| package.json | [package.json](../../../package.json) |
| buildHook.ts | [modules/buildHook.ts](../../../modules/buildHook.ts) |
| RichTextEditor.vue | [app/components/Camelot/RichTextEditor.vue](../../../app/components/Camelot/RichTextEditor.vue) |
| DateV2.vue | [app/components/Camelot/DateV2.vue](../../../app/components/Camelot/DateV2.vue) |
| useColorSchemeCssVars.ts | [app/composables/useColorSchemeCssVars.ts](../../../app/composables/useColorSchemeCssVars.ts) |
| Breadcrumb.vue | [app/components/Camelot/Breadcrumb.vue](../../../app/components/Camelot/Breadcrumb.vue) |
| usePiniaClear.ts | [app/composables/usePiniaClear.ts](../../../app/composables/usePiniaClear.ts) |
| echartModule.ts | [modules/echartModule.ts](../../../modules/echartModule.ts) |
| tappay.ts | [modules/tappay.ts](../../../modules/tappay.ts) |
| shared/types/cascadeMenu.ts | [shared/types/cascadeMenu.ts](../../../shared/types/cascadeMenu.ts) |
| app/types/cascadeMenu.ts | [app/types/cascadeMenu.ts](../../../app/types/cascadeMenu.ts) |

[nuxt.config.ts]: #references
[package.json]: #references
[buildHook.ts]: #references
[RichTextEditor.vue]: #references
[DateV2.vue]: #references
[useColorSchemeCssVars.ts]: #references
[Breadcrumb.vue]: #references
[usePiniaClear.ts]: #references
[echartModule.ts]: #references
[tappay.ts]: #references
[shared/types/cascadeMenu.ts]: #references
[app/types/cascadeMenu.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
