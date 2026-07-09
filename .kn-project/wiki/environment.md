# ⚙️ 環境變數 (Environment Variables)

本頁記錄 Camelot Nuxt Layer 使用的所有 Runtime Config 與環境設定。

> [!NOTE]
> 本專案為 **Nuxt Layer**，各環境變數需由**消費端應用程式**的 `nuxt.config.ts` 或 `.env` 覆蓋設定。Layer 本身的 `nuxt.config.ts` 僅定義預設值與結構。

---

## 分組一：支付模組 (Payment)

### `NUXT_TAPPAY_ADD_SCRIPT`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.tappay.addScript` |
| **型別** | `boolean` |
| **預設值** | `false` |
| **用途** | 控制是否在 `<head>` 中自動注入 TapPay SDK script (`https://js.tappaysdk.com/sdk/tpdirect/v5.17.0`)。 |
| **影響** | 若設為 `false`，頁面不會載入 TapPay SDK，信用卡支付功能無法使用。 |
| **環境範例** | `NUXT_TAPPAY_ADD_SCRIPT=true` |

### `NUXT_GOOGLE_PAY_ADD_SCRIPT`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.googlePay.addScript` |
| **型別** | `boolean` |
| **預設值** | `false` |
| **用途** | 控制是否在 `<head>` 中自動注入 Google Pay JS SDK (`https://pay.google.com/gp/p/js/pay.js`)。 |
| **影響** | 若設為 `false`，Google Pay 支付功能無法使用。 |
| **環境範例** | `NUXT_GOOGLE_PAY_ADD_SCRIPT=true` |

---

## 分組二：安全性插件 (Security Plugin)

### `NUXT_SECURITY_PLUGIN_ENABLED`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.securityPlugin.enabled` |
| **型別** | `boolean` |
| **預設值** | `true` |
| **用途** | 啟用/停用 Server Side Security Plugin（CSP Headers、安全標頭注入）。 |
| **影響** | 停用後，伺服器不會設定任何 CSP 或安全 HTTP 標頭，**建議僅在開發或 Playground 環境下設為 `false`**。 |
| **環境範例** | `NUXT_SECURITY_PLUGIN_ENABLED=false` |

### `NUXT_SECURITY_PLUGIN_USE_NONCE`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.securityPlugin.useNonce` |
| **型別** | `boolean` |
| **預設值** | `true` |
| **用途** | 是否為每個請求生成隨機 Nonce，並注入所有 `<script>`、`<style>`、`<link>` 標籤。 |
| **影響** | 開啟後，CSP `script-src` 將使用 `'nonce-{random}' 'strict-dynamic'` 模式，提升安全性；關閉後退回 `'unsafe-inline'`。 |
| **環境範例** | `NUXT_SECURITY_PLUGIN_USE_NONCE=true` |

### CSP 規則 (securityPlugin.contentSecurityPolicy)

以下欄位允許消費端應用程式**追加**自定 CSP 來源（基底來源由 Layer 內建）：

| Config 路徑 | 型別 | 基底內建值 | 說明 |
| :--- | :--- | :--- | :--- |
| `.connect` | `string[]` | `'self'` | `connect-src`：API 請求來源 |
| `.font` | `string[]` | `'self', 'data:', fonts.gstatic.com` | `font-src`：字體來源 |
| `.frame` | `string[]` | `'self', 'unsafe-inline'` | `frame-src`：Frame 來源 |
| `.frameAncestors` | `string[]` | `'self'` | `frame-ancestors`：允許嵌入本站的父頁面 |
| `.img` | `string[]` | `'self', 'data:'` | `img-src`：圖片來源 |
| `.manifest` | `string[]` | `'self'` | `manifest-src`：Web App Manifest 來源 |
| `.media` | `string[]` | `'self'` | `media-src`：媒體來源 |
| `.object` | `string[]` | `'self'` | `object-src`：物件來源 |
| `.script` | `string[]` | `'self', 'unsafe-inline'` | `script-src`：腳本來源（Nonce 模式下額外加強） |
| `.style` | `string[]` | `'self', fonts.googleapis.com, 'unsafe-inline'` | `style-src`：樣式來源 |
| `.worker` | `string[]` | `'self', 'unsafe-inline', 'wasm-unsafe-eval', 'blob:'` | `worker-src`：Worker 腳本來源 |

---

## 分組三：Public 公開設定

### `NUXT_PUBLIC_VERSION`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.public.version` |
| **型別** | `string` |
| **預設值** | `'1.0.0'` |
| **用途** | 應用程式版本號，可透過 `GET /api/version` 查詢。 |
| **環境範例** | `NUXT_PUBLIC_VERSION=4.3.1.12` |

### `NUXT_PUBLIC_ENV`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.public.env` |
| **型別** | `string` |
| **預設值** | `'development'` |
| **用途** | 應用程式當前環境識別字串（如 `production`, `staging`, `development`）。 |
| **環境範例** | `NUXT_PUBLIC_ENV=production` |

### `NUXT_PUBLIC_REPLACE_END_SLASH`
| 項目 | 說明 |
| :--- | :--- |
| **Config 路徑** | `runtimeConfig.public.replaceEndSplash` |
| **型別** | `boolean` |
| **預設值** | `true` |
| **用途** | 若為 `true`，Global Middleware `00.replacePath.global.ts` 會自動移除 URL 末尾的斜線（`/path/` → `/path`），避免重複路由。 |
| **影響** | 設為 `false` 後，不會進行 URL 正規化，可能導致路由判斷問題。 |
| **環境範例** | `NUXT_PUBLIC_REPLACE_END_SLASH=true` |

---

## 建議 `.env.example` 範本

```env
# 支付模組
NUXT_TAPPAY_ADD_SCRIPT=false
NUXT_GOOGLE_PAY_ADD_SCRIPT=false

# 安全性插件
NUXT_SECURITY_PLUGIN_ENABLED=true
NUXT_SECURITY_PLUGIN_USE_NONCE=true

# 公開設定
NUXT_PUBLIC_VERSION=1.0.0
NUXT_PUBLIC_ENV=development
NUXT_PUBLIC_REPLACE_END_SLASH=true
```

---

[🏠 Wiki](index.md)
