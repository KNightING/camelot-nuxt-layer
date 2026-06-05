<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpening"
          class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/35 backdrop-blur-xs select-none pointer-events-auto"
        >
          <div class="flex items-center justify-center" :class="[themeMode]">
            <!-- Cyber Loading Radar -->
            <div v-if="themeMode === 'cyber'" class="cyber-loader">
              <div class="cyber-loader-ring">
                <div class="ring-core" />
                <div class="tech-text">LOADING...</div>
              </div>
            </div>

            <!-- Sci-fi Loading Radar -->
            <div v-else-if="themeMode === 'scifi'" class="scifi-radar">
              <CamelotScifiReticle active />
              <div class="radar-circle" />
              <div class="radar-scanner" />
              <span class="radar-text">SYS_LOAD...</span>
            </div>

            <!-- Cupertino iOS Spinner -->
            <div v-else-if="themeMode === 'cupertino'" class="ios-spinner">
              <div v-for="i in 8" :key="i" class="ios-blade" />
            </div>

            <!-- Material Spinner -->
            <div v-else class="material-spinner">
              <svg viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20" fill="none" class="path" />
              </svg>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const { isOpening } = useLoading()
const { themeMode } = useCamelotTheme()
</script>

<style scoped>
/* Material spinner */
.material-spinner {
  width: 50px;
  height: 50px;
  animation: rotate-spinner 2s linear infinite;
}
.material-spinner .path {
  stroke: var(--cml-color-current-color, var(--color-primary));
  stroke-width: 4;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}
@keyframes rotate-spinner {
  100% { transform: rotate(360deg); }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Cupertino (iOS) spinner */
.ios-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}
.ios-blade {
  position: absolute;
  top: 0;
  left: 18px;
  width: 4px;
  height: 12px;
  background-color: var(--cml-c-m3-on-surface, #8e8e93);
  border-radius: 2px;
  transform-origin: 2px 20px;
  animation: ios-fade 1s linear infinite;
}
.ios-blade:nth-child(1) { transform: rotate(0deg); animation-delay: -0.875s; }
.ios-blade:nth-child(2) { transform: rotate(45deg); animation-delay: -0.75s; }
.ios-blade:nth-child(3) { transform: rotate(90deg); animation-delay: -0.625s; }
.ios-blade:nth-child(4) { transform: rotate(135deg); animation-delay: -0.5s; }
.ios-blade:nth-child(5) { transform: rotate(180deg); animation-delay: -0.375s; }
.ios-blade:nth-child(6) { transform: rotate(225deg); animation-delay: -0.25s; }
.ios-blade:nth-child(7) { transform: rotate(270deg); animation-delay: -0.125s; }
.ios-blade:nth-child(8) { transform: rotate(315deg); animation-delay: 0s; }

@keyframes ios-fade {
  from { opacity: 1; background-color: var(--cml-color-current-color, var(--cml-c-m3-on-surface, #000)); }
  to { opacity: 0.2; }
}

/* Sci-Fi Loading Radar */
.scifi-radar {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radar-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 20%, transparent);
  border-radius: 50%;
}
.radar-scanner {
  position: absolute;
  width: 100%;
  height: 100%;
  border-top: 2px solid var(--cml-color-current-color, var(--color-primary));
  border-radius: 50%;
  animation: radar-rotate 2s linear infinite;
}
.radar-text {
  font-family: monospace;
  font-size: 0.65rem;
  color: var(--cml-color-current-color, var(--color-primary));
  text-shadow: 0 0 5px var(--cml-color-current-color, var(--color-primary));
  animation: blink 1s linear infinite;
}
@keyframes radar-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Cyber Loading */
.cyber-loader {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cyber-loader-ring {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px dashed #ff0055;
  border-radius: 50%;
  animation: rotate-ring 4s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring-core {
  position: absolute;
  inset: 6px;
  border: 2px solid #00f0ff;
  border-right-color: transparent;
  border-left-color: transparent;
  border-radius: 50%;
  animation: rotate-ring-reverse 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 4px #00f0ff);
}
.tech-text {
  font-family: monospace;
  font-size: 0.65rem;
  color: #00f0ff;
  text-shadow: 0 0 5px #00f0ff;
  animation: blink 1s linear infinite;
}
@keyframes rotate-ring {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes rotate-ring-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
</style>
