# ProgressStage

## Summary

`CamelotProgressStage` 是階段進度指示器：以左上方留一個缺口的弧形環顯示「目前階段／總階段」的比例，目前階段的數字從缺口處突出，斜線與總階段數排在圓心附近，三者視為一體。外觀依主題切換。系列元件的比較見 [進度元件](../progress-components.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `current` | `number` | `1` | 目前階段 |
| `total` | `number` | `1` | 總階段數 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |
| `size` | `number` | `96` | 元件尺寸（px） |
| `strokeWidth` | `number` | `7` | 弧線線寬（px） |

## 運作方式

### 弧形與比例

1. 缺口固定開在左上方，寬 98 度；其餘 262 度是軌道。
2. 進度弧從缺口的一端順時針畫起，長度等於目前階段除以總階段，夾在 0 到 1；總階段小於等於 0 時為 0。
3. 階段變化時以彈性曲線過渡；使用者偏好減少動態時關閉過渡。

來源：1. [ProgressStage.vue][]

### 數字排版

| 元素 | 排版 |
| :--- | :--- |
| 目前階段 | 角色色粗斜體，放在缺口處；3 位數以內 51px，4 位數以上 40px |
| 斜線 | 淡色，旋轉 30 度，放在圓心偏左上 |
| 總階段 | 淡色斜體，放在圓心偏右下，字級為尺寸的 26% |

目前階段的位置與字級是固定像素，不隨 `size` 縮放；改變尺寸時需自行確認排版。

來源：1. [ProgressStage.vue][]

### 各主題外觀

| 主題 | 軌道 | 進度弧 |
| :--- | :--- | :--- |
| aqua | 14% 角色色 | 角色色到偏白的斜向漸層 |
| scifi | 18% 角色色 | 角色色加外光暈 |
| cupertino、material | 淡外框線色 | 角色色 |

來源：1. [ProgressStage.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ProgressStage.vue | [app/components/Camelot/ProgressStage.vue](../../../../app/components/Camelot/ProgressStage.vue) |

[ProgressStage.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
