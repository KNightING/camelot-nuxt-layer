# ProgressBar

## Summary

`CamelotProgressBar` 是水平進度條：依目前值與最大值填滿軌道，也可切成不確定狀態、以由左往右反覆掃過的色塊表示進行中；可在右側顯示百分比或分數標籤，外觀依主題切換。系列元件的比較見 [進度元件](../progress-components.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `value` | `number` | `0` | 目前進度值 |
| `max` | `number` | `100` | 最大值 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `indeterminate` | `boolean` | `false` | 不確定狀態，顯示掃描動畫 |
| `showLabel` | `boolean` | `false` | 顯示右側標籤；不確定狀態下不顯示 |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | 標籤格式：百分比或分數 |
| `height` | `string` | `'8px'` | 軌道高度（CSS 長度） |
| `rounded` | `boolean` | `true` | 是否圓角；Sci-Fi 主題一律無圓角 |

## 運作方式

### 進度與標籤

1. 進度百分比等於目前值除以最大值，夾在 0 到 100；最大值小於等於 0 時為 0。
2. 百分比標籤四捨五入到整數，例如「42%」。
3. 分數標籤直接顯示原始值，例如「3 / 8」，不做夾限。
4. 進度變化時填色寬度以彈性曲線過渡；不確定狀態以 40% 寬的色塊由左往右反覆掃過，一趟 1.4 秒。

來源：1. [ProgressBar.vue][]

### 各主題外觀

| 主題 | 軌道 | 填色 |
| :--- | :--- | :--- |
| aqua | 玻璃軌道加背景模糊 | 玻璃填滿 |
| scifi | 淡角色色框線與 8% 角色色底，無圓角 | 角色色加外光暈 |
| cupertino、material | 淺色容器底 | 角色色 |

使用者偏好減少動態時，關閉過渡與掃描動畫。

來源：1. [ProgressBar.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ProgressBar.vue | [app/components/Camelot/ProgressBar.vue](../../../../app/components/Camelot/ProgressBar.vue) |

[ProgressBar.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
