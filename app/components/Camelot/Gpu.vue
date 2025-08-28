<template>
  <div
    class="transform-gpu"
    :class="{
      'fix-ios-scrolling': !disabledFixIosScrolling,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabledFixIosScrolling?: boolean
}>()
</script>

<!-- https://juejin.cn/post/7085526308460953637#heading-0 -->
<style scoped>
.fix-ios-transform {
  -webkit-transform: translate3d(0,0,0);
  -moz-transform: translate3d(0,0,0);
  -ms-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
}

.fix-ios-scrolling {
  -webkit-overflow-scrolling: touch;
}
</style>
