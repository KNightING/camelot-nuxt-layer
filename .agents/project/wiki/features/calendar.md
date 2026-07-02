# 🗓️ Calendar / 日期選擇器系統

本頁記錄 Camelot Nuxt Layer 中日期選擇器家族的架構、Props 規格與互動流程。

> [!WARNING]
> `DateV2` 與 `DateRangeV2` 元件正在**重構進行中 (🚧)**，相關計畫請見 `.agents/project/plans/`。

---

## 架構總覽

日期選擇器系統由三個層次組成：

```mermaid
graph TD
    User["消費端應用程式"]
    DateV2["CamelotDateV2\n(單日期選擇器)"]
    DateRangeV2["CamelotDateRangeV2\n(範圍選擇器)"]
    Calendar["Internal/Calendar\n(共用日曆核心)"]
    DateFns["date-fns\n(日期運算)"]

    User -->|v-model| DateV2
    User -->|v-model| DateRangeV2
    DateV2 -->|內嵌使用| Calendar
    DateRangeV2 -->|並排雙月份| Calendar
    Calendar --> DateFns
```

---

## 元件規格

### `Internal/Calendar.vue` — 日曆核心

共用的日曆核心元件，被 `DateV2` 與 `DateRangeV2` 使用。

#### Props

| Prop | 型別 | 預設值 | 說明 |
| :--- | :--- | :---: | :--- |
| `isRange` | `boolean` | `false` | 是否為範圍選擇模式 |
| `minDate` | `Date \| number` | — | 可選最早日期 |
| `maxDate` | `Date \| number` | — | 可選最晚日期 |
| `hidePrevMonth` | `boolean` | `false` | 是否隱藏上個月日期格 |
| `hideNextMonth` | `boolean` | `false` | 是否隱藏下個月日期格 |
| `enableTime` | `boolean` | `false` | 是否顯示時間選擇器 |
| `hidePrevArrow` | `boolean` | `false` | 是否隱藏上個月箭頭 |
| `hideNextArrow` | `boolean` | `false` | 是否隱藏下個月箭頭 |
| `getDayAttributes` | `(date: Date, dayOfWeek: number) => CalendarDayAttributes \| null` | — | 自訂每日屬性回調 |

#### defineModel (雙向綁定)

| Model 名稱 | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `Date \| number \| null` | 單選日期值 |
| `rangeValue` | `(Date \| number \| null)[] \| null` | 範圍選擇值 `[start, end]` |
| `viewDate` | `Date`（required） | 當前日曆顯示月份 |

#### CalendarDayAttributes 介面

```typescript
export interface CalendarDayAttributes {
  isHoliday?: boolean    // 是否為假日（標紅色）
  label?: string | null  // 日期下方顯示的文字 Label
  labelClass?: string    // Label 的 CSS class
  disabled?: boolean     // 是否禁用此日期
  dot?: boolean          // 是否顯示小點標記
  dotColor?: string      // 小點的自訂顏色（CSS color string）
  class?: string         // 日期格的額外 CSS class
}
```

#### 選擇器模式 (pickerMode)

```mermaid
stateDiagram-v2
    [*] --> calendar : 初始
    calendar --> year : 點擊年份按鈕
    calendar --> month : 點擊月份按鈕
    year --> calendar : 選擇年份
    month --> calendar : 選擇月份
```

#### 顏色邏輯規則

| 條件 | 套用顏色 |
| :--- | :--- |
| 週末 (日/六) 或 `isHoliday` | `text-error` (紅色) |
| 已選取日期 | `bg-primary text-on-primary` (圓形背景) |
| 今日 | `text-primary` (主色) |
| 範圍內 | `bg-primary/10` (淡主色背景) |
| 其他當月日期 | `text-on-surface` |
| 相鄰月份日期 | `text-outline opacity-50` |

---

## 狀態流程圖

### 單日期選擇 (`isRange: false`)

```mermaid
sequenceDiagram
    participant User as 使用者
    participant DateV2 as CamelotDateV2
    participant Calendar as Internal/Calendar

    User->>DateV2: 點擊輸入框
    DateV2->>Calendar: 開啟 (傳入 modelValue, viewDate)
    User->>Calendar: 點擊日期格
    Calendar->>Calendar: selectDate(date)
    Calendar-->>DateV2: 更新 modelValue (defineModel)
    DateV2-->>User: 顯示選取日期
```

### 範圍選擇 (`isRange: true`)

```mermaid
sequenceDiagram
    participant User as 使用者
    participant DateRangeV2 as CamelotDateRangeV2
    participant CalL as Calendar (左)
    participant CalR as Calendar (右)

    User->>CalL: 點擊起始日期
    CalL->>CalL: 設定 rangeValue[0]，清除 rangeValue[1]
    User->>CalR: 點擊結束日期
    CalR->>CalR: 比較日期，設定 [start, end] 或交換
    CalR-->>DateRangeV2: 更新 rangeValue
    DateRangeV2-->>User: 顯示起訖日期
```

---

## 相關計畫

| 計畫 | 狀態 | 說明 |
| :--- | :--- | :--- |
| [2604131355-refactor-calendar-define-model](../plans/2604131355-refactor-calendar-define-model/plan.md) | 🚧 進行中 | 將 Calendar 改為 `defineModel` |
| [2604131417-propagate-calendar-updates](../plans/2604131417-propagate-calendar-updates/plan.md) | 🚧 進行中 | 傳播 `getDayAttributes` 更新 |
| [2604131437-fix-calendar-type-errors](../plans/2604131437-fix-calendar-type-errors/plan.md) | 🚧 進行中 | 修復 TypeScript 型別問題 |
| [2604131441-unify-calendar-colors-and-2-line-label](../plans/2604131441-unify-calendar-colors-and-2-line-label/plan.md) | 🚧 進行中 | 統一顏色控制與換行 Label |
| [2604131510-refactor-daterange-separate-inputs](../plans/2604131510-refactor-daterange-separate-inputs/plan.md) | 🚧 進行中 | DateRangeV2 改為雙獨立 Input |

---

## References

- [date-fns 官方文件](https://date-fns.org/)
- [Vue 3 defineModel RFC](https://vuejs.org/guide/components/v-model)

---

[🏠 Wiki](../index.md)
