# 🧩 元件清單矩陣 (Components)

Camelot Nuxt Layer 全部元件，每個連結為獨立 API 頁（Props / Emits / v-model / Slots / Exposed）。匯入名稱為 `Camelot<Name>`（Nuxt 自動匯入）。

> 主題子元件（Aqua/Material/Cupertino/Scifi）與 `Internal/` 為實作細節，通常由公開元件自動選用。

---

## 📝 表單 (Form)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `Button` | 按鈕（四風格、color 角色、is-container） | [詳情](./components/Button.md) |
| `Input` | 輸入框 | [詳情](./components/Input.md) |
| `Textarea` | 多行輸入（autosize、字數） | [詳情](./components/Textarea.md) |
| `Checkbox` | 勾選框（indeterminate） | [詳情](./components/Checkbox.md) |
| `CheckboxGroup` | 勾選群組 | [詳情](./components/CheckboxGroup.md) |
| `Radio` | 單選 | [詳情](./components/Radio.md) |
| `RadioGroup` | 單選群組 | [詳情](./components/RadioGroup.md) |
| `Switch` | 開關 | [詳情](./components/Switch.md) |
| `SelectV2` | 下拉選擇（可搜尋、虛擬滾動） | [詳情](./components/SelectV2.md) |
| `NumberCounter` | 數字加減 | [詳情](./components/NumberCounter.md) |
| `Slider` | 滑桿（單值/區間） | [詳情](./components/Slider.md) |
| `FieldLabel` | 表單共通標籤 | [詳情](./components/FieldLabel.md) |
| `IdxForm` | 表單容器 | [詳情](./components/IdxForm.md) |
| `DateV2` | 單日期選擇器 | [詳情](./components/DateV2.md) |
| `DateRangeV2` | 日期範圍選擇器 | [詳情](./components/DateRangeV2.md) |
| `TimeV2` | 純時間選擇器 | [詳情](./components/TimeV2.md) |

## 🧱 版面 / 資料 / 導覽 (Layout / Data / Nav)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `Container` | 通用容器 | [詳情](./components/Container.md) |
| `Table` | 資料表格（fixed header/columns、泛型、雙軸自訂捲軸） | [詳情](./components/Table.md) |
| `Tree` | 多階層樹 | [詳情](./components/Tree.md) |
| `Menu` | 多階層導覽選單 | [詳情](./components/Menu.md) |
| `CascadeMenu` | 側邊飛出多階層彈出選單 | [詳情](./components/CascadeMenu.md) |
| `Breadcrumb` | 麵包屑 | [詳情](./components/Breadcrumb.md) |
| `Pagination` | 分頁 | [詳情](./components/Pagination.md) |
| `Steps` | 步驟指示器 | [詳情](./components/Steps.md) |
| `Tabs` | 頁籤（滑動指示器） | [詳情](./components/Tabs.md) |
| `RippleTabs` | 漣漪頁籤 | [詳情](./components/RippleTabs.md) |
| `Timeline` | 時間軸 | [詳情](./components/Timeline.md) |
| `VirtualScroll` | 虛擬滾動 | [詳情](./components/VirtualScroll.md) |
| `Expanded` | 展開/收合區塊 | [詳情](./components/Expanded.md) |
| `Drawer` | 側邊抽屜 | [詳情](./components/Drawer.md) |

## 🪟 覆蓋層 / 捲軸 (Overlay / Scrollbar)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `BaseDialogV2` | 對話框（mask 點空白關閉） | [詳情](./components/BaseDialogV2.md) |
| `BaseBottomSheetV2` | 底部彈出面板 | [詳情](./components/BaseBottomSheetV2.md) |
| `PopupV2` | 彈出層 | [詳情](./components/PopupV2.md) |
| `Toast` | 吐司通知（玻璃淡入、8 方位） | [詳情](./components/Toast.md) |
| `OverlayScrollbar` | 附著容器的自訂 overlay 捲軸（H/V） | [詳情](./components/OverlayScrollbar.md) |
| `Scrollbar` | 包裝式自訂捲軸 | [詳情](./components/Scrollbar.md) |

## 🔄 回饋 / 進度 (Feedback / Progress)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `Loading` | 載入動畫 | [詳情](./components/Loading.md) |
| `Skeleton` | 骨架屏 | [詳情](./components/Skeleton.md) |
| `ProgressBar` | 進度條 | [詳情](./components/ProgressBar.md) |
| `ProgressCircle` | 環形進度 | [詳情](./components/ProgressCircle.md) |
| `ProgressStage` | 階段進度 | [詳情](./components/ProgressStage.md) |

