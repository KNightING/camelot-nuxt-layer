# 環境變數

## Summary

Camelot Nuxt Layer 的設定全部走 Nuxt runtimeConfig：Layer 的 Nuxt 設定只定義預設值與結構，實際值由消費端的 Nuxt 設定或 `NUXT_` 開頭的環境變數覆寫。本 repo 沒有 `.env.example`，也不分 flavor。支付 SDK 與 Google 字型由 Nuxt 模組在建置期讀取，只能在消費端的 Nuxt 設定裡改；安全性插件與公開設定在執行期讀取，可用環境變數覆寫。缺值時一律套用下表的預設值，不會啟動失敗。

## 變數

### 支付與字型

這三個值由 Layer 的 Nuxt 模組在建置期讀取設定檔裡的值，執行期環境變數改不到，請寫在消費端 Nuxt 設定的 runtimeConfig。

| 變數 | 用途 | 缺省影響 | 範例 |
|---|---|---|---|
| `tappay.addScript` | 在 head 注入 TapPay SDK 5.17.0 的 script | 預設 `false`：不載入 TapPay，信用卡支付無法使用 | `true` |
| `googlePay.addScript` | 在 head 注入 Google Pay JS SDK 的 script | 預設 `false`：Google Pay 無法使用 | `true` |
| `googleFont.disabled` | 停用 Noto Sans TC 的 Google 字型 preconnect 與樣式表 | 預設 `false`：會載入 Google 字型 | `true` |

來源：1. [nuxt.config.ts][]　2. [tappay.ts][]　3. [googleFont.ts][]

### 安全性插件

| 變數 | 用途 | 缺省影響 | 範例 |
|---|---|---|---|
| `NUXT_SECURITY_PLUGIN_ENABLED` | 啟用伺服器端安全性插件，設定 CSP 與安全 HTTP 標頭 | 預設 `true`；設為 `false` 時不送任何 CSP 或安全標頭，建議只在開發或 playground 關閉 | `false` |
| `NUXT_SECURITY_PLUGIN_USE_NONCE` | 每個請求產生隨機 nonce，注入 script、style、link 標籤 | 預設 `true`；關閉時 script-src 不帶 nonce 與 strict-dynamic，只剩 self 與 unsafe-inline | `true` |

來源：1. [nuxt.config.ts][]　2. [securityPlugin.ts][]

### CSP 追加來源

`securityPlugin.contentSecurityPolicy` 底下的陣列讓消費端追加 CSP 來源，Layer 內建的基底來源一律保留。

每條指令都含 self，全域 default-src 為 self。

| 設定鍵 | 對應指令 | 基底來源 |
|---|---|---|
| `connect` | connect-src | self |
| `font` | font-src | self、data、fonts.gstatic.com 的 http 與 https |
| `frame` | frame-src | self、unsafe-inline |
| `frameAncestors` | frame-ancestors | self |
| `img` | img-src | self、data |
| `manifest` | manifest-src | self |
| `media` | media-src | self |
| `object` | object-src | self |
| `script` | script-src | self、unsafe-inline；nonce 模式另加 nonce 與 strict-dynamic |
| `style` | style-src | self、fonts.googleapis.com、unsafe-inline |
| `worker` | worker-src | self、unsafe-inline、wasm-unsafe-eval、blob |

來源：1. [securityPlugin.ts][]

### 公開設定

| 變數 | 用途 | 缺省影響 | 範例 |
|---|---|---|---|
| `NUXT_PUBLIC_VERSION` | 應用程式版本號，由版本 API 回傳 | 預設 `1.0.0` | `4.3.1.12` |
| `NUXT_PUBLIC_ENV` | 環境識別字串；Layer 內沒有程式讀取，供消費端使用 | 預設 `development` | `production` |
| `NUXT_PUBLIC_REPLACE_END_SPLASH` | 全域 middleware 移除路徑末尾的斜線，根路徑除外 | 預設 `true`；設為 `false` 時不正規化，同一頁可能有兩個網址 | `true` |

設定鍵名是 `replaceEndSplash`，所以環境變數是 SPLASH 而不是 SLASH。

來源：1. [nuxt.config.ts][]　2. [index.get.ts][]　3. [$00.replacePath.ts][]

## 來源與載入順序

1. Layer 的 Nuxt 設定提供預設值。
2. 消費端的 Nuxt 設定覆寫 Layer 預設值。
3. 執行期的 `NUXT_` 環境變數覆寫前兩者；建置期由模組讀取的支付與字型設定不受影響。

來源：1. [nuxt.config.ts][]

## 環境差異

無：本 repo 不分 flavor，各環境的值由消費端決定。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| nuxt.config.ts | [nuxt.config.ts](../../nuxt.config.ts) |
| tappay.ts | [modules/tappay.ts](../../modules/tappay.ts) |
| googleFont.ts | [modules/googleFont.ts](../../modules/googleFont.ts) |
| securityPlugin.ts | [server/plugins/securityPlugin.ts](../../server/plugins/securityPlugin.ts) |
| index.get.ts | [server/api/version/index.get.ts](../../server/api/version/index.get.ts) |
| $00.replacePath.ts | [app/middleware/$00.replacePath.ts](../../app/middleware/$00.replacePath.ts) |

[nuxt.config.ts]: #references
[tappay.ts]: #references
[googleFont.ts]: #references
[securityPlugin.ts]: #references
[index.get.ts]: #references
[$00.replacePath.ts]: #references

---
[🏠 Wiki](index.md)
