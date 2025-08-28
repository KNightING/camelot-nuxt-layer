<template>
  <div class="flex flex-col">
    <div @pointerup="expanded = !expanded">
      <slot name="header" />
    </div>
    <div
      class="expanded-container"
      :class="{ close: !expanded }"
    >
      <div
        style="min-height:0px"
      >
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

const { height: contentHeight, width: contentWidth } = useElementBounding(contentRef)

defineExpose({
  contentHeight,
  contentWidth,
})
</script>

<style scoped>
.expanded-container{
  display: grid;
  overflow: hidden;
  grid-template-rows: 1fr;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.close {
  grid-template-rows: 0fr !important;
  opacity: 0 !important;
}
</style>
