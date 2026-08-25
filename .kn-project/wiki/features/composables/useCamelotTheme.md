# useCamelotTheme

## Summary

管理 Camelot 的主題風格（material／cupertino／scifi／aqua）、深淺色與品牌色，並於切換時觸發全站顏色漸變過場。

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
| `themeMode` | `Ref<CamelotThemeMode>` | 目前主題風格，透過 `useLocalStorage('cml-theme-mode', 'aqua', { initOnMounted: true })` 持久化。**全站共用同一個 ref**。 |
| `colorMode` | — | [`useCamelotColorMode()`](./useCamelotColorMode.md) 的 `store`（深淺色），全站共用同一個實例。 |
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
- **本 composable 的所有狀態與副作用皆為模組層單例。** 它被 35 個 Camelot 元件檔呼叫，單頁可達數百個實例；若逐實例建立 `useColorMode`、storage ref 與 watcher，切換一次深淺色就會產生數百份重複的 `<html>` 寫入。
    - `themeMode` 的 `useLocalStorage`、`colorMode` 的 `useColorMode`、以及下述兩個 watcher，統一掛在模組層的 `globalThemeScope`（`effectScope(true)`）上，不隨任何元件卸載而失效。
    - 每次呼叫實際新建的只有 `setThemeColor` / `setPrimaryColor` 兩個閉包。
- `watch(themeMode)`（immediate，單例）會更新 `<html>` 的 `--cml-active-ui-style` 與 `data-camelot-theme-mode`。
- `watch([themeMode, colorMode])`（非 immediate，單例）於風格／深淺色切換時觸發漸變。
- `triggerThemeTransition` 為模組層單例計時器（idempotent），多個實例呼叫只會重置同一個計時器；`prefers-reduced-motion: reduce` 時不觸發。另可獨立匯入使用。

---
[🏠 Wiki](../../index.md)
