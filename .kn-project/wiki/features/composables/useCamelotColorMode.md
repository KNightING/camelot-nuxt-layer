# useCamelotColorMode

## Summary

`useCamelotColorMode()` 回傳全站共用的單一 VueUse `useColorMode` 實例，負責深淺色模式。實例在模組載入時建立一次，之後每次呼叫都拿到同一份。Layer 內需要深淺色狀態的程式碼一律透過它取得，不自行呼叫 `useColorMode()`。

## 運作方式

### 為什麼必須共用

VueUse 的 `useColorMode` 每建立一個實例，就會註冊一份 watcher，在模式變動時往 `<html>` 寫 class。

[useCamelotTheme](./useCamelotTheme.md) 被數十個 Camelot 元件呼叫，單頁可達數百個呼叫端。逐一建立實例的話，切換一次深淺色就會產生數百次重複的 class 寫入。

深淺色是全站單一狀態，實例收斂為模組層一份即可。

> [!IMPORTANT]
> 在本 Layer 內**不要**直接呼叫 `useColorMode()`，一律改用本 composable。

來源：1. [useCamelotColorMode.ts][]

### 使用者

| 使用者 | 用途 |
| --- | --- |
| [useCamelotTheme](./useCamelotTheme.md) | 回傳深淺色設定給元件，並在切換時觸發顏色漸變 |
| [useCustomColorScheme](./useCustomColorScheme.md) | 判斷目前是否深色，決定採用哪組色彩方案 |
| [useMaterial3ColorScheme](./useMaterial3ColorScheme.md) | 同上 |

來源：1. [useCamelotTheme.ts][]　2. [useCustomColorScheme.ts][]　3. [useMaterial3ColorScheme.ts][]

## 用法

```ts
const { system, store } = useCamelotColorMode()

store.value = 'dark'
```

## 簽章

```ts
useCamelotColorMode(): ReturnType<typeof useColorMode>
```

## 回傳

VueUse `useColorMode()` 的回傳值，全站共用同一個實例：

| 名稱 | 說明 |
| --- | --- |
| `store` | 使用者設定的模式，可寫；`auto` 代表跟隨系統 |
| `system` | 系統偏好的深淺色 |
| `state` | 實際套用的模式 |

## 相關頁面

- [色彩主題系統](../../platform/color-scheme.md)
- [Composables 清單](../composables.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotColorMode.ts | [app/composables/useCamelotColorMode.ts](../../../../app/composables/useCamelotColorMode.ts) |
| useCamelotTheme.ts | [app/composables/useCamelotTheme.ts](../../../../app/composables/useCamelotTheme.ts) |
| useCustomColorScheme.ts | [app/composables/useCustomColorScheme.ts](../../../../app/composables/useCustomColorScheme.ts) |
| useMaterial3ColorScheme.ts | [app/composables/useMaterial3ColorScheme.ts](../../../../app/composables/useMaterial3ColorScheme.ts) |

[useCamelotColorMode.ts]: #references
[useCamelotTheme.ts]: #references
[useCustomColorScheme.ts]: #references
[useMaterial3ColorScheme.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
