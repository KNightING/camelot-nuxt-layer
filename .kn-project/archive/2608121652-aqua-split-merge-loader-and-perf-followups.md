# 2608121652 - aqua-split-merge-loader-and-perf-followups

- Created: 2026-08-12 16:52 / Archived: 2026-08-12 18:40
- Issue: KNightING/camelot-nuxt-layer#25

## Summary

Aqua 主題的載入指示器由單圈旋轉環改為「1 顆 → 炸開為 2 → 炸開為 4 → 旋入合一 → 蓄力再爆開」的循環動畫，並收尾前一輪效能計畫（#23）明列的兩項未竟事項。動畫採三層結構讓環繞與分裂各自獨立，全程僅動 `transform` 與 `opacity`；尺寸與濃度隨分裂遞減、合併時一併還原，表達總量守恆。另移除表格表頭逐 `<th>` 的毛玻璃（每格各自成為 backdrop root 與合成層），並把 DateRangeV2 對 `[Date, Date] | null` 的 deep watch 收斂為淺層 getter 監聽。影響範圍為 Loading、Table、DateRangeV2 三個元件。

## Cross-Repo Scope

無（單一 repo）。

## Key Decisions

- Loading 造型：平面（2D）構圖，不使用 `perspective` 或 3D 旋轉；放棄原子造型，改為分裂／合一循環 — 使用者於 Phase 2 歷經多輪預覽後定案。
- 三層結構（公轉層 / 臂 / 球體）— 環繞、角度岔開、半徑推進的時間曲線各不相同，混在同一組 keyframes 會互相牽制且難以調整。
- 4 顆球固定存在於 DOM，分裂以位移／縮放／透明度演出 — 增刪節點會觸發版面重算，且無法用純 CSS keyframes 表達。
- 節奏為「長停留 × 快移動」：停留佔去大部分時間，每次轉換約 0.3s；停留與移動的時間曲線於 keyframe 內個別指定。
- 公轉每循環 3 圈（約 300°/s）— 週期拉長後若維持 2 圈，角速度會下降，與「速度要快」相牴觸。
- 合併必須讀起來像合併：外圍球途中不淡出、改為加速旋入、透明度只在完全重合的瞬間切換 — 初版在半路淡出，讀起來是「三顆消失只剩一顆」。
- 彈跳不回落，膨脹到頂點直接炸開（花火語彙）；兩處分裂前皆先蓄力，蓄力段約 0.5s 並採漸強曲線 — 使用者逐輪回饋定案，峰值放在 0%／100% 兩端使循環無縫銜接。
- 尺寸與濃度隨分裂遞減（峰值 1.5 → .82 → .6；濃度 1 → .85 → .62）— 表達同一份量被分得越細就越小也越淡。
- 球體填色走色彩角色且不使用 `backdrop-filter` — 初版沿用 `--color-surface` 的半透明填色，在深色模式下與載入遮罩幾乎同色而看不見；改為不透明角色色後毛玻璃已無作用，順帶省下一層合成。
- Table 表頭改不透明底色（Q1 選項 A）— 徹底消除 N 個合成層；aqua 的玻璃質感由容器層的 `aqua-glass` 承擔。
- Loading 外框 64 → 112px（Q3 選項 A）— 爆開幅度加大後 4 顆散開的最外緣約 49px，96px 會貼邊。

## Deviations

- 計畫 `${description}` 於 Phase 2 由 `aqua-quantum-loader-...` 改名為 `aqua-split-merge-loader-...`：造型概念在核准前更換，資料夾名即索引，必須跟著改（當時分支與 issue 皆尚未建立，無外部影響）。
- Q4 承諾的截圖未能提供：預覽分頁為 `visibilityState: hidden`，瀏覽器不合成畫面亦不執行 CSS 動畫，截圖 API 逾時。改以 Web Animations API 設定 `currentTime` 逐格取樣驗證關鍵格數值，動畫外觀由使用者於正常視窗確認。
- 執行中一度以腳本改寫 `Loading.vue` 導致整檔轉為 CRLF（`.editorconfig` 指定 `lf`），已還原為 LF 後才提交。

## Impact Files

- `app/components/Camelot/Loading.vue`（`.aqua-split` / `.aqua-split-spin` / `.aqua-split-branch` / `.aqua-split-ball` 與其 keyframes）— 取代原 `.aqua-loader` / `.aqua-loader-ring` / `.aqua-loader-core` 與 `@keyframes aqua-spin`；含 `prefers-reduced-motion` 降級（停用公轉與分裂，只留一顆靜態球）。
- `app/components/Camelot/Table.vue`（`headerCellClass` 的 `aqua` 分支）— 由 `bg-surface-container/90 ... backdrop-blur-md` 改為不透明的 `bg-surface-container`。
- `app/components/Camelot/DateRangeV2.vue`（`watch(model, ...)`）— `{ deep: true }` 改為 `watch(() => [model.value?.[0], model.value?.[1]], ...)`。

## Details

驗證數據（Commit `31786f9`）：以 Web Animations API 取樣比對關鍵格——0% 與 100% 完全相同（無縫循環）；8% 兩顆 r27／scale .82；26%→36% 原地蓄力至 scale 1.08（半徑不變）；44%–74% 四顆 r41／scale .6；84% 全部回到 r0。4 顆階段的臂角度為 0°/90°/180°/270°，公轉 1080° 於週期末回到原點。濃度階序實測 1 / .85 / .62，填色為不透明的角色色、`backdrop-filter: none`。Table 表頭實測 `backdrop-filter: none` 且底色不透明；DateRangeV2 選取 2026-08-03 ~ 2026-08-10 正常寫回，關閉再開啟仍保留並正確標示區間。三個異動檔案 lint 皆乾淨，無新增 console error。
