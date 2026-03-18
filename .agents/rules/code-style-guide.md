---
trigger: always_on
description: "Vue, Nuxt 4, & UI Code Style Guide"
---

# 專案程式碼風格指南 (Code Style Guide)

## 🚀 框架與核心架構 (Vue & Nuxt 4)
- **依賴自動注入 (Auto-Imports)**：本專案基於 Nuxt 4，已提供完善的自動注入功能。**絕對不要**手動 `import` 以下內容：
  - 各類 Vue 原生功能（如：`ref`, `computed`, `watch`,`MaybeRefOrGetter`,`MaybeRef`, `toRefs` 等）
  - 專案定義的組合式函式 (`app/composables/` 目錄下)
  - 狀態管理模組 (`app/stores/` 目錄下) 與 Pinia 相關功能（如：`storeToRefs`, `defineStore` 等）
  - 各類標示 Icon（包含 `iconv-lite` 等圖示庫）
  - `@vueuse`package提供的功能
- **狀態管理**：本專案使用 **Pinia** 進行全域狀態 (Store) 管理。
- **型別與模型層 (Models)**：所有的 `interface`、`type` 等資料模型，請統一分類收納至 `app/models/` 目錄當中，並確保結構清晰。
- **持久化狀態與 Hydration (Persistence Layer)**：使用 `useLocalStorage`、`useSessionStorage`
 管理 Store 狀態時，若涉及客戶端持久化資料，必須加上 `{ initOnMounted: true }` 配置。這能確保在 Nuxt 的 Hydration 過程中，客戶端能正確從 `localStorage` 讀取資料並同步，避免渲染不一致 (Hydration Mismatch)。

## ⚡ Vue 元件開發規範
- **開發風格 (Composition API)**：請堅持使用 **Composition API** 寫法（如 `<script setup>`），嚴禁使用 Options API（如 `data()`, `methods`）。 Store 的撰寫也請同樣採用 Composition API (Setup Store) 模式，且**一律加上並暴露 `$reset` 方法**。
- **響應式狀態宣告**：一律只使用 `ref` 進行響應式變數的宣告，請**避免**使用 `reactive`。
- **元件雙向綁定 (v-model)**：實作元件的雙向綁定機制時，請使用新的 `defineModel` 語法：
  ```ts
  const modelValue = defineModel<string>()
  ```
- **Template Refs 宣告**：若需要抓取 DOM 或子元件實例，請採用新的 `useTemplateRef` 寫法，拒絕使用舊模式聲明：
  ```ts
  const inputRef = useTemplateRef<HTMLInputElement>('my-input')
  ```
- **Props 定義 (型別導向)**：請以純 TypeScript 型別定義 `props`，保持精簡與可讀性：
  ```ts
  const props = defineProps<{
    book: Book
  }>()
  ```
- **Emits 定義 (以元組語法為準)**：自 Vue 3.3+ 起，請採用更簡潔的 Tuple 型別配置定義 `emit`：
  ```ts
  const emit = defineEmits<{
    change: [id: number]
    update: [value: string]
  }>()
  ```
- **避免用 Computed 回傳元件與樣式**：請不要透過 JS/TS 內的 `computed` 動態回傳元件名稱（例如搭配 `<component :is="...">`）或是動態判斷並回傳一大串 CSS class。
- **Class 綁定寫法**：於 `<template>` 處理樣式綁定時，應**避免使用三元運算子**。請一律使用物件語法：`:class="{ 'bg-primary': isValid, 'bg-gray': !isValid }"`。
- **模板邏輯抽離**：盡量避免在 `<template>` 內撰寫又長又複雜的邏輯判斷式。應將這些會頻繁計算的布林值判斷抽取至 `<script setup>` 中定義為 `computed`，並讓模板直接綁定該 `computed` 變數名稱（如：`v-if="isSetupConfigured"`）提升可讀性。
- **列表渲染 (v-for) 的狀態與樣式抽離**：在 `<template>` 內執行 `v-for` 時，若需要判斷當下項目的「啟動狀態」(例如 `isActive`)或特定樣式行為，應**避免在模板內直接比對（例如 `item.id === activeId`）**。建議在 `<script setup>` 中宣告一個 `computed` 去 `map` 原始陣列並添加所需的狀態（如 `isActive` 布林值），讓模板直接取用該變數進行判定，以達成資料驅動（Data-Driven）的精潔架構。
- **優先使用通用元件**：盡量使用 `app/components/App/Base` 下已建立的通用元件，以保持 UI 的一致性並減少重複代碼。
- **頁面 (Page) 結構與拆分**：開發 Page 時，盡量將內容區域分開成獨立元件。並將新增的拆分元件放置到 `app/components/App` 底下合適的業務子目錄下（如果沒有合適的目錄請自行建立）。當這些元件之間有複雜狀態互通的情況時，**請建立獨立的 Pinia Store** 來進行狀態交互，而非過度依賴 Props/Emits 的深層傳遞。

