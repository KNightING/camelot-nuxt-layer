# useCamelotColorMode

## Summary

提供全站共用的單一 `useColorMode` 實例（深淺色模式）。Layer 內任何需要深淺色狀態的程式碼一律透過它取得，不自行呼叫 `useColorMode()`。

## 簽章
```ts
export const useCamelotColorMode: () => ReturnType<typeof useColorMode>
```

## 回傳

即 VueUse `useColorMode()` 的回傳值（`store`、`system`、`state` 等），但**全站共用同一個實例**。

## 用法
```ts
const { system, store } = useCamelotColorMode()

// 讀取／設定深淺色
store.value = 'dark'
```

## 為什麼必須共用

VueUse 的 `useColorMode` 每建立一個實例，就會註冊一份 watcher 在模式變動時往 `<html>` 寫 class。

[`useCamelotTheme`](./useCamelotTheme.md) 被 35 個 Camelot 元件檔呼叫，單頁可達數百個實例。若逐實例建立 `useColorMode`，切換一次深淺色會產生數百次重複的 class 寫入與 watcher 執行——這會讓深淺色切換明顯比主題風格／色系切換卡頓（後兩者完全不觸及 colorMode）。

模式是全站單一狀態，實例收斂為模組層一份即可。

> [!IMPORTANT]
> 在本 Layer 內**不要**直接呼叫 `useColorMode()`，一律改用本 composable。

## 使用者

| 檔案 | 用途 |
| --- | --- |
| [app/composables/useCamelotTheme.ts](../../../../app/composables/useCamelotTheme.ts) | 回傳 `colorMode` 給元件、驅動漸變過場 |
| [app/composables/useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts) | 判定 `isDarkMode` 以決定採用的色彩方案 |
| [app/composables/useMaterial3ColorScheme.ts](../../../../app/composables/useMaterial3ColorScheme.ts) | 同上 |

---
[🎨 色彩主題系統](../color-scheme.md) ・ [🪝 Composables](../composables.md) ・ [🏠 Wiki](../../index.md)
