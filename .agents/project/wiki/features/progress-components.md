# 📊 Progress 元件（ProgressBar / ProgressCircle / ProgressStage）

> 三個進度元件，皆支援四種主題（material / cupertino / scifi / aqua）、determinate 過場與動畫；前兩者另有 indeterminate（不確定）模式。

## ▬ ProgressBar（`ProgressBar.vue`）

水平線性進度條。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` | number | 0 | 當前值 |
| `max` | number | 100 | 最大值 |
| `color` | CamelotColorRole | `'primary'` | 角色色 |
| `indeterminate` | boolean | false | 不確定模式（sweep 跑馬燈動畫） |
| `showLabel` | boolean | false | 顯示文字 |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | `percent`→`25%`；`fraction`→`value / max`（如 `1 / 4`） |
| `height` | string | `'8px'` | 軌道高度 |
| `rounded` | boolean | true | 圓角（scifi 強制方角） |

- `percent = clamp(value / max × 100, 0..100)`。
- 風格：material/cupertino 用 surface 軌道 + primary 填滿；scifi 主色細邊 + glow；aqua `aqua-track` 玻璃軌道 + `aqua-fill` 漸層填滿。
- 動畫：determinate `transition-[width] ease-spring`；indeterminate `animate-progress-sweep`（`tailwind.css` keyframe），尊重 `prefers-reduced-motion`。

## ◯ ProgressCircle（`ProgressCircle.vue`）

SVG 環形進度。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` / `max` / `color` | — | 0 / 100 / `'primary'` | 同上 |
| `indeterminate` | boolean | false | 旋轉（固定弧 + spin） |
| `showLabel` | boolean | false | 圓心顯示 percent / fraction |
| `labelMode` | `'percent' \| 'fraction'` | `'percent'` | 同 ProgressBar |
| `size` | number | 64 | 直徑 px |
| `strokeWidth` | number | 6 | 線寬 |

- 雙圈：track + progress，`stroke-dasharray = 周長`、`stroke-dashoffset = 周長 × (1 − percent)`。
- 風格：material 圓頭 linecap、scifi `drop-shadow` glow、aqua SVG `linearGradient` stroke（`useId()` 防 id 衝突）。
- svg 加 `overflow-visible` 避免 glow 被裁切。

## ⛓️ ProgressStage（`ProgressStage.vue`）

階段儀表環：左上有「破口」，當前階段數字由破口「突破」而出，總階段斜置於右下，整體讀作 `n/total`。

| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `current` | number | 1 | 當前階段 |
| `total` | number | 1 | 總階段 |
| `color` | CamelotColorRole | `'primary'` | 角色色 |
| `size` | number | 96 | 直徑 px |
| `strokeWidth` | number | 7 | 線寬 |

- 弧線從左上破口（破口中心 225°、開口固定 98°）順時針補滿，`stroke-dashoffset` 反映 `current/total`，`transition ease-spring`。
- 當前數字：絕對定位、右對齊、最小 3 字元寬，固定 `right:62px / top:4px`，字級固定 **51px**，四位數（千位）降一階為 **40px**；斜線置圓心左上、總階段置圓心右下並斜體，視為一體。
- 四風格 stroke / glow 與 ProgressCircle 一致（aqua 漸層、scifi drop-shadow）。

## 🎬 共用動畫

`tailwind.css`：`--animate-progress-sweep: progress-sweep 1.4s ease-in-out infinite;` + `@keyframes progress-sweep { 0%{margin-left:-40%} 100%{margin-left:100%} }`。圓形 indeterminate 用 Tailwind 內建 `animate-spin`。

## 參考
- 主題系統：[theme-system.md](./theme-system.md)
- aqua utility / `ease-spring`：`app/assets/css/tailwind.css`