## 🎨 UI 實作與 Tailwind CSS v4 規範
- **樣式核心**：本專案使用最新版本的 **Tailwind CSS v4**。
- **主題與色彩管理**：
  - 產生 UI 代碼時，請優先參考已定義的主題色系統。
  - 先檢查 `app/assets/css/tailwind.css` 中設定好的變數，或參考 `app/composables/App/useAppColorScheme.ts`，並使用這些既有變數來設定 UI。
  - **減少 Arbitrary Values**：請盡可能避免使用諸如 `bg-[#ff5722]` 等自由值，找不到定義的主題變數時，才允許作為例外使用。
- **字體與排版**：
  - 網頁基本字體已於 `body` 進行全域綁定生效，開發元件時原則上**無須手動配置字體**。
  - 特殊區塊若有調整需求，在 `app/assets/css/tailwind.css` 中有特別設置了幾個字體的 `@utility`，請盡量直接套用這些原生寫法。

## 🌍 多語系支援 (i18n)
- **統一萃取介面文字**：所有的固定 UI 文字資訊（包含按鈕標籤、錯誤訊息、欄位名稱等），都必須經過 i18n 的翻譯抽象處理，**禁止**直接在 `.vue` 或 `.ts` 中寫死字串。
- **依賴套件配置**：本專案採用 **Nuxt i18n** 作為多國語系核心機制。
- **進階特性運用**：
  - 鼓勵使用 **Linked messages** 避免重複翻譯鍵值。
  - 當需要插入變數時，優先使用 **Named interpolation** (例如 `"{name} 的金額"` ) 提高可讀性。
  - **禁止**使用 List interpolation (也就是依靠陣列索引的插值模式如 `"{0}"`) 以免語境混亂。

## 🧩 設計模式與重構原則 (Design Patterns)
- **去字串化 (De-stringification)**：系統中的狀態、動作、硬體類型與固定選項（如退貨原因），一律嚴禁使用硬編碼字串 (Hardcoded Strings)。
  - **集中化 Enum 管理**：所有具備固定集合意義的資料，必須收納至 `app/shared/enums/` 底下。
  - **型別驅動開發**：在 Store、Component 與 Model 中，必須引用 Enum 成員進行邏輯判斷與賦值，以獲得編譯期的錯誤檢查與開發環境的自動補全。
- **全域錯誤處理模式 (Global Error Pattern)**：
  - **排除局部耦合**：頁面或組件內不應自行宣告 `errorVisible` 或重複實作錯誤 Dialog。
  - **統一分發觸發**：當捕捉到非預期的 API 失敗、資料庫寫入錯誤或業務邏輯終止時，請透過 `useAppErrorStore().handleError({ title, message })` 將錯誤上拋至全域 UI 層進行統一致敬。
- **路徑別名規範**：
  - 為了簡潔性與一致性，在引用專案內部模組時，請優先使用 `@/`、`@@/` 別名。
  - **技術註記**：在 Nuxt 專案中，`@/` 會被指向 `app/` 目錄，`@@/` 會被指向 NUXT專案目錄，使用別名能確保在目錄重構時具備更好的移植性。
- **提前回傳原則 (Guard Clauses / Early Return)**：
  - **減少巢狀結構**：專注於邏輯的「快樂路徑」(Happy Path)，並透過「衛句」(Guard Clauses) 優先處理並回傳錯誤或邊緣情況。
  - **提升可讀性**：避免深層的 `if-else` 巢狀結構，讓程式碼邏輯更加扁平且易於理解。
  - **範例**：
    ```ts
    if (r.isFail()) {
      return
    }
    // 成功後的邏輯...
    ```