# Plan: 2606051746 - Implement Cyber Style (Modern Tech-Heavy Cyberpunk Theme)

- Created: 2026-06-05 17:46
- Branch: N/A
- Completed: 2026-06-05 18:05

## Goals
Implement a fourth style theme (`cyber`) across all basic and advanced components to provide a modern, heavy-tech cyberpunk theme.
The `cyber` style will feature:
- Neon accents (glitch hot-pink, cyan, neon-green glows).
- Double borders, grid backgrounds, dot-matrix overlays, cybernetic scanlines.
- Angled cuts, data telemetry indicators, and digital bracket elements.

## User Review Required
> [!IMPORTANT]
> - **Theme Mode Expansion**: `CamelotThemeMode` will be expanded to `'material' | 'cupertino' | 'scifi' | 'cyber'`.
> - **Rich Aesthetics**: Components will feature micro-animations, glowing neon shadows, and futuristic tech telemetry elements to maximize visual wow-factor.

## Proposed Changes

### Composables

#### [MODIFY] [useCamelotTheme.ts](../../app/composables/useCamelotTheme.ts)
Extend `CamelotThemeMode` to include `'cyber'`.

### Components - Basic

#### [MODIFY] [Button.vue](../../app/components/Camelot/Button.vue)
Add conditional rendering for the Cyber button component.

#### [NEW] [Cyber/Button.vue](../../app/components/Camelot/Cyber/Button.vue)
A cyber button component featuring a digital bracket outline, glowing neon border, and cyber matrix background.

#### [MODIFY] [Switch.vue](../../app/components/Camelot/Switch.vue)
Add conditional rendering for the Cyber switch.

#### [NEW] [Cyber/Switch.vue](../../app/components/Camelot/Cyber/Switch.vue)
A cyber switch with neon track slider and binary indicator text (`[I]` / `[O]`).

#### [MODIFY] [Checkbox.vue](../../app/components/Camelot/Checkbox.vue)
Add conditional rendering for the Cyber checkbox.

#### [NEW] [Cyber/Checkbox.vue](../../app/components/Camelot/Cyber/Checkbox.vue)
A cyber checkbox using futuristic target brackets and a neon cross `[X]` checkmark.

#### [MODIFY] [Input.vue](../../app/components/Camelot/Input.vue)
Add conditional rendering for Cyber input field styling.

#### [NEW] [Cyber/Input.vue](../../app/components/Camelot/Cyber/Input.vue)
A cyber input with technical telemetry brackets, glowing border, and blinking tech caret.

#### [MODIFY] [SelectV2.vue](../../app/components/Camelot/SelectV2.vue)
Add cyber-style select trigger styling and dropdown container/option list layout.

### Components - Advanced

#### [MODIFY] [BaseDialogV2.vue](../../app/components/Camelot/BaseDialogV2.vue)
Inject glowing neon borders, glitch overlays, and data-grid backgrounds for Cyber dialogs.

#### [MODIFY] [BaseBottomSheetV2.vue](../../app/components/Camelot/BaseBottomSheetV2.vue)
Inject mechanical slides, grid overlays, and cyber neon container layouts.

#### [MODIFY] [Tabs.vue](../../app/components/Camelot/Tabs.vue)
Add tech matrix grid tabs, with selected tab having neon border glow and dot markers.

#### [MODIFY] [Steps.vue](../../app/components/Camelot/Steps.vue)
Add cyber step nodes using telemetry styling (`01`, `02`, `03`) and grid connectors.

#### [MODIFY] [Skeleton.vue](../../app/components/Camelot/Skeleton.vue)
Introduce cyber skeleton animations featuring dot-matrix sweepers.

#### [MODIFY] [Loading.vue](../../app/components/Camelot/Loading.vue)
Add a cyber radar scanner/neon data ring rotating animation.

#### [MODIFY] [Toast.vue](../../app/components/Camelot/Toast.vue)
Add neon alert decks with alert headers and warning corner indicators.

### Demo

#### [MODIFY] [index.vue](../../.playground/app/pages/index.vue)
Add `cyber` selection into the theme switcher and demonstrate all cyber styled components on the playground page.

## Verification Plan

### Automated Tests
- Run `pnpm run build` to verify standard Nuxt/TS compiling works without errors.

### Manual Verification
- Check all 12 basic & advanced components in the playground using the `'cyber'` theme.
- Confirm glowing colors respond properly to theme variable changes.

## Completed Tasks
- [x] 1. Extend `useCamelotTheme.ts` to include `'cyber'` theme mode.
- [x] 2. Implement core Cyber sub-components: `Cyber/Button.vue`, `Cyber/Switch.vue`, `Cyber/Checkbox.vue`, `Cyber/Input.vue`.
- [x] 3. Integrate Cyber sub-components into basic wrappers (`Button.vue`, `Switch.vue`, `Checkbox.vue`, `Input.vue`).
- [x] 4. Add Cyber styles to `SelectV2.vue` trigger and option lists.
- [x] 5. Implement Cyber styles in advanced wrappers: `BaseDialogV2.vue`, `BaseBottomSheetV2.vue`, `Tabs.vue`, `Steps.vue`.
- [x] 6. Implement Cyber styles in feedback wrappers: `Skeleton.vue`, `Loading.vue`, `Toast.vue`.
- [x] 7. Update playground `index.vue` to include `'cyber'` in theme selector and demonstrate cyber components.
- [x] 8. Verify compilation and visual aesthetics.
