<template>
  <CamelotBaseDialogV2>
    <template #wrapper>
      <div class="wrapper">
        <slot />
      </div>
    </template>
  </CamelotBaseDialogV2>
</template>

<script setup lang="ts">
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100vh);
}

dialog {
  position: fixed;
  height: 100vh;
  pointer-events: painted;
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100vw; /* 宽度占满 */
  max-width: 100vw;
}

.wrapper {
  position: fixed;
  bottom: 0px;
}
</style>
