# Tabs

## Summary

泛型分頁切換元件：橫向列出分頁，以滑動指示器標出目前選取項，選取項會自動捲到可視範圍中央。指示器與分頁樣式依主題切換。匯入名稱為 `CamelotTabs`（Nuxt 自動匯入）。

## 運作方式

### 切換

1. 點擊分頁時一律發出點擊事件。
2. 手動模式只發出點擊事件，不改變選取，由使用端決定。
3. 懸停模式下滑鼠移入分頁即視同點擊。
4. 點到已選取的分頁不重複切換；切到新分頁時更新選取值，並發出變更事件。
5. 分頁文字預設取選項的 name；有指定資料欄位名且選項資料含該欄位時，改取該欄位。

來源：1. [Tabs.vue][]

### 指示器與捲動

| 主題 | 容器 | 指示器 |
|---|---|---|
| Aqua | 藥丸形玻璃軌道 | 藥丸形填滿 |
| Material | 底部分隔線 | 3px 主色底線 |
| Cupertino | 淺底區段控制 | 亮底浮起的區段 |
| Sci-Fi | 無外框 | 2px 發光底線 |

1. 指示器位置在執行期量測分頁的實際位置與寬度，並換算成可捲動內容內的座標。
2. 選取、選項或主題變更，容器尺寸變化，以及字型載入完成後都會重算。
3. 元件更新時把選取分頁捲到中央；可選擇平滑捲動或直接跳過去。

來源：1. [Tabs.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `options` | `SelectOptions<T>` | — | 分頁選項清單。 |
| `dataKey` | `string` | — | 從 `option.data` 取顯示文字的欄位名。 |
| `scrollSmooth` | `boolean` | `true` | 切換時平滑捲動至選取分頁。 |
| `trigger` | `'click' \| 'hover' \| 'manual'` | — | 觸發切換方式；`manual` 時僅發出事件不改變選取。 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色。 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `(index: number, option: SelectOption<T>)` | 點擊分頁時觸發，懸停模式的移入也算。 |
| `changed` | `(index: number, option: SelectOption<T>)` | 選取變更時觸發。 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `string \| number` | 目前選取項的 `value`。 |
| `v-model:selectedIndex` | `number \| undefined` | 目前選取項的索引，與 value 雙向對應。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, option, data, text, index, isSelected }` | 自訂單一分頁內容。 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Tabs.vue | [app/components/Camelot/Tabs.vue](../../../../app/components/Camelot/Tabs.vue) |

[Tabs.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
