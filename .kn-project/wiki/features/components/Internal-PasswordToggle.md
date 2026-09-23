# PasswordToggle

## Summary

PasswordToggle（匯入名稱 `CamelotInternalPasswordToggle`）是密碼顯示與隱藏的眼睛按鈕，屬內部元件。[Input](./Input.md) 在 type 為 password 且 passwordToggle 開啟時，把它放在 after 區域尾端，四個主題共用同一顆；它只切換 v-model:revealed，何時自動切回隱碼由 Input 決定。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | — | 停用，跟隨 Input 的 disabled |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:revealed` | `boolean` | 是否顯示密碼，預設 `false` |

## 運作方式

### 按鈕行為

1. 點擊切換 revealed。
2. 按下滑鼠時阻止預設行為，焦點留在輸入框，Input 才能在切換後還原游標位置。
3. 隱碼時顯示睜眼圖示，顯示密碼時顯示閉眼圖示。

| 無障礙屬性 | 值 |
| :--- | :--- |
| aria-label | 隱碼時為「顯示密碼」，顯示時為「隱藏密碼」 |
| aria-pressed | 與 revealed 相同 |

顯示策略 hide-on-change 與 persistent 不在此元件，由 Input 的 passwordRevealMode 控制。

來源：1. [PasswordToggle.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| PasswordToggle.vue | [app/components/Camelot/Internal/PasswordToggle.vue](../../../../app/components/Camelot/Internal/PasswordToggle.vue) |

[PasswordToggle.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
