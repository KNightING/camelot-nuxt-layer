<template>
  <li class="list-none">
    <button
      type="button"
      class="flex min-h-[38px] w-full items-center gap-2 rounded-lg py-2 pr-3 text-left text-sm transition-colors"
      :class="[
        isActive ? activeClass : 'text-on-surface hover:bg-on-surface/5',
        { 'pointer-events-none opacity-40': item.disabled },
      ]"
      :style="{ paddingLeft: `${level * 16 + 10}px` }"
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
      <ul>
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
const isExpanded = computed(() => menu.isExpanded(props.item))

const activeClass = computed(() => {
  switch (themeMode.value) {
    case 'aqua':
      return 'aqua-fill text-on-primary'
    case 'scifi':
      return 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-primary [text-shadow:0_0_8px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]'
    case 'cupertino':
      return 'bg-primary/10 font-semibold text-primary'
    default:
      return 'bg-primary/10 font-medium text-primary'
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
