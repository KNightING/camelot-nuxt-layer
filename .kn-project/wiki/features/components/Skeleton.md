# Skeleton

## Summary

載入中的骨架佔位元件：載入時依目前主題顯示不同的載入動畫，載入完成後改顯示預設插槽的實際內容。匯入名稱為 `CamelotSkeleton`（Nuxt 自動匯入）。

## 運作方式

| 主題 | 載入動畫 |
|---|---|
| Aqua | 毛玻璃底加 shimmer 光帶 |
| Sci-Fi | HUD 外框，無邊界、不切角，開啟格線、掃描線與脈衝，最低 24px |
| Cupertino、Material | 閃光掃過的預設骨架 |

元件不自動繼承屬性，傳入的 class 等屬性會轉交給實際的骨架容器。

來源：1. [Skeleton.vue][]

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `isLoading` | `boolean` | `true` | 是否顯示骨架；`false` 時改為渲染預設插槽。 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `default` | — | 載入完成後顯示的實際內容。 |

## 相關頁面

- [Scifi Frame](./Scifi-Frame.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Skeleton.vue | [app/components/Camelot/Skeleton.vue](../../../../app/components/Camelot/Skeleton.vue) |

[Skeleton.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
