# 📚 Camelot Nuxt Layer — Wiki 首頁

> 本 Wiki 是專案知識的中樞，涵蓋架構、元件/Composable API 目錄、環境設定與開發規範。

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
| **多語系** | @nuxtjs/i18n (Layer 基底 en / zh；區域語系由消費端註冊 fallback 至基底，範例見 .playground) |
| **套件管理** | pnpm |

---

## 🗂️ API 清單矩陣 (Inventory Matrix)

每個 component / composable 皆有**獨立 API 頁**（Props / Emits / v-model / Slots / Exposed / 簽章 / 回傳）：

| 矩陣 | 內容 |
| :--- | :--- |
| **[🧩 元件清單矩陣](./components.md)** | 全部 ~89 元件（表單 / 版面 / 覆蓋層 / 回饋 / 媒體 / 主題變體 / 內部），每個一頁 |
| **[🪝 Composable 清單矩陣](./composables.md)** | 全部 ~48 composable（主題 / 元件相關 / API / 驗證 / 儲存 / 路由 / DOM / 工具），每個一頁 |

> 元件為 Nuxt 自動匯入 `Camelot<Name>`；主題子元件（Aqua/Material/Cupertino/Scifi）與 `Internal/` 為實作細節，由公開元件自動選用。

---

### 🧩 Nuxt 模組 (`modules/`)

| 模組 | 狀態 | 說明 |
| :--- | :---: | :--- |
| `tappay` | ✅ | 依 `runtimeConfig` 條件注入 TapPay SDK |
| `googleFont` | ✅ | 自動注入 Noto Sans TC Google Fonts |
| `buildHook` | ✅ | 建置期 Hook |
| `echartModule` | ✅ | ECharts 整合模組 |

### 🖥️ 伺服器功能 (`server/`)

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
    B --> G["i18n 基底 (en / zh)；區域語系由消費端註冊"]
    B --> H["Tailwind CSS v4 主題"]

    C --> C1["表單元件 (Input, Select, Date...)"]
    C --> C2["對話框/側欄 (Dialog, BottomSheet, Drawer, Popup)"]
    C --> C3["動畫元件 (Reveal, Ripple, Skeleton...)"]
    C --> C4["Internal/Calendar (共用日曆核心)"]
    C --> C5["版面/資料/導覽 (Tree, Table, Menu, OverlayScrollbar)"]

    H --> H1["四風格主題 (material/cupertino/scifi/aqua, 預設 aqua)"]
    H --> H2["aqua-glass / aqua-fill 等共用 utility"]

    D --> D1["useBaseApi (API 封裝)"]
    D --> D2["useCamelotRouter (路由管理)"]
    D --> D3["useCustomColorScheme (主題)"]

    E --> E1["tappay (支付 SDK)"]
    E --> E2["googleFont (字體)"]

    F --> F1["securityPlugin (CSP/Nonce)"]
```

---

## 📎 主題頁 (Topics)

跨切面/專題文件（與上方 API 頁互補）：

- [🎨 Theme System / 主題系統（四風格 + Aqua）](./features/theme-system.md)
- [🧱 Drawer / Tree / Table / Menu](./features/layout-data-components.md)
- [📜 OverlayScrollbar / 自訂捲軸系統](./features/overlay-scrollbar.md)
- [🗓️ Calendar / 日期選擇器（含節日/語系/緊湊）](./features/calendar.md)
- [🗓️🔔 DatePicker 時間/確認・Aqua 邊框 Token・Toast 動畫](./features/datepicker-time-aqua-toast.md)
- [✍️🖼️ RichTextEditor（TipTap）與 ImageDropzone](./features/richtext-editor-image-dropzone.md)
- [⏰ TimeV2 / 純時間選擇器](./features/time-picker.md)
- [🏷️ FieldLabel 共通標籤與表單控制元件](./features/field-label-and-form-controls.md)
- [🕒 Timeline 時間軸](./features/timeline.md)
- [📎 檔案拖曳系統（FileDropzone / FileChip / useCamelotFileDrop）](./features/file-drop.md)
- [🔘 Radio 與選項群組（RadioGroup / CheckboxGroup）](./features/radio-and-groups.md)
- [🎨 Color Scheme / 色彩主題](./features/color-scheme.md)
- [🌐 useLocale / 語系格式正規化](./features/locale.md)
- [🌐 i18n 語系系統（CLDR + Fallback 鏈 + Layer 分工）](./features/i18n-locales.md)
- [⚙️ 環境變數](./environment.md)

---

[🧩 元件清單](./components.md) | [🪝 Composable 清單](./composables.md) | [⚙️ 環境變數](./environment.md) | [🏠 Wiki](index.md)
