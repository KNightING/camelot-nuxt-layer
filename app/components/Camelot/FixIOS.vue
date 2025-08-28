<template>
  <div
    :class="{
      'ios-fixed-bug-transform': fixTransform,
      'ios-fixed-bug-scrolling': fixScrolling,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  fixTransform?: boolean
  fixScrolling?: boolean
}>(), {
  fixTransform: true,
  fixScrolling: true,
})
</script>

<!-- https://juejin.cn/post/7085526308460953637#heading-0 -->
<style scoped>
.ios-fixed-bug-transform {
  -webkit-transform: translate3d(0,0,0);
  -moz-transform: translate3d(0,0,0);
  -ms-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
}

.ios-fixed-bug-scrolling {
  -webkit-overflow-scrolling: touch;
}
</style>
