# Tactile Button

## Summary

Tactile Button 是 Tactile 主題的按鈕外觀實作，匯入名稱 `CamelotTactileButton`。一般在 Tactile 主題下由 [Button](./Button.md) 自動選用：角色色平塗、14px 圓角，按下縮小後以彈簧回彈。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | 停用按鈕 |
| `loading` | `boolean` | `false` | 處理中：文字透明佔位，中央顯示轉圈 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 按鈕點擊事件 |

## 外觀
| 狀態 | 外觀 |
| :--- | :--- |
| 一般 | 角色色平塗加同色柔影，文字用配對前景色 |
| 按下 | 縮小到 95%，放開以彈簧回彈 |
| 鍵盤聚焦 | 2px 角色色焦點環 |
| 停用 | 半透明並灰階，沒有落影 |

來源：1. [Tactile/Button.vue](../../../../app/components/Camelot/Tactile/Button.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
