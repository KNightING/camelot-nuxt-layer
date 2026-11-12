# 排程手勢

## Summary

`useCamelotSchedulerDrag(options)` 是 Scheduler 的指標手勢控制器：拖移事件、拖拉結束時間、在空白處拖曳選取。座標與時間的換算由各視圖提供，控制器只處理手勢的生命週期與預覽，回傳預覽 `draft` 與起手勢的三個函式。

## 運作方式
| 規則 | 說明 |
| :--- | :--- |
| 起點 | 視圖在事件、把手或空白處按下時呼叫對應的函式；唯讀、已有手勢進行中或鎖定的事件不會啟動 |
| 滑鼠 | 移動超過 4px 才進入拖移；沒超過放開就是點一下 |
| 觸控 | 按住 350ms 進入拖移並擋掉捲動；之前移動超過 8px 就放棄 |
| 預覽 | 拖動中把預覽套進事件清單，放開才發出 change 或 create |
| 點一下 | 事件上是開啟編輯；空白處是用預設長度新增，日期格從 9:00 開始 |
| 最小單位 | 時間軸可換時間，日期格只換日、時間不變 |

來源：1. [useCamelotSchedulerDrag.ts](../../../../app/composables/useCamelotSchedulerDrag.ts)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
