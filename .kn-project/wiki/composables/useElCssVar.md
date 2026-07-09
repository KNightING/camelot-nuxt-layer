# useElCssVar

> 讀寫指定元素上的 CSS 變數，並以響應式 ref 雙向同步（可選擇是否用 MutationObserver 監聽變動、是否讀取繼承值）。

## 簽章
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

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `prop` | `MaybeRefOrGetter<string>` | （必填） | CSS 變數名稱（例如 `--cml-c-primary`）。 |
| `target` | `MaybeElementRef` | `window.document.documentElement` | 目標元素；未提供時預設操作根元素。 |
| `options.initialValue` | `string` | `''` | 初始值；讀不到變數時的回退值。 |
| `options.observe` | `boolean` | `false` | 是否以 `MutationObserver` 監聽 `style`、`class` 屬性變化並更新。 |
| `options.inherit` | `boolean` | `true` | `true` 用 `getComputedStyle` 讀取（含繼承值）；`false` 只讀元素 inline `style` 的變數值。 |
| `options.window` | `Window` | `defaultWindow` | 使用的 window 物件。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `Ref<string>` | CSS 變數的響應式 ref；讀取取得目前值，寫入會 `setProperty` 到目標元素。 |

## 用法
```ts
const primary = useElCssVar('--cml-c-primary', el, { inherit: false })
primary.value = '#6750a4' // 寫入元素 style
console.log(primary.value) // 讀取目前值
```

## 備註
- 內部對 `[elRef, prop]` 變化 immediate 監聽以更新 ref；並監聽 ref 變化寫回元素 `style`。
- `inherit: false` 時僅讀 inline style，適合搭配需要精準覆蓋的情境（如自訂色彩配置）。

---
[🏠 Wiki](../index.md)
