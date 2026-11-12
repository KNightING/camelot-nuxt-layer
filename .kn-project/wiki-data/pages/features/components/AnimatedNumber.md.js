WIKI_PAGE("features/components/AnimatedNumber.md",{
"title":"AnimatedNumber",
"summary":"AnimatedNumber 是大數字顯示元件，匯入名稱 `CamelotAnimatedNumber`。以等寬字體顯示格式化後的數字，數值變動時只有變化的字元會從下方滾進來並淡入。它只負責顯示，不做任何運算。",
"svgs":{},
"seq":{},
"ext":["archive/2611121510-tactile-showcase-parity.md"],
"changelog":[{"plan": "2611121510-tactile-showcase-parity", "date": "2026-11-12", "version": "4.6.4.2", "note": "tactile 與展示頁對齊，新增步進器、大數字、可選取標籤與行內日曆", "issue": "[#80](https://github.com/KNightING/camelot-nuxt-layer/issues/80)", "pr": "[PR #81](https://github.com/KNightING/camelot-nuxt-layer/pull/81)"}],
"md":"# AnimatedNumber\n\n## Summary\n\nAnimatedNumber 是大數字顯示元件，匯入名稱 `CamelotAnimatedNumber`。以等寬字體顯示格式化後的數字，數值變動時只有變化的字元會從下方滾進來並淡入。它只負責顯示，不做任何運算。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `value` | `number \\| 十進位字串` | `0` | 要顯示的數字；字串（例如 `'144.00'`）原樣交給 Intl 格式化 |\n| `prefix` | `string` | `''` | 數字前面的符號，例如「$」 |\n| `suffix` | `string` | `''` | 數字後面的單位 |\n| `fractionDigits` | `number` | `0` | 固定顯示的小數位數 |\n| `locale` | `string` | 瀏覽器語系 | 決定千分位與小數點的 BCP 47 語系 |\n| `size` | `CamelotNumberSize` | `'lg'` | 尺寸：md 24px、lg 36px、xl 60px |\n| `color` | `CamelotColorRole` | `'primary'` | Sci-Fi 風格的發光色 |\n\n## 規則\n| 規則 | 說明 |\n| :--- | :--- |\n| 第一次渲染 | 不播動畫，只有之後數值變動才播 |\n| 滾動範圍 | 以字元位置與內容判斷，變動的字元重新播放；沒變的字元不動 |\n| 無障礙 | 整串數字以一個標籤朗讀，個別字元對輔助工具隱藏 |\n| 減少動態 | 使用者偏好減少動態時不播動畫 |\n\n來源：1. [AnimatedNumber.vue](../../../../app/components/Camelot/AnimatedNumber.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});
