# Scifi Frame

## Summary

Sci-Fi 主題的 HUD 外框容器，以切角、格線、掃描線、脈衝與光澤等裝飾包住內容，是 Sci-Fi 版輸入框、按鈕等控制項的共用外殼，通常不直接在頁面上使用。匯入名稱為 `CamelotScifiFrame`（Nuxt 自動匯入）。

## 運作方式

1. 外框主色取自目前色彩變數，沒有設定時退回主題主色，再退回文字顏色。
2. 預設裁切左上與右下兩角，並在這兩角畫角落裝飾；改用四角樣式時四個角都會裁切。
3. 關閉切角裁切時，角落裝飾一併隱藏。
4. 外框內建一個準星裝飾，由啟用準星的設定控制收合與發光。
5. 內容區的最低高度繼承外框本身，讓外層設定的高度能傳到內容。

來源：1. [Scifi/Frame.vue][]　2. [Scifi/Reticle.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `variant` | `'2-corner' \| '4-corner'` | `'2-corner'` | 切角樣式；`4-corner` 為四角皆切。 |
| `showGrid` | `boolean` | `true` | 顯示格線背景。 |
| `showScanline` | `boolean` | `true` | 顯示掃描線動畫。 |
| `showPulse` | `boolean` | `false` | 顯示水平脈衝掃描背景。 |
| `focused` | `boolean` | `false` | 聚焦狀態，套用光暈與內陰影。 |
| `filled` | `boolean` | `false` | 以主色填滿背景。 |
| `showShine` | `boolean` | `false` | 觸發一次光澤滑掠動畫。 |
| `activeReticle` | `boolean` | `false` | 啟用角落準星效果。 |
| `showBorders` | `boolean` | `true` | 顯示外框邊界背景；`false` 時背景不透明度設為 0。 |
| `showCorners` | `boolean` | `true` | 顯示左上與右下角落裝飾，需同時開啟 `clipCorners`。 |
| `clipCorners` | `boolean` | `true` | 啟用切角裁切；`false` 時不裁切邊角。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 外框內容。 |

## 相關頁面

- [Scifi Reticle](./Scifi-Reticle.md)
- [Scifi Input](./Scifi-Input.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Scifi/Frame.vue | [app/components/Camelot/Scifi/Frame.vue](../../../../app/components/Camelot/Scifi/Frame.vue) |
| Scifi/Reticle.vue | [app/components/Camelot/Scifi/Reticle.vue](../../../../app/components/Camelot/Scifi/Reticle.vue) |

[Scifi/Frame.vue]: #references
[Scifi/Reticle.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
