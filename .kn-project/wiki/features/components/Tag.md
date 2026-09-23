# Tag

## Summary

標籤徽章：以短文字標示狀態或分類，支援實心、柔色、外框三種外觀，兩種尺寸，並可加上關閉按鈕。形狀依主題切換。匯入名稱為 `CamelotTag`（Nuxt 自動匯入）。

## 運作方式

### 外觀與尺寸

| 外觀 | 樣式 |
|---|---|
| solid | 主色底、配對前景色文字 |
| soft | 主色淡底、主色文字；Sci-Fi 另加半透明邊框與外發光 |
| outline | 主色框線、主色文字 |

| 主題 | 形狀 |
|---|---|
| Aqua | 藥丸形，背景模糊 |
| Sci-Fi | 切角、直角，文字大寫加寬字距 |
| Cupertino | 圓角 |
| 其他 | 中圓角 |

小尺寸用較小字級與內距，預設為中尺寸。

來源：1. [Tag.vue][]

### 關閉與停用

1. 開啟可關閉時，文字後方顯示關閉按鈕；點擊發出關閉事件，不會冒泡到外層。
2. 停用時整個標籤半透明，關閉按鈕不可點。

來源：1. [Tag.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | — | 標籤文字，也可用預設插槽覆寫。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | 外觀。 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸。 |
| `closable` | `boolean` | — | 是否顯示關閉按鈕。 |
| `disabled` | `boolean` | — | 停用，降低透明度、關閉按鈕不可點。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `close` | — | 點擊關閉按鈕時觸發。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `icon` | — | 標籤前置圖示。 |
| `default` | — | 標籤內容，未提供時顯示 `label`。 |

## 相關頁面

- [TagGroup](./TagGroup.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Tag.vue | [app/components/Camelot/Tag.vue](../../../../app/components/Camelot/Tag.vue) |

[Tag.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
