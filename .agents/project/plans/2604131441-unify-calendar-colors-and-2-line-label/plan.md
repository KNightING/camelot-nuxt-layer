<!-- REMINDER: Relative Paths Only! No file:///c:/... -->
# Plan: 2604131441 - Unify Colors and 2-Line Label
- Created: 2026-04-13 14:41
- Branch: N/A
- Completed: [Wait for Finish]

## Goals
1. Unify day cell color control at the parent container level.
2. Support multiline (up to 2 lines) labels for each day.
3. Optimize the layout to handle potential multi-line wrapping.

## Proposed Changes
1.  **Modify `app/components/Camelot/Internal/Calendar.vue`**:
    - **Logic**: In `calendarDays.computed`, calculate `dayColorClass` based on day state (Selected, Today, Holiday, Month).
    - **Template**:
      - Apply `dayColorClass` to the day wrapper `div`.
      - Increase day wrapper height to `h-[52px]` to handle two label lines.
      - Refactor the date `span` and label `span` to inherit text color.
      - Update label `span` with `line-clamp-2`, `break-all`, and tight line-height.
2.  **Update `.playground/app/pages/index.vue`**:
    - Modify the `getDayAttributes` example to include a multi-line label for demonstration purposes.

## Impacted Files
- [./app/components/Camelot/Internal/Calendar.vue](./app/components/Camelot/Internal/Calendar.vue)
- [./.playground/app/pages/index.vue](./.playground/app/pages/index.vue)
