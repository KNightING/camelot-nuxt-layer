<template>
  <Teleport to="body">
    <Transition
      appear
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        ref="panelRef"
        class="fixed min-w-[184px] max-w-[300px] origin-top-left overflow-hidden text-sm text-on-surface"
        :class="[roleColorClass, surfaceClass]"
        :style="panelStyle"
      >
        <ul
          class="flex flex-col gap-0.5 overflow-x-hidden overflow-y-auto overscroll-contain p-1.5"
          :style="{ maxHeight: scrollMaxHeight }"
        >
          <template
            v-for="(item, idx) in items"
            :key="item.divider ? `divider-${idx}` : item.value"
          >
            <li
              v-if="item.divider"
              class="mx-2 my-1 h-px bg-outline-variant/60"
            />
            <li v-else>
              <button
                type="button"
                class="relative flex min-h-[36px] w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors"
                :class="rowClass(item)"
                @mouseenter="onRowEnter(item, $event)"
                @click="onRowClick(item, $event)"
              >
                <span class="flex-1 truncate">{{ item.label }}</span>
                <IMaterialSymbolsChevronRightRounded
                  v-if="hasChildren(item)"
                  class="-mr-1 h-4 w-4 shrink-0 opacity-70"
                />
              </button>
            </li>
          </template>
        </ul>

        <CamelotInternalCascadeMenuPanel
          v-if="openItem?.children?.length"
          :key="openItem.value"
          :items="openItem.children"
          :anchor="openAnchor"
          :level="level + 1"
          placement="submenu"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import IMaterialSymbolsChevronRightRounded from '~icons/material-symbols/chevron-right-rounded'

const props = defineProps<{
  items: CamelotCascadeMenuItem[]
  anchor: HTMLElement | null
  level: number
  placement: 'root' | 'submenu'
}>()

const ctx = inject<CamelotCascadeMenuContext>(CAMELOT_CASCADE_MENU_KEY)!
const { themeMode } = useCamelotTheme()

// 選中／hover 效果與 SelectV2 選項共用同一核心
const {
  activeClass: activeRowClass, hoverClass: hoverRowClass,
} = useCamelotMenuItemTheme()

const roleColorClass = computed(() => ctx.roleColorClass())

// 選項區最大高度：取 prop 與「視窗高 - 16px」較小者，超過則內部捲動
const scrollMaxHeight = computed(() => `min(${ctx.maxHeight}, calc(100vh - 16px))`)

const panelRef = useTemplateRef<HTMLElement>('panelRef')

const hasChildren = (item: CamelotCascadeMenuItem) => !!item.children?.length

/* ---------- 子選單開合（hover 延遲 / click 切換） ---------- */
const openItem = ref<CamelotCascadeMenuItem | null>(null)
const openAnchor = ref<HTMLElement | null>(null)

let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined

const clearTimers = () => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
}

const openSubmenu = (item: CamelotCascadeMenuItem, el: HTMLElement) => {
  clearTimers()
  openItem.value = item
  openAnchor.value = el
}

const closeSubmenu = () => {
  clearTimers()
  openItem.value = null
  openAnchor.value = null
}

const onRowEnter = (item: CamelotCascadeMenuItem, e: MouseEvent) => {
  if (ctx.submenuTrigger !== 'hover' || item.disabled) return
  const el = e.currentTarget as HTMLElement
  clearTimers()
  if (hasChildren(item)) {
    openTimer = setTimeout(() => openSubmenu(item, el), ctx.openDelay)
  }
  else {
    // 移到同層的葉節點 → 收掉已展開的兄弟子選單
    openItem.value = null
    openAnchor.value = null
  }
}

const onRowClick = (item: CamelotCascadeMenuItem, e: MouseEvent) => {
  if (item.disabled) return
  if (hasChildren(item)) {
    // hover 模式：展開由滑入控制，點擊父項不收合、也不關閉選單
    if (ctx.submenuTrigger === 'hover') return
    const el = e.currentTarget as HTMLElement
    if (openItem.value === item) closeSubmenu()
    else openSubmenu(item, el)
    return
  }
  ctx.select(item)
}

/* ---------- 飛出定位（fixed，僅在掛載/視窗變動時量測一次並凍結） ----------
   不依賴 anchor 的「即時」量測：避免 (1) 開啟首幀 anchor 尚未量到 → 抖動；
   (2) 兄弟子選單切換時舊面板 anchor 卸載 → 位置重算成 (0,0) 飛到左上角。 */
const GAP = 4
const EDGE = 8

const pos = ref<{ top: number, left: number } | null>(null)

const computePosition = () => {
  const anchor = props.anchor
  const panel = panelRef.value
  if (!anchor || !panel) return

  const a = anchor.getBoundingClientRect()
  // offsetWidth/Height 不受 enter 動畫 scale 影響，量測較穩定
  const pw = panel.offsetWidth
  const ph = panel.offsetHeight
  const winW = window.innerWidth
  const winH = window.innerHeight

  let top: number
  let left: number

  if (props.placement === 'root') {
    // 根面板：貼齊觸發器下緣、左對齊；下方/右側不足則翻轉
    top = a.bottom + GAP
    left = a.left
    if (left + pw > winW) left = Math.max(EDGE, a.right - pw)
    if (top + ph > winH) top = Math.max(EDGE, a.top - GAP - ph)
  }
  else {
    // 子面板：出現在該列右側、頂端對齊；右側不足翻左、下方不足上移
    top = a.top
    left = a.right + GAP
    if (left + pw > winW) left = Math.max(EDGE, a.left - GAP - pw)
    if (top + ph > winH) top = Math.max(EDGE, winH - ph - EDGE)
  }

  pos.value = {
    top: Math.round(top),
    left: Math.round(left),
  }
}

const panelStyle = computed(() => {
  const z = ctx.baseZIndex + props.level
  // 尚未定位前隱藏（仍佔版面可量測），避免 (0,0) 錯誤幀
  if (!pos.value) {
    return {
      top: '0px',
      left: '0px',
      zIndex: z,
      visibility: 'hidden' as const,
    }
  }
  return {
    top: `${pos.value.top}px`,
    left: `${pos.value.left}px`,
    zIndex: z,
  }
})

onMounted(() => {
  if (panelRef.value) ctx.registerPanel(panelRef.value)
  // onMounted 於瀏覽器繪製前執行：同步定位 → 首幀即正確、無抖動
  computePosition()
})

onBeforeUnmount(() => {
  if (panelRef.value) ctx.unregisterPanel(panelRef.value)
  clearTimers()
})

// 視窗尺寸變動時重算（捲動時整個選單會關閉，故無需監聽 scroll）
useEventListener('resize', computePosition)

/* ---------- 四風格外觀（消費 CurrentColor） ---------- */
const surfaceClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-glass rounded-2xl'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)] bg-slate-950/80 font-mono backdrop-blur-md shadow-[inset_0_0_18px_color-mix(in_srgb,var(--cml-color-current-color)_8%,transparent)]'
    case 'cupertino':
      return 'rounded-xl border border-white/20 bg-surface/70 shadow-lg backdrop-blur-xl dark:border-white/10'
    default:
      return 'rounded-xl border border-outline-variant bg-surface shadow-lg'
  }
})

const rowClass = (item: CamelotCascadeMenuItem) => {
  if (item.disabled) return 'pointer-events-none text-on-surface opacity-40'
  return openItem.value === item ? activeRowClass.value : hoverRowClass.value
}
</script>
