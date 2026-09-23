# Loading

## Summary

Loading（匯入名稱 `CamelotLoading`）是全螢幕的載入遮罩：半透明深色遮罩蓋住整個畫面，中央顯示依主題而異的指示器，下方可附階段提示文字。顯示與否完全由 [useLoading](../composables/useLoading.md) 控制，在 App 根部掛一次即可；唯一的 prop 只影響 Aqua 主題的指示器樣式。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `type` | `CamelotLoadingType`，即 `'ripple' \| 'bounce'` | `'ripple'` | Aqua 主題的指示器樣式；其他主題忽略 |

無 Emits、v-model、Slots、Exposed。

## 運作方式

### 遮罩

1. useLoading 開啟時顯示，全部載入結束時隱藏，進出以 0.35s 淡入淡出。
2. 遮罩掛到 body、只在瀏覽器端渲染，固定蓋滿視窗，層級 1100，背景輕微模糊。
3. 遮罩開啟期間攔截所有指標事件。

來源：1. [Loading.vue][]

### 各主題指示器

| 主題 | 指示器 |
| :--- | :--- |
| Aqua | 依 type 為水滴漣漪或玻璃珠彈跳，見下方 |
| Sci-Fi | 雷達掃描動畫，含準星與 SYS_LOAD 字樣 |
| Cupertino | iOS 風格 8 葉片旋轉器 |
| Material | SVG 圓形旋轉器 |

來源：1. [Loading.vue][]

### 提示文字

指示器下方的文字由 useLoading 開啟或更新文字時帶入，可在同一次載入中切換階段；沒有文字時整段不渲染。

1. 換文字時舊字淡出、新字淡入，不會硬跳。
2. 文字區宣告為狀態區，螢幕報讀器會禮貌地唸出新文字。
3. 文字固定為半透明白加陰影，不跟主題文字色：遮罩永遠是深色，淺色模式的主題文字色會看不見。
4. Sci-Fi 主題改用等寬字，顏色跟隨角色色，與該主題其他資訊一致。

來源：1. [Loading.vue][]

### Aqua 指示器

兩種樣式都是向心或原地的形狀，沒有由左往右的線性位移，避免被讀成進度條。

| 樣式 | 元素 | 動態 |
| :--- | :--- | :--- |
| ripple | 中心 22px 玻璃水滴與三道同心漣漪 | 水滴先縮後脹，漣漪由 0.28 倍擴散到原尺寸並淡出，三道錯開三分之一週期 |
| bounce | 三顆 18px 玻璃珠 | 依序彈跳，以底部為變形中心 |

| 樣式 | 週期變數 | 預設 |
| :--- | :--- | :--- |
| ripple | `--cml-aqua-ripple-duration` | 2.8s |
| bounce | `--cml-aqua-bounce-duration` | 1.1s |

三道漣漪與三顆珠子的延遲都從週期變數推算，改一個值即可整組變速。

bounce 在起跳與落地各壓扁一次、空中略微拉長；少了這兩下，看起來會像等速上下平移而不是彈跳。

來源：1. [Loading.vue][]

### Aqua 共通規則

1. 球體填色走角色色並混入白色做漸層與高光，不使用背景模糊：遮罩是深色，深色模式的表面色與遮罩幾乎同色會看不見。
2. 動畫只動 transform 與 opacity。
3. 使用者偏好減少動態時停住動畫，保留靜態球體表示進行中。

來源：1. [Loading.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Loading.vue | [app/components/Camelot/Loading.vue](../../../../app/components/Camelot/Loading.vue) |

[Loading.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
