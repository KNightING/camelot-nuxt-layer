<template>
  <template v-if="isMobile && $slots.mobile">
    <slot name="mobile" />
  </template>
  <template v-else-if="isTablet && ($slots.tablet || (!disabledDownward && $slots.mobile))">
    <template v-if="$slots.tablet">
      <slot name="tablet" />
    </template>
    <template v-else-if="$slots.mobile">
      <slot name="mobile" />
    </template>
  </template>
  <template v-else-if="isLaptop && ($slots.laptop || (!disabledDownward && ($slots.tablet || $slots.mobile)))">
    <template v-if="$slots.laptop">
      <slot name="laptop" />
    </template>
    <template v-else-if="$slots.tablet">
      <slot name="tablet" />
    </template>
    <template v-else-if="$slots.mobile">
      <slot name="mobile" />
    </template>
  </template>
  <template v-else-if="isDesktop && ($slots.desktop || (!disabledDownward && ($slots.laptop || $slots.tablet || $slots.mobile)))">
    <template v-if="$slots.desktop">
      <slot name="desktop" />
    </template>
    <template v-else-if="$slots.laptop">
      <slot name="laptop" />
    </template>
    <template v-else-if="$slots.tablet">
      <slot name="tablet" />
    </template>
    <template v-else-if="$slots.mobile">
      <slot name="mobile" />
    </template>
  </template>
  <template v-else>
    <slot
      :is-mobile="isMobile"
      :is-tablet="isTablet"
      :is-laptop="isLaptop"
      :is-desktop="isDesktop"
    />
  </template>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /**
   *  關閉向下相容
   */
  disabledDownward?: boolean
}>(), {
})

const { isMobile, isTablet, isLaptop, isDesktop } = useDeviceBreakpoints()
</script>

<style scoped>

</style>
