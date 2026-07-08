<template>
  <div
    class="relative w-full overflow-hidden"
    :class="[containerClass, roleColorClass]"
  >
    <div
      ref="scrollContainerRef"
      class="cml-table-scroll w-full overflow-auto"
      :style="scrollStyle"
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
              class="border-b-2 px-4 py-2.5 font-medium whitespace-nowrap"
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

          <!-- 虛擬滾動上方留白 -->
          <tr
            v-if="virtual && topPad > 0"
            aria-hidden="true"
          >
            <td
              :colspan="columns.length"
              :style="{ height: `${topPad}px`, padding: 0, border: 0 }"
            />
          </tr>

          <!-- Data rows（虛擬模式僅渲染可視窗格，rowIndex 仍為真實索引） -->
          <tr
            v-for="{ row, rowIndex } in renderRows"
            :key="getRowKey(row, rowIndex)"
            :data-vrow="rowIndex"
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

          <!-- 虛擬滾動下方留白 -->
          <tr
            v-if="virtual && bottomPad > 0"
            aria-hidden="true"
          >
            <td
              :colspan="columns.length"
              :style="{ height: `${bottomPad}px`, padding: 0, border: 0 }"
            />
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

    <!-- 自訂 overlay 捲軸：水平（docked/可浮動）與垂直（右側 docked），皆走色彩角色 -->
    <CamelotOverlayScrollbar
      :container="scrollContainerRef"
      orientation="horizontal"
      :floating-enabled="floatingScrollbar"
      :color="color"
    />
    <CamelotOverlayScrollbar
      :container="scrollContainerRef"
      orientation="vertical"
      :color="color"
    />
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
    /** 色彩角色：套用於捲軸、列 hover 底色、表頭底線等強調處 */
    color?: CamelotColorRole
    /** 固定高度（如 "480px"）：容器維持此高度，內容少時保留空白、多時內部捲動 */
    height?: string
    /** 高度上限（如 "480px"）：僅設上限，內容少於上限時容器會縮短 */
    maxHeight?: string
    /** 浮動水平捲軸（預設開啟）：表格底部落在視窗外時，於視窗底浮現一條與表格同步的水平捲軸 */
    floatingScrollbar?: boolean
    pinnedTopRows?: T[]
    /** 虛擬滾動（預設開啟；支援可變列高，需搭配 height 或 maxHeight 限制高度才有效益） */
    virtual?: boolean
    /** 預估列高（px），尚未量測的列以此估算 */
    estimatedRowHeight?: number
    /** 是否為垂直捲軸保留固定空間（gutter）；關閉則捲軸直接覆蓋於表格上 */
    reserveVerticalScrollbar?: boolean
    /** 是否為水平捲軸保留固定空間（gutter）；關閉則捲軸直接覆蓋於表格上 */
    reserveHorizontalScrollbar?: boolean
  }>(),
  {
    stripe: false,
    hover: true,
    color: 'primary',
    floatingScrollbar: true,
    pinnedTopRows: () => [],
    virtual: true,
    estimatedRowHeight: 44,
    reserveVerticalScrollbar: true,
    reserveHorizontalScrollbar: true,
  },
)

const { themeMode } = useCamelotTheme()

// 色彩角色 → 設定 --cml-color-current-color 的 class（套在根元素，供表頭/列取用）
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const headRowRef = useTemplateRef<HTMLElement>('headRowRef')
const { height: headerHeight } = useElementBounding(headRowRef)

const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef')

// 固定高度（height）優先於高度上限（maxHeight）；兩者皆為選填，未給則容器隨內容伸縮。
// 以「透明 border」（非 padding）保留右/底捲軸空間：overflow 裁切在 padding box（border 之內），
// 內容不會進到 border 區 → gutter 乾淨、不會漏出捲動內容；固定欄/列也停在 padding box 邊緣。
const scrollStyle = computed(() => {
  const style: Record<string, string> = { boxSizing: 'border-box' }
  // 保留空間關閉時不加 border → 捲軸直接覆蓋於表格上
  if (props.reserveVerticalScrollbar) style.borderRight = '12px solid transparent'
  if (props.reserveHorizontalScrollbar) style.borderBottom = '12px solid transparent'
  if (props.height) style.height = props.height
  if (props.maxHeight) style.maxHeight = props.maxHeight
  return style
})

// 虛擬視窗：sticky header + pinned 列佔據資料列前的固定偏移
const headerOffset = computed(() => headerHeight.value + props.pinnedTopRows.length * props.estimatedRowHeight)

const {
  visibleIndices, topPad, bottomPad, setSize,
} = useCamelotVirtual(
  scrollContainerRef,
  () => props.data.length,
  () => props.estimatedRowHeight,
  {
    overscan: 6,
    headerOffset: () => headerOffset.value,
  },
)

// 依虛擬開關決定實際渲染的資料列（保留真實 rowIndex 供條紋/插槽使用）
const renderRows = computed(() =>
  props.virtual
    ? visibleIndices.value.map(i => ({
        row: props.data[i] as T,
        rowIndex: i,
      }))
    : props.data.map((row, i) => ({
        row,
        rowIndex: i,
      })),
)

// 量測已渲染列的實際高度
let rowRo: ResizeObserver | null = null
const measureRows = () => {
  const root = scrollContainerRef.value
  if (!root) return
  for (const el of root.querySelectorAll('tr[data-vrow]')) {
    const idx = Number((el as HTMLElement).dataset.vrow)
    if (!Number.isNaN(idx)) {
      setSize(idx, (el as HTMLElement).offsetHeight)
      rowRo?.observe(el)
    }
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  rowRo = new ResizeObserver((entries) => {
    for (const e of entries) {
      const idx = Number((e.target as HTMLElement).dataset.vrow)
      if (!Number.isNaN(idx)) setSize(idx, (e.target as HTMLElement).offsetHeight)
    }
  })
  nextTick(measureRows)
})

watch(visibleIndices, () => nextTick(measureRows))
watch(() => props.data, () => nextTick(measureRows), { deep: false })

onBeforeUnmount(() => {
  rowRo?.disconnect()
  rowRo = null
})

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
  // 表頭底線走色彩角色（inline 確定生效，避免 Tailwind arbitrary border-color 未產生）
  borderBottomColor: `var(--color-${props.color})`,
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

// hover 底色以 scoped CSS（.cml-row-hover）驅動，走 --cml-color-current-color；
// 避免 Tailwind 未生成 color-mix arbitrary utility 的問題。
const hoverClass = computed(() => (props.hover ? 'cml-row-hover' : ''))

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

<style scoped>
/* 表格容器：overflow:auto 保留原生捲動行為（滾輪/觸控/鍵盤），但隱藏原生捲軸——
   兩軸皆改由自訂 CamelotOverlayScrollbar 呈現。 */
.cml-table-scroll {
  scrollbar-width: none; /* Firefox */
}

.cml-table-scroll::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
}

/* 列 hover 底色：走色彩角色（--cml-color-current-color 由根元素 roleColorClass 注入並向下繼承）。
   必須「不透明」（與 surface 混色，而非 transparent），否則固定欄位 sticky 儲存格 hover 時會透出底下捲動的內容。 */
.cml-table-scroll tbody tr:hover td.cml-row-hover {
  background-color: color-mix(in srgb, var(--cml-color-current-color) 14%, var(--color-surface-container-highest));
}
</style>
