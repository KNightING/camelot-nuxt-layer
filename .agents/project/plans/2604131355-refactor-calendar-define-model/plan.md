<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2604131355 - Refactor Calendar defineModel & Consolidated Holiday Support
- Created: 2026-04-13 13:55
- Iterated: 2026-04-13 14:11
- Branch: N/A
- Completed: [Wait for Finish]

## Goals
1. Refactor `Calendar.vue` to use `defineModel`.
2. Implement weekend (Sat/Sun) red text by default.
3. Add `getDayContent` prop (consolidated callback for `isHoliday` and `label`).

## Proposed Changes
1.  **Modify `app/components/Camelot/Internal/Calendar.vue`**:
    - **Models**: Use `defineModel` for `modelValue`, `rangeValue`, `viewDate`.
    - **Props**: Add `getDayContent` callback.
    - **Logic**:
      - Consolidation of `isHoliday` and `getDateLabel` results into one object returned by `getDayContent`.
    - **Template**:
      - (Same as previous iteration)

## Impacted Files
- [./app/components/Camelot/Internal/Calendar.vue](./app/components/Camelot/Internal/Calendar.vue)
