# useRandomCatImg

> 產生隨機貓咪圖片 URL（cataas.com），提供響應式 URL 與重新產生的方法。

## 簽章
```ts
export const useRandomCatImg = () => ({
  url,
  newCat,
})
```

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `url` | `Ref<string>` | 目前的貓咪圖片 URL（形如 `https://cataas.com/cat?<randomCode>`）。 |
| `newCat` | `() => void` | 產生新的隨機碼並更新 `url`。 |

## 用法
```ts
const { url, newCat } = useRandomCatImg()
// <img :src="url" />
// <button @click="newCat">換一隻</button>
```

## 備註
- 建立時會自動呼叫一次 `newCat()` 產生初始 URL。
- 隨機碼由 `Math.random().toString(36).substring(2, 15)` 產生。
- 僅回傳 URL，不會實際發送 fetch。

---
[🏠 Wiki](../index.md)
