# ScifiCheckbox

## Summary

`CamelotScifiCheckbox` 是 Sci-Fi 主題的核取方塊：18px 的 HUD 方框，勾選時中央亮起帶光暈的方塊並有一道掃描線反覆掃過，hover 時顯示準星。半選狀態與勾選狀態外觀相同。一般不直接使用，而是由 `CamelotCheckbox` 在 Sci-Fi 主題下自動選用；標籤與色彩角色由外層元件提供。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用 |
| `indeterminate` | `boolean` | `false` | 半選（未定）狀態，外觀與勾選相同 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 勾選狀態切換時觸發，帶入切換後的值 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`（預設 `false`） | 是否為勾選狀態 |

## 運作方式

### 狀態外觀

| 狀態 | 外觀 |
| :--- | :--- |
| 未勾選 | 淡色細框，左右兩側有較深的括號狀邊 |
| 勾選或半選 | 括號邊改為實色並發光，中央 10px 方塊亮起，掃描線每秒掃過一次 |
| hover | 方框周圍顯示準星 |
| 停用 | 透明度 30%、灰階，不接受點擊 |

來源：1. [Scifi/Checkbox.vue][]

### 點擊

1. 點擊即切換勾選狀態，並以新值發出 `change`；與 Radio 不同，已勾選時點擊會取消。
2. 半選狀態下點擊，切換的是勾選值；因為半選外觀與勾選相同，畫面可能看不出變化，半選旗標要由外部清除。
3. 停用時不接受點擊，不發出 `change`。

來源：1. [Scifi/Checkbox.vue][]

## 相關頁面

- [Checkbox](./Checkbox.md)
- [Scifi Reticle](./Scifi-Reticle.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Scifi/Checkbox.vue | [app/components/Camelot/Scifi/Checkbox.vue](../../../../app/components/Camelot/Scifi/Checkbox.vue) |

[Scifi/Checkbox.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
