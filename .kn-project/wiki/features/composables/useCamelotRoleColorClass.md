# 角色色彩類別

## Summary

`useCamelotRoleColorClass(color, isContainer)` 把色彩角色轉成一組 Tailwind 任意屬性 class，在元素上設定 `--cml-color-current-color` 與 `--cml-color-current-on-color` 兩個 CSS 變數。路由元件以它注入當前色，葉元件與面板再以 var() 取用，四種主題共用同一套色彩來源。

## 運作方式

1. 依 isContainer 選擇一般色或容器色的對照表。
2. 以色彩角色查表，回傳對應的 class 字串，color 或 isContainer 變動時重新計算。
3. 把 class 綁到元素上，子孫即可讀到兩個當前色變數。
4. class 字串全為字面量，Tailwind v4 掃描器才能在編譯期產生對應 utility。

| 模式 | 當前色 | 當前前景色 |
| --- | --- | --- |
| 一般色 | 角色色，例如 `--color-primary` | 角色前景色，例如 `--color-on-primary` |
| 容器色 | 角色容器色，例如 `--color-primary-container` | 容器前景色，例如 `--color-on-primary-container` |

支援的角色：primary、secondary、tertiary、error、info、warning、success。

浮層 Teleport 離開原本的 DOM 位置後，CSS 變數的繼承會中斷，面板需要自行再套一次這組 class。

來源：1. [useCamelotRoleColorClass.ts][]

## 用法

```ts
const colorClass = useCamelotRoleColorClass(() => props.color, () => props.container)
```

```vue
<div :class="colorClass">
  <span class="bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]">…</span>
</div>
```

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
| `color` | `MaybeRefOrGetter<CamelotColorRole>` | — | 色彩角色 |
| `isContainer` | `MaybeRefOrGetter<boolean>` | `false` | 為 `true` 時使用容器色 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `ComputedRef<string>` | 設定兩個當前色變數的 class 字串 |

## 相關頁面

- [選單項主題](./useCamelotMenuItemTheme.md)：消費當前色變數的選中與 hover 樣式。
- [浮層傳送目標](./useCamelotTeleportTarget.md)：浮層離開 DOM 後的變數繼承問題。
- [色彩主題系統](../../platform/color-scheme.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotRoleColorClass.ts | [app/composables/useCamelotRoleColorClass.ts](../../../../app/composables/useCamelotRoleColorClass.ts) |

[useCamelotRoleColorClass.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
