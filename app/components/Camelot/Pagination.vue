<template>
  <nav
    class="flex flex-wrap items-center gap-2 text-sm"
    :class="roleColorClass"
    aria-label="pagination"
  >
    <span
      v-if="showTotal"
      class="mr-1 text-on-surface-variant tabular-nums"
    >共 {{ total ?? totalPages }} 筆</span>

    <!-- Prev -->
    <button
      type="button"
      class="cml-page-item"
      :class="[itemShapeClass, ghostClass]"
      :disabled="disabled || page <= 1"
      aria-label="previous page"
      @click="go(page - 1)"
    >
      <IMaterialSymbolsChevronLeftRounded class="h-5 w-5" />
    </button>

    <!-- Pages -->
    <template
      v-for="item in items"
      :key="item.key"
    >
      <span
        v-if="item.type === 'ellipsis'"
        class="cml-page-item pointer-events-none text-on-surface-variant"
        :class="itemShapeClass"
      >…</span>
      <button
        v-else
        type="button"
        class="cml-page-item tabular-nums"
        :class="[itemShapeClass, item.value === page ? activeClass : ghostClass]"
        :disabled="disabled"
        :aria-current="item.value === page ? 'page' : undefined"
        @click="go(item.value)"
      >
        {{ item.value }}
      </button>
    </template>

    <!-- Next -->
    <button
      type="button"
      class="cml-page-item"
      :class="[itemShapeClass, ghostClass]"
      :disabled="disabled || page >= totalPages"
      aria-label="next page"
      @click="go(page + 1)"
    >
      <IMaterialSymbolsChevronRightRounded class="h-5 w-5" />
    </button>

    <!-- Page size -->
    <div
      v-if="showPageSize"
      class="ml-1 w-28"
    >
      <CamelotSelectV2
        v-model="pageSize"
        :options="pageSizeSelectOptions"
        :searchable="false"
        :color="color"
      />
    </div>

    <!-- Jumper -->
    <div
      v-if="showJumper"
      class="ml-1 flex items-center gap-1 text-on-surface-variant"
    >
      <span>跳至</span>
      <input
        type="number"
        min="1"
        :max="totalPages"
        :value="page"
        class="w-14 rounded-md border border-outline-variant bg-transparent px-2 py-1 text-center text-on-surface outline-none focus:border-[var(--cml-color-current-color)]"
        @change="onJump"
      >
      <span>頁</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 總筆數（與 totalPages 擇一；兩者皆給時以 totalPages 為準） */
    total?: number
    /** 總頁數（未給則由 total / pageSize 計算） */
    totalPages?: number
    /** 當前頁左右各顯示幾個頁碼 */
    siblingCount?: number
    /** 首尾各固定顯示幾個頁碼 */
    boundaryCount?: number
    showTotal?: boolean
    showJumper?: boolean
    showPageSize?: boolean
    pageSizeOptions?: number[]
    color?: CamelotColorRole
    disabled?: boolean
  }>(),
  {
    siblingCount: 1,
    boundaryCount: 1,
    pageSizeOptions: () => [10, 20, 50, 100],
    color: 'primary',
  },
)

const page = defineModel<number>({ default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const totalPages = computed(() => {
  if (props.totalPages != null) return Math.max(1, props.totalPages)
  if (props.total != null) return Math.max(1, Math.ceil(props.total / pageSize.value))
  return 1
})

// 省略號頁碼：首尾邊界 + 當前頁左右 sibling，缺口以 … 表示
const items = computed(() => {
  const tp = totalPages.value
  const cur = Math.min(Math.max(page.value, 1), tp)
  const set = new Set<number>()
  for (let i = 1; i <= Math.min(props.boundaryCount, tp); i++) set.add(i)
  for (let i = Math.max(tp - props.boundaryCount + 1, 1); i <= tp; i++) set.add(i)
  for (let i = Math.max(cur - props.siblingCount, 1); i <= Math.min(cur + props.siblingCount, tp); i++) set.add(i)
  const sorted = [...set].sort((a, b) => a - b)
  const out: { type: 'page' | 'ellipsis', value: number, key: string }[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push({
      type: 'ellipsis',
      value: -1,
      key: `e${p}`,
    })
    out.push({
      type: 'page',
      value: p,
      key: `p${p}`,
    })
    prev = p
  }
  return out
})

const pageSizeSelectOptions = computed(() =>
  props.pageSizeOptions.map(n => ({
    value: n,
    name: `${n} / 頁`,
  })),
)

const go = (target: number) => {
  if (props.disabled) return
  const next = Math.min(Math.max(target, 1), totalPages.value)
  if (next !== page.value) page.value = next
}

const onJump = (e: Event) => {
  const v = Number((e.target as HTMLInputElement).value)
  if (!Number.isNaN(v)) go(v)
}

// 重設頁碼當每頁筆數變動導致超出總頁數
watch([pageSize, totalPages], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

const itemShapeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'rounded-full'
    case 'scifi':
      return 'rounded-none [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]'
    case 'cupertino':
      return 'rounded-lg'
    default:
      return 'rounded-md'
  }
})

const activeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-fill text-on-primary font-semibold'
    case 'scifi':
      return 'bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)] font-semibold shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_60%,transparent)]'
    default:
      return 'bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)] font-semibold'
  }
})

const ghostClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-track text-on-surface hover:text-[var(--cml-color-current-color)] disabled:opacity-40'
    case 'scifi':
      return 'border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)] text-on-surface hover:text-[var(--cml-color-current-color)] disabled:opacity-40'
    default:
      return 'text-on-surface hover:bg-surface-container-highest disabled:opacity-40'
  }
})
</script>

<style scoped>
.cml-page-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  user-select: none;
}
.cml-page-item:disabled {
  cursor: not-allowed;
}
</style>
