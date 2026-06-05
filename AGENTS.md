# AI Agents 治理與協作指南 (AGENTS.md)

這個資料夾 `.agents` 用於存放由 AI Agents 產生的開發文件，協助追蹤專案進度、設計決策與技術規格。

## 強制技能調度：kn:project:precision-workflow-manager

本專案將 **`kn:project:precision-workflow-manager`** 設為核心治理技能。Agent 在執行任何非瑣碎任務時，**必須優先啟動此技能**以進行精準工作流 (Phase 0-5) 管理。純錯字、純註解、純格式或同等低風險且少於 10 行的孤立變更，可依技能定義的 Small Task 路徑直接處理。

### 1. 技能啟動條件 (Skill Activation)
當 Agent 接收到包含以下指令或意圖時，**必須主動讀取並調用** `kn:project:precision-workflow-manager`：
- **關鍵行為**：`build`, `create`, `modify`, `fix`, `add`, `implement`, `refactor`, `setup`, `optimize`, `change`, `rework`, `debug`.
- **檔案變更**：涉及 `.vue`, `.ts`, `.js`, `.py`, `.rs`, `.go` 等邏輯檔案，或 `.agents/` 目錄下的文件。

### 2. 治理審核閘口 (Governance Gates)
啟動技能後，Agent 必須遵循技能規範中的審核點：
- **Phase 2 鎖定**：擺脫計畫後，Agent **必須停止**並請求使用者核准任務清單，嚴禁跳過。
- **Phase 5 結案**：任務完成後，Agent **必須請求**歸檔許可，未經同意不得自行清理計畫。

---

## 📂 目錄結構

- `project/`: 專案核心文件。
  - `project.md`: 專案入口 (Portal)，提供 Wiki 快速導覽。
  - `governance.md`: 專案治理與 Git 操作規範。
  - `wiki/`: 專案百科 (Graph 關聯系統)，收錄架構、技術棧與功能細節。
  - `plans.md`: 當前執行中的計畫索引。
  - `archive.md`: 已完成計畫的歷史紀錄。
  - `plans/`: 存放各個開發計畫的細節（`plan.md`, `tasks.md`）。
  - `archive/`: 存放已歸檔的計畫文件。

---
[📈 專案入口](./.agents/project/project.md) | [⚖️ 治理規範](./.agents/project/governance.md)
