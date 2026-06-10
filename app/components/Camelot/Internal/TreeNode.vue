<template>
  <li class="list-none">
    <div
      class="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md py-1 pr-2 transition-colors hover:bg-on-surface/5"
      :class="{ 'pointer-events-none opacity-40': node.disabled }"
      :style="{ paddingLeft: `${level * 20 + 4}px` }"
      @click="onRowClick"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded text-on-surface-variant transition-transform duration-200"
        :class="{ 'rotate-90': isExpanded }"
        @click.stop="tree.toggleExpand(node)"
      >
        <IMaterialSymbolsChevronRightRounded class="h-4 w-4" />
      </button>
      <span
        v-else
        class="w-5 shrink-0"
      />

      <!-- 預設（可勾選且未自訂 node slot）：label 直接由 Checkbox 元件渲染，與獨立 Checkbox 完全一致 -->
      <CamelotCheckbox
        v-if="tree.checkable && !tree.hasNodeSlot"
        :model-value="isChecked"
        :indeterminate="isIndeterminate"
        :disabled="node.disabled"
        :label="node.label"
        :color="tree.color"
        @click.stop
        @change="tree.toggleCheck(node)"
      />

      <!-- 有自訂 node slot 或不可勾選：checkbox（無 label）+ slot/預設標籤 -->
      <template v-else>
        <CamelotCheckbox
          v-if="tree.checkable"
          :model-value="isChecked"
          :indeterminate="isIndeterminate"
          :disabled="node.disabled"
          :color="tree.color"
          @click.stop
          @change="tree.toggleCheck(node)"
        />
        <slot
          name="node"
          :node="node"
          :level="level"
          :is-checked="isChecked"
          :is-expanded="isExpanded"
        >
          <span class="truncate text-sm text-on-surface">{{ node.label }}</span>
        </slot>
      </template>
    </div>

    <CamelotExpanded
      v-if="hasChildren"
      :expanded="isExpanded"
    >
      <CamelotInternalTreeNode
        v-for="child in node.children"
        :key="child.value"
        :node="child"
        :level="level + 1"
      >
        <template #node="scope">
          <slot
            name="node"
            v-bind="scope"
          />
        </template>
      </CamelotInternalTreeNode>
    </CamelotExpanded>
  </li>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    node: CamelotTreeNode
    level?: number
  }>(),
  {
    level: 0,
  },
)

const tree = inject<CamelotTreeContext>(CAMELOT_TREE_KEY)!

const hasChildren = computed(() => !!props.node.children?.length)
const isChecked = computed(() => tree.isChecked(props.node))
const isIndeterminate = computed(() => tree.isIndeterminate(props.node))
const isExpanded = computed(() => tree.isExpanded(props.node))

const onRowClick = () => {
  if (props.node.disabled) return
  if (tree.checkable) {
    // 可勾選模式：點整行（含空白處）即切換勾選，展開交由 chevron 按鈕
    tree.toggleCheck(props.node)
  }
  else if (hasChildren.value) {
    tree.toggleExpand(props.node)
  }
  tree.onNodeClick(props.node)
}
</script>
