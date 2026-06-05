# Plan: 2606051505 - Implement CamelotUI Styles in Nuxt Layer

- Created: 2026-06-05 15:05
- Branch: N/A
- Completed: [Wait for Finish]

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

#### [NEW] [useCamelotTheme.ts](../../../app/composables/useCamelotTheme.ts)
A new composable to manage the active UI theme: `'material' | 'cupertino' | 'scifi'`.
It will utilize `useLocalStorage` to persist user preference.

### Components

#### [MODIFY] [Input.vue](../../../app/components/Camelot/Input.vue)
Refactor/update to support `material`, `cupertino`, and `scifi` themes based on the active style from `useCamelotTheme`.

#### [MODIFY] [Select.vue](../../../app/components/Camelot/Select.vue)
Refactor/update to support `material`, `cupertino`, and `scifi` themes based on the active style from `useCamelotTheme`.

#### [MODIFY] [SelectV2.vue](../../../app/components/Camelot/SelectV2.vue)
Refactor/update to support `material`, `cupertino`, and `scifi` themes based on the active style from `useCamelotTheme`.

#### [NEW] [Button.vue](../../../app/components/Camelot/Button.vue)
Introduce a native button component inside Nuxt layer that supports `material`, `cupertino`, and `scifi` styles, matching CamelotUI button designs.

#### [NEW] [Switch.vue](../../../app/components/Camelot/Switch.vue)
Introduce a native switch component inside Nuxt layer that supports `material`, `cupertino`, and `scifi` styles.

#### [NEW] [Checkbox.vue](../../../app/components/Camelot/Checkbox.vue)
Introduce a native checkbox component inside Nuxt layer that supports `material`, `cupertino`, and `scifi` styles.

#### [MOVE] [ScifiFrame.vue](../../../app/components/Camelot/Scifi/Frame.vue)
Move `ScifiFrame.vue` to `Scifi/Frame.vue`.

#### [MOVE] [ScifiReticle.vue](../../../app/components/Camelot/Scifi/Reticle.vue)
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

