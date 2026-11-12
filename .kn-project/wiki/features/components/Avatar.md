# Avatar

## Summary

Avatar 是頭像元件，匯入名稱 `CamelotAvatar`。有圖片網址時顯示圖片，沒有或載入失敗時顯示姓名縮寫；提供三種尺寸與色彩角色，Sci-Fi 主題是切角方塊，其餘主題是圓形。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `''` | 姓名；圖片的替代文字，也是縮寫的來源 |
| `src` | `string` | `''` | 圖片網址 |
| `size` | `CamelotAvatarSize` | `'md'` | 尺寸：sm 32px、md 42px、lg 56px |
| `color` | `CamelotColorRole` | `'primary'` | 縮寫底色的色彩角色 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 取代縮寫的自訂內容；有圖片時不顯示 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 拉丁字母姓名 | 取前兩個字元並轉大寫 |
| 其他文字 | 取第一個字，避免兩個全形字塞不進小尺寸 |
| 圖片載入失敗 | 退回顯示縮寫；圖片網址變更後會重新嘗試 |

來源：1. [Avatar.vue](../../../../app/components/Camelot/Avatar.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
