<template>
  <ul class="w-full select-none">
    <CamelotInternalMenuItem
      v-for="item in items"
      :key="item.value"
      :item="item"
      :level="0"
    />
  </ul>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: CamelotMenuItem[]
    defaultExpandAll?: boolean
  }>(),
  {
    defaultExpandAll: false,
  },
)

const emit = defineEmits<{
  select: [item: CamelotMenuItem]
}>()

const active = defineModel<string | number>()
const expanded = defineModel<(string | number)[]>('expanded', { default: () => [] })

const expandedSet = computed(() => new Set(expanded.value))

const isActive = (value: string | number) => active.value === value

const collectValues = (item: CamelotMenuItem): (string | number)[] =>
  [item.value, ...(item.children?.flatMap(collectValues) ?? [])]

// 子孫中含有選中項（且自己不是選中項）→ 父節點用於僅變色不上底色
const isActiveAncestor = (item: CamelotMenuItem) => {
  if (!item.children?.length || active.value === undefined) return false
  return item.children.flatMap(collectValues).includes(active.value)
}

const isExpanded = (item: CamelotMenuItem) => expandedSet.value.has(item.value)

const toggleExpand = (item: CamelotMenuItem) => {
  const set = new Set(expanded.value)
  if (set.has(item.value)) set.delete(item.value)
  else set.add(item.value)
  expanded.value = [...set]
}

const select = (item: CamelotMenuItem) => {
  active.value = item.value
  emit('select', item)
}

const collectParentValues = (items: CamelotMenuItem[]): (string | number)[] =>
  items.flatMap(i => (i.children?.length ? [i.value, ...collectParentValues(i.children)] : []))

onMounted(() => {
  if (props.defaultExpandAll && expanded.value.length === 0) {
    expanded.value = collectParentValues(props.items)
  }
})

provide<CamelotMenuContext>(CAMELOT_MENU_KEY, {
  isActive,
  isActiveAncestor,
  isExpanded,
  toggleExpand,
  select,
})
</script>
