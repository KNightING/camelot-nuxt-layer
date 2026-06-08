<template>
  <template v-if="isLoading">
    <!-- Aqua Frosted Glass Layout -->
    <div
      v-if="themeMode === 'aqua'"
      class="skeleton aqua-skeleton relative h-full w-full overflow-hidden"
      v-bind="$attrs"
    >
      <div class="aqua-shimmer" />
    </div>

    <!-- Sci-fi Layout (using CamelotScifiFrame without borders and cut corners) -->
    <CamelotScifiFrame
      v-else-if="themeMode === 'scifi'"
      :show-borders="false"
      :clip-corners="false"
      :show-pulse="true"
      :show-grid="true"
      :show-scanline="true"
      focused
      v-bind="$attrs"
      class="w-full h-full min-h-[24px]"
    />

    <!-- Cupertino & Material (Default) Layout -->
    <div
      v-else
      class="overflow-hidden relative w-full h-full skeleton"
      :class="[themeMode]"
      v-bind="$attrs"
    >
      <div class="flash" />
    </div>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<{
  isLoading?: boolean
}>(), {
  isLoading: true,
})

const { themeMode } = useCamelotTheme()
</script>

<style scoped>
.skeleton {
  --background-color: 145, 145, 145;
  animation: skeleton-animate 4s ease-out infinite;
}

.skeleton.cupertino {
  --background-color: 220, 220, 220;
  background-color: rgba(var(--background-color), 0.4);
  animation: skeleton-animate-cupertino 1.5s ease-in-out infinite alternate;
}

.skeleton.cupertino .flash {
  display: none;
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

@keyframes skeleton-animate-cupertino {
  0% {
    background-color: rgba(var(--background-color), 0.3);
  }
  100% {
    background-color: rgba(var(--background-color), 0.75);
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
.skeleton.aqua-skeleton {
  background-color: color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 8%, transparent);
  border-radius: 12px;
  animation: none;
}
.aqua-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 20%,
    color-mix(in srgb, white 55%, transparent) 50%,
    transparent 80%
  );
  transform: translateX(-100%);
  animation: aqua-shimmer 1.6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes aqua-shimmer {
  to { transform: translateX(100%); }
}
</style>
