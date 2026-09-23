# useRandomCatImg

## Summary

useRandomCatImg 產生 cataas.com 的隨機貓咪圖片網址，回傳響應式網址與換一張的方法，常用於範例頁與佔位圖。它只組網址，不發送任何請求；網址帶隨機查詢字串，讓瀏覽器每次都重新取圖。

## 介面

### 簽章

```ts
const useRandomCatImg: () => {
  url: Ref<string>
  newCat: () => void
}
```

### 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `url` | `Ref<string>` | 目前的貓咪圖片網址，格式見下方 |
| `newCat` | `() => void` | 產生新的隨機碼並更新 `url` |

```text
https://cataas.com/cat?<隨機碼>
```

來源：1. [useRandomCatImg.ts][]

## 用法

```vue
<script setup lang="ts">
const { url, newCat } = useRandomCatImg()
</script>

<template>
  <img :src="url">
  <button @click="newCat">換一隻</button>
</template>
```

## 規則

| 規則 | 說明 |
| --- | --- |
| 初始值 | 建立時自動呼叫一次 `newCat` |
| 隨機碼 | `Math.random` 轉 36 進位後取第 2 到 14 位 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useRandomCatImg.ts | [app/composables/useRandomCatImg.ts](../../../../app/composables/useRandomCatImg.ts) |

[useRandomCatImg.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
