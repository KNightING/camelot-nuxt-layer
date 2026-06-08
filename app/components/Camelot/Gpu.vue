<template>
  <!-- https://juejin.cn/post/7085526308460953637#heading-0 -->
  <div
    class="transform-gpu"
    :class="{
      '[transform:translate3d(0,0,0)]': !props.disabledFixTransform,
      '[-webkit-overflow-scrolling:touch]': !props.disabledFixScrolling,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabledFixTransform?: boolean
  disabledFixScrolling?: boolean
}>(), {
  disabledFixTransform: false,
  disabledFixScrolling: false,
})
</script>
