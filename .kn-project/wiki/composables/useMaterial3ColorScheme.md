# useMaterial3ColorScheme

> 管理 Material 3 色彩配置（明/暗），將採用中的配置寫入目標元素的 `--cml-c-m3-<kebab>` CSS 變數（顏色轉為 `r,g,b` 形式）；未指定目標時退回全域版本。

## 簽章
```ts
export const useMaterial3ColorScheme = (
  target?: MaybeElementRef,
  config?: Material3ColorSchemeConfig,
) => {
  mode, lightColorScheme, darkColorScheme, usedColorScheme,
}

export const useGlobalMaterial3ColorScheme = (
  config?: Material3ColorSchemeConfig,
) => { ... }
```

其中：
```ts
type Material3ColorSchemeConfig = {
  lightColorScheme?: Material3ColorSchemePartial
  darkColorScheme?: Material3ColorSchemePartial
  editMode?: boolean
}

export type Material3ColorScheme = { /* primary, onPrimary, surface, ... 完整 M3 色票 */ }
export type Material3ColorSchemePartial = Partial<Material3ColorScheme>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `target` | `MaybeElementRef` | `undefined` | 套用色彩變數的目標元素；未提供時改用 `useGlobalMaterial3ColorScheme`。 |
| `config.lightColorScheme` | `Material3ColorSchemePartial` | 全域淺色配置 | 淺色模式色彩配置。 |
| `config.darkColorScheme` | `Material3ColorSchemePartial` | 全域深色配置 | 深色模式色彩配置。 |
| `config.editMode` | `boolean` | `true`（僅在 `=== false` 時停用） | 為 `false` 時不寫入 CSS 變數。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `mode` | `useColorMode().store` | 目前色彩模式的可寫 ref。 |
| `lightColorScheme` | `Ref<Material3ColorSchemePartial>` | 淺色模式配置。 |
| `darkColorScheme` | `Ref<Material3ColorSchemePartial>` | 深色模式配置。 |
| `usedColorScheme` | `ComputedRef<Material3ColorSchemePartial>` | 依目前模式（`auto` 時看系統偏好）採用的配置。 |

## 匯出常數
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `defaultColorScheme` | `Material3ColorScheme` | 預設淺色 M3 色票。 |
| `defaultDarkColorScheme` | `Material3ColorScheme` | 預設深色 M3 色票。 |
| `Material3ColorSchemeKeys` | `(keyof Material3ColorScheme)[]` | 所有 M3 色鍵名。 |

## 用法
```ts
// 全域設定
useMaterial3ColorScheme(undefined, {
  lightColorScheme: { primary: '#6750a4' },
  darkColorScheme: { primary: '#d0bcff' },
})

// 套用到特定元素
const el = ref<HTMLElement>()
useMaterial3ColorScheme(el, { lightColorScheme: { primary: '#005ac1' } })
```

## 備註
- 變數寫入委派給 [`applyMaterial3CssVars`](./useColorSchemeCssVars.md)：以 `useColor().hexToRgbaArray` 將 hex 轉為 `r,g,b` 三元組（無法解析時直接寫入原值），寫入 `--cml-c-m3-<kebab-case-key>`。
    - 此格式**與 `useCustomColorScheme` 的原始色值格式不同**，故兩者各用一支寫入函式，僅共用鍵名轉換快取。三元組供 `rgb(var(--cml-c-m3-x) / <alpha>)` 這類需要調整透明度的用法。
- 有 `target` 時，`light/darkColorScheme` 初始取 `config` 或全域值；`config` 存在時再覆蓋一次。
- 深淺色來源為共用的 [`useCamelotColorMode`](./useCamelotColorMode.md)，非各自建立的 `useColorMode`。
- `useGlobalMaterial3ColorScheme` 直接更新模組層級的全域 ref，供整站共用。

---
[🏠 Wiki](../index.md)
