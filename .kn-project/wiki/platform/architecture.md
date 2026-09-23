# 專案架構

## Summary

Camelot Nuxt Layer（套件名稱 `camelot-nuxt3-layer`）是以 Nuxt Layer 形式發佈的 UI 元件函式庫。消費端的 Nuxt 4 應用程式以 extends 繼承它，取得 Vue 3 元件、Composables、Nuxt 模組、伺服器外掛與 Tailwind CSS v4 主題。本頁說明 Layer 由哪些部分組成、各自提供什麼；逐一元件與 composable 的 API 見清單矩陣。

## 運作方式

### 專案概覽

| 項目 | 說明 |
| :--- | :--- |
| 套件名稱 | camelot-nuxt3-layer |
| 版本 | 以 package.json 為準 |
| 框架 | Nuxt 4 + Vue 3 Composition API |
| 樣式 | Tailwind CSS v4 |
| 狀態管理 | Pinia 與 pinia-plugin-persistedstate |
| 多語系 | @nuxtjs/i18n；語系全部由消費端註冊，細節見 [i18n 語系系統](./i18n-locales.md) |
| 套件管理 | pnpm |

來源：1. [package.json][]　2. [nuxt.config.ts][]

### Layer 組成

消費端 extends 這個 Layer 後，下列各部分會一起合併進它的 Nuxt 應用程式。

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "Layer 全貌",
  "desc": "消費端繼承 Layer 後取得的六個部分",
  "nodes": [
    {"id": "A", "text": "消費端 Nuxt App", "kind": "ext"},
    {"id": "B", "text": "Camelot Layer", "key": true},
    {"id": "C", "text": "UI 元件"},
    {"id": "D", "text": "Composables"},
    {"id": "E", "text": "Nuxt 模組"},
    {"id": "F", "text": "伺服器外掛"},
    {"id": "G", "text": "i18n 設定"},
    {"id": "H", "text": "Tailwind 主題"}
  ],
  "edges": [
    {"from": "A", "to": "B", "label": "extends"},
    {"from": "B", "to": "C"},
    {"from": "B", "to": "D"},
    {"from": "B", "to": "E"},
    {"from": "B", "to": "F"},
    {"from": "B", "to": "G"},
    {"from": "B", "to": "H"}
  ]
}
```

![Layer 全貌](architecture.圖1.svg)

UI 元件依用途分成五群；共用日曆核心供各日期與時間選擇器共用。

```json diagram id=圖2
{
  "type": "flow",
  "dir": "TD",
  "title": "UI 元件分群",
  "desc": "Layer 的 UI 元件依用途分成五群",
  "nodes": [
    {"id": "C", "text": "UI 元件", "key": true},
    {"id": "C1", "text": "表單元件"},
    {"id": "C2", "text": "對話框與側欄"},
    {"id": "C3", "text": "動畫元件"},
    {"id": "C4", "text": "共用日曆核心"},
    {"id": "C5", "text": "版面資料導覽"}
  ],
  "edges": [
    {"from": "C", "to": "C1"},
    {"from": "C", "to": "C2"},
    {"from": "C", "to": "C3"},
    {"from": "C", "to": "C4"},
    {"from": "C", "to": "C5"}
  ]
}
```

![UI 元件分群](architecture.圖2.svg)

| 分群 | 代表元件 |
| :--- | :--- |
| 表單元件 | Input、SelectV2、DateV2、DateRangeV2 |
| 對話框與側欄 | BaseDialogV2、BaseBottomSheetV2、Drawer、PopupV2 |
| 動畫元件 | RevealText、RippleEffect、Skeleton |
| 共用日曆核心 | 內部 Calendar |
| 版面資料導覽 | Tree、Table、Menu、OverlayScrollbar |

主題提供四種風格與共用工具，核心 composable 則負責 API、路由與色彩。

```json diagram id=圖3
{
  "type": "flow",
  "dir": "TD",
  "title": "主題與核心 composable",
  "desc": "Tailwind 主題與 Composables 各自提供的核心能力",
  "nodes": [
    {"id": "H", "text": "Tailwind 主題", "key": true},
    {"id": "H1", "text": "四風格主題"},
    {"id": "H2", "text": "Aqua 共用工具"},
    {"id": "D", "text": "Composables", "key": true},
    {"id": "D1", "text": "API 封裝"},
    {"id": "D2", "text": "路由管理"},
    {"id": "D3", "text": "色彩主題"}
  ],
  "edges": [
    {"from": "H", "to": "H1"},
    {"from": "H", "to": "H2"},
    {"from": "D", "to": "D1"},
    {"from": "D", "to": "D2"},
    {"from": "D", "to": "D3"}
  ]
}
```

![主題與核心 composable](architecture.圖3.svg)

| 節點 | 說明 |
| :--- | :--- |
| 四風格主題 | material、cupertino、scifi、aqua，預設 aqua |
| Aqua 共用工具 | 玻璃面板、填滿態、軌道等 Tailwind 工具 |
| API 封裝 | [useBaseApi](../features/composables/useBaseApi.md) |
| 路由管理 | [useCamelotRouter](../features/composables/useCamelotRouter.md) |
| 色彩主題 | [useCustomColorScheme](../features/composables/useCustomColorScheme.md) |

元件以 Nuxt 自動匯入，名稱為 Camelot 加上元件名。主題子元件（Aqua、Material、Cupertino、Scifi）與內部元件是實作細節，由公開元件依主題自動選用。主題機制見 [主題系統](./theme-system.md)。

來源：1. [nuxt.config.ts][]

### Nuxt 模組

Layer 自帶的模組放在模組目錄，由 Nuxt 自動載入；開關讀 runtimeConfig。

| 模組 | 狀態 | 說明 |
| :--- | :---: | :--- |
| tappay | 🟢 | runtimeConfig 開啟時注入 TapPay SDK script |
| googleFont | 🟢 | 注入 Noto Sans TC 的 Google Fonts 連結，可由 runtimeConfig 關閉 |
| buildHook | 🟢 | 建置期 hook |
| echartModule | 🟢 | 把 ECharts 相關套件加入 transpile |

來源：1. [tappay.ts][]　2. [googleFont.ts][]　3. [buildHook.ts][]　4. [echartModule.ts][]

### 伺服器功能

| 項目 | 狀態 | 說明 |
| :--- | :---: | :--- |
| securityPlugin | 🟢 | 設定 CSP 與其他安全標頭，並為 script、style、link 注入 nonce |
| 版本端點 | 🟢 | 回傳 runtimeConfig 中的應用程式版本號 |
| 健康檢查端點 | 🟢 | 回傳 OK |

端點路徑：

```text
GET /api/version
GET /api/health
```

來源：1. [securityPlugin.ts][]　2. [version/index.get.ts][]　3. [health/index.get.ts][]

### 清單矩陣

每個元件與 composable 都有獨立的 API 頁，記錄 Props、Emits、v-model、Slots、Exposed、簽章與回傳值。兩份矩陣是逐頁索引的入口：

| 矩陣 | 內容 |
| :--- | :--- |
| [元件清單矩陣](../features/components.md) | 全部元件，依表單、版面、覆蓋層、回饋、媒體、主題變體、內部分組 |
| [Composable 清單矩陣](../features/composables.md) | 全部 composable，依主題、元件相關、API、驗證、儲存、路由、DOM、工具分組 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 建立 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| package.json | [package.json](../../../package.json) |
| nuxt.config.ts | [nuxt.config.ts](../../../nuxt.config.ts) |
| tappay.ts | [modules/tappay.ts](../../../modules/tappay.ts) |
| googleFont.ts | [modules/googleFont.ts](../../../modules/googleFont.ts) |
| buildHook.ts | [modules/buildHook.ts](../../../modules/buildHook.ts) |
| echartModule.ts | [modules/echartModule.ts](../../../modules/echartModule.ts) |
| securityPlugin.ts | [server/plugins/securityPlugin.ts](../../../server/plugins/securityPlugin.ts) |
| version/index.get.ts | [server/api/version/index.get.ts](../../../server/api/version/index.get.ts) |
| health/index.get.ts | [server/api/health/index.get.ts](../../../server/api/health/index.get.ts) |

[package.json]: #references
[nuxt.config.ts]: #references
[tappay.ts]: #references
[googleFont.ts]: #references
[buildHook.ts]: #references
[echartModule.ts]: #references
[securityPlugin.ts]: #references
[version/index.get.ts]: #references
[health/index.get.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
