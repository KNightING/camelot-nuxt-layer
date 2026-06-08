<template>
  <div class="flex flex-col">
    <div @pointerup="expanded = !expanded">
      <slot name="header" />
    </div>
    <div
      class="grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="min-h-0">
        <div ref="contentRef">
          <slot />
        </div>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
const expanded = defineModel<boolean>('expanded', {
  default: false,
})

const contentRef = useTemplateRef('contentRef')

const {
  height: contentHeight, width: contentWidth,
} = useElementBounding(contentRef)

defineExpose({
  contentHeight,
  contentWidth,
})
</script>
