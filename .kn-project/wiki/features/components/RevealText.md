# RevealText

## Summary

`CamelotRevealText` 顯示一段文字，再以一道沿指定角度推進的遮罩，把同一段文字以指定的填色或背景逐步覆蓋上去。可自動播放、滑鼠移入播放或由外部控制播放，時長、延遲、方向與填色都可調。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `text` | `string` | — | 要顯示的文字（必填） |
| `trigger` | `'auto' \| 'hover' \| 'manual'` | `'auto'` | 觸發方式：自動播放、滑鼠移入播放、手動控制 |
| `play` | `boolean` | `false` | `manual` 模式下設為真即播放 |
| `angle` | `string` | `'0deg'` | 揭示推進方向（CSS 角度） |
| `duration` | `string` | `'500ms'` | 動畫時長（CSS 時間） |
| `delay` | `string` | `'0s'` | 動畫延遲（CSS 時間） |
| `fill` | `string` | `'#ff4d4f'` | 揭示層的背景，可為顏色、漸層或圖片 |
| `bgSize` | `string` | `'auto'` | 揭示層背景尺寸（CSS 長度或關鍵字） |

## 運作方式

### 揭示

1. 元件先以一般文字色顯示整段文字。
2. 上方疊一層同樣的文字，以 `fill` 為背景並裁切成文字形狀，背景置中。
3. 揭示層以線性漸層遮罩控制可見範圍，播放時可見比例從 0% 推到 100%，播完停在全填色。
4. `hover` 模式只在滑鼠停留期間播放，移出後回到原色。
5. 使用者偏好減少動態時不播放動畫，直接顯示全填色。

來源：1. [RevealText.vue][]

### 預設樣式

元件內建字級 64px、文字色近黑，不跟隨主題或外層字級；要改變時需從外層覆寫元件的樣式。

來源：1. [RevealText.vue][]

## 相關頁面

- [RevealImage](./RevealImage.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RevealText.vue | [app/components/Camelot/RevealText.vue](../../../../app/components/Camelot/RevealText.vue) |

[RevealText.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
