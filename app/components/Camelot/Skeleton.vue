<template>
  <template v-if="isLoading">
    <!-- Cyber Layout -->
    <div
      v-if="themeMode === 'cyber'"
      class="overflow-hidden relative w-full h-full skeleton cyber-skeleton"
      v-bind="$attrs"
    >
      <div class="cyber-flash-bar" />
      <div class="cyber-matrix-overlay" />
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
.skeleton.cyber-skeleton {
  background-color: rgba(255, 0, 85, 0.12);
  border: 1px solid rgba(255, 0, 85, 0.3);
  animation: none;
}
.cyber-matrix-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#ff0055 1.2px, transparent 1.2px);
  background-size: 6px 6px;
  opacity: 0.2;
  pointer-events: none;
}
.cyber-flash-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 240, 255, 0.5) 50%,
    transparent
  );
  animation: cyber-sweep 2s linear infinite;
  pointer-events: none;
  filter: drop-shadow(0 0 6px #00f0ff);
}
@keyframes cyber-sweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
</style>
