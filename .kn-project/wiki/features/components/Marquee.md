# Marquee

## Summary

跑馬燈：內容渲染兩份無縫循環捲動，支援四個方向、以 px/s 指定速度、hover 暫停與外部暫停；內容未超出容器或 `prefers-reduced-motion: reduce` 時不捲動、只顯示一份。

**匯入名稱**：`CamelotMarquee`

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
| `default` | — | 跑馬燈內容（會渲染兩份，第二份 `aria-hidden`） |

## 備註
- 容器尺寸由使用端決定：水平為 block 撐滿；**垂直方向必須自行給高度**（如 `class="h-16"`），否則永遠不會「超出容器」。
- `animation-duration` = 單份內容長度 ÷ `speed`，由 `useElementSize` 量測；內容或容器尺寸變動即重算。位移量為 `-50% − gap/2`（軌道含兩份內容與一個 gap），第二份剛好接到第一份起點。
- 外部 `paused` 的規則特異度刻意高於 `animation` 縮寫（`.cml-marquee-track.cml-marquee-running.cml-marquee-paused`），因縮寫會把 `animation-play-state` 重設為 running。
- 不分主題（純版面元件）。

---
[🏠 Wiki](../../index.md)
