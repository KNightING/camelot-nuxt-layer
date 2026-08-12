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

// 對外只提供尺寸，尺寸變化由內建的 ResizeObserver 涵蓋；
// window scroll/resize 只影響座標，對本元件無用，關掉可省下每個實例的常駐監聽。
const {
  height: contentHeight, width: contentWidth,
} = useElementBounding(contentRef, {
  windowScroll: false,
  windowResize: false,
})

defineExpose({
  contentHeight,
  contentWidth,
})
</script>
