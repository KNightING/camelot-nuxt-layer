# Breakpoints

## Summary

Breakpoints 是依裝置斷點選擇插槽渲染的響應式容器，匯入名稱 `CamelotBreakpoints`（Nuxt 自動匯入）。斷點分為 mobile、tablet、laptop、desktop；目前斷點沒有提供插槽時，預設會回退到較小斷點的插槽，都沒有才渲染預設插槽。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `disabledDownward` | `boolean` | — | 關閉向下相容；停用後大斷點不再回退使用較小斷點的插槽 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `mobile` | — | 行動裝置版面 |
| `tablet` | — | 平板版面 |
| `laptop` | — | 筆電版面 |
| `desktop` | — | 桌機版面 |
| `default` | `{ isMobile, isTablet, isLaptop, isDesktop }` | 無對應具名插槽時的後備內容，並提供各斷點布林值 |

## 運作方式

1. 從 [useDeviceBreakpoints](../composables/useDeviceBreakpoints.md) 取得目前斷點。
2. 有目前斷點的插槽就渲染它。
3. 沒有時依序往較小斷點找，例如 desktop 依序找 laptop、tablet、mobile。
4. 開啟 `disabledDownward` 時跳過第 3 步。
5. 都找不到就渲染預設插槽。

來源：1. [Breakpoints.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Breakpoints.vue | [app/components/Camelot/Breakpoints.vue](../../../../app/components/Camelot/Breakpoints.vue) |

[Breakpoints.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
