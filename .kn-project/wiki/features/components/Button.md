# Button

## Summary

Button 是依當前主題自動切換外觀的公開按鈕元件，匯入名稱 `CamelotButton`（Nuxt 自動匯入）。它依主題選用 Scifi、Cupertino、Aqua 或 Material 的按鈕實作，統一處理文字、角色色彩、停用與點擊事件；四種主題字級都是 1rem、最低高度 42px。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | `'Button'` | 按鈕文字（無 default 插槽內容時顯示） |
| `disabled` | `boolean` | `false` | 是否停用按鈕 |
| `color` | `CamelotColorRole` | `'primary'` | 角色色彩，四種主題都套用 |
| `isContainer` | `boolean` | `false` | 改用角色的容器色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `click` | `event: MouseEvent` | 按鈕點擊事件 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 按鈕內容；未提供時顯示 `label` |

## 運作方式

### 主題切換

1. 讀取目前主題模式。
2. 依模式渲染對應實作；未知模式一律用 Material。
3. 外層容器設定字級 1rem，並依 color 與 isContainer 設定目前角色色，內層實作取用這組顏色。

| 主題 | 實作 |
|---|---|
| scifi | [Scifi Button](./Scifi-Button.md) |
| cupertino | [Cupertino Button](./Cupertino-Button.md) |
| aqua | [Aqua Button](./Aqua-Button.md) |
| 其他（預設 material） | [Material Button](./Material-Button.md)，另外收到 color 與 isContainer 以決定漣漪顏色 |

來源：1. [Button.vue][]

### 尺寸

四種主題最低高度都是 42px；字級變大時按鈕會跟著撐高，不會裁切文字。

來源：1. [Button.vue][]

## 相關頁面
- [useCamelotTheme](../composables/useCamelotTheme.md)
- [useCamelotRoleColorClass](../composables/useCamelotRoleColorClass.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Button.vue | [app/components/Camelot/Button.vue](../../../../app/components/Camelot/Button.vue) |

[Button.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
