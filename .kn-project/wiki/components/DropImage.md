# DropImage

> 圖片選取與拖放上傳元件，支援點擊選檔、拖放，並可顯示既有圖片。

**匯入名稱**：`CamelotDropImage`

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `label` | `string` | — | 上方標籤文字 |
| `modelValue` | `File \| string` | — | 目前選取的圖片（檔案或字串） |
| `originImage` | `string` | — | 既有／原始圖片的來源網址 |
| `id` | `string` | — | file input 的 id；未提供時自動產生 |
| `placeholderText` | `string` | — | 尚無圖片時顯示的提示文字 |
| `isAspectVideo` | `boolean` | — | 是否使用 16:9（video）比例，否則為正方形 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `update:modelValue` | `value?: File \| string` | 選取或拖放圖片後更新 |

## 備註
- 內部以 `computed` 的 `image` 對應 `modelValue`，setter 中透過 `FileReader` 讀取 `File` 並顯示為 DataURL，或直接以字串設定圖片來源。
- 拖放透過 `@vueuse/core` 的 `useDropZone`；拖曳於區域上方時顯示藍色虛線提示。
- 僅接受 `image/*` 類型；`setImageRef` 會過濾非圖片檔。
- 當 `modelValue` 為 `undefined` 而 `originImage` 存在時，載入中會顯示 `CamelotSkeleton`，載入完成後顯示原始圖片（載入狀態來自 `useImage`）。
- 未提供 `id` 時，id 以時間戳與 `useRandom()` 組合產生。

---
[🏠 Wiki](../index.md)
