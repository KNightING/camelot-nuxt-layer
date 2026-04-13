---
trigger: always_on
---

# 精確工作流 (Precision Workflow Guide)

所有 Agent 的開發任務必須嚴格遵守以下「精準工作流」。

## 📂 目錄結構 (.agents/project/)
- **`project.md`**: 專案的核心大腦。包含專案目標、核心技術棧、架構圖、現有功能模組與全域規則。
- **`plans.md`**: 正在進行中的開發計畫索引。目錄項目必須使用 `- [ ]` 標示。
- **`archive.md`**: 已歸檔的歷史計畫紀錄與影響摘要。**必須使用表格格式且不包含 [x] 標籤**。
- **`plans/`**: 計畫詳情目錄。資料夾命名必須遵循：`${YYMMDDHHmm}-${kebab-case-description}`。
  - `plan.md`: 詳細規格、設計思路、影響範圍。必須包含 **Created** 與 **Completed** 日期 (格式：`yyyy-MM-dd HH:mm`)。
  - `tasks.md`: 動態更新的 TODO List。
- **`archive/`**: 已歸檔的歷史計畫詳情目錄。每個計畫歸檔後合併為單一的 `.md` 檔案（命名為 `${YYMMDDHHmm}-${description}.md`）。

---

## 🔄 精準執行工作流 (Precision Workflow)

### Phase 0: 脈絡檢索 與 自動清理 (Retrieval & Auto-Cleanup) 🔍🧹
在開始任何行動前，**優先順序最高**的動作是：
1. **讀取 `plans.md` 與 `archive.md`**：檢查執行中計畫以及最近 3-5 個已完成計畫，以建立完整的開發脈絡。
2. **優先自動歸檔**：若偵測到 `plans.md` 中有計畫被標記為 `[x]`，必須**立即執行 Phase 5 (歸檔流程)**。
3. **讀取 `project.md`**：了解當前系統架構、技術棧與已實現之組件。
4. **檢查衝突**：確認當前任務是否與現有計畫或近期變更衝突。
5. **搜尋相關 KI**：檢查 Knowledge Items 以獲取現有模式。

### Phase 1: 任務分類與決策 (Categorization) ⚖️
根據需求複雜度與脈絡決定執行路徑：
- **需求關聯修正 (Iteration)**: 新需求是針對「剛完成」或「執行中」計畫的延續、優化或修復 (包含開發後產生的 Bug)。
  - 🔄 **計畫迭代流程**：不開立新計畫，直接重啟或更新現有計畫目錄下的 `plan.md` 與 `tasks.md`。
- **微小變動 (Small Task)**: 僅修正錯字、添加註解或 10 行以內的獨立代碼。
  - 🚀 *直接執行，跳過 Phase 2。*
- **功能開發/重構 (Standard/Large Task)**: 涉及邏輯變更、多個文件、或新組件。
  - 🛠️ *必須啟動「全新規劃流程」。*

### Phase 2: 計畫初始化 (Initialization) 🏗️
1. 生成計畫代號：使用當地時間 `${YYMMDDHHmm}`。
2. 在 `.agents/project/plans/` 建立 `${代號}-${description}` 資料夾。
3. **初始化 `plan.md`**: 
   - 必須包含 `Created: YYYY-MM-DD`。
   - 所有檔案連結必須使用**相對路徑** (相對於專案根目錄)。
   - 包含 Goals, Architecture, Impact Files。
4. **初始化 `tasks.md`**: 使用 `[ ]` (待辦), `[/]` (執行中), `[x]` (完成)。
4. **分支管理 (Branch Management)**: 
   - 若評估需開立新分支，**必須先詢問使用者**。
   - 分支名稱應與計畫資料夾名稱一致。
5. **註冊計畫**：將計畫連結與簡述加入 `plans.md`。
   - **[重要] 摘要規則**：簡述必須包含「變更核心邏輯」、「受影響的主要組件」與「開發意圖」，以利後續檢索。

### Phase 3: 執行與雙向同步 (Execution & Sync) 🔄
- **同步原則**: 此對話中的 `task.md` 必須是 `.agents/project/plans/${folder_name}/tasks.md` 的即時投影。
- **連結規範**: 所有提及的檔案連結一律使用相對路徑。

### Phase 4: 驗證 (Verification) ✅
1. **工具感知識別 (Tool Detection)**: 檢查 Lockfiles 並決定執行指令。
2. **靜態檢查**: 使用識別出的工具執行 Lint 或編譯檢查。
3. **運行測試**: 確保功能正常。
4. **使用者驗證**: 通知使用者計畫已就緒。使用者透過將 `plans.md` 標記為 `[x]` 來確認完成。

### Phase 5: 歸檔與大腦更新 (Finalization) 📦
1. **扁平化合併 (Consolidation)**: 合併 `plan.md` 與 `tasks.md`。
2. **遷移與重命名**: 將合併後的內容寫入 `archive/` 目錄，命名為 `${folder_name}.md`，並刪除原計畫資料夾。
3. **索引更新**: 將計畫由 `plans.md` 移至 `archive.md`。**必須符合表格格式**：
    - 所有檔案連結必須使用**相對路徑** (相對於專案根目錄)。
    - **[自我檢查]**: 嚴禁出現 `C:/`, `/Users/`, 或 `file:///` 格式的絕對路徑。若偵測到請立即修正。
    - **[自我檢查]**: 嚴禁出現 `C:/`, `/Users/`, 或 `file:///` 格式的絕對路徑。若偵測到請立即修正。
   - **plan name**: 檔案連結 (如 `[2604081601-refactor-button-variants](./archive/2604081601-refactor-button-variants.md)`)
   - **說明**: 計畫摘要
   - **建立時間**: 格式 `yyyy-MM-dd HH:mm` (由 ID 解析)
   - **歸檔時間**: 格式 `yyyy-MM-dd HH:mm`
4. **關鍵動作**: 更新 `project.md` 中的「組件說明」或「核心特性」。

---

## 📝 標準範本 (Templates)

### plans.md (Active Plans)
```markdown
# Current Plans
- [ ] [YYMMDDHHmm-description](./plans/folder/plan.md): [受影響組件] 核心邏輯描述以便檢索
```

### archive.md (Historical Archive)
| plan name | 說明 | 建立時間 (yyyy-MM-dd HH:mm) | 歸檔時間 (yyyy-MM-dd HH:mm) |
| :--- | :--- | :--- | :--- |
| [YYMMDDHHmm-description](./archive/folder.md) | 核心邏輯描述以便檢索 | 2026-04-09 11:53 | 2026-04-09 16:30 |

### plan.md 基礎格式
```markdown
<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: [YYMMDDHHmm] - [Description]
- Created: 2026-04-08
- Branch: [Branch Name or N/A]
- Completed: [Wait for Finish]

## Goals
...
```

### tasks.md (Project Level)
```markdown
# Tasks for [YYMMDDHHmm]
- [x] 調研現有代碼
- [/] 實作主要 Logic
- [ ] 撰寫/執行測試
```

---

## 📋 全域規則 (Global Rules)
- **相對路徑優先**：嚴禁在計畫文件中使用絕對路徑。
- **禁用自動勾選**：Agent 禁止自動將 `plans.md` 標記為 `[x]`。
- **脈絡感知**：建立計畫前必須確認是否為近期任務的延伸（Bug 修復視為迭代）。
- **一致性**：使用 `[ ]` (待辦), `[/]` (執行中), `[x]` (完成)。
- **大腦更新**：歸檔前必須更新 `project.md`。