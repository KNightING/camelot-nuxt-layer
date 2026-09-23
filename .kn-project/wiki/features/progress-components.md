# 📊 進度元件

## Summary

三個進度元件：水平進度條 `CamelotProgressBar`、SVG 環形進度 `CamelotProgressCircle`、帶破口讀作「n／total」的階段儀表環 `CamelotProgressStage`。三者都支援 material、cupertino、scifi、aqua 四種主題與 `color` 色彩角色，數值變化以彈簧曲線過場並尊重減少動態偏好；前兩者另有 indeterminate（不確定）模式。

## 運作方式

### ProgressBar

水平線性進度條，填滿寬度＝`value` 除以 `max` 的百分比，限制在 0 到 100 之間；`max` 小於等於 0 時視為 0。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | 當前值 |
| `max` | `number` | `100` | 最大值 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `indeterminate` | `boolean` | `false` | 不確定模式，填滿段左右來回掃描 |
| `showLabel` | `boolean` | `false` | 右側顯示文字；不確定模式不顯示 |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | 顯示百分比，或「值 ／ 最大值」 |
| `height` | `string` | `'8px'` | 軌道高度 |
| `rounded` | `boolean` | `true` | 圓角；scifi 主題強制方角 |

| 主題 | 外觀 |
| :--- | :--- |
| material、cupertino | 表面色軌道，色彩角色填滿 |
| scifi | 色彩角色淡底加細邊，填滿段帶光暈 |
| aqua | 玻璃軌道加漸層填滿 |

1. 確定模式以寬度過場，曲線為彈簧曲線。
2. 不確定模式用 40% 寬的填滿段做掃描動畫，一輪 1.4 秒。
3. 使用者開啟減少動態時，過場與掃描動畫都關閉。

來源：1. [ProgressBar.vue][]　2. [tailwind.css][]

### ProgressCircle

SVG 環形進度，由軌道圈與進度圈疊成；進度圈的虛線偏移量＝周長乘以（1 減完成比例）。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | 當前值 |
| `max` | `number` | `100` | 最大值 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `indeterminate` | `boolean` | `false` | 固定弧長旋轉 |
| `showLabel` | `boolean` | `false` | 圓心顯示文字；不確定模式不顯示 |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | 同 ProgressBar |
| `size` | `number` | `64` | 直徑 px |
| `strokeWidth` | `number` | `6` | 線寬 |

| 主題 | 外觀 |
| :--- | :--- |
| scifi | 平頭線端加光暈 |
| aqua | 漸層描邊，漸層 id 以 `useId()` 產生避免衝突 |
| 其他 | 圓頭線端 |

svg 設為溢出可見，避免光暈被裁切；不確定模式用 Tailwind 內建的旋轉動畫。

來源：1. [ProgressCircle.vue][]

### ProgressStage

階段儀表環：左上有破口，當前階段數字從破口突破而出，斜線在圓心左上、總階段在圓心右下，整體讀作「n／total」。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `current` | `number` | `1` | 當前階段 |
| `total` | `number` | `1` | 總階段數 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `size` | `number` | `96` | 直徑 px |
| `strokeWidth` | `number` | `7` | 線寬 |

| 規則 | 說明 |
| :--- | :--- |
| 破口 | 中心在 225°（左上），開口固定 98° |
| 進度弧 | 從破口順時針補滿，完成比例＝當前除以總數，限制在 0 到 1 |
| 當前數字字級 | 三位數以內 51px，四位數以上 40px |
| 當前數字位置 | 絕對定位靠右、最小 3 字元寬，固定在右 62px、上 4px |
| 總階段 | 斜體，字級為直徑的 26% |
| 主題 | aqua 漸層描邊、scifi 加光暈，其餘用色彩角色描邊；線端一律圓頭 |

來源：1. [ProgressStage.vue][]

## 相關頁面

- [ProgressBar](./components/ProgressBar.md)
- [ProgressCircle](./components/ProgressCircle.md)
- [ProgressStage](./components/ProgressStage.md)
- [主題系統](../platform/theme-system.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ProgressBar.vue | [app/components/Camelot/ProgressBar.vue](../../../app/components/Camelot/ProgressBar.vue) |
| tailwind.css | [app/assets/css/tailwind.css](../../../app/assets/css/tailwind.css) |
| ProgressCircle.vue | [app/components/Camelot/ProgressCircle.vue](../../../app/components/Camelot/ProgressCircle.vue) |
| ProgressStage.vue | [app/components/Camelot/ProgressStage.vue](../../../app/components/Camelot/ProgressStage.vue) |

[ProgressBar.vue]: #references
[tailwind.css]: #references
[ProgressCircle.vue]: #references
[ProgressStage.vue]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
