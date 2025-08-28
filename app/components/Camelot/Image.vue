<template>
  <CamelotSkeleton
    v-if="isLoading"
    ref="target"
  />
  <div
    v-else-if="isError"
    v-bind="$attrs"
  >
    <slot name="error" />
  </div>
  <img
    v-else
    :src="src"
    v-bind="$attrs"
  >
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string
    immediate?: boolean
  }>(), {
    immediate: false,
  })

const { isLoading, isError, isPending, isReady, load } = useLazyImage({
  src: props.src,
})

const target = ref(null)

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting
      && (isReady.value === false
        && isError.value === false
        && isPending.value === false)) {
      load()
    }
  },
)

onBeforeUnmount(() => {
  stop()
})

defineExpose({ isLoading, isError, isReady })
</script>

<style scoped></style>
