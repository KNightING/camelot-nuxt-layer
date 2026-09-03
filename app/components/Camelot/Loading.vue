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
            <!-- Aqua Split / Merge Cycle：1 顆 → 炸開為 2 → 炸開為 4 → 旋入合一 → 蓄力再爆開 -->
            <div
              v-if="themeMode === 'aqua'"
              class="aqua-split"
            >
              <!-- 公轉層：整組等速旋轉，球體進出中心的軌跡因此是螺旋而非直線 -->
              <div class="aqua-split-spin">
                <!-- 臂：決定該球在圓周上的角度，分裂時把子球從母球身上岔開 -->
                <div
                  v-for="index in 4"
                  :key="index"
                  class="aqua-split-branch"
                  :class="`aqua-split-branch-${index}`"
                >
                  <span
                    class="aqua-split-ball"
                    :class="`aqua-split-ball-${index}`"
                  />
                </div>
              </div>
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
/* Aqua Split / Merge Cycle
   節奏為「長停留 × 快移動」：時間主要花在 2 顆與 4 顆兩個狀態上，
   轉換各約 0.3s。兩處分裂前都先蓄力膨脹，合一後的能量不洩掉、
   直接轉為下一輪的蓄力，因此整個循環沒有靜止的一顆球。 */
.aqua-split {
  position: relative;
  width: 112px;
  height: 112px;
  /* 分裂／公轉／四顆球共用同一個週期，改這裡就整組一起變速 */
  --cml-aqua-split-duration: 6s;
}
.aqua-split-spin,
.aqua-split-branch {
  position: absolute;
  inset: 0;
}
/* 公轉每循環 3 圈（約 180°/s）：週期拉長讓分裂與合併看得清楚，仍維持環繞的速度感 */
.aqua-split-spin {
  animation: aqua-split-spin var(--cml-aqua-split-duration) linear infinite;
}
.aqua-split-branch-1 {
  transform: rotate(0deg);
}
.aqua-split-branch-2 {
  transform: rotate(180deg);
}
/* 第 3、4 顆由母球所在的角度岔開 90°，四顆最終等分圓周 */
.aqua-split-branch-3 {
  animation: aqua-split-fork-3 var(--cml-aqua-split-duration) linear infinite;
}
.aqua-split-branch-4 {
  animation: aqua-split-fork-4 var(--cml-aqua-split-duration) linear infinite;
}
.aqua-split-ball {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  border-radius: 9999px;
  /* 球體走色彩角色而非 surface：載入遮罩本身是半透明黑底，
     surface 色在深色模式下幾乎與遮罩同色，球會看不見。
     不透明填色也讓 backdrop-filter 失去意義，一併省下該層合成。 */
  background-color: color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 88%, white);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.55),
    0 2px 16px color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 55%, transparent);
  animation: none var(--cml-aqua-split-duration) linear infinite;
}
.aqua-split-ball-1 {
  animation-name: aqua-split-ball-1;
}
.aqua-split-ball-2 {
  animation-name: aqua-split-ball-2;
}
.aqua-split-ball-3 {
  animation-name: aqua-split-ball-3;
}
.aqua-split-ball-4 {
  animation-name: aqua-split-ball-4;
}
@keyframes aqua-split-spin {
  to { transform: rotate(1080deg); }
}
@keyframes aqua-split-fork-3 {
  0%, 36% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.08, 1.2, 0.3, 1);
  }
  44%, 100% { transform: rotate(90deg); }
}
@keyframes aqua-split-fork-4 {
  0%, 36% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.08, 1.2, 0.3, 1);
  }
  44%, 100% { transform: rotate(270deg); }
}
/* 母球：週期起點即上一輪蓄力的頂點，不回落而直接拋射 */
@keyframes aqua-split-ball-1 {
  0% {
    transform: translateX(0) scale(1.5);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.08, 1.25, 0.3, 1);
  }
  8%, 26% {
    transform: translateX(27px) scale(0.82);
    opacity: 0.85;
    animation-timing-function: cubic-bezier(0.5, 0, 0.78, 0.6);
  }
  36% {
    transform: translateX(27px) scale(1.08);
    opacity: 0.9;
    animation-timing-function: cubic-bezier(0.08, 1.25, 0.3, 1);
  }
  44%, 74% {
    transform: translateX(41px) scale(0.6);
    opacity: 0.62;
    animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.55);
  }
  84% {
    transform: translateX(0) scale(0.6);
    opacity: 0.85;
    animation-timing-function: cubic-bezier(0.5, 0, 0.78, 0.6);
  }
  100% {
    transform: translateX(0) scale(1.5);
    opacity: 1;
  }
}
/* 第 2 顆自母球分出；透明度只在與母球完全重合時切換，故看不出淡入淡出 */
@keyframes aqua-split-ball-2 {
  0% {
    transform: translateX(0) scale(1.5);
    opacity: 0;
    animation-timing-function: cubic-bezier(0.08, 1.25, 0.3, 1);
  }
  2% { opacity: 0.85; }
  8%, 26% {
    transform: translateX(27px) scale(0.82);
    opacity: 0.85;
    animation-timing-function: cubic-bezier(0.5, 0, 0.78, 0.6);
  }
  36% {
    transform: translateX(27px) scale(1.08);
    opacity: 0.9;
    animation-timing-function: cubic-bezier(0.08, 1.25, 0.3, 1);
  }
  44%, 74% {
    transform: translateX(41px) scale(0.6);
    opacity: 0.62;
    animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.55);
  }
  84% {
    transform: translateX(0) scale(0.32);
    opacity: 0.62;
  }
  85% { opacity: 0; }
  100% {
    transform: translateX(0) scale(1.5);
    opacity: 0;
  }
}
@keyframes aqua-split-ball-3 {
  0%, 36% {
    transform: translateX(27px) scale(1.08);
    opacity: 0;
    animation-timing-function: cubic-bezier(0.08, 1.25, 0.3, 1);
  }
  38% { opacity: 0.62; }
  44%, 74% {
    transform: translateX(41px) scale(0.6);
    opacity: 0.62;
    animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.55);
  }
  84% {
    transform: translateX(0) scale(0.32);
    opacity: 0.62;
  }
  85% { opacity: 0; }
  100% {
    transform: translateX(27px) scale(1.08);
    opacity: 0;
  }
}
@keyframes aqua-split-ball-4 {
  0%, 36% {
    transform: translateX(27px) scale(1.08);
    opacity: 0;
    animation-timing-function: cubic-bezier(0.08, 1.25, 0.3, 1);
  }
  38% { opacity: 0.62; }
  44%, 74% {
    transform: translateX(41px) scale(0.6);
    opacity: 0.62;
    animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.55);
  }
  84% {
    transform: translateX(0) scale(0.32);
    opacity: 0.62;
  }
  85% { opacity: 0; }
  100% {
    transform: translateX(27px) scale(1.08);
    opacity: 0;
  }
}
/* 降級：停用公轉與分裂，只留一顆靜態球 */
@media (prefers-reduced-motion: reduce) {
  .aqua-split-spin,
  .aqua-split-branch,
  .aqua-split-ball {
    animation: none;
  }
  .aqua-split-ball-2,
  .aqua-split-ball-3,
  .aqua-split-ball-4 {
    opacity: 0;
  }
}
</style>
