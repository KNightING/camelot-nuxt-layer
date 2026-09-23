# useElCssVar

## Summary

useElCssVar 讀寫指定元素上的單一 CSS 變數，回傳與該變數雙向同步的響應式 ref：讀取得到目前值，寫入會設到元素的 inline style。可選擇以 MutationObserver 監聽元素 style、class 變動，或只讀 inline 值不讀繼承值。它是 VueUse useCssVar 的改寫版，差別在 inherit 選項。

## 介面

### 簽章

```ts
export function useElCssVar(
  prop: MaybeRefOrGetter<string>,
  target?: MaybeElementRef,
  options: UseCssVarOptions = {},
): Ref<string>

export interface UseCssVarOptions extends ConfigurableWindow {
  initialValue?: string
  observe?: boolean
  inherit?: boolean
}
```

### 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `prop` | `MaybeRefOrGetter<string>` | 必填 | CSS 變數名稱，例如 `--cml-c-primary` |
| `target` | `MaybeElementRef` | 根元素 | 目標元素；未提供或解析不到時操作 `document.documentElement` |
| `options.initialValue` | `string` | `''` | ref 初始值，也是讀不到變數時的回退值 |
| `options.observe` | `boolean` | `false` | 以 `MutationObserver` 監聽 `style`、`class` 屬性變化並重讀 |
| `options.inherit` | `boolean` | `true` | `true` 以 `getComputedStyle` 讀取，含繼承值；`false` 只讀元素 inline style |
| `options.window` | `Window` | `defaultWindow` | 使用的 window 物件 |

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| 回傳值 | `Ref<string>` | CSS 變數的響應式 ref；寫入時以 `setProperty` 設到目標元素 |

來源：1. [useElCssVar.ts][]

## 用法

```ts
const primary = useElCssVar('--cml-c-primary', el, { inherit: false })
primary.value = '#6750a4' // 寫入元素 style
console.log(primary.value) // 讀取目前值
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 何時重讀 | 目標元素或變數名稱改變時立即重讀一次；開啟 `observe` 時屬性變動也會重讀 |
| 何時寫回 | ref 值改變時寫回目標元素的 inline style |
| 讀到空值 | 回退為 `initialValue` |
| 生命週期 | 每個實例建立一個 ref、一個 computed 與兩個常駐 watch |

> [!WARNING]
> 只在 setup 期建立，不要在 watcher 或迴圈內建立實例。在 watcher callback 內建立時不屬於任何 effect scope，永遠不會被回收。
> 需要一次寫入多個變數（如整組色彩方案）時，改用單向寫入的 [useColorSchemeCssVars](./useColorSchemeCssVars.md)，寫入不需要響應式 ref。

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useElCssVar.ts | [app/composables/useElCssVar.ts](../../../../app/composables/useElCssVar.ts) |

[useElCssVar.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
