# BaseBottomSheetV2

## Summary

由底部滑入的底部彈出面板（Bottom Sheet），依當前主題（scifi／cupertino／aqua／material）自動切換版面；壓住頂部把手向下拖曳可關閉，遮罩隨拖曳進度漸淡。

**匯入名稱**：`CamelotBaseBottomSheetV2`（Nuxt 自動匯入）

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `draggable` | `boolean` | `true` | 是否允許從頂部把手拖曳關閉 |
| `dismissThreshold` | `number` | `0.35` | 拖曳超過面板高度的多少比例即關閉（0–1） |

其餘 props（`closeByMask`／`tag`／`zIndex`／`query`）與 `cancel` 事件經 attrs 落到 [BaseDialogV2](./BaseDialogV2.md)。

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model:open` | `boolean` | 是否開啟 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 面板內容 |

## 備註
- 內部包裹於 `CamelotBaseDialogV2` 的 `#wrapper` 插槽。
- 透過 `useCamelotTheme()` 取得 `themeMode`，依主題渲染對應版面；預設為 Material 版面。
- 各版面頂端為共用的 [Internal/SheetHandle](./Internal-SheetHandle.md) 把手，並以 `slide-up` 動畫由底部滑入。
- **手勢關閉**：只從把手 `pointerdown` 起手（`setPointerCapture`），面板跟手 `translateY`；**只允許向下**（向上會露出面板底下的空白，位移夾在 0）。放開時 `dragOffset / 面板高度 ≥ dismissThreshold`，或甩動（速度 ≥ 0.6px/ms 且距離 ≥ 32px；放開前停頓 >100ms 視為無速度）即關閉並保留位移接續 leave transition，否則以 `ease-spring` 彈回。
- 拖曳位移放在 `.wrapper` 內另一層 `.sheet-drag`：`.wrapper` 的 `slide-up` keyframe 以 `forwards` 填充，其 transform 會蓋過同元素的 inline transform。
- 遮罩漸淡：拖曳進度回寫 BaseDialogV2 的 `backdropProgress`（拖曳中 `backdropImmediate` 關閉遮罩 transition 以逐幀跟手）。
- 面板容器寬度為 `w-full` 而非 `w-screen`：`100vw` **包含垂直捲軸寬度**，會使面板比可視區寬而產生水平捲軸。
- 面板層級取自[疊層刻度](../layering.md)的 `--cml-z-sheet`，低於 popup 層級，因此 Sheet 內的選單浮層會正確疊在面板之上。
- 本元件**不提供內建關閉按鈕**；除把手拖曳外，關閉 UI 由使用端負責。
- 內容請只放內容：外框、內距與寬度已由本元件負責，slot 內再包一層完整盒子會造成雙層邊框與寬度溢出。

---
[🏠 Wiki](../../index.md)
