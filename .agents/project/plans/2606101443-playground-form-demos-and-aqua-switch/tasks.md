# Tasks for 2606101443
- [x] 分析現有 playground 卡片結構與 Aqua Switch / Checkbox 尺寸
- [x] Aqua Switch 縮小尺寸（22×40，thumb 18）
- [x] Switch wrapper 新增 label prop（含點擊切換、disabled 樣式）
- [x] Playground：拆分 Input/Textarea 與 Select 卡片
- [x] Playground：補 Input / Textarea / Select disabled 展示
- [x] Playground：Switch 展示加 label
- [x] Preview 驗證（aqua 主題：尺寸 40×22 vs Checkbox 20×20、label 點擊切換、disabled 狀態渲染）

## Iteration 2
- [x] Material / Cupertino Switch 縮小至 40×22；Scifi 縮小至 48×22
- [x] Checkbox 打勾放大（Aqua/Material 10×6、Cupertino 8×12）
- [x] 新增公開元件 CamelotFieldLabel（依主題自動樣式）
- [x] Input / Textarea / SelectV2 / Switch / Checkbox 統一 `#label` slot（slot props 帶 label）+ FieldLabel fallback
- [x] Checkbox label 從 4 個主題 variant 移除，改由 wrapper 統一處理
- [x] NumberCounter 四主題風格 + color/disabled/label props + absStep 覆寫 bug 修復
- [x] Playground：NumberCounter 展示（label / disabled）、自定義 #label slot 範例
- [x] Preview 驗證（四主題 Switch 尺寸、打勾、counter 主題樣式、custom label slot）

## Iteration 3（Bug 修正）
- [x] SelectV2：disabled 傳入 PopupV2（無法展開）+ 樣式改 opacity-50（與 Input 一致）
- [x] TreeNode：checkable 時點整行空白切換勾選
- [x] TimeField：下拉 Teleport + fixed 定位脫離 overflow-hidden、color var 帶入、上下空間自動判向
- [x] Preview 驗證（disabled select 不可開、一般 select 正常、tree 整行點擊、time 下拉 teleport 與顏色）
