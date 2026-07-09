# useCamelotTheme

> 管理 Camelot 的主題風格（material／cupertino／scifi／aqua）、深淺色與品牌色，並於切換時觸發全站顏色漸變過場。

## 簽章
```ts
useCamelotTheme(): {
  themeMode: Ref<CamelotThemeMode>
  colorMode: ...
  lightColorScheme: Ref<...>
  darkColorScheme: Ref<...>
  setPrimaryColor: (lightColor: string, darkColor: string) => void
  setThemeColor: (key: string, lightColor: string, darkColor: string) => void
  triggerThemeTransition: () => void
}

type CamelotThemeMode = 'material' | 'cupertino' | 'scifi' | 'aqua'
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `themeMode` | `Ref<CamelotThemeMode>` | 目前主題風格，透過 `useLocalStorage('cml-theme-mode', 'aqua', { initOnMounted: true })` 持久化。 |
| `colorMode` | — | `useColorMode()` 的 `store`（深淺色）。 |
| `lightColorScheme` | `Ref` | 淺色配色方案，來自 `useCustomColorScheme`。 |
| `darkColorScheme` | `Ref` | 深色配色方案，來自 `useCustomColorScheme`。 |
| `setPrimaryColor` | `(lightColor, darkColor) => void` | 設定品牌主色（等同 `setThemeColor('primary', ...)`）。 |
| `setThemeColor` | `(key, lightColor, darkColor) => void` | 設定指定色彩 key 的淺／深色值，並觸發顏色漸變。 |
| `triggerThemeTransition` | `() => void` | 在 `<html>` 暫時加上 `cml-theme-transitioning` class（360ms）以漸變過場。 |

## 用法
```ts
const { themeMode, setPrimaryColor } = useCamelotTheme()
themeMode.value = 'scifi'
setPrimaryColor('#3366ff', '#88aaff')
```

## 備註
- `triggerThemeTransition` 為模組層單例計時器（idempotent），多個實例呼叫只會重置同一個計時器；`prefers-reduced-motion: reduce` 時不觸發。
- `watch(themeMode)`（immediate）會更新 `<html>` 的 `--cml-active-ui-style` 與 `data-camelot-theme-mode`。
- `watch([themeMode, colorMode])`（非 immediate）於風格／深淺色切換時觸發漸變。
- 另匯出模組層函式 `triggerThemeTransition`。

---
[🏠 Wiki](../index.md)
