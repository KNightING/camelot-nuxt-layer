# AvatarGroup

## Summary

AvatarGroup 把多個 [Avatar](./Avatar.md) 重疊成一排，匯入名稱 `CamelotAvatarGroup`。超過上限的人數以「+N」表示，滑鼠滑過整組時頭像會展開成不重疊。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :--- | :--- |
| `items` | `CamelotAvatarItem[]` | `[]` | 頭像資料；每項有 name，選填 src 與 color |
| `max` | `number` | `5` | 最多顯示幾個頭像 |
| `size` | `CamelotAvatarSize` | `'md'` | 全部頭像的尺寸 |
| `color` | `CamelotColorRole` | `'primary'` | 項目未指定 color 時的預設色彩角色 |

## 規則
| 規則 | 說明 |
| :--- | :--- |
| 重疊量 | 跟著尺寸變化，尺寸越大重疊越多 |
| 分隔 | 每個頭像外有一圈表面色外框；Sci-Fi 主題不畫外框 |
| 滑過單一頭像 | 該頭像上移 4px |

來源：1. [AvatarGroup.vue](../../../../app/components/Camelot/AvatarGroup.vue)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
