# RevealImage

## Summary

`CamelotRevealImage` 顯示一張先呈黑白的圖片，再以一道沿指定角度推進的遮罩，把同一張圖的彩色版逐步揭示出來。可自動播放、滑鼠移入播放或由外部控制播放，時長、延遲與方向都可調。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `src` | `string` | — | 圖片網址（必填），黑白底圖與彩色揭示層共用 |
| `alt` | `string` | `''` | 圖片替代文字 |
| `trigger` | `'auto' \| 'hover' \| 'manual'` | `'auto'` | 觸發方式：自動播放、滑鼠移入播放、手動控制 |
| `play` | `boolean` | `false` | `manual` 模式下設為真即播放 |
| `angle` | `string` | `'0deg'` | 揭示推進方向（CSS 角度） |
| `duration` | `string` | `'800ms'` | 動畫時長（CSS 時間） |
| `delay` | `string` | `'0s'` | 動畫延遲（CSS 時間） |

## 運作方式

### 揭示

1. 圖片本身套灰階濾鏡作為底圖，寬度撐滿元件。
2. 上方疊一層同一張圖的彩色版，以線性漸層遮罩控制可見範圍，初始完全隱藏。
3. 播放時遮罩的可見比例從 0% 推到 100%，播完停在全彩。
4. `hover` 模式只在滑鼠停留期間播放，移出後回到黑白。

來源：1. [RevealImage.vue][]

### 漸進與減少動態

| 項目 | 行為 |
| :--- | :--- |
| 漸進效果 | 元件自行把遮罩比例註冊為百分比型別，揭示過程平滑推進，不依賴其他元件 |
| 減少動態 | 使用者偏好減少動態時，彩色層直接完整顯示，不播放揭示動畫 |

來源：1. [RevealImage.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| RevealImage.vue | [app/components/Camelot/RevealImage.vue](../../../../app/components/Camelot/RevealImage.vue) |

[RevealImage.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
