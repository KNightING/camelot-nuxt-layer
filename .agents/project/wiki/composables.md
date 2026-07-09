# 🪝 Composable 清單矩陣 (Composables)

全部 composable，每個連結為獨立頁（簽章 / 參數 / 回傳 / 用法）。Nuxt 自動匯入，直接呼叫即可。

---

## 🎨 主題 / 色彩

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useCamelotTheme` | 主題切換狀態（themeMode / colorMode / 色彩方案） | [詳情](./composables/useCamelotTheme.md) |
| `useCamelotRoleColorClass` | 色彩角色 → 注入 `--cml-color-current-*` 的 class | [詳情](./composables/useCamelotRoleColorClass.md) |
| `useCamelotPickerTheme` | DatePicker 各風格 class | [詳情](./composables/useCamelotPickerTheme.md) |
| `useCamelotMenuItemTheme` | 選單/選項列各風格 active/hover | [詳情](./composables/useCamelotMenuItemTheme.md) |
| `useMaterial3ColorScheme` | Material 3 色彩方案生成 | [詳情](./composables/useMaterial3ColorScheme.md) |
| `useCustomColorScheme` | 自訂色彩方案管理 | [詳情](./composables/useCustomColorScheme.md) |
| `useColor` | 顏色處理工具 | [詳情](./composables/useColor.md) |

## 🧩 元件相關

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useCamelotToast` | Toast 通知系統 | [詳情](./composables/useCamelotToast.md) |
| `useCamelotVirtual` | 虛擬滾動核心（可變列高） | [詳情](./composables/useCamelotVirtual.md) |
| `useCamelotOverlayScrollbar` | 自訂 overlay 捲軸核心（方向感知） | [詳情](./composables/useCamelotOverlayScrollbar.md) |
| `useCamelotFileDrop` | 檔案拖曳 headless 核心 | [詳情](./composables/useCamelotFileDrop.md) |
| `useCamelotRouter` | 擴展 Vue Router（歷史堆疊） | [詳情](./composables/useCamelotRouter.md) |
| `useLocale` | 語系格式正規化（bcp47/cldr/l10n） | [詳情](./composables/useLocale.md) |
| `useLoading` | 全域載入狀態 | [詳情](./composables/useLoading.md) |

## 🌐 API / 串流

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useBaseApi` | API 請求基礎封裝（含串流） | [詳情](./composables/useBaseApi.md) |
| `useBaseUrl` | Base URL | [詳情](./composables/useBaseUrl.md) |
| `useFetchStream` | Fetch 串流請求 | [詳情](./composables/useFetchStream.md) |
| `useFetchJSONLinesStream` | JSON Lines 串流 | [詳情](./composables/useFetchJSONLinesStream.md) |

## ✅ 表單 / 驗證

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useInputValidationController` | 表單驗證控制器 | [詳情](./composables/useInputValidationController.md) |
| `useValueValidation` | 值驗證工具 | [詳情](./composables/useValueValidation.md) |
| `useIsValidKey` | 鍵值驗證 | [詳情](./composables/useIsValidKey.md) |

## 💾 儲存 / Proxy

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useStorageProxy` | 儲存 proxy 基底 | [詳情](./composables/useStorageProxy.md) |
| `useLocalStorageProxy` | localStorage proxy | [詳情](./composables/useLocalStorageProxy.md) |
| `useSessionStorageProxy` | sessionStorage proxy | [詳情](./composables/useSessionStorageProxy.md) |
| `useCookieProxy` | cookie proxy | [詳情](./composables/useCookieProxy.md) |
| `usePiniaClear` | 清空 Pinia | [詳情](./composables/usePiniaClear.md) |

## 🧭 路由 / 連結

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useCurrentRoute` | 當前路由 | [詳情](./composables/useCurrentRoute.md) |
| `useRouteWrapper` | 路由包裝 | [詳情](./composables/useRouteWrapper.md) |
| `useAnchorLink` | 錨點連結 | [詳情](./composables/useAnchorLink.md) |
| `useAutoLink` | 自動連結 | [詳情](./composables/useAutoLink.md) |

## 🖱️ DOM / 滾動 / 裝置

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useElCssVar` | 讀寫元素 CSS 變數 | [詳情](./composables/useElCssVar.md) |
| `useScrollParent` | 找捲動祖先 | [詳情](./composables/useScrollParent.md) |
| `useScrollOnBottom` | 捲到底偵測 | [詳情](./composables/useScrollOnBottom.md) |
| `useInfinitePage` | 無限滾動分頁 | [詳情](./composables/useInfinitePage.md) |
| `useDeviceBreakpoints` | 裝置斷點偵測 | [詳情](./composables/useDeviceBreakpoints.md) |
| `useDrawerCollapsed` | Drawer 收合狀態（singleton） | [詳情](./composables/useDrawerCollapsed.md) |

## 🖼️ 檔案 / 媒體

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useBlobDownload` | Blob 下載 | [詳情](./composables/useBlobDownload.md) |
| `useCanvasConvert` | Canvas 轉換 | [詳情](./composables/useCanvasConvert.md) |
| `useFileKey` | 檔案唯一鍵 | [詳情](./composables/useFileKey.md) |
| `useFileToDataURL` | 檔案轉 DataURL | [詳情](./composables/useFileToDataURL.md) |
| `useLazyImage` | 圖片懶載入 | [詳情](./composables/useLazyImage.md) |
| `useRandomCatImg` | 隨機貓圖 | [詳情](./composables/useRandomCatImg.md) |

## 🔧 工具

| Composable | 說明 | 詳情 |
| :--- | :--- | :--- |
| `useObject` | 物件操作工具集 | [詳情](./composables/useObject.md) |
| `useFloat` | 浮點數處理 | [詳情](./composables/useFloat.md) |
| `useNumberThousandsSeparators` | 千分位 | [詳情](./composables/useNumberThousandsSeparators.md) |
| `useRandom` | 隨機 | [詳情](./composables/useRandom.md) |
| `useDelay` | 延遲 | [詳情](./composables/useDelay.md) |
| `useErrorRef` | 錯誤狀態封裝 | [詳情](./composables/useErrorRef.md) |

---

[🧩 元件清單](./components.md) | [🏠 Wiki](./index.md)
