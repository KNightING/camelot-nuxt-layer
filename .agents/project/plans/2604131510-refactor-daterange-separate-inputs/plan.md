<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2604131510 - Refactor DateRangeV2 Separate Inputs
- Created: 2026-04-13 15:10
- Branch: N/A
- Completed: [Wait for Finish]

## Goals
1. Refactor the trigger display of `DateRangeV2.vue` from a single string to dual inputs.
2. Align the aesthetics with `DateV2.vue`.
3. Improve the clarity of date range selection by separating start and end dates.

## Proposed Changes
1.  **Modify `app/components/Camelot/DateRangeV2.vue`**:
    - **Logic**: 
      - Define `startDisplay` and `endDisplay` computed properties based on `model.value`.
      - Use `props.format` for default string representation.
    - **Template**:
      - Change the trigger container from `div` to `label`.
      - Implement two `<input type="text" readonly>` elements.
      - Add a separator (e.g., `~`) between the inputs.
      - Ensure `disabled` and `isError` states are correctly reflected.
2.  **Verify Styles**:
    - Ensure font size, colors, and focus states match the repository's Design System.

## Impacted Files
- [./app/components/Camelot/DateRangeV2.vue](./app/components/Camelot/DateRangeV2.vue)
