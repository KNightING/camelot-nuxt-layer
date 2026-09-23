# Carousel

## Summary

Carousel 是泛型輪播元件，匯入名稱 `CamelotCarousel`。支援六種切換特效、水平或垂直方向、循環、自動播放、拖曳跟手換頁，以及可自訂的箭頭與指標；只渲染當前項附近的投影片，並尊重使用者的減少動態偏好。

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
| `gap` | `number` | `0` | 相鄰項間距（px），以投影片內距實作，不破壞比例 |
| `duration` | `number` | `450` | 切換動畫時長（ms） |
| `showArrows` | `boolean` | `true` | 顯示左右箭頭 |
| `showDots` | `boolean` | `true` | 顯示指標圓點 |
| `height` | `string` | `'320px'` | 容器高度 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `number` | 目前顯示的索引（預設 `0`） |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | `{ item, index, isActive }` | 自訂單張投影片內容 |
| `dot` | `{ index, active, go }` | 自訂指標點，轉送給 CarouselIndicator |
| `prev` | `{ prev, next, go, current, total, disabled }` | 整顆換掉左或上箭頭；定位由元件負責，slot 只管長相與觸發。`disabled` 為非 loop 且已在第一張 |
| `next` | `{ prev, next, go, current, total, disabled }` | 整顆換掉右或下箭頭；`disabled` 為非 loop 且已在最後一張 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `next()` | 切換至下一項 |
| `prev()` | 切換至上一項 |
| `go(i)` | 切換至指定索引（loop 時環繞、否則夾在範圍內） |

## 運作方式

### 投影片定位

每張投影片的位移與透明度，都由它與當前項的帶號距離推導；loop 模式下距離會環繞計算。

1. 無限循環因此自然成立，不需要複製頭尾投影片。
2. 只有距離落在可視半徑內的投影片會被渲染，半徑依特效與 `peek` 決定。
3. slide、coverflow、zoom 可用 `peek` 在兩側露出前後各 N 張鄰項。

來源：1. [Carousel.vue][]

### 拖曳換頁

1. 項目少於 2 張時不啟用拖曳。
2. 在控制項上按下時不進入拖曳，例如按鈕、連結、表單欄位、label、按鈕或分頁角色的元素。
3. 拖曳中位移直接畫在投影片上並關閉過場，畫面跟著手指走。
4. 非 loop 時拖出頭尾會套 0.35 阻尼，讓「已經到底」有回饋。
5. 放開時位移超過 40px 才換頁，否則彈回原位。

| 規則 | 說明 |
|---|---|
| 跟手特效 | slide、coverflow、zoom、cardStack；fade 與 flip 沒有平移可跟，只做門檻式換頁 |
| 控制項排除 | 拖曳會捕獲指標，放開事件改派給輪播本身，控制項會收不到點擊 |
| 捕獲失敗 | 指標已失效時捕獲會丟錯，一律吞掉，避免換頁判斷整段中斷 |
| 位移順序 | 拖曳位移接在置中之後、特效位移之前；coverflow 的旋轉才不會讓位移歪掉 |
| 觸控 | 水平輪播把垂直捲動留給瀏覽器，垂直輪播反之，滑動換頁不會擋住頁面捲動 |

來源：1. [Carousel.vue][]

### 自動播放

以下條件全部成立才會啟動，任一不成立即暫停：

1. 開啟 `autoplay`。
2. 使用者未開啟減少動態偏好；開啟時也同時停用轉場動畫。
3. 項目超過 1 張。
4. 未因 `pauseOnHover` 而處於滑鼠移入狀態。
5. 不在拖曳中。

來源：1. [Carousel.vue][]

### 箭頭與指標

1. 項目超過 1 張才顯示箭頭與指標。
2. 要完全移除時把 `showArrows` 或 `showDots` 設為 false；只想改長相則用 prev、next、dot 插槽。
3. 指標使用獨立的 [CarouselIndicator](./CarouselIndicator.md)，方向與角色色沿用輪播設定。

來源：1. [Carousel.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Carousel.vue | [app/components/Camelot/Carousel.vue](../../../../app/components/Camelot/Carousel.vue) |

[Carousel.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
