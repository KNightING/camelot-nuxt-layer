# 📚 Camelot Nuxt Layer — Wiki 首頁

> 本 Wiki 是專案知識的中樞，涵蓋架構、元件目錄、環境設定與開發規範。

## 🌐 語言切換 (Language Switcher)
- 🇹🇼 **正體中文** (當前)
- 🇺🇸 [English](./lang/en-US/index.md) *(尚未建立)*

---

## 📋 專案概覽

**Camelot Nuxt Layer** 是一個 Nuxt Layer 形式的 UI 元件函式庫，提供各種可複用的 Vue 3 元件、Composables 與工具模組，供各類 Nuxt 4 應用程式擴展使用。

| 項目 | 說明 |
| :--- | :--- |
| **套件名稱** | `camelot-nuxt3-layer` |
| **版本** | `4.3.1.12` |
| **框架** | Nuxt 4 + Vue 3 (Composition API) |
| **樣式** | Tailwind CSS v4 |
| **狀態管理** | Pinia + pinia-plugin-persistedstate |
| **多語系** | @nuxtjs/i18n (zh-TW, en-US) |
| **套件管理** | pnpm |

---

## 🗂️ 功能清單矩陣 (Functional Inventory Matrix)

### UI 元件 (`app/components/Camelot/`)

| 元件 | 狀態 | 說明 | Wiki |
| :--- | :---: | :--- | :--- |
| `BaseBottomSheet` | ✅ | 底部彈出面板 (v1) | — |
| `BaseBottomSheetV2` | ✅ | 底部彈出面板 (v2，精簡版) | — |
| `BaseDialog` | ✅ | 通用對話框 (v1) | — |
| `BaseDialogV2` | ✅ | 通用對話框 (v2，支援更多選項) | — |
| `Breakpoints` | ✅ | 顯示當前斷點（開發工具用） | — |
| `ColorSchemeProvider` | ✅ | 主題色彩 Provider | [詳情](./features/color-scheme.md) |
| `Container` | ✅ | 通用容器元件 | — |
| `CustomColorSchemeProvider` | ✅ | 自訂色彩方案 Provider | [詳情](./features/color-scheme.md) |
| `Date` | ✅ | 日期選擇器 (v1，舊版) | — |
| `DateV2` | 🚧 | 日期選擇器 (v2，重構中) | [詳情](./features/calendar.md) |
| `DateRange` | ✅ | 日期範圍選擇器 (v1，舊版) | — |
| `DateRangeV2` | 🚧 | 日期範圍選擇器 (v2，重構中) | [詳情](./features/calendar.md) |
| `DropImage` | ✅ | 拖曳上傳圖片元件 | — |
| `Expanded` | ✅ | 可展開/收合的內容區塊 | — |
| `Gpu` | ✅ | GPU 加速動畫容器 | — |
| `IdxForm` | ✅ | 表單容器元件 | — |
| `Image` | ✅ | 圖片元件 (v1) | — |
| `ImageV2` | ✅ | 圖片元件 (v2，支援懶載入/動畫) | — |
| `Input` | ✅ | 通用輸入框元件 | — |
| `Loading` | ✅ | 載入中動畫元件 | — |
| `Material3Provider` | ✅ | Material Design 3 主題 Provider | — |
| `NumberCounter` | ✅ | 數字計數動畫元件 | — |
| `Popup` | ✅ | 彈出層元件 (v1) | — |
| `PopupV2` | ✅ | 彈出層元件 (v2，功能更完整) | — |
| `RevealImage` | ✅ | 圖片揭示動畫元件 | — |
| `RevealText` | ✅ | 文字揭示動畫元件 | — |
| `RippleEffect` | ✅ | Material Design 漣漪點擊效果 | — |
| `RippleTabs` | ✅ | 帶漣漪效果的 Tab 元件 | — |
| `Scrollbar` | ✅ | 自訂滾動條元件 | — |
| `Select` | ✅ | 下拉選擇元件 (v1) | — |
| `SelectV2` | ✅ | 下拉選擇元件 (v2，功能更完整) | — |
| `Skeleton` | ✅ | 骨架屏 Loading 佔位元件 | — |
| `SlideTransitionGroup` | ✅ | 滑動過場群組元件 | — |
| `Steps` | ✅ | 步驟指示器元件 | — |
| `Tabs` | ✅ | 頁籤元件 | — |
| `Toast` | ✅ | 吐司通知元件 | — |

