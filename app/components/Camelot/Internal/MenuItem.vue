<template>
  <li class="list-none">
    <button
      type="button"
      class="flex min-h-[38px] w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors"
      :class="[
        isActive
          ? activeClass
          : isActiveAncestor
            ? 'font-medium text-[var(--cml-color-current-color)] hover:bg-on-surface/5'
            : ['hover:bg-on-surface/5', level === 0 ? 'font-medium text-on-surface' : 'text-on-surface/75'],
        { 'pointer-events-none opacity-40': item.disabled },
      ]"
      @click="onClick"
    >
      <span class="flex-1 truncate">{{ item.label }}</span>
      <IMaterialSymbolsChevronRightRounded
        v-if="hasChildren"
        class="h-4 w-4 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-90': isExpanded }"
      />
    </button>

    <CamelotExpanded
      v-if="hasChildren"
      :expanded="isExpanded"
    >
      <!-- 巢狀層級：左側導引線（垂直線止於最後一個子項中線，並轉一個 L 形轉角指向它）
           + 適度內距讓選中陰影不被裁切 -->
      <ul class="relative my-0.5 ml-[22px] pt-1.5 pr-1.5 pb-2 pl-3 before:absolute before:top-2 before:bottom-[27px] before:left-0 before:w-px before:bg-outline-variant before:content-[''] after:absolute after:bottom-[27px] after:left-0 after:h-px after:w-2.5 after:bg-outline-variant after:content-['']">
        <CamelotInternalMenuItem
          v-for="child in item.children"
          :key="child.value"
          :item="child"
          :level="level + 1"
        />
      </ul>
    </CamelotExpanded>
  </li>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    item: CamelotMenuItem
    level?: number
  }>(),
  {
    level: 0,
  },
)

const menu = inject<CamelotMenuContext>(CAMELOT_MENU_KEY)!
const { themeMode } = useCamelotTheme()

const hasChildren = computed(() => !!props.item.children?.length)
const isActive = computed(() => menu.isActive(props.item.value))
const isActiveAncestor = computed(() => menu.isActiveAncestor(props.item))
const isExpanded = computed(() => menu.isExpanded(props.item))

const activeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-fill text-[var(--cml-color-current-on-color)]'
    case 'scifi':
      return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)] text-[var(--cml-color-current-color)] [text-shadow:0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_50%,transparent)]'
    case 'cupertino':
      return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_10%,transparent)] font-semibold text-[var(--cml-color-current-color)]'
    default:
      return 'bg-[color-mix(in_srgb,var(--cml-color-current-color)_10%,transparent)] font-medium text-[var(--cml-color-current-color)]'
  }
})

const onClick = () => {
  if (props.item.disabled) return
  if (hasChildren.value) {
    menu.toggleExpand(props.item)
  }
  else {
    menu.select(props.item)
  }
}
</script>
