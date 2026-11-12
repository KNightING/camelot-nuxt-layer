# Scheduler

## Summary

Scheduler 是行事曆與排班表元件，匯入名稱 `CamelotScheduler`。有月、週、日三種行事曆視圖，以及以人員為列的兩種排班視圖；可在空白處新增事件、拖移事件換時間或換日、拖拉下緣調整長度，並內建編輯面板。事件由使用者持有，以 v-model 雙向綁定，所有變更同時發出事件；時間一律是本地時間。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `resources` | `CamelotSchedulerResource[]` | `[]` | 排班視圖的列（人員、房間、設備）；沒有時排班視圖不會出現 |
| `views` | `CamelotSchedulerView[]` | 五種全開 | 要提供的視圖，也決定切換列的順序 |
| `weekStartsOn` | `0 \| 1` | `0` | 週起始：0 週日、1 週一 |
| `locale` | `string` | 繁體中文 | 星期與標題的 BCP 47 語系 |
| `startHour`、`endHour` | `number` | `0`、`24` | 時間軸可見範圍（時） |
| `hourHeight` | `number` | `48` | 週與日視圖每小時的高度（px） |
| `scrollToHour` | `number` | `8` | 週與日視圖打開時捲動到這個小時 |
| `snapMinutes` | `number` | `15` | 拖移與調整長度的吸附單位（分鐘） |
| `defaultMinutes` | `number` | `60` | 點一下空白處新增的事件長度（分鐘） |
| `readonly` | `boolean` | `false` | 不能新增、拖移、調整長度或編輯 |
| `color` | `CamelotColorRole` | `'primary'` | 事件未指定顏色時的色彩角色 |
| `labels` | `Partial<CamelotSchedulerLabels>` | 繁體中文 | 要覆蓋的顯示文字，沒給的欄位用預設 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `create` | `event` | 在編輯面板按儲存，新增一筆事件後 |
| `update` | `event`、`previous` | 拖移、調整長度或編輯後，帶新舊兩個版本 |
| `delete` | `event` | 在編輯面板刪除事件後 |
| `event-click` | `event` | 在事件上點一下；唯讀時也會發出 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `events` | `CamelotSchedulerEvent[]`（預設 `[]`） | 事件清單；元件的變更會產生新陣列寫回 |
| `date` | `Date`（預設今天） | 目前顯示的日期，月看所在月、週看所在週 |
| `view` | `CamelotSchedulerView`（預設 `week`） | 目前的視圖 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `editor` | `event`、`isNew`、`open`、`save`、`remove`、`close` | 整個換掉內建編輯面板；用 save 與 remove 把結果交回元件 |

## 視圖
| 視圖 | 版面 | 拖移 |
| :--- | :--- | :--- |
| `month` | 6×7 日期格，每格最多 3 筆，超出顯示「還有 N 筆」 | 換日，時間不變 |
| `week` | 7 欄時間軸，左側時間刻度，今天有目前時間線 | 換時間與換日，下緣調整長度 |
| `day` | 1 欄時間軸 | 換時間，下緣調整長度 |
| `resourceWeek` | 人員為列、7 天為欄，班次排在儲存格內 | 換日與換人 |
| `resourceDay` | 人員為列、小時為欄的時間軸；同時段重疊的班次疊成多條 | 換時間與換人，右緣調整長度 |

## 手勢
| 規則 | 說明 |
| :--- | :--- |
| 新增 | 在時間軸的空白處拖曳選取時段，或在任何空白處點一下用預設長度；完成後開啟編輯面板 |
| 拖移 | 按住事件移動，放開才寫回；拖動中顯示預覽；時間吸附到 `snapMinutes` |
| 調整長度 | 拖事件的下緣（排班日視圖是右緣），最短一個吸附單位 |
| 滑鼠 | 移動超過 4px 才算拖移，否則視為點一下 |
| 觸控 | 按住 350ms 才進入拖移，之前手指移動視為捲動；進入拖移後擋掉捲動 |
| 鍵盤 | 事件可聚焦，Enter 或空白鍵開啟編輯；不支援用鍵盤移動事件 |
| 鎖定事件 | `locked` 的事件不能拖移、調整長度或刪除，點一下以唯讀方式開啟 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 重疊事件 | 週與日視圖並排成欄，欄寬平分；排班日視圖疊成多條，列高跟著增加 |
| 跨日事件 | 在跨過的每一天都會顯示，區間裁到當天 |
| 排班視圖 | 只顯示有 `resourceId` 且對應到 `resources` 的事件 |
| 不含 | 重複事件、時區換算、全天事件、鍵盤移動事件 |

來源：1. [Scheduler.vue](../../../../app/components/Camelot/Scheduler.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
