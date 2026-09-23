# BaseBottomSheetV2

## Summary

BaseBottomSheetV2 是由畫面底部滑入的底部彈出面板（Bottom Sheet），匯入名稱 `CamelotBaseBottomSheetV2`（Nuxt 自動匯入）。它建立在 [BaseDialogV2](./BaseDialogV2.md) 之上，依當前主題切換四種外觀；使用者壓住頂部把手向下拖曳即可關閉，遮罩隨拖曳進度漸淡。本元件不提供關閉按鈕，除拖曳外的關閉方式由使用端負責。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `draggable` | `boolean` | `true` | 是否允許從頂部把手拖曳關閉 |
| `dismissThreshold` | `number` | `0.35` | 拖曳超過面板高度的多少比例即關閉（0–1） |

其餘屬性與 cancel 事件會透傳到 BaseDialogV2，包含 closeByMask、tag、zIndex、query。

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:open` | `boolean`（預設 `false`） | 是否開啟 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 面板內容 |

## 運作方式

### 版面

1. 以 BaseDialogV2 的自訂外層插槽渲染，不使用對話框的置中內容框。
2. 依主題渲染 scifi、cupertino、aqua 或 material 面板，未知主題用 material。
3. 各面板頂端是共用的 [SheetHandle](./Internal-SheetHandle.md) 把手，開啟時由底部滑入。
4. 面板最高佔視窗 85%，內容超出時在面板內捲動。

內容只放內容即可：外框、內距與寬度已由本元件負責，插槽內再包一層完整盒子會造成雙層邊框與寬度溢出。

來源：1. [BaseBottomSheetV2.vue][]

### 手勢關閉

1. 只有從把手按下才開始拖曳，並鎖定該指標。
2. 面板跟著手指垂直位移，只允許向下；向上會露出面板底下的空白，因此位移下限為 0。
3. 放開時符合任一條件就關閉：拖曳距離達面板高度的門檻比例，或向下甩動。
4. 關閉時保留目前位移，讓離場動畫從手指放開處接續；未達條件則以彈簧曲線彈回。
5. 拖曳進度同步回寫給 BaseDialogV2，遮罩逐幀跟著變淡。

| 規則 | 說明 |
|---|---|
| 甩動 | 速度 ≥ 0.6px/ms 且距離 ≥ 32px |
| 停頓 | 放開前停住超過 100ms，速度視為 0 |
| 再次開啟 | 位移重設為 0 |

拖曳位移放在面板外層之內的另一層：外層的滑入動畫會保留最後的 transform，蓋過同一元素上的行內位移。

來源：1. [BaseBottomSheetV2.vue][]

### 尺寸與疊層

| 規則 | 說明 |
|---|---|
| 寬度 | 面板用撐滿父層寬度，不用視窗寬度單位；視窗寬度含捲軸寬，會產生水平捲軸 |
| 疊層 | 使用 sheet 層級，低於 popup，面板內的選單浮層會疊在面板之上 |

來源：1. [BaseBottomSheetV2.vue][]

## 相關頁面
- [疊層刻度](../../platform/layering.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| BaseBottomSheetV2.vue | [app/components/Camelot/BaseBottomSheetV2.vue](../../../../app/components/Camelot/BaseBottomSheetV2.vue) |

[BaseBottomSheetV2.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
