# Plan: 2606051505 - Implement CamelotUI Styles in Nuxt Layer
- Created: 2026-06-05 15:05
- Branch: N/A
- Completed: 2026-06-05 16:10

## Goals
Implement the CamelotUI styles (`material`, `cupertino`, `scifi`) natively inside `camelot-nuxt-layer` for core components: Button, Input, Select, Switch, and Checkbox.
Introduce `useCamelotTheme` composable to manage the active style.

## User Review Required
> [!IMPORTANT]
> - **Supported Styles**: Only `material`, `cupertino`, and `scifi` will be supported (no `softui` as requested).
> - **Theme Composable**: `useCamelotTheme` will be created using `useLocalStorage` with `{ initOnMounted: true }` to manage/persist the active theme mode.
> - **Slot Preservation**: Slots for custom HTML templates/icons/badges will be kept so that capability/headless slot functionalities remain intact.

## Proposed Changes

### Composables

#### [NEW] [useCamelotTheme.ts](../../app/composables/useCamelotTheme.ts)
A new composable to manage the active UI theme: `'material' | 'cupertino' | 'scifi'`.
It will utilize `useLocalStorage` to persist user preference.

### Components

#### [MODIFY] [Input.vue](../../app/components/Camelot/Input.vue)
Refactor/update to support `material`, `cupertino`, and `scifi` themes based on the active style from `useCamelotTheme`.

#### [MODIFY] [Select.vue](../../app/components/Camelot/Select.vue)
Refactor/update to support `material`, `cupertino`, and `scifi` themes based on the active style from `useCamelotTheme`.

#### [MODIFY] [SelectV2.vue](../../app/components/Camelot/SelectV2.vue)
Refactor/update to support `material`, `cupertino`, and `scifi` themes based on the active style from `useCamelotTheme`.

#### [NEW] [Button.vue](../../app/components/Camelot/Button.vue)
Introduce a native button component inside Nuxt layer that supports `material`, `cupertino`, and `scifi` styles, matching CamelotUI button designs.

#### [NEW] [Switch.vue](../../app/components/Camelot/Switch.vue)
Introduce a native switch component inside Nuxt layer that supports `material`, `cupertino`, and `scifi` styles.

#### [NEW] [Checkbox.vue](../../app/components/Camelot/Checkbox.vue)
Introduce a native checkbox component inside Nuxt layer that supports `material`, `cupertino`, and `scifi` styles.

#### [MOVE] [ScifiFrame.vue](../../app/components/Camelot/Scifi/Frame.vue)
Move `ScifiFrame.vue` to `Scifi/Frame.vue`.

#### [MOVE] [ScifiReticle.vue](../../app/components/Camelot/Scifi/Reticle.vue)
Move `ScifiReticle.vue` to `Scifi/Reticle.vue`.

#### [DELETE] V1 Components
- `BaseBottomSheet.vue`
- `BaseDialog.vue`
- `Date.vue`
- `DateRange.vue`
- `Image.vue`
- `Popup.vue`
- `Select.vue`
- `Material/Select.vue`
- `Cupertino/Select.vue`
- `Scifi/Select.vue`

## Verification Plan

### Manual Verification
- Deploy to a playground page and test each style (`material`, `cupertino`, `scifi`) for all 5 basic components.
- Check slots to verify external template replacement capability works properly.
- Verify that index layout and scrolling are not blocked by the fixed Header.

## Completed Tasks
- [x] 1. 建立 `useCamelotTheme` Composable，支援 `material`, `cupertino`, `scifi` 風格
- [x] 2. 實作/移植 Button 元件 (支援 `material`, `cupertino`, `scifi` 風格)
- [x] 3. 實作/移植 Switch 元件 (支援 `material`, `cupertino`, `scifi` 風格)
- [x] 4. 實作/移植 Checkbox 元件 (支援 `material`, `cupertino`, `scifi` 風格)
- [x] 5. 重構/修改 Input.vue 元件 (支援 `material`, `cupertino`, `scifi` 風格)
- [x] 6. 重構/修改 Select.vue & SelectV2.vue 元件 (支援 `material`, `cupertino`, `scifi` 風格)
- [x] 7. 於 playground 頁面進行手動測試與驗證
- [x] 8. 重構元件結構：將 Button, Switch, Checkbox, Input, Select 拆分至 Material/, Cupertino/, Scifi/ 子目錄
- [x] 9. 修正 index.vue 遮擋問題，使切換 UI 位於 Header 下方
- [x] 10. 徹底解決 playground 展示區被 Header 遮擋的問題 (調整 padding / layout)
- [x] 11. 將 ScifiFrame.vue 與 ScifiReticle.vue 移動至 Scifi/ 子目錄下，分別命名為 Frame.vue 與 Reticle.vue
- [x] 12. 移除所有有 V2 版本的 V1 元件 (BaseBottomSheet, BaseDialog, Date, DateRange, Image, Popup, Select)
- [x] 13. 更新 Playground (index.vue, dialog.vue 等) 中所有對已刪除 V1 元件的引用，使其全部改用 V2 元件
- [x] 14. 移除 Material/Select.vue, Cupertino/Select.vue, Scifi/Select.vue，因為 Select 已完全由 SelectV2 代替
