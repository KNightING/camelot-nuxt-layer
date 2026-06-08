<template>
  <div
    class="relative w-full overflow-hidden"
    :class="containerClass"
  >
    <div
      class="w-full overflow-auto"
      :style="maxHeight ? { maxHeight } : undefined"
    >
      <table class="w-full min-w-max border-separate border-spacing-0 text-sm text-on-surface">
        <colgroup>
          <col
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? { width: col.width } : undefined"
          >
        </colgroup>

        <thead>
          <tr ref="headRowRef">
            <th
              v-for="col in columns"
              :key="col.key"
              class="border-b border-outline-variant px-4 py-2.5 font-medium whitespace-nowrap"
              :class="[headerCellClass, alignClass(col), fixedShadowClass(col)]"
              :style="headCellStyle(col)"
            >
              <slot
                :name="`head-${col.key}`"
                :column="col"
              >
                {{ col.title }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Pinned rows (固定置頂列) -->
          <tr
            v-for="(row, rowIndex) in pinnedTopRows"
            :key="`pinned-${getRowKey(row, rowIndex)}`"
            class="group"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="border-b border-outline-variant px-4 py-2.5 whitespace-nowrap"
              :class="[pinnedRowClass, alignClass(col), fixedShadowClass(col)]"
              :style="pinnedCellStyle(col)"
            >
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :column="col"
                :value="cellValue(row, col)"
                :row-index="rowIndex"
                :pinned="true"
              >
                {{ cellValue(row, col) }}
              </slot>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            class="group"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="border-b border-outline-variant px-4 py-2.5 whitespace-nowrap transition-colors"
              :class="[rowBgClass(rowIndex), hoverClass, alignClass(col), fixedShadowClass(col)]"
              :style="bodyCellStyle(col)"
            >
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :column="col"
                :value="cellValue(row, col)"
                :row-index="rowIndex"
                :pinned="false"
              >
                {{ cellValue(row, col) }}
              </slot>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="data.length === 0 && pinnedTopRows.length === 0">
            <td
              :colspan="columns.length"
              class="px-4 py-10 text-center text-on-surface-variant"
            >
              <slot name="empty">
                無資料
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    columns: CamelotTableColumn<T>[]
    data: T[]
    rowKey?: string | ((row: T) => string | number)
    stripe?: boolean
    hover?: boolean
    maxHeight?: string
    pinnedTopRows?: T[]
  }>(),
  {
    stripe: false,
    hover: true,
    pinnedTopRows: () => [],
  },
)

const { themeMode } = useCamelotTheme()

const headRowRef = useTemplateRef<HTMLElement>('headRowRef')
const { height: headerHeight } = useElementBounding(headRowRef)

const leftFixed = computed(() => props.columns.filter(c => c.fixed === 'left'))
const rightFixed = computed(() => props.columns.filter(c => c.fixed === 'right'))

const parseWidth = (w?: string) => {
  const n = Number.parseInt(w ?? '', 10)
  return Number.isFinite(n) ? n : 120
}

const leftOffset = (col: CamelotTableColumn<T>) => {
  let offset = 0
  for (const c of leftFixed.value) {
    if (c.key === col.key) break
    offset += parseWidth(c.width)
  }
  return offset
}

const rightOffset = (col: CamelotTableColumn<T>) => {
  let offset = 0
  for (const c of [...rightFixed.value].reverse()) {
    if (c.key === col.key) break
    offset += parseWidth(c.width)
  }
  return offset
}

const isLastLeftFixed = (col: CamelotTableColumn<T>) =>
  leftFixed.value.length > 0 && leftFixed.value[leftFixed.value.length - 1]?.key === col.key

const isFirstRightFixed = (col: CamelotTableColumn<T>) =>
  rightFixed.value.length > 0 && rightFixed.value[0]?.key === col.key

const stickyXStyle = (col: CamelotTableColumn<T>) => {
  if (col.fixed === 'left') return {
    position: 'sticky' as const,
    left: `${leftOffset(col)}px`,
  }
  if (col.fixed === 'right') return {
    position: 'sticky' as const,
    right: `${rightOffset(col)}px`,
  }
  return {}
}

const headCellStyle = (col: CamelotTableColumn<T>) => ({
  position: 'sticky' as const,
  top: '0px',
  zIndex: col.fixed ? 30 : 20,
  ...stickyXStyle(col),
})

const bodyCellStyle = (col: CamelotTableColumn<T>) =>
  col.fixed
    ? {
        zIndex: 10,
        ...stickyXStyle(col),
      }
    : {}

const pinnedCellStyle = (col: CamelotTableColumn<T>) => ({
  position: 'sticky' as const,
  top: `${headerHeight.value}px`,
  zIndex: col.fixed ? 25 : 15,
  ...stickyXStyle(col),
})

const fixedShadowClass = (col: CamelotTableColumn<T>) => {
  if (isLastLeftFixed(col)) return 'shadow-[6px_0_6px_-4px_rgba(0,0,0,0.15)]'
  if (isFirstRightFixed(col)) return 'shadow-[-6px_0_6px_-4px_rgba(0,0,0,0.15)]'
  return ''
}

const alignClass = (col: CamelotTableColumn<T>) => {
  if (col.align === 'center') return 'text-center'
  if (col.align === 'right') return 'text-right'
  return 'text-left'
}

const headerCellClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'bg-surface-container/90 text-on-surface backdrop-blur-md'
    case 'scifi':
      return 'bg-surface-container text-primary uppercase tracking-wider'
    case 'cupertino':
      return 'bg-surface-container-high text-on-surface'
    default:
      return 'bg-surface-container text-on-surface'
  }
})

const pinnedRowClass = computed(() => 'bg-surface-container-low')

const rowBgClass = (index: number) => {
  if (!props.stripe) return 'bg-surface'
  return index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-low'
}

const hoverClass = computed(() => (props.hover ? 'group-hover:bg-surface-container-highest' : ''))

const containerClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'rounded-2xl aqua-glass'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
    case 'cupertino':
      return 'rounded-xl border border-outline-variant'
    default:
      return 'rounded-lg border border-outline-variant'
  }
})

const cellValue = (row: T, col: CamelotTableColumn<T>) => {
  if (col.accessor) return col.accessor(row)
  return row[col.key]
}

const getRowKey = (row: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (props.rowKey) return row[props.rowKey] as string | number
  return index
}
</script>
