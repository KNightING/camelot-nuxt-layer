# Carousel

## Summary

泛型輪播元件，支援多種切換特效、垂直/水平方向、自動播放、拖曳滑動、箭頭與指標。

**匯入名稱**：`CamelotCarousel`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `T[]` | — | 輪播項目陣列 |
| `itemKey` | `string \| ((item: T, index: number) => string \| number)` | — | 項目 key 取值方式 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `effect` | `'slide' \| 'fade' \| 'zoom' \| 'coverflow' \| 'cardStack' \| 'flip'` | `'slide'` | 切換特效 |
| `loop` | `boolean` | `false` | 是否循環 |
| `autoplay` | `boolean` | `false` | 是否自動播放 |
| `interval` | `number` | `4000` | 自動播放間隔（ms） |
| `pauseOnHover` | `boolean` | `true` | 滑鼠移入時暫停自動播放 |
| `peek` | `number` | `0` | slide/coverflow/zoom 模式下當前項前後各顯示幾個鄰項 |
| `gap` | `number` | `0` | 相鄰項間距（px，以內距實作） |
| `duration` | `number` | `450` | 切換動畫時長（ms） |
| `showArrows` | `boolean` | `true` | 顯示左右箭頭 |
| `showDots` | `boolean` | `true` | 顯示指標圓點 |
| `height` | `string` | `'320px'` | 容器高度 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `v-model` | `number` | 目前顯示的索引（預設 `0`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, index, isActive }` | 自訂單張投影片內容 |
| `dot` | （傳遞給 `CamelotCarouselIndicator` 的 scope） | 自訂指標點 |
| `prev` | `{ prev, next, go, current, total, disabled }` | 整顆換掉左／上箭頭；定位由元件的 `.cml-arrow-anchor` 負責，slot 只管長相與觸發。`disabled` 為非 loop 且已在第一張 |
| `next` | `{ prev, next, go, current, total, disabled }` | 整顆換掉右／下箭頭；`disabled` 為非 loop 且已在最後一張 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `next()` | 切換至下一項 |
| `prev()` | 切換至上一項 |
| `go(i)` | 切換至指定索引（loop 時環繞、否則夾在範圍內） |

## 備註
- 尊重 `prefers-reduced-motion`：開啟時停用轉場與自動播放。
- 拖曳/滑動：`pointermove` 期間位移直接畫在投影片上（跟手，此時關閉過場動畫），放開後需超過 40px 門檻才真的換頁，否則彈回原位；拖曳中暫停自動播放。
- 只有位移類特效（`slide` / `coverflow` / `zoom` / `cardStack`）會跟手；`fade` 與 `flip` 沒有平移可跟，維持門檻式換頁。
- 非 loop 時拖出頭尾會套 0.35 阻尼，讓「已經到底」有回饋而不是完全不動。
- **pointerdown 落在控制項（`button` / `a` / `input` / `label` / `[role="button"]` / `[role="tab"]`）上時不進入拖曳**：拖曳用 `setPointerCapture`，而捕獲會把 `pointerup` 重新導向到本元件，`click` 因此改派給兩者的共同祖先——不擋掉的話箭頭、指標，以及投影片內容裡的任何按鈕都會收不到點擊。
- `setPointerCapture` / `releasePointerCapture` 以 try 包住：pointerId 已失效時會丟 `NotFoundError`，未接住會中斷 handler，連帶讓放開後的換頁判斷整段不執行。
- 拖曳位移接在置中之後、各特效自己的位移之前：`coverflow` 這類帶 `rotateY` 的特效若接在最後，會沿著已旋轉的軸移動而看起來歪掉。
- 完全移除控制項用 `:show-arrows="false"` / `:show-dots="false"`；只想改長相則用 `#prev` / `#next` / `#dot` slot。
- 僅渲染可視窗半徑內的項目（依特效決定半徑）。
- 自動播放使用 `useIntervalFn`，多重條件（autoplay、非 reduce-motion、項數 > 1、非 hover 暫停、非拖曳中）皆成立才啟動。

---
[🏠 Wiki](../../index.md)
