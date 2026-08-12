# Tasks for 2608121652

## Phase 0 — 調查
- [x] 取得三項變更的 `path:line` 佐證
- [x] 確認既有 `prefers-reduced-motion` 慣例與色彩角色變數用法

## Phase 2 — 設計定案
- [x] Loading 造型歷經多輪預覽定案：分裂／合一循環（環繞 + 蓄力爆開）

## Phase 3 — 執行
- [x] 1. Loading.vue：aqua 分支改為分裂／合一循環（三層結構 + 兩處蓄力 + reduced-motion 降級）
- [x] 2. Table.vue：aqua 表頭改不透明底色、移除逐 cell `backdrop-blur-md`
- [x] 3. DateRangeV2.vue：deep watch 改為淺層 getter 監聽

## Phase 4 — 驗證
- [x] `pnpm lint`：三個異動檔案皆乾淨
- [x] Loading 結構：112×112 外框、4 顆球各自綁定 keyframes、公轉 3.6s、branch 3/4 具岔開動畫
- [x] Loading 可見度：球體填色為色彩角色（不透明）、無 `backdrop-filter`、濃度階序 1 → .85 → .62
- [x] Loading 關鍵格逐一比對（以 Web Animations API 設定 currentTime 取樣）：
  - 0% 與 100% 完全相同（無縫循環）；8% 兩顆 r27/s.82/o.72；26%→36% 原地蓄力至 s1.08/o.85；44%～74% 四顆 r41/s.6/o.5；84% 全部回到 r0
  - 4 顆時的臂角度為 0°/90°/180°/270°（等分圓周）；公轉 1080° 於週期末回到原點
- [x] Table 表頭：`backdrop-filter: none`、底色為不透明
- [x] DateRangeV2：選取 2026-08-03 ~ 2026-08-10 正常寫回，關閉再開啟仍保留並正確標示區間
- [x] 無新增 console error
- [ ] 截圖：預覽分頁為 hidden，瀏覽器不合成畫面亦不執行 CSS 動畫，無法於此環境截圖或錄製；動畫外觀請由使用者於正常視窗確認
