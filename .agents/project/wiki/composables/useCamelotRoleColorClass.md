# useCamelotRoleColorClass

> 將色彩角色解析為設定 CSS 變數（`--cml-color-current-color` / `--cml-color-current-on-color`）的 Tailwind arbitrary-property class。

## 簽章
```ts
useCamelotRoleColorClass(
  color: MaybeRefOrGetter<CamelotColorRole>,
  isContainer: MaybeRefOrGetter<boolean> = false,
): ComputedRef<string>
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `color` | `MaybeRefOrGetter<CamelotColorRole>` | — | 色彩角色（`primary`／`secondary`／`tertiary`／`error`／`info`／`warning`／`success`）。 |
| `isContainer` | `MaybeRefOrGetter<boolean>` | `false` | 為 `true` 時使用容器色（`--color-{role}-container` / `--color-on-{role}-container`），否則使用一般色（`--color-{role}` / `--color-on-{role}`）。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `ComputedRef<string>` | 設定當前色彩 CSS 變數的字面量 class 字串，隨 `color`／`isContainer` 變動。 |

## 用法
```ts
const colorClass = useCamelotRoleColorClass(() => props.color, () => props.container)
// 葉元件以 bg-[var(--cml-color-current-color)] / text-[var(--cml-color-current-on-color)] 取用
```

## 備註
- class 字串為字面量（定義於 `ROLE_COLOR_CLASS` / `ROLE_CONTAINER_COLOR_CLASS`），Tailwind v4 掃描器才能在編譯期產生對應 utility。
- 取代過往於各 router 元件中以 `computed` 回傳 `:style` 物件注入 CSS 變數的寫法。

---
[🏠 Wiki](../index.md)
