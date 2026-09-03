# Loading

## Summary

全螢幕遮罩式載入指示器，依主題切換不同樣式的旋轉動畫。

**匯入名稱**：`CamelotLoading`

## 備註
- 無 Props、Emits、v-model、Slots、Exposed。狀態完全由 `useLoading()` 的 `isOpening` 控制顯示。
- 透過 `<Teleport to="body">` 掛載於 `body`，包在 `<ClientOnly>` 中僅於用戶端渲染。
- 顯示時為固定定位（`fixed inset-0`）的半透明黑色遮罩並帶背景模糊，層級 `z-[1100]`。
- 依 `useCamelotTheme()` 的 `themeMode` 切換樣式：
  - `aqua`：磨砂玻璃膠囊 + 流光（`aqua-capsule`，168×16px），見下節。
  - `scifi`：雷達掃描動畫（含 `CamelotScifiReticle`、`SYS_LOAD...` 文字）。
  - `cupertino`：iOS 風格 8 葉片旋轉器。
  - 其他（預設）：Material SVG 圓形旋轉器。
- 使用 `fade` 過場動畫（0.35s）。

## Aqua：磨砂玻璃膠囊 + 流光

另外三個主題的指示器都是圓形（Material 環、Cupertino 葉片、Sci-fi 雷達），Aqua 刻意改用水平膠囊做視覺區隔，也呼應 Aqua 通篇的 pill 語彙。

**三層結構**：

| 層 | 類別 | 職責 |
| :--- | :--- | :--- |
| 膠囊 | `.aqua-capsule` | 半透明底 + `backdrop-filter` 毛玻璃 + 髮絲白邊 + 頂部內高光 + 角色色柔影；本身做 `scaleY` 呼吸 |
| 主流光 | `.aqua-capsule-flow` | 寬 46%，角色色由淡到亮再到淡的漸層，兩端柔化成一段「液體」而非硬塊 |
| 副流光 | `.aqua-capsule-sheen` | 寬 70% 的白色高光，更寬更淡，相位落後主流光約 1/6 週期，疊出玻璃裡的層次 |

**規則**：

- 週期由 `--cml-aqua-loading-duration`（預設 `2.6s`）統一控制，三層共用；調速只需改這一個值。
- 流光來回穿過膠囊（`0%/100%` 在左外、`50%` 在右外），時間曲線 `cubic-bezier(0.62, 0, 0.38, 1)`，兩端減速像液體到底再回流。
- `translateX` 以**自身寬度**為單位，因此右側終點值依寬度換算：`(168 / 自身寬度) × 100%` —— 46% 寬為 `218%`、70% 寬為 `143%`。改寬度時這兩個數字要一起改。
- 動畫僅使用 `transform`，兩層流光皆標記 `will-change: transform`。
- `prefers-reduced-motion: reduce` 時停住所有動畫，主流光固定停在膠囊中段，仍表達「進行中」。

---
[🏠 Wiki](../../index.md)
