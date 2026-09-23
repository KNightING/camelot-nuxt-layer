# Scifi Reticle

## Summary

Sci-Fi 主題的四角瞄準框裝飾，啟用或滑鼠移入時四角向內收合並發光。它由 HUD 外框與 Sci-Fi 開關內建使用，通常不直接放在頁面上，匯入名稱為 `CamelotScifiReticle`（Nuxt 自動匯入）。

## 運作方式

1. 以絕對定位貼在父層外圍，四邊各向外延伸 8px。
2. 預設不接收滑鼠事件；開啟可懸停時改為接收，讓滑鼠移入也能觸發收合。
3. 顏色取目前色彩變數，沒有時退回主題主色，再退回文字顏色。

來源：1. [Scifi/Reticle.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `active` | `boolean` | — | 是否啟用，四角收合並發光。 |
| `hoverable` | `boolean` | — | 是否可由滑鼠移入觸發，並開啟指標事件。 |

## 相關頁面

- [Scifi Frame](./Scifi-Frame.md)
- [Scifi Switch](./Scifi-Switch.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Scifi/Reticle.vue | [app/components/Camelot/Scifi/Reticle.vue](../../../../app/components/Camelot/Scifi/Reticle.vue) |

[Scifi/Reticle.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
