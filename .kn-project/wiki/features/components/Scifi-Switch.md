# Scifi Switch

## Summary

Sci-Fi 主題的開關切換元件：滑塊旁顯示 ON 或 OFF 狀態字，外圍有準星裝飾，切換時閃一下亮光。通常由公開的 Switch 依主題自動選用，匯入名稱為 `CamelotScifiSwitch`（Nuxt 自動匯入）。

## 運作方式

1. 點擊時切換開關狀態，並發出變更事件，帶入切換後的值。
2. 切換瞬間播放約 200ms 的亮度閃爍與光暈動畫。
3. 準星裝飾平時半透明，懸停或開啟時完整顯示。
4. 停用時忽略點擊、不發出事件，外觀轉為灰階半透明。

來源：1. [Scifi/Switch.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabled` | `boolean` | `false` | 是否停用，停用時不可點擊並套用灰階透明樣式。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `change` | `checked: boolean` | 切換狀態時觸發，帶入切換後的值。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `boolean`，預設 `false` | 開關狀態，開為 `true`、關為 `false`。 |

## 相關頁面

- [Scifi Reticle](./Scifi-Reticle.md)
- [Switch](./Switch.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Scifi/Switch.vue | [app/components/Camelot/Scifi/Switch.vue](../../../../app/components/Camelot/Scifi/Switch.vue) |

[Scifi/Switch.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
