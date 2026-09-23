# 色彩方案變數

## Summary

`useColorSchemeCssVars` 模組是色彩方案的 CSS 變數單向寫入器，匯出 `applyColorSchemeCssVars` 與 `applyMaterial3CssVars` 兩支函式，把整組色彩方案物件一次寫進目標元素的 inline style，不建立任何響應式實例。前者供 useCustomColorScheme 使用，後者供 useMaterial3ColorScheme 使用。

## 運作方式

### 寫入流程

1. 目標元素為空時直接結束。
2. 逐一走訪色彩方案的鍵，值不是字串就略過。
3. 依下方命名規則寫入內部變數；一般寫入器另寫一個 Tailwind 覆蓋變數指向它。

來源：1. [useColorSchemeCssVars.ts][]

### 變數命名規則

```
Material3 色鍵 primary        → --cml-c-m3-primary
其餘色鍵 rippleColor          → --cml-c-ripple-color
Tailwind 覆蓋變數             → --color-primary: var(--cml-c-m3-primary)
```

1. 色鍵從 camelCase 轉成 kebab-case，結果會快取，切換主題時不重算。
2. 屬於 Material3 色鍵集合的鍵加上 m3 前綴，其餘鍵只加 Camelot 前綴。
3. Tailwind v4 把主題色放在 `:root`，直接改會被蓋掉，因此採雙變數：內部變數存實際色值，覆蓋變數指向內部變數。

來源：1. [useColorSchemeCssVars.ts][]

### 兩支寫入函式的差異

| 項目 | applyColorSchemeCssVars | applyMaterial3CssVars |
| --- | --- | --- |
| 寫入值 | 原始色值 | 紅綠藍三個數字，以逗號分隔 |
| 無法解析為 Hex | 不解析，一律原樣寫入 | 原樣寫入 |
| 變數前綴 | 依鍵是否屬於 Material3 決定 | 一律 m3 前綴 |
| Tailwind 覆蓋變數 | 會寫 | 不寫 |
| 用途 | 供覆蓋變數直接 var 取用 | 供 rgb 函式搭配透明度使用 |

兩者值格式不同，刻意不合併，只共用鍵名的 kebab-case 快取。

來源：1. [useColorSchemeCssVars.ts][]

### 設計考量

| 考量 | 說明 |
| --- | --- |
| 不用 useElCssVar | 寫入是單向動作；逐鍵建立 ref 與 watcher 會在主題切換這條熱路徑上產生大量永不回收的 watcher |
| Material3 鍵集合延遲建立 | 本模組與 useMaterial3ColorScheme 互相匯入，模組載入當下建立集合會撞上尚未初始化的鍵清單，因此首次寫入時才建立 |

來源：1. [useColorSchemeCssVars.ts][]

## 用法

```ts
applyColorSchemeCssVars(el, { primary: '#6750a4', rippleColor: '#111827' })
// --cml-c-m3-primary: #6750a4; --color-primary: var(--cml-c-m3-primary);
// --cml-c-ripple-color: #111827; --color-ripple-color: var(--cml-c-ripple-color);
```

## 匯出

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `applyColorSchemeCssVars` | `(target: CssVarTarget, colorScheme: Record<string, unknown>) => void` | 寫入原始色值與 Tailwind 覆蓋變數 |
| `applyMaterial3CssVars` | `(target: CssVarTarget, colorScheme: Record<string, unknown>) => void` | 把 Hex 轉成紅綠藍三元組後寫入 |
| `toColorSchemeCssVarName` | `(key: string) => string` | 色鍵轉內部變數名 |
| `CssVarTarget` | `HTMLElement \| SVGElement \| null \| undefined` | 目標元素型別 |

## 相關頁面

- [useCustomColorScheme](./useCustomColorScheme.md)
- [useMaterial3ColorScheme](./useMaterial3ColorScheme.md)
- [useElCssVar](./useElCssVar.md)
- [色彩主題系統](../../platform/color-scheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useColorSchemeCssVars.ts | [app/composables/useColorSchemeCssVars.ts](../../../../app/composables/useColorSchemeCssVars.ts) |

[useColorSchemeCssVars.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
