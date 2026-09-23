# ImageV2

## Summary

ImageV2（匯入名稱 `CamelotImageV2`）是延遲載入的圖片元件：進入視窗才開始載入，載入中顯示骨架，失敗時改渲染 error 插槽。可選擇在滑鼠懸停時於圖片旁浮出大圖預覽；載入狀態可從元件外部讀取。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `src` | `string` | — | 圖片網址；變更時已開始載入的圖會重新載入 |
| `fullSrc` | `string` | — | 懸停大圖的網址；未提供時用 src |
| `alt` | `string` | — | 替代文字 |
| `hoverShowFullImage` | `boolean` | `false` | 懸停時顯示大圖預覽 |
| `width` | `number` | — | 圖片寬度，單位 px |
| `height` | `number` | — | 圖片高度，單位 px |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'scale-down'` | 圖片填充方式 |
| `immediate` | `boolean` | `false` | 立即載入，不等進入視窗 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `loaded` | `image: HTMLImageElement` | 圖片載入完成時發出 |

## Slots
| Slot | 作用域參數 | 說明 |
| :--- | :--- | :--- |
| `error` | — | 載入失敗時顯示的內容 |

## Exposed
| 名稱 | 說明 |
| :--- | :--- |
| `isLoading` | 是否載入中 |
| `isError` | 是否載入失敗 |
| `isReady` | 是否已載入完成 |

## 運作方式

### 載入流程

1. 容器有一半進入視窗時開始載入，觸發後即停止觀察。
2. 載入中顯示 [Skeleton](./Skeleton.md)。
3. 失敗時渲染 error 插槽，成功時渲染圖片並發出 `loaded` 事件。
4. `src` 變更時，已開始載入的圖立即重新載入；還沒進入視窗的仍等進入後才載入。
5. 元件上的其他屬性會傳到圖片或 error 插槽的外層元素上。

載入狀態由 [useLazyImage](../composables/useLazyImage.md) 管理；整段只在瀏覽器端渲染。

來源：1. [ImageV2.vue][]

### 懸停大圖

1. 指標進入 400ms 後顯示大圖，離開 100ms 後隱藏。
2. 大圖掛到 body，垂直對齊原圖中線，放在原圖右側；右側放不下改放左側，下方超出改往上移。
3. 橫幅圖限制最寬、直幅圖限制最高，大圖本身也用 ImageV2 立即載入。
4. 只在大圖顯示期間監聽視窗捲動與縮放以更新位置，隱藏後不留監聽。

來源：1. [ImageV2.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231702-fix-wiki-review-code-defects](../../../archive/2609231702-fix-wiki-review-code-defects.md) | 修正程式碼缺陷後更新為修正後的行為 | [#47](https://github.com/KNightING/camelot-nuxt-layer/issues/47) | — |
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| ImageV2.vue | [app/components/Camelot/ImageV2.vue](../../../../app/components/Camelot/ImageV2.vue) |

[ImageV2.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
