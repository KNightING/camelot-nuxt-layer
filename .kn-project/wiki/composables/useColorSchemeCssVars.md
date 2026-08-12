# useColorSchemeCssVars

> 色彩方案的 CSS 變數**單向寫入器**。把整組色彩方案物件一次寫進目標元素的 inline style，不建立任何響應式實例。

## 匯出

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `applyColorSchemeCssVars` | `(target: CssVarTarget, colorScheme: Record<string, unknown>) => void` | 寫入原始色值，並附帶 Tailwind 覆蓋變數。供 [`useCustomColorScheme`](./useCustomColorScheme.md) 使用。 |
| `applyMaterial3CssVars` | `(target: CssVarTarget, colorScheme: Record<string, unknown>) => void` | 將 hex 轉為 `r,g,b` 三元組後寫入。供 [`useMaterial3ColorScheme`](./useMaterial3ColorScheme.md) 使用。 |
| `toColorSchemeCssVarName` | `(key: string) => string` | 色鍵 → 內部變數名。 |
| `CssVarTarget` | `HTMLElement \| SVGElement \| null \| undefined` | 目標元素型別；`unrefElement` 亦可能回傳 SVG 元素。 |

## 變數命名規則

```
Material3 色鍵 (primary)      → --cml-c-m3-primary
其餘色鍵 (rippleColor)         → --cml-c-ripple-color
Tailwind 覆蓋變數（僅 apply-   → --color-primary: var(--cml-c-m3-primary)
ColorSchemeCssVars 會寫）
```

Tailwind v4 會把主題色放進 `:root`，直接改會被蓋掉，故採雙變數策略：內部變數存實際色值，覆蓋變數指向內部變數。

## 用法
```ts
applyColorSchemeCssVars(el, { primary: '#6750a4', rippleColor: '#111827' })
// el.style: --cml-c-m3-primary: #6750a4; --color-primary: var(--cml-c-m3-primary);
//           --cml-c-ripple-color: #111827; --color-ripple-color: var(--cml-c-ripple-color);
```

## 備註

- **兩支寫入函式的值格式不同，刻意不合併**：`applyColorSchemeCssVars` 寫原始色值（供 `--color-*` 直接 `var()` 取用），`applyMaterial3CssVars` 寫 `r,g,b` 三元組（供 `rgb(var(--x) / <alpha>)` 調整透明度）。兩者僅共用鍵名的 kebab-case 快取。
- **為什麼不用 [`useElCssVar`](./useElCssVar.md)**：寫入是單向動作，不需要每個變數各自持有 ref。逐鍵建立 `useElCssVar` 會在主題切換這種熱路徑上產生大量永不回收的 watcher。
- Material3 鍵集合為**延遲初始化**：本模組與 `useMaterial3ColorScheme` 互為循環匯入，在模組載入當下建立 `Set` 會撞上 `Material3ColorSchemeKeys` 的 TDZ。
- 非字串值一律略過。

---
[🎨 色彩主題系統](../features/color-scheme.md) ・ [🪝 Composables](../composables.md) ・ [🏠 Wiki](../index.md)
