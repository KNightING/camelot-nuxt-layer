<template>
  <div
    class="relative w-full overflow-hidden"
    :class="[containerClass, roleColorClass]"
  >
    <div
      ref="scrollContainerRef"
      class="cml-table-scroll w-full overflow-x-hidden overflow-y-auto"
      :style="scrollStyle"
      @wheel="onWheelHorizontal"
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

    <!-- 水平捲軸：docked 時保留在容器內（被圓角裁切、左右內縮）；需浮動時才 Teleport 至 body 固定視窗底 -->
    <Teleport
      to="body"
      :disabled="!floatingBarFloating"
    >
      <div
        v-if="floatingVisible"
        class="cml-floating-scrollbar"
        :class="{ 'cml-floating-scrollbar--floating': floatingBarFloating }"
        :style="floatingTrackStyle"
      >
        <div
          class="cml-floating-scrollbar__thumb"
          :style="floatingThumbStyle"
          @pointerdown="floatingOnThumbDown"
          @pointermove="floatingOnThumbMove"
          @pointerup="floatingOnThumbUp"
          @pointercancel="floatingOnThumbUp"
          @pointerenter="floatingOnThumbEnter"
          @pointerleave="floatingOnThumbLeave"
        >
          <div
            class="cml-floating-scrollbar__bar"
            :style="floatingBarStyle"
          />
        </div>
      </div>
    </Teleport>
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
  }>(),
  {
    stripe: false,
    hover: true,
    color: 'primary',
    floatingScrollbar: true,
    pinnedTopRows: () => [],
    virtual: true,
    estimatedRowHeight: 44,
  },
)

const { themeMode } = useCamelotTheme()

// 色彩角色 → 設定 --cml-color-current-color 的 class（套在根元素，供表頭/列取用）
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const headRowRef = useTemplateRef<HTMLElement>('headRowRef')
const { height: headerHeight } = useElementBounding(headRowRef)

const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef')

// overflow-x: hidden 會關閉使用者水平捲動，故以 wheel handler 補回觸控板水平滑動 / shift+滾輪
const onWheelHorizontal = (e: WheelEvent) => {
  const el = scrollContainerRef.value
  if (!el || el.scrollWidth <= el.clientWidth) return
  const dx = e.deltaX !== 0 ? e.deltaX : (e.shiftKey ? e.deltaY : 0)
  if (dx === 0) return
  // 設定 scrollLeft 會觸發容器 scroll 事件，composable 會據以更新捲軸 thumb 位置
  el.scrollLeft += dx
  e.preventDefault()
}

// 固定高度（height）優先於高度上限（maxHeight）；兩者皆為選填，未給則容器隨內容伸縮
const scrollStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) style.height = props.height
  if (props.maxHeight) style.maxHeight = props.maxHeight
  return style
})

// 浮動水平捲軸（表格底在視窗外時於視窗底附近浮現，自訂可拖曳 thumb 與容器同步）
const {
  visible: floatingVisible,
  floating: floatingBarFloating,
  trackStyle: floatingTrackStyle,
  thumbStyle: floatingThumbStyle,
  barStyle: floatingBarStyle,
  onThumbDown: floatingOnThumbDown,
  onThumbMove: floatingOnThumbMove,
  onThumbUp: floatingOnThumbUp,
  onThumbEnter: floatingOnThumbEnter,
  onThumbLeave: floatingOnThumbLeave,
} = useCamelotFloatingScrollbar(
  scrollContainerRef,
  () => props.floatingScrollbar,
  // 浮動軸 Teleport 至 body，改以全域角色色變數 var(--color-{role}) 上色
  () => `var(--color-${props.color})`,
)

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
/* 表格容器：水平方向 overflow-x hidden（不顯示原生橫軸、改用自訂 .cml-floating-scrollbar，
   水平捲動由 wheel handler + 自訂軸拖曳驅動）；垂直方向保留原生捲軸並加粗、圓角、走主題色。
   註：不設標準的 scrollbar-width / scrollbar-color——在現代 Chrome 設了會關閉 ::-webkit-scrollbar
   自訂並改用較細的標準捲軸；此處以 webkit 偽元素取得 12px 加粗捲軸（Windows/Chrome 主要對象）。 */
.cml-table-scroll::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.cml-table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.cml-table-scroll::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--cml-c-m3-on-surface-variant) 60%, transparent);
  border-radius: 9999px;
  /* 透明邊 + padding-box 讓 thumb 內縮成膠囊狀 */
  border: 3px solid transparent;
  background-clip: padding-box;
}

.cml-table-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--cml-c-m3-on-surface);
  background-clip: padding-box;
}

/* 列 hover 底色：走色彩角色（--cml-color-current-color 由根元素 roleColorClass 注入並向下繼承）。
   必須「不透明」（與 surface 混色，而非 transparent），否則固定欄位 sticky 儲存格 hover 時會透出底下捲動的內容。 */
.cml-table-scroll tbody tr:hover td.cml-row-hover {
  background-color: color-mix(in srgb, var(--cml-color-current-color) 14%, var(--color-surface-container-highest));
}

/* 自訂水平捲軸：定位(position/left/right/bottom)由 composable 依 docked/浮動 態 inline 給值。
   docked 態在容器內（被圓角 overflow 裁切）；浮動態 Teleport 至 body 固定視窗底。
   僅 thumb 可互動，不攔截其餘點擊。 */
.cml-floating-scrollbar {
  z-index: 35;
  height: 14px;
  pointer-events: none;
}

.cml-floating-scrollbar--floating {
  z-index: 40;
}

/* thumb：命中區（較高好抓取）；定位/cursor 由 composable inline 驅動 */
.cml-floating-scrollbar__thumb {
  position: absolute;
  bottom: 0;
  height: 14px;
  pointer-events: auto;
  touch-action: none;
}

/* bar：視覺膠囊；固定 12px，放大以 transform: scaleY 動畫（origin 底部，往上長）。
   顏色/淡邊由 composable inline 驅動。 */
.cml-floating-scrollbar__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 12px;
  transform-origin: center bottom;
  border-radius: 9999px;
  transition: transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}
</style>
