# Tasks for 2606101554
- [x] 分析 ImageDropzone 結構
- [x] FileDropzone.vue（drop 區 + chip 列 + 副檔名分類 icon/色）
- [x] slots（default/icon/chip）與 v-model/select
- [x] 主題圓角 scoped CSS
- [x] Playground 展示卡
- [x] Preview 驗證（CSV 綠 / PDF 紅 / PNG 縮圖 / 未知灰 + 副檔名標籤大寫 + 移除鈕、計數同步）

## Iteration 2（Headless 化）
- [x] chip 加檔案大小（`CSV · 532 B` 格式）
- [x] useCamelotFileDrop composable（共用核心 + camelotFileMeta / camelotFormatFileSize 匯出）
- [x] CamelotFileChip 獨立公開元件（自帶主題圓角、#default slot、removable）
- [x] FileDropzone / ImageDropzone 重構為消費 composable（對外行為不變）
- [x] Playground headless 示範（自定義拖曳區 + 圖片 grid 縮圖重現 + FileChip 混排）
- [x] Preview 驗證（headless drop/移除、FileDropzone 與 ImageDropzone grid 回歸、eslint 通過）
