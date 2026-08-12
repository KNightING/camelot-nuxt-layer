import { kebabCase } from 'change-case'
import { Material3ColorSchemeKeys } from './useMaterial3ColorScheme'

/**
 * 色彩方案的 CSS 變數寫入器。
 *
 * 寫入 CSS 變數是單向動作，刻意不經過 `useElCssVar` —— 那會為每個變數建立
 * ref + computed + 兩個 watch。在主題切換這種熱路徑上逐鍵建立 reactive 實例，
 * 會讓單次切換產生數萬個永不回收的 watcher（見 issue #17）。
 */

/** 可承載 CSS 變數的目標元素；`unrefElement` 亦可能回傳 SVG 元素。 */
export type CssVarTarget = HTMLElement | SVGElement | null | undefined

/**
 * `useMaterial3ColorScheme` 會反向用到本模組的寫入器，兩者互為循環匯入。
 * 在模組載入當下建 Set 會撞上 `Material3ColorSchemeKeys` 的 TDZ，故延遲到首次寫入時才建立。
 */
let material3KeySet: Set<string> | undefined

const getMaterial3KeySet = (): Set<string> => {
  material3KeySet ??= new Set<string>(Material3ColorSchemeKeys)
  return material3KeySet
}

/**
 * 色鍵（camelCase）→ CSS 變數片段（kebab-case）的快取。
 * 鍵集合有限且固定，切換主題時逐鍵重算純屬浪費。
 */
const cssVarSegmentCache = new Map<string, string>()

const toCssVarSegment = (key: string): string => {
  const cached = cssVarSegmentCache.get(key)
  if (cached) {
    return cached
  }

  const segment = kebabCase(key)
  cssVarSegmentCache.set(key, segment)
  return segment
}

/**
 * 內部變數名：Material3 色鍵前綴 `--cml-c-m3-`，其餘 Camelot / 消費端自訂色鍵前綴 `--cml-c-`。
 */
export const toColorSchemeCssVarName = (key: string): string =>
  getMaterial3KeySet().has(key)
    ? `--cml-c-m3-${toCssVarSegment(key)}`
    : `--cml-c-${toCssVarSegment(key)}`

/**
 * 將整組色彩方案寫入目標元素的 inline style。
 *
 * 採雙變數策略：內部變數 `--cml-c-*` 存實際色值，Tailwind 覆蓋變數 `--color-*`
 * 指向內部變數（Tailwind v4 會把主題色放進 `:root`，直接改會被蓋掉）。
 */
export const applyColorSchemeCssVars = (
  target: CssVarTarget,
  colorScheme: Record<string, unknown>,
): void => {
  if (!target) {
    return
  }

  for (const key in colorScheme) {
    const value = colorScheme[key]
    if (typeof value !== 'string') {
      continue
    }

    const cssVarName = toColorSchemeCssVarName(key)
    target.style.setProperty(cssVarName, value)
    target.style.setProperty(`--color-${toCssVarSegment(key)}`, `var(${cssVarName})`)
  }
}

/**
 * 將整組 Material3 色彩方案以 `r,g,b` 三元組寫入 `--cml-c-m3-*`。
 *
 * 三元組格式供 `rgb(var(--cml-c-m3-x) / <alpha>)` 這類需要調整透明度的用法；
 * 無法解析為 hex 時原樣寫入。此格式與 {@link applyColorSchemeCssVars} 的色值格式不同，
 * 故兩者刻意不共用同一支寫入函式。
 */
export const applyMaterial3CssVars = (
  target: CssVarTarget,
  colorScheme: Record<string, unknown>,
): void => {
  if (!target) {
    return
  }

  const color = useColor()

  for (const key in colorScheme) {
    const value = colorScheme[key]
    if (typeof value !== 'string') {
      continue
    }

    const rgba = color.hexToRgbaArray(value)
    target.style.setProperty(
      `--cml-c-m3-${toCssVarSegment(key)}`,
      rgba ? `${rgba[0]},${rgba[1]},${rgba[2]}` : value,
    )
  }
}
