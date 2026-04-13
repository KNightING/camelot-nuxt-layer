<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2604131437 - Fix Calendar Type Errors
- Created: 2026-04-13 14:37
- Branch: N/A
- Completed: [Wait for Finish]

## Goals
1. Resolve TypeScript errors in `DateV2` and `DateRangeV2` components.
2. Synchronize callback types with the updated `Internal/Calendar.vue` model definitions.
3. Ensure robust null/undefined handling in selectors.

## Proposed Changes
1.  **Modify `app/components/Camelot/DateV2.vue`**:
    - Update `onDateSelect` to accept `Date | number | null | undefined`.
    - Add guard clause.
2.  **Modify `app/components/Camelot/DateRangeV2.vue`**:
    - Update `onRangeSelect` to accept `(Date | number | null)[] | null | undefined`.
    - Handle conversion to `[Date | null, Date | null]` safely.

## Impacted Files
- [./app/components/Camelot/DateV2.vue](./app/components/Camelot/DateV2.vue)
- [./app/components/Camelot/DateRangeV2.vue](./app/components/Camelot/DateRangeV2.vue)
