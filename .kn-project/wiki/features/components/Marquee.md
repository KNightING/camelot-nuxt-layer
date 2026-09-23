# Marquee

## Summary

`CamelotMarquee` 是跑馬燈容器：把預設 slot 的內容渲染兩份、首尾相接無限循環捲動，支援上下左右四個方向、以每秒像素指定速度、滑鼠移入暫停與外部暫停。內容沒有超出容器、速度為 0，或使用者偏好減少動態時不捲動，只顯示一份。不分主題，是純版面元件。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | `'left'` | 捲動方向 |
| `speed` | `number` | `60` | 速度（px/s）；`0` 不捲 |
| `pauseOnHover` | `boolean` | `true` | 滑鼠移入暫停 |
| `gap` | `string` | `'1rem'` | 內容項目之間、以及兩份內容接續處的間距（CSS 長度） |
| `paused` | `boolean` | `false` | 外部暫停 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 跑馬燈內容，可放任何元素（文字、div、元件）；會渲染兩份，第二份對輔助技術隱藏 |

## 運作方式

### 內容與版面

1. 預設 slot 的直接子元素依方向排成一列（水平）或一欄（垂直），彼此間隔 `gap`。
2. 水平方向容器預設撐滿父層寬度；垂直方向必須由使用端給容器高度，否則內容永遠不會超出容器，也就不會捲動。
3. 因為內容會渲染兩份，slot 內的元件也會建立兩個實例；有狀態或有副作用的元件要留意。

來源：1. [Marquee.vue][]

### 捲動速度與循環

1. 元件持續量測單份內容與容器的尺寸，內容或容器尺寸變動時即時重算。
2. 動畫時長等於單份內容長度除以 `speed`，所以內容越長、一圈越久，但移動速度固定。
3. 每圈位移一份內容加一個間距的長度，第二份剛好接到第一份的起點，看起來沒有接縫。
4. `right` 與 `down` 是把同一個動畫反向播放。

來源：1. [Marquee.vue][]

### 暫停

| 情境 | 行為 |
| :--- | :--- |
| `pauseOnHover` 開啟且滑鼠移入 | 暫停，移出後從原位繼續 |
| `paused` 為真 | 暫停，改回假後從原位繼續 |
| 內容未超出、`speed` 為 0 或偏好減少動態 | 不捲動，只保留一份內容 |

來源：1. [Marquee.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Marquee.vue | [app/components/Camelot/Marquee.vue](../../../../app/components/Camelot/Marquee.vue) |

[Marquee.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
