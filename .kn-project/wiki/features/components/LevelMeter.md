# LevelMeter

## Summary

LevelMeter 是分段音量表，匯入名稱 `CamelotLevelMeter`。依 0 到 1 的音量點亮對應數量的分段，超過峰值門檻的分段亮起時改用警示色，左側可放聲道名稱。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `level` | `number` | `0` | 目前音量，0 到 1 |
| `segments` | `number` | `16` | 分段數 |
| `peakFrom` | `number` | `0.85` | 超過這個比例的分段視為峰值區 |
| `label` | `string` | `''` | 聲道名稱等標籤 |
| `color` | `CamelotColorRole` | `'primary'` | 一般分段亮起時的色彩角色 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `label` | — | 自訂標籤 |

## 外觀
| 主題 | 分段形狀 |
| :--- | :--- |
| scifi | 直角，亮起時帶外發光 |
| aqua、cupertino | 膠囊 |
| tactile、material | 2px 圓角 |

來源：1. [LevelMeter.vue](../../../../app/components/Camelot/LevelMeter.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
