<!-- REMINDER: Relative Paths Only! -->
# Plan: 2607081458 - CamelotTable 新增固定高度(height) prop

- Created: 2026-07-08
- Branch: main(經使用者核准直接於 main 修改)
- Status: Awaiting Archive
- Completed: [Wait for Finish]

## Goals

讓 `CamelotTable` 支援「真正固定高度」:即使資料只有 5 筆、內容撐不滿,表格容器仍維持設定的高度(不隨內容縮小)。現有 `maxHeight` 只設上限,內容少時會縮短。

## Architecture

### `app/components/Camelot/Table.vue`

1. **新增 prop**:`height?: string`(與既有 `maxHeight?: string` 一致的基礎字串型別,如 `"480px"`)。
2. **捲動容器樣式**:目前模板為 inline `:style="maxHeight ? { maxHeight } : undefined"`。
   改抽為 `computed` `scrollStyle`,同時支援 `height` 與 `maxHeight`:
   ```ts
   const scrollStyle = computed(() => {
     const style: Record<string, string> = {}
     if (props.height) style.height = props.height
     if (props.maxHeight) style.maxHeight = props.maxHeight
     return style
   })
   ```
   - `height` 設定 → 容器固定高度(內容少時保留空白、多時內部捲動)。
   - 僅 `maxHeight` → 維持現行行為(上限,內容少則縮短),向後相容。
   - 兩者皆給 → `height` 固定、`maxHeight` 仍作上限(通常擇一使用)。
3. **虛擬滾動相容**:虛擬滾動原註明「需搭配 maxHeight 限制高度才有效益」;固定 `height` 同樣讓容器有界高度,虛擬滾動照常運作,註解一併補上 `height`。

### `.playground/app/pages/index.vue`(Table Card demo)

- 將現有 `max-height="480px"` 改為 `height="480px"`,示範固定高度(5 筆時不再縮短)。

## Impact Files

| 檔案 | 動作 |
| :--- | :--- |
| `app/components/Camelot/Table.vue` | 新增 `height` prop + `scrollStyle` computed,模板 `:style` 改用之 |
| `.playground/app/pages/index.vue` | demo 由 `max-height` 改 `height` 示範固定高度 |
| `.agents/project/wiki/features/layout-data-components.md` | 補 Table `height` prop 說明(Phase 5 歸檔時) |

## Verification

- Playground 實測:Table 容器 `clientHeight` 固定為 480px(5 筆內容也不縮短),`overflow-y: auto`;切換每頁筆數(5/10/20)高度維持不變。
- 無 console 錯誤/警告。

## Code Style

遵循 `kn:project:code-style`(通用鐵則 + Nuxt/Vue):Composition API、prop 純型別、模板邏輯抽 computed(避免 inline 三元回傳物件)、去魔法值(高度值由消費端傳入)。

## Git Completion Policy

- After user-approved commits, completion will run `git rebase main` and update the remote work branch with `git push --force-with-lease`.
- PR/archive order: Archive automatically triggered on PR request.

## References

- 相關 Wiki:`.agents/project/wiki/features/layout-data-components.md`(Table 元件)
