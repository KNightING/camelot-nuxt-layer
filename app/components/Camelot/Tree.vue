<template>
  <ul class="w-full select-none text-sm">
    <CamelotInternalTreeNode
      v-for="node in nodes"
      :key="node.value"
      :node="node"
      :level="0"
    >
      <template #node="scope">
        <slot
          name="node"
          v-bind="scope"
        />
      </template>
    </CamelotInternalTreeNode>
  </ul>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    nodes: CamelotTreeNode[]
    checkable?: boolean
    defaultExpandAll?: boolean
    color?: CamelotColorRole
  }>(),
  {
    checkable: false,
    defaultExpandAll: false,
    color: 'primary',
  },
)

const emit = defineEmits<{
  nodeClick: [node: CamelotTreeNode]
}>()

// 已勾選的「葉節點」值；父節點的勾選/半選由葉節點推導
const checked = defineModel<(string | number)[]>('checked', { default: () => [] })
const expanded = defineModel<(string | number)[]>('expanded', { default: () => [] })

const checkedSet = computed(() => new Set(checked.value))
const expandedSet = computed(() => new Set(expanded.value))

const collectLeaves = (node: CamelotTreeNode): (string | number)[] => {
  if (node.children?.length) {
    return node.children.flatMap(collectLeaves)
  }
  return [node.value]
}

const isChecked = (node: CamelotTreeNode) => {
  const leaves = collectLeaves(node)
  return leaves.length > 0 && leaves.every(v => checkedSet.value.has(v))
}

const isIndeterminate = (node: CamelotTreeNode) => {
  if (!node.children?.length) return false
  const leaves = collectLeaves(node)
  const some = leaves.some(v => checkedSet.value.has(v))
  return some && !leaves.every(v => checkedSet.value.has(v))
}

const toggleCheck = (node: CamelotTreeNode) => {
  const leaves = collectLeaves(node)
  const set = new Set(checked.value)
  const target = !leaves.every(v => set.has(v))
  for (const v of leaves) {
    if (target) set.add(v)
    else set.delete(v)
  }
  checked.value = [...set]
}

const isExpanded = (node: CamelotTreeNode) => expandedSet.value.has(node.value)

const toggleExpand = (node: CamelotTreeNode) => {
  const set = new Set(expanded.value)
  if (set.has(node.value)) set.delete(node.value)
  else set.add(node.value)
  expanded.value = [...set]
}

const onNodeClick = (node: CamelotTreeNode) => emit('nodeClick', node)

const collectParentValues = (nodes: CamelotTreeNode[]): (string | number)[] =>
  nodes.flatMap(n => (n.children?.length ? [n.value, ...collectParentValues(n.children)] : []))

onMounted(() => {
  if (props.defaultExpandAll && expanded.value.length === 0) {
    expanded.value = collectParentValues(props.nodes)
  }
})

const slots = useSlots()

provide<CamelotTreeContext>(CAMELOT_TREE_KEY, {
  checkable: props.checkable,
  // getter 以保持反應性（color 可於執行期變動）
  get color() {
    return props.color
  },
  hasNodeSlot: !!slots.node,
  isChecked,
  isIndeterminate,
  isExpanded,
  toggleCheck,
  toggleExpand,
  onNodeClick,
})
</script>
