# Loading

## Summary

全螢幕遮罩式載入指示器，依主題切換不同樣式的旋轉動畫。

**匯入名稱**：`CamelotLoading`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `type` | `CamelotLoadingType`（`'ripple' \| 'bounce'`） | `'ripple'` | Aqua 主題的指示器樣式；其他主題忽略 |

## 備註
- 無 Emits、v-model、Slots、Exposed。顯示與否完全由 `useLoading()` 的 `isOpening` 控制。
- 唯一的 Prop 是 `type`（見下表），只影響 Aqua 主題；其他主題各只有一種樣式，會忽略它。
- 透過 `<Teleport to="body">` 掛載於 `body`，包在 `<ClientOnly>` 中僅於用戶端渲染。
- 顯示時為固定定位（`fixed inset-0`）的半透明黑色遮罩並帶背景模糊，層級 `z-[1100]`。
- 依 `useCamelotTheme()` 的 `themeMode` 切換樣式：
  - `aqua`：依 `type` 切換水滴漣漪或玻璃珠彈跳，見下節。
  - `scifi`：雷達掃描動畫（含 `CamelotScifiReticle`、`SYS_LOAD...` 文字）。
  - `cupertino`：iOS 風格 8 葉片旋轉器。
  - 其他（預設）：Material SVG 圓形旋轉器。
- 使用 `fade` 過場動畫（0.35s）。
- 指示器下方可顯示提示文字，由 [useLoading](../composables/useLoading.md) 的 `open(tag, text)` / `setText(tag, text)` 驅動，可在同一次載入中換階段。沒有文字時整段不渲染。文字以 `Transition mode="out-in"` 淡入淡出，換階段不會硬跳；帶 `role="status"` 與 `aria-live="polite"`。
- 文字顏色固定為半透明白 + 陰影，**不吃 `on-surface`**：遮罩永遠是半透明深色，淺色模式下 `on-surface` 會看不見。sci-fi 另外改等寬字並走 CurrentColor，與該主題其他資訊一致。

## Aqua：`ripple` 與 `bounce`

兩者都刻意做成**向心／原地**的形狀，沒有任何由左往右填滿的線性位移——之前的水平膠囊流光版本會被讀成進度條而非指示器。

### `ripple`（預設）：水滴漣漪

| 元素 | 類別 | 職責 |
| :--- | :--- | :--- |
| 水滴 | `.aqua-ripple-droplet` | 中心 22px 玻璃球，先縮後脹的呼吸，讀起來像「滴下去」才盪出漣漪 |
| 漣漪 | `.aqua-ripple-wave-{1..3}` | 三道同心圓由 scale 0.28 擴散到 1 並淡出，錯開 1/3 週期形成連續擴散 |

週期由 `--cml-aqua-ripple-duration`（預設 `2.8s`）控制，三道波的延遲以 `calc()` 從它推算，改一個值即可整組變速。

### `bounce`：玻璃珠彈跳

| 元素 | 類別 | 職責 |
| :--- | :--- | :--- |
| 玻璃珠 | `.aqua-bounce-bead-{1..3}` | 三顆 18px 玻璃球依序彈跳，`transform-origin: center bottom` |

週期由 `--cml-aqua-bounce-duration`（預設 `1.1s`）控制。關鍵在 keyframe 的**起跳與落地各壓扁一次**（`scale(1.18, 0.82)`）、空中略微拉長（`scale(0.94, 1.06)`）——少了這兩下會讀成等速上下平移而不是彈跳。

### 共通

- 球體填色走色彩角色 `--cml-color-current-color`（混入白做漸層與內高光），**不使用 `backdrop-filter`**：載入遮罩是半透明黑底，surface 色在深色模式下與遮罩幾乎同色會看不見；不透明填色後毛玻璃也失去意義。
- 動畫僅使用 `transform` 與 `opacity`。
- `prefers-reduced-motion: reduce` 時停住動畫，保留靜態球體表示「進行中」。

---
[🏠 Wiki](../../index.md)
