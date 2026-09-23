# 覆蓋式捲軸

## Summary

`useCamelotOverlayScrollbar(container, orientation, floatingEnabled, thumbColor, mainStartInset)` 是自訂覆蓋式捲軸的方向感知核心：附著在既有捲動容器上，量測幾何，產生 track、thumb、bar 三組樣式，並處理拖曳與 hover。水平捲軸可貼容器底或浮動到視窗底，垂直捲軸固定貼在右側。OverlayScrollbar 元件以它實作。

## 運作方式

### 量測

主軸就是捲動方向：水平讀橫向的捲動位置、內容寬與可視寬，垂直讀縱向的對應值。

1. 容器不存在、主軸沒有溢出，或容器完全在視窗外時，隱藏捲軸並結束。
2. 記錄內容長度、可視長度與目前捲動位置。
3. track 長度等於可視長度扣掉起點偏移與兩端內縮。
4. thumb 長度依可視比例計算，最小 40px。
5. 水平、允許浮動，且容器底部超出視窗時，改為浮動狀態。

來源：1. [useCamelotOverlayScrollbar.ts][]

### 定位與外觀

| 狀態 | track 位置 |
| --- | --- |
| 水平貼底 | 容器內絕對定位，距底 2px，左右內縮 6px，左側另加起點偏移 |
| 水平浮動 | 視窗固定定位，距視窗底 6px，左緣對齊容器左緣加 6px |
| 垂直 | 容器內絕對定位，距右 2px，上方從起點偏移加 6px 開始 |

| 狀態 | bar 外觀 |
| --- | --- |
| 平時 | 交叉軸縮為一半，thumb 色 55% 混透明，2px 淡邊 |
| hover 或拖曳 | 恢復全寬，完整 thumb 色，4px 光暈 |

thumb 只放隨拖曳變動的尺寸、位移與游標；bar 的視覺樣式分開計算，拖曳期間 bar 物件參照不變，CSS transition 不會被重啟。

來源：1. [useCamelotOverlayScrollbar.ts][]

### 拖曳

1. 按下 thumb：進入拖曳狀態，記下起點與當時捲動位置，並 capture 指標。
2. 移動：把指標位移依 thumb 可移動範圍換算成捲動距離，直接寫回容器。
3. 放開：結束拖曳並釋放 capture。

來源：1. [useCamelotOverlayScrollbar.ts][]

### 重新量測時機

| 觸發 | 處理 |
| --- | --- |
| 容器自身捲動 | 只更新捲動位置，不重新量測 |
| 視窗捲動，以 capture 監聽 | 排入下一幀量測 |
| 視窗 resize | 排入下一幀量測 |
| 容器與其第一個子元素尺寸變動 | 排入下一幀量測，涵蓋換頁等只改內容的情況 |
| 掛載後 | nextTick 直接量測 |
| 方向、浮動開關或起點偏移變動 | 直接量測 |

排入的量測以單一 pending 的 requestAnimationFrame 合併，每幀最多量測一次；scope 結束時取消尚未執行的那一幀。

來源：1. [useCamelotOverlayScrollbar.ts][]

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
  () => 48,
)
```

## 簽章

```ts
useCamelotOverlayScrollbar(
  container: Readonly<ShallowRef<HTMLElement | null>>,
  orientation: () => CamelotScrollbarOrientation,
  floatingEnabled: () => boolean,
  thumbColor?: () => string,
  mainStartInset?: () => number,
): {
  visible, floating, trackStyle, thumbStyle, barStyle,
  onThumbDown, onThumbMove, onThumbUp, onThumbEnter, onThumbLeave,
}

type CamelotScrollbarOrientation = 'horizontal' | 'vertical'
```

## 參數

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `container` | `Readonly<ShallowRef<HTMLElement \| null>>` | 必填 | 附著的捲動容器 |
| `orientation` | `() => CamelotScrollbarOrientation` | 必填 | 主軸方向 |
| `floatingEnabled` | `() => boolean` | 必填 | 是否允許浮動到視窗底，只對水平有效 |
| `thumbColor` | `() => string` | `() => 'var(--cml-c-m3-on-surface)'` | thumb 顏色，接受 CSS 色彩運算式 |
| `mainStartInset` | `() => number` | `() => 0` | 主軸起點額外偏移，單位 px，例如避開 sticky 表頭 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `visible` | `Ref<boolean>` | 是否顯示捲軸 |
| `floating` | `Ref<boolean>` | 水平捲軸是否處於浮動狀態 |
| `trackStyle` | `ComputedRef<CSSProperties>` | track 定位樣式 |
| `thumbStyle` | `ComputedRef<CSSProperties>` | thumb 命中區的尺寸、位移與游標 |
| `barStyle` | `ComputedRef<CSSProperties>` | bar 的縮放、顏色與淡邊 |
| `onThumbDown` | `(e: PointerEvent) => void` | 開始拖曳 |
| `onThumbMove` | `(e: PointerEvent) => void` | 拖曳中更新捲動位置 |
| `onThumbUp` | `(e: PointerEvent) => void` | 結束拖曳 |
| `onThumbEnter` | `() => void` | 進入 hover |
| `onThumbLeave` | `() => void` | 離開 hover |

## 常數

| 常數 | 值 | 說明 |
| --- | --- | --- |
| `MIN_THUMB_SIZE` | 40 | thumb 最小長度，px |
| `MAIN_INSET` | 6 | 主軸兩端內縮，px |
| `CROSS_INSET` | 2 | 交叉軸內縮，px |
| `VIEWPORT_GAP` | 6 | 浮動時距視窗底，px |

## 相關頁面

- [OverlayScrollbar](../components/OverlayScrollbar.md)
- [自訂捲軸系統](../../platform/overlay-scrollbar.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotOverlayScrollbar.ts | [app/composables/useCamelotOverlayScrollbar.ts](../../../../app/composables/useCamelotOverlayScrollbar.ts) |

[useCamelotOverlayScrollbar.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
