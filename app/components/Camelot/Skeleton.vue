<template>
  <template v-if="isLoading">
    <div
      class="overflow-hidden relative w-full h-full skeleton"
      v-bind="$attrs"
    >
      <div class="flash" />
    </div>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script>
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  isLoading?: boolean
}>(), {
  isLoading: true,
})
</script>

<style scoped>
.skeleton {
  --background-color: 145, 145, 145;
  animation: skeleton-animate 4s ease-out infinite;
}

@keyframes skeleton-animate {
  0% {
    background-color: rgba(var(--background-color), .8);
  }

  75% {

    background-color: rgba(var(--background-color), .6);
  }

  100% {
    background-color: rgba(var(--background-color), .8);
  }
}

.flash {
  filter: blur(30px);
  position: absolute;
  top: 0px;
  left: 0px;
  width: 125%;
  height: 125%;
  background-image: linear-gradient(90deg, rgba(var(--background-color), .8) , rgba(var(--background-color), .6));
  pointer-events: none;
  animation: animate 2s ease-out infinite;
  animation-delay: .6s;
}

@keyframes animate {
  0% {
    transform: translateX(-110%) rotate(45deg) scale(1.25);
  }

  50% {
    transform: translateX(70%) rotate(225deg) scale(1.5);
  }

  100% {
    transform: translateX(250%) rotate(315deg) scale(1.25);
  }
}
</style>
