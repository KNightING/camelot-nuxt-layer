# 排程運算

## Summary

`useCamelotSchedulerLayout()` 是 Scheduler 的純函式集合：吸附、區間裁切、重疊分欄、日期格、事件平移與調整長度。時間以整數分鐘運算，日期加減走本地時間的日曆日，避開夏令時間的一小時誤差；全部有單元測試。

## 函式
| 函式 | 說明 |
| :--- | :--- |
| `snapMinutes` | 把分鐘數吸附到單位的倍數 |
| `eventsOnDay`、`rangeInDay` | 取與某一天有交集的事件，與事件在當天的區間（分鐘）；午夜結束的事件不算進隔天 |
| `layoutColumns` | 重疊分欄：連續重疊的區間成為一組，組內共用欄數；起點相同時較長的排左邊 |
| `nearestRectIndex` | 找出離指標最近的格子，指標拖出視圖時取最近的 |
| `buildMonthGrid`、`buildWeekDays` | 月視圖的 42 天與一週的 7 天，依週起始日對齊 |
| `shiftEvent` | 平移事件，長度不變，可同時換人員；不改動原本的事件 |
| `resizeEventEnd`、`rangeBetween` | 調整結束時間（不得短於最短長度）、由兩個端點得到由早到晚的區間 |

來源：1. [useCamelotSchedulerLayout.ts](../../../../app/composables/useCamelotSchedulerLayout.ts)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
