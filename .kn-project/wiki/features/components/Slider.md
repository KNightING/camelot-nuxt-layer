# Slider

## Summary

滑桿元件：拖曳把手或點軌道選取數值，支援單值與雙把手區間、步進吸附、刻度與文字標記、數值提示，並依主題切換軌道、填色與把手樣式。匯入名稱為 `CamelotSlider`（Nuxt 自動匯入）。

## 運作方式

### 拖曳與點軌道

1. 拖曳把手時即時改值，每次都吸附到步進值的倍數，並限制在最小與最大值之間。
2. 點軌道時，離點擊位置最近的把手移過去，並可接著拖曳。
3. 區間模式下兩個把手不會交錯，起點不超過終點。
4. 聚焦把手後，右鍵與上鍵加一個步進，左鍵與下鍵減一個步進。
5. 停用時擋掉拖曳與點軌道；方向鍵不受停用影響。

來源：1. [Slider.vue][]

### 值的校正

1. 載入時與外部改值時，會把值吸附到步進值的倍數，避免把手和刻度錯位。
2. 改變步進、最小或最大值時也會重新吸附。
3. 吸附時依步進值的小數位數四捨五入，避免浮點誤差。

來源：1. [Slider.vue][]

### 標記與提示

| 設定 | 行為 |
|---|---|
| 標記為 true | 依步進自動產生刻度與數字；刻度超過 20 個時不產生 |
| 標記為陣列 | 依陣列畫刻度，有 label 的顯示文字 |
| 開啟數值提示 | 每個把手上方常駐顯示目前數值 |

Sci-Fi 主題的軌道與把手為直角，其他主題為圓角。

來源：1. [Slider.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `min` | `number` | `0` | 最小值。 |
| `max` | `number` | `100` | 最大值。 |
| `step` | `number` | `1` | 步進值，數值吸附到它的倍數。 |
| `range` | `boolean` | `false` | 雙把手區間模式，值為 `[起, 迄]`。 |
| `height` | `number` | `6` | 軌道高度，單位 px。 |
| `marks` | `boolean \| { value: number, label?: string }[]` | `false` | 刻度與文字；`true` 時依步進自動產生。 |
| `showTooltip` | `boolean` | `false` | 在把手上方顯示數值提示。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `disabled` | `boolean` | `false` | 停用滑桿。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number \| [number, number]` | 目前值；區間模式為 `[起, 迄]`，預設 `0`。 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Slider.vue | [app/components/Camelot/Slider.vue](../../../../app/components/Camelot/Slider.vue) |

[Slider.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
