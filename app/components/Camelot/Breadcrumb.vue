<template>
  <nav
    class="flex flex-wrap items-center gap-1.5 text-sm"
    :class="[roleColorClass, themeMode === 'scifi' ? 'font-mono uppercase tracking-wider' : '']"
    aria-label="breadcrumb"
  >
    <template
      v-for="(item, i) in items"
      :key="item.value ?? i"
    >
      <component
        :is="item.href ? 'a' : 'button'"
        :href="item.href"
        :type="item.href ? undefined : 'button'"
        class="inline-flex items-center gap-1 transition-colors"
        :class="i === items.length - 1
          ? 'font-semibold text-[var(--cml-color-current-color)] pointer-events-none'
          : 'text-on-surface-variant hover:text-[var(--cml-color-current-color)]'"
        :aria-current="i === items.length - 1 ? 'page' : undefined"
        @click="onClick(item, i)"
      >
        <slot
          name="item"
          :item="item"
          :index="i"
          :is-last="i === items.length - 1"
        >
          {{ item.label }}
        </slot>
      </component>

      <span
        v-if="i < items.length - 1"
        class="text-on-surface-variant/60 select-none"
        aria-hidden="true"
      >
        <slot name="separator">
          <IMaterialSymbolsChevronRightRounded
            v-if="!separator"
            class="h-4 w-4"
          />
          <template v-else>{{ separator }}</template>
        </slot>
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  value?: string | number
  href?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    /** 自訂分隔字元；留空則用 chevron 圖示 */
    separator?: string
    color?: CamelotColorRole
  }>(),
  {
    color: 'primary',
  },
)

const emit = defineEmits<{ select: [item: BreadcrumbItem, index: number] }>()

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const onClick = (item: BreadcrumbItem, index: number) => {
  if (item.disabled || index === props.items.length - 1) return
  emit('select', item, index)
}
</script>
