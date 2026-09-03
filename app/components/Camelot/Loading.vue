<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpening"
          class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/35 backdrop-blur-xs select-none pointer-events-auto"
        >
          <div
            class="flex items-center justify-center"
            :class="[themeMode]"
          >
            <!--
              Aqua：磨砂玻璃膠囊 + 內部流光。
              另外三個主題的指示器都是圓形（Material 環、Cupertino 葉片、Sci-fi 雷達），
              這裡刻意用水平膠囊做區隔，也呼應 Aqua 通篇的 pill 語彙。
            -->
            <div
              v-if="themeMode === 'aqua'"
              class="aqua-capsule"
            >
              <!-- 副流光：更寬更淡、相位錯開，疊出玻璃裡的層次 -->
              <span class="aqua-capsule-sheen" />
              <!-- 主流光：一段柔邊的角色色，來回穿過膠囊 -->
              <span class="aqua-capsule-flow" />
            </div>

            <!-- Sci-fi Loading Radar -->
            <div
              v-else-if="themeMode === 'scifi'"
              class="scifi-radar"
            >
              <CamelotScifiReticle active />
              <div class="radar-circle" />
              <div class="radar-scanner" />
              <span class="radar-text">SYS_LOAD...</span>
            </div>

            <!-- Cupertino iOS Spinner -->
            <div
              v-else-if="themeMode === 'cupertino'"
              class="ios-spinner"
            >
              <div
                v-for="i in 8"
                :key="i"
                class="ios-blade"
              />
            </div>

            <!-- Material Spinner -->
            <div
              v-else
              class="material-spinner"
            >
              <svg viewBox="25 25 50 50">
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  class="path"
                />
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
/* ===== Aqua：磨砂玻璃膠囊 + 流光 =====
   主流光與副流光共用同一個週期變數，改速度只要動這一個值。 */
.aqua-capsule {
  --cml-aqua-loading-duration: 2.6s;
  position: relative;
  width: 168px;
  height: 16px;
  border-radius: 9999px;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--color-surface, white) 45%, transparent);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid color-mix(in srgb, white 24%, transparent);
  box-shadow:
    inset 0 1px 0 0 color-mix(in srgb, white 38%, transparent),
    0 8px 24px -8px color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 60%, transparent);
  animation: aqua-capsule-breathe var(--cml-aqua-loading-duration) ease-in-out infinite;
}

.aqua-capsule-flow,
.aqua-capsule-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: 9999px;
  will-change: transform;
}

/* 主流光：角色色由淡到亮再到淡，兩端柔化成一段「液體」而不是硬塊 */
.aqua-capsule-flow {
  width: 46%;
  background-image: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 55%, transparent),
    color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 92%, white),
    color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 55%, transparent),
    transparent
  );
  animation: aqua-capsule-flow var(--cml-aqua-loading-duration) cubic-bezier(0.62, 0, 0.38, 1) infinite;
}

/* 副流光：白色高光，寬一點淡一點，相位落後主流光約 1/6 週期 */
.aqua-capsule-sheen {
  width: 70%;
  background-image: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, white 26%, transparent),
    transparent
  );
  animation: aqua-capsule-sheen var(--cml-aqua-loading-duration) cubic-bezier(0.62, 0, 0.38, 1) infinite;
  animation-delay: calc(var(--cml-aqua-loading-duration) / -6);
}

/* translateX 以自身寬度為單位：-100% 完全離開左緣，
   (168 / 自身寬度) × 100% 完全離開右緣（46% → 218%、70% → 143%） */
@keyframes aqua-capsule-flow {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(218%); }
}
@keyframes aqua-capsule-sheen {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(143%); }
}
@keyframes aqua-capsule-breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.18); }
}

/* 降級：停住流光，留一段靜態的填色表示「進行中」 */
@media (prefers-reduced-motion: reduce) {
  .aqua-capsule,
  .aqua-capsule-flow,
  .aqua-capsule-sheen {
    animation: none;
  }
  .aqua-capsule-flow {
    transform: translateX(60%);
  }
}
</style>
