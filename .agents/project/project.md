# Project: Camelot Nuxt Layer

## Overview
**Camelot Nuxt Layer** 是一個以 Nuxt Layer 形式封裝的 UI 元件函式庫，提供可複用的 Vue 3 元件、Composables、Pinia Stores 及 Nuxt 模組，供各類 Nuxt 4 應用程式作為 Base Layer 使用。

**套件名稱**: `camelot-nuxt3-layer` v`4.3.1.12`

---

## Core Technologies
- **框架**: Nuxt 4 + Vue 3 (Composition API, `<script setup>`)
- **樣式**: Tailwind CSS v4 (主題定義於 `app/assets/css/tailwind.css`)
- **狀態管理**: Pinia + pinia-plugin-persistedstate
- **多語系**: @nuxtjs/i18n (預設 `zh-TW`，支援 `en-US`)
- **日期處理**: date-fns
- **圖示**: unplugin-icons (Material Symbols)
- **工具集**: @vueuse/core, @vueuse/nuxt
- **套件管理**: pnpm

---

## Directory Structure

```
camelot-nuxt-layer/
├── app/
│   ├── assets/css/          # Tailwind v4 主題 & 全域樣式
│   ├── components/Camelot/  # UI 元件（36 個）
│   │   └── Internal/        # 共用內部元件（Calendar）
│   ├── composables/         # 共用 Composables（40+ 個）
│   ├── middleware/          # Nuxt Middleware
│   └── plugins/             # Nuxt Client Plugins
├── i18n/locales/            # 語言包 (zh-TW, en-US)
├── modules/                 # 自訂 Nuxt 模組 (tappay, googleFont...)
├── server/
│   ├── api/                 # Nitro API Endpoints
│   └── plugins/             # Nitro Server Plugins (securityPlugin)
├── shared/types/            # 共用型別
└── .agents/project/         # AI 治理文件
```

---

## Current Modules

| Module | Path | Description |
| :--- | :--- | :--- |
| UI Components | `app/components/Camelot/` | 36 個核心 UI 元件，涵蓋表單（Input, Select, Date）、對話框（Dialog, BottomSheet, Popup）、動畫（Reveal, Ripple, Skeleton）、日期選擇（DateV2, DateRangeV2）；支援 Material、Cupertino、Sci-Fi、Aqua Pill 風格 |
| Internal Components | `app/components/Camelot/Internal/` | DateV2 / DateRangeV2 共用的日曆核心（Calendar） |
| Composables | `app/composables/` | 40+ 個共用 Composables，涵蓋 API 封裝、路由管理、色彩主題、表單驗證、串流請求等 |
| Theme Manager | `app/composables/useCamelotTheme` | 全域風格選擇的狀態管理 |
| Nuxt Modules | `modules/` | `tappay`（條件注入 TapPay SDK）、`googleFont`（Noto Sans TC）、`buildHook`、`echartModule`（ECharts 整合） |
| Server | `server/` | `securityPlugin`（CSP Headers、Nonce 注入、安全 HTTP 標頭）、`api/version`（`GET /api/version`） |

---

## Wiki Quick Links

| 分類 | 連結 |
| :--- | :--- |
| 📋 Wiki 首頁 | [wiki/index.md](./wiki/index.md) |
| 🗓️ 日期選擇器系統 | [wiki/features/calendar.md](./wiki/features/calendar.md) |
| 🎨 色彩主題系統 | [wiki/features/color-scheme.md](./wiki/features/color-scheme.md) |
| ⚙️ 環境變數 | [wiki/environment.md](./wiki/environment.md) |

---

## Active Plans
請參閱 [plans.md](./plans.md) 查看執行中計畫。