### 內部元件 (`app/components/Camelot/Internal/`)

| 元件 | 狀態 | 說明 | Wiki |
| :--- | :---: | :--- | :--- |
| `Calendar` | 🚧 | 日曆核心元件（DateV2/DateRangeV2 共用） | [詳情](./features/calendar.md) |

---

### Composables (`app/composables/`)

| Composable | 狀態 | 說明 |
| :--- | :---: | :--- |
| `useBaseApi` | ✅ | API 請求基礎封裝 (含串流支援) |
| `useCamelotRouter` | ✅ | 擴展 Vue Router，含歷史堆疊管理 |
| `useCamelotToast` | ✅ | Toast 通知系統 |
| `useColor` | ✅ | 顏色處理工具 |
| `useCustomColorScheme` | ✅ | 自訂色彩方案管理 |
| `useDeviceBreakpoints` | ✅ | 裝置斷點偵測 |
| `useElCssVar` | ✅ | 讀取/設定元素 CSS 變數 |
| `useErrorRef` | ✅ | 錯誤狀態封裝 |
| `useFetchStream` | ✅ | Fetch 串流請求 |
| `useFetchJSONLinesStream` | ✅ | JSON Lines 串流請求 |
| `useFloat` | ✅ | 浮點數處理工具 |
| `useInfinitePage` | ✅ | 無限滾動分頁邏輯 |
| `useInputValidationController` | ✅ | 表單驗證控制器 |
| `useLoading` | ✅ | 全域載入狀態管理 |
| `useMaterial3ColorScheme` | ✅ | Material Design 3 色彩方案生成 |
| `useObject` | ✅ | 物件操作工具集 |
| `useScrollOnBottom` | ✅ | 捲動到底部事件偵測 |
| `useValueValidation` | ✅ | 值驗證工具 |
| `useNaiveUITheme` | ✅ | NaiveUI 主題整合 |
| *(其他工具型 Composables)* | ✅ | useDelay, useRandom, useFileKey 等 |

---

### Nuxt 模組 (`modules/`)

| 模組 | 狀態 | 說明 |
| :--- | :---: | :--- |
| `tappay` | ✅ | 依 `runtimeConfig` 條件注入 TapPay SDK |
| `googleFont` | ✅ | 自動注入 Noto Sans TC Google Fonts |
| `buildHook` | ✅ | 建置期 Hook |
| `echartModule` | ✅ | ECharts 整合模組 |

---

### 伺服器功能 (`server/`)

| 項目 | 狀態 | 說明 |
| :--- | :---: | :--- |
| `server/plugins/securityPlugin` | ✅ | CSP Headers、Nonce 注入、安全標頭設定 |
| `server/api/version` | ✅ | `GET /api/version` — 回傳應用程式版本號 |

---

## 🗺️ 架構圖

```mermaid
graph TD
    A["消費端 Nuxt App"] -->|extends| B["camelot-nuxt-layer"]

    B --> C["UI 元件 (Camelot/)"]
    B --> D["Composables"]
    B --> E["Nuxt 模組"]
    B --> F["Server Plugins"]
    B --> G["i18n (zh-TW / en-US)"]
    B --> H["Tailwind CSS v4 主題"]

    C --> C1["表單元件 (Input, Select, Date...)"]
    C --> C2["對話框 (Dialog, BottomSheet, Popup)"]
    C --> C3["動畫元件 (Reveal, Ripple, Skeleton...)"]
    C --> C4["Internal/Calendar (共用日曆核心)"]

    D --> D1["useBaseApi (API 封裝)"]
    D --> D2["useCamelotRouter (路由管理)"]
    D --> D3["useCustomColorScheme (主題)"]

    E --> E1["tappay (支付 SDK)"]
    E --> E2["googleFont (字體)"]

    F --> F1["securityPlugin (CSP/Nonce)"]
```

---

## 📎 快速導覽

- [🗓️ Calendar / 日期選擇器](./features/calendar.md)
- [🎨 Color Scheme / 色彩主題](./features/color-scheme.md)
- [⚙️ 環境變數](./environment.md)

---

[⚙️ 環境變數](./environment.md) | [🏠 Wiki](index.md)