## 🖼️ 媒體 / 檔案 (Media / File)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `ImageV2` | 圖片（懶載入/動畫） | [詳情](./components/ImageV2.md) |
| `RevealImage` | 圖片揭示動畫 | [詳情](./components/RevealImage.md) |
| `RevealText` | 文字揭示動畫 | [詳情](./components/RevealText.md) |
| `DropImage` | 拖曳上傳圖片 | [詳情](./components/DropImage.md) |
| `ImageDropzone` | 圖片拖曳/選擇區 | [詳情](./components/ImageDropzone.md) |
| `FileDropzone` | 檔案拖曳/選擇 | [詳情](./components/FileDropzone.md) |
| `FileChip` | 附件晶片 | [詳情](./components/FileChip.md) |
| `Carousel` | 輪播 | [詳情](./components/Carousel.md) |
| `CarouselIndicator` | 輪播指示器 | [詳情](./components/CarouselIndicator.md) |
| `RichTextEditor` | TipTap 富文本編輯器 | [詳情](./components/RichTextEditor.md) |

## 🏷️ 標籤 (Tag)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `Tag` | 標籤 | [詳情](./components/Tag.md) |
| `TagGroup` | 標籤群組 | [詳情](./components/TagGroup.md) |

## ✨ 效果 / 工具 (Effect / Util)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `RippleEffect` | 漣漪點擊效果 | [詳情](./components/RippleEffect.md) |
| `SlideTransitionGroup` | 滑動過場群組 | [詳情](./components/SlideTransitionGroup.md) |
| `Gpu` | GPU 加速動畫容器 | [詳情](./components/Gpu.md) |
| `Breakpoints` | 斷點顯示（開發用） | [詳情](./components/Breakpoints.md) |

## 🎨 主題 Provider (Theme Provider)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `ColorSchemeProvider` | 主題色彩 Provider | [詳情](./components/ColorSchemeProvider.md) |
| `CustomColorSchemeProvider` | 自訂色彩方案 Provider | [詳情](./components/CustomColorSchemeProvider.md) |
| `Material3Provider` | Material Design 3 Provider | [詳情](./components/Material3Provider.md) |

---

## 🔧 內部元件 (Internal — 實作細節)

| 元件 | 說明 | API |
| :--- | :--- | :--- |
| `Internal/Calendar` | 日曆核心（DateV2/DateRangeV2 共用） | [詳情](./components/Internal-Calendar.md) |
| `Internal/CascadeMenuPanel` | CascadeMenu 遞迴飛出面板 | [詳情](./components/Internal-CascadeMenuPanel.md) |
| `Internal/MenuItem` | Menu 遞迴項目 | [詳情](./components/Internal-MenuItem.md) |
| `Internal/TimeField` | 時/分/秒欄位 | [詳情](./components/Internal-TimeField.md) |
| `Internal/TimeRow` | 時間列 | [詳情](./components/Internal-TimeRow.md) |
| `Internal/TreeNode` | Tree 遞迴節點 | [詳情](./components/Internal-TreeNode.md) |
| `Internal/editor/ResizableImageView` | RichTextEditor 可縮放圖片 node view | [詳情](./components/Internal-editor-ResizableImageView.md) |

## 🎭 主題實作變體 (Theme Variants — 由公開元件自動選用)

| 主題 | 元件 |
| :--- | :--- |
| **Aqua** | [Button](./components/Aqua-Button.md)・[Input](./components/Aqua-Input.md)・[Switch](./components/Aqua-Switch.md)・[Checkbox](./components/Aqua-Checkbox.md)・[Radio](./components/Aqua-Radio.md) |
| **Material** | [Button](./components/Material-Button.md)・[Input](./components/Material-Input.md)・[Switch](./components/Material-Switch.md)・[Checkbox](./components/Material-Checkbox.md)・[Radio](./components/Material-Radio.md) |
| **Cupertino** | [Button](./components/Cupertino-Button.md)・[Input](./components/Cupertino-Input.md)・[Switch](./components/Cupertino-Switch.md)・[Checkbox](./components/Cupertino-Checkbox.md)・[Radio](./components/Cupertino-Radio.md) |
| **Scifi** | [Button](./components/Scifi-Button.md)・[Input](./components/Scifi-Input.md)・[Switch](./components/Scifi-Switch.md)・[Checkbox](./components/Scifi-Checkbox.md)・[Radio](./components/Scifi-Radio.md)・[Frame](./components/Scifi-Frame.md)・[Reticle](./components/Scifi-Reticle.md) |

---

[🪝 Composable 清單](./composables.md) | [🏠 Wiki](./index.md)
