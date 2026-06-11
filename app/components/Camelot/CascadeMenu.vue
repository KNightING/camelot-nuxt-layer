<template>
  <div
    ref="triggerRef"
    class="inline-flex w-fit"
    :class="{ 'pointer-events-none opacity-60': disabled }"
  >
    <div
      class="contents"
      @click="onTriggerClick"
    >
      <slot :open="open" />
    </div>

    <CamelotInternalCascadeMenuPanel
      v-if="open"
      :items="items"
      :anchor="triggerEl"
      :level="0"
      placement="root"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: CamelotCascadeMenuItem[]
    color?: CamelotColorRole
    submenuTrigger?: 'hover' | 'click'
    openDelay?: number
    closeDelay?: number
    zIndex?: number
    disabled?: boolean
    closeOnSelect?: boolean
  }>(),
  {
    color: 'primary',
    submenuTrigger: 'hover',
    openDelay: 80,
    closeDelay: 160,
    zIndex: 50,
    disabled: false,
    closeOnSelect: true,
  },
)

const emit = defineEmits<{
  select: [item: CamelotCascadeMenuItem]
}>()

const open = defineModel<boolean>('open', { default: false })

const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const triggerEl = computed(() => triggerRef.value ?? null)

const roleColorClass = useCamelotRoleColorClass(() => props.color)

// 各層 Teleport 後的面板根元素註冊表（供 click-outside 判定）
const panelEls = ref<HTMLElement[]>([])

const onTriggerClick = () => {
  if (props.disabled) return
  open.value = !open.value
}

const closeAll = () => {
  open.value = false
}

const select = (item: CamelotCascadeMenuItem) => {
  emit('select', item)
  if (props.closeOnSelect) closeAll()
}

provide<CamelotCascadeMenuContext>(CAMELOT_CASCADE_MENU_KEY, {
  submenuTrigger: props.submenuTrigger,
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  baseZIndex: props.zIndex,
  roleColorClass: () => roleColorClass.value,
  select,
  closeAll,
  registerPanel: (el) => {
    panelEls.value.push(el)
  },
  unregisterPanel: (el) => {
    panelEls.value = panelEls.value.filter(e => e !== el)
  },
})

// 點擊觸發器與所有面板之外 → 關閉
useEventListener(document, 'pointerdown', (e) => {
  if (!open.value) return
  const target = e.target as Node
  if (triggerEl.value?.contains(target)) return
  if (panelEls.value.some(el => el.contains(target))) return
  closeAll()
})

// Esc 關閉
useEventListener(document, 'keydown', (e) => {
  if (open.value && e.key === 'Escape') closeAll()
})

// 捲動關閉（與既有浮層慣例一致）
useEventListener(window, 'scroll', () => {
  if (open.value) closeAll()
})

onUpdated(() => {
  if (props.disabled) closeAll()
})
</script>
