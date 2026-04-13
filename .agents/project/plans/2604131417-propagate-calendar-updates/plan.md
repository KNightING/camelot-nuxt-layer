<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2604131417 - Propagate Calendar Updates
- Created: 2026-04-13 14:17
- Branch: N/A
- Completed: [Wait for Finish]

## Goals
1. Expose `getDayAttributes` in `DateV2` and `DateRangeV2`.
2. Modernize bindings between these components and `Internal/Calendar.vue`.
3. Demonstrate "Today" label in the playground.

## Proposed Changes
1.  **Modify `app/components/Camelot/DateV2.vue`**:
    - Add `getDayAttributes` prop.
    - Pass down to `Calendar`.
    - Update `v-model` and `viewDate` bindings.
2.  **Modify `app/components/Camelot/DateRangeV2.vue`**:
    - Add `getDayAttributes` prop.
    - Pass down to `Calendar`.
    - Update `v-model:range-value` and `v-model:view-date` bindings.
3.  **Modify `.playground/app/pages/index.vue`**:
    - Implement `isToday` check using `date-fns` (it is available in the project).
    - Add `getDayAttributes` function to return `{ label: '今天' }` for today.
    - Apply to `CamelotDateV2` and `CamelotDateRangeV2`.

## Impacted Files
- [./app/components/Camelot/DateV2.vue](./app/components/Camelot/DateV2.vue)
- [./app/components/Camelot/DateRangeV2.vue](./app/components/Camelot/DateRangeV2.vue)
- [./.playground/app/pages/index.vue](./.playground/app/pages/index.vue)
