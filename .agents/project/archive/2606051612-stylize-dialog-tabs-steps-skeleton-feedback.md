# Plan: 2606051612 - Stylize Dialogs, Tabs, Steps, Skeletons, and Feedback Components
- Created: 2026-06-05 16:12
- Branch: N/A
- Completed: 2026-06-05 17:36

## Goals
Implement the style system (`material`, `cupertino`, `scifi`) natively for the following advanced elements:
1. **BaseDialogV2** & **BaseBottomSheetV2**: Theme-appropriate wraps for custom dialog/sheet templates.
2. **Tabs**: Expose dynamic styles (segmented caps for iOS, line under sliders for Material, and block clips for Sci-Fi).
3. **Steps**: Stylize progress steps.
4. **Skeleton**: Skeleton loader layout animations.
5. **Toast** & **Loading**: Theme-appropriate spinners and notifications.

## User Review Required
> [!IMPORTANT]
> - **Global Theme Integration**: All components will retrieve the current active style theme dynamically via `useCamelotTheme().themeMode.value`.
> - **Unified Components Pattern**: We will keep the main components (e.g. `BaseDialogV2.vue`, `Tabs.vue`, `Steps.vue`, `Skeleton.vue`, `Toast.vue`, `Loading.vue`) as unified interfaces that delegate their layout and styling to `Material/`, `Cupertino/`, and `Scifi/` sub-directories, matching the core controls structure.

## Proposed Changes

### Components - Dialog & BottomSheet
#### [MODIFY] [BaseDialogV2.vue](../../app/components/Camelot/BaseDialogV2.vue)
Update to render container wrapping based on active style.

#### [MODIFY] [BaseBottomSheetV2.vue](../../app/components/Camelot/BaseBottomSheetV2.vue)
Update to support slide-up sheets (Cupertino), side/bottom slots (Material), and HUD data plates (Sci-Fi).

### Components - Navigation
#### [MODIFY] [Tabs.vue](../../app/components/Camelot/Tabs.vue)
Integrate style-specific layouts (M3 slider tabs, Cupertino segmented controls, Sci-Fi glitch HUD bars).

#### [MODIFY] [Steps.vue](../../app/components/Camelot/Steps.vue)
Support style-specific steps markers and progress lines.

### Components - Feedback & Loading
#### [MODIFY] [Skeleton.vue](../../app/components/Camelot/Skeleton.vue)
Render styles for skeleton block loading effects.

#### [MODIFY] [Loading.vue](../../app/components/Camelot/Loading.vue)
Add Material circular spinner, Cupertino spinner (iOS native look), and Sci-Fi radar scanning layout.

#### [MODIFY] [Toast.vue](../../app/components/Camelot/Toast.vue)
Expose styled toast notification bars.

### Playground
#### [MODIFY] [index.vue](../../.playground/app/pages/index.vue)
Add demo showcases for Dialogs, BottomSheets, Tabs, Steps, Skeletons, and Toast/Loading components under each style theme.

## Verification Plan

### Manual Verification
- Deploy the playground index page.
- Select different styles (`material`, `cupertino`, `scifi`) and verify that all 6 advanced components update layout and styles dynamically.
- Confirm compilation succeeds with zero Vite/TS warnings.

## Completed Tasks
- [x] 1. 實作 BaseDialogV2 元件的風格化 (Material 圓角、Cupertino 經典 Alert 彈出框、Scifi 邊框 HUD 卡片)
- [x] 2. 實作 BaseBottomSheetV2 元件的風格化 (Cupertino 底部滑出、Material 側邊/底部 Sheet、Scifi HUD 控制面板)
- [x] 3. 實作 Tabs 元件的風格化 (Material 下劃線、Cupertino 膠囊分段、Scifi 斜切高亮)
- [x] 4. 實作 Steps 元件的風格化 (Material 圓圈進度、Cupertino 線條進度、Scifi 括號節點)
- [x] 5. 實作 Skeleton 元件的風格化 (Material 卡片閃爍、Cupertino 經典條狀、Scifi 網格綠色雷達)
- [x] 6. 實作 Loading 與 Toast 元件的風格化 (載入與吐司提示風格化)
- [x] 7. 更新 playground index.vue 以展示這 5 組新風格元件的效果
- [x] 8. 專案編譯測試與手動調校
