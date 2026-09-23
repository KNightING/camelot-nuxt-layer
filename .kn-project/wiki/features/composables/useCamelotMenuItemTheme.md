# 選單項主題

## Summary

`useCamelotMenuItemTheme()` 是選單與選項列的共用樣式核心，依目前主題風格回傳選中態與 hover 態的 class。CascadeMenu 的飛出面板與 SelectV2 的下拉選項共用它，確保兩者效果一致。顏色一律取自上層注入的當前色 CSS 變數。

## 運作方式

1. 從 useCamelotTheme 讀取目前主題風格。
2. 依風格回傳兩個 computed class 字串：選中態與未選 hover 態。
3. 顏色取自色彩角色 class 注入的當前色與當前前景色兩個 CSS 變數。
4. class 字串全為字面量，Tailwind v4 掃描器才能在編譯期產生對應 utility。

| 主題 | 選中態 | 未選 hover |
| --- | --- | --- |
| aqua | aqua-fill 填色，文字用當前前景色 | 當前色 12% 底 |
| scifi | 當前色 18% 底，文字當前色，帶文字光暈 | 當前色 10% 底，文字轉當前色 |
| cupertino | 當前色 12% 底，文字當前色，semibold | 當前色 8% 底 |
| material | 當前色 12% 底，文字當前色，medium | 當前色 8% 底 |

未選態的文字色一律為 on-surface。

來源：1. [useCamelotMenuItemTheme.ts][]　2. [SelectV2.vue][]　3. [CascadeMenuPanel.vue][]

## 用法

```ts
const { activeClass, hoverClass } = useCamelotMenuItemTheme()
```

```vue
<li :class="[roleColorClass, selected ? activeClass : hoverClass]">…</li>
```

## 簽章

```ts
useCamelotMenuItemTheme(): {
  activeClass: ComputedRef<string>
  hoverClass: ComputedRef<string>
}
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `activeClass` | `ComputedRef<string>` | 選中態的 class |
| `hoverClass` | `ComputedRef<string>` | 未選態的文字色與 hover 底色 class |

## 相關頁面

- [角色色彩類別](./useCamelotRoleColorClass.md)：注入當前色 CSS 變數。
- [SelectV2](../components/SelectV2.md)
- [CascadeMenu](../components/CascadeMenu.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotMenuItemTheme.ts | [app/composables/useCamelotMenuItemTheme.ts](../../../../app/composables/useCamelotMenuItemTheme.ts) |
| SelectV2.vue | [app/components/Camelot/SelectV2.vue](../../../../app/components/Camelot/SelectV2.vue) |
| CascadeMenuPanel.vue | [app/components/Camelot/Internal/CascadeMenuPanel.vue](../../../../app/components/Camelot/Internal/CascadeMenuPanel.vue) |

[useCamelotMenuItemTheme.ts]: #references
[SelectV2.vue]: #references
[CascadeMenuPanel.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
