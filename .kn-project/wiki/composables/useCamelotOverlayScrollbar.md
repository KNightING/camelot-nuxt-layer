# useCamelotOverlayScrollbar

> 自訂 overlay 捲軸核心（方向感知）：附著於既有捲動容器，量測幾何並產生 track/thumb/bar 樣式，處理拖曳與 hover；水平支援 docking / floating，垂直恆 docked 於右側。

## 簽章
```ts
export const useCamelotOverlayScrollbar = (
  container: Readonly<ShallowRef<HTMLElement | null>>,
  orientation: () => CamelotScrollbarOrientation,
  floatingEnabled: () => boolean,
  thumbColor?: () => string,
  mainStartInset?: () => number,
) => {
  visible, floating, trackStyle, thumbStyle, barStyle,
  onThumbDown, onThumbMove, onThumbUp, onThumbEnter, onThumbLeave,
}

export type CamelotScrollbarOrientation = 'horizontal' | 'vertical'
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `container` | `Readonly<ShallowRef<HTMLElement \| null>>` | （必填） | 附著的捲動容器 ref。 |
| `orientation` | `() => CamelotScrollbarOrientation` | （必填） | 主軸方向：`'horizontal'`（X 軸）或 `'vertical'`（Y 軸）。 |
| `floatingEnabled` | `() => boolean` | （必填） | 是否啟用「浮動到視窗底」（僅水平有意義）。 |
| `thumbColor` | `() => string` | `() => 'var(--cml-c-m3-on-surface)'` | thumb 顏色（CSS 色彩運算式）。 |
| `mainStartInset` | `() => number` | `() => 0` | 主軸起點額外偏移（px），如垂直捲軸避開 sticky 表頭。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `visible` | `Ref<boolean>` | 是否顯示捲軸（有主軸溢出且容器在視窗內）。 |
| `floating` | `Ref<boolean>` | 水平是否處於浮動（Teleport 至視窗底）狀態。 |
| `trackStyle` | `ComputedRef<CSSProperties>` | track 定位樣式（依方向與 docked/floating 態）。 |
| `thumbStyle` | `ComputedRef<CSSProperties>` | thumb（命中區）定位與 cursor。 |
| `barStyle` | `ComputedRef<CSSProperties>` | bar（視覺）樣式：hover/拖曳放大、顏色與淡邊。 |
| `onThumbDown` | `(e: PointerEvent) => void` | thumb pointerdown：啟動拖曳並 pointer capture。 |
| `onThumbMove` | `(e: PointerEvent) => void` | thumb pointermove：依位移更新容器捲動位置。 |
| `onThumbUp` | `(e: PointerEvent) => void` | thumb pointerup：結束拖曳並釋放 capture。 |
| `onThumbEnter` | `() => void` | 滑入 thumb（設 `hovered = true`）。 |
| `onThumbLeave` | `() => void` | 滑出 thumb（設 `hovered = false`）。 |

## 用法
```ts
const container = useTemplateRef<HTMLElement>('container')

const {
  visible, trackStyle, thumbStyle, barStyle,
  onThumbDown, onThumbMove, onThumbUp, onThumbEnter, onThumbLeave,
} = useCamelotOverlayScrollbar(
  container,
  () => 'vertical',
  () => false,
  () => 'var(--color-primary)',
  () => 48, // 避開表頭高度
)
```

## 備註
- 常數：`MIN_THUMB_SIZE = 40`、`MAIN_INSET = 6`、`CROSS_INSET = 2`、`VIEWPORT_GAP = 6`。
- 主軸（main）＝捲動方向：水平讀 `scrollLeft/scrollWidth/clientWidth`，垂直讀 `scrollTop/scrollHeight/clientHeight`。
- 主軸溢出量 `<= client + 1`，或容器完全在視窗外時 `visible` 為 `false`。
- `barStyle` 與 `thumbStyle` 定位拆開，使拖曳期間 bar 物件參照不變，避免 Vue 重繪重啟 CSS transition。
- 監聽：容器 `scroll`、`window` 的 `scroll`（capture，以收到祖先捲動）與 `resize`；並以 `useResizeObserver` 觀察容器與其第一個子元素（內容尺寸變動，如換頁）。
- `onMounted` 時 `nextTick(measure)`；`floatingEnabled/orientation/mainStartInset` 變動亦重新量測。

---
[🏠 Wiki](../index.md)
