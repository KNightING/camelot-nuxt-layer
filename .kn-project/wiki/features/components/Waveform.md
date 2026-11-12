# Waveform

## Summary

Waveform 是音訊波形元件，匯入名稱 `CamelotWaveform`。依傳入的振幅陣列畫出一排長條，已播放的部分上色；可點擊、拖曳或用方向鍵跳轉，進度以 0 到 1 的數值雙向綁定。元件只負責畫面與跳轉，不播放聲音。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `peaks` | `number[]` | `[]` | 每根長條的振幅，0 到 1；陣列長度即長條數 |
| `height` | `string` | `'72px'` | 整體高度 |
| `seekable` | `boolean` | `true` | 是否可點擊、拖曳或用方向鍵跳轉 |
| `disabled` | `boolean` | `false` | 停用後變淡且無法跳轉 |
| `color` | `CamelotColorRole` | `'primary'` | 已播放部分的色彩角色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `seek` | `progress: number` | 使用者跳轉後觸發，值為 0 到 1 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `progress` | `number`（預設 `0`） | 播放進度，0 到 1 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 最小高度 | 振幅再小的長條也保留 8% 高度，靜音段才看得到 |
| 方向鍵 | 左右鍵每次移動 5% |
| 拖曳 | 按下後拖出元件範圍仍持續跳轉 |
| 超出範圍的值 | 進度與振幅都會限制在 0 到 1 |

來源：1. [Waveform.vue](../../../../app/components/Camelot/Waveform.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
