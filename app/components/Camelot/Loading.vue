<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpening"
          class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/35 backdrop-blur-xs select-none pointer-events-auto"
        >
          <div
            class="flex flex-col items-center justify-center gap-5"
            :class="[themeMode]"
          >
            <!--
              Aqua：兩種樣式，以 type 切換（其他主題各只有一種，會忽略此 prop）。
              兩者都刻意做成向心／原地的形狀，避免被讀成由左往右填滿的進度條。
            -->
            <template v-if="themeMode === 'aqua'">
              <!-- ripple（預設）：中心水滴呼吸，外圈同心圓一波波向外擴散淡出 -->
              <div
                v-if="type === 'ripple'"
                class="aqua-ripple"
              >
                <span
                  v-for="i in 3"
                  :key="i"
                  class="aqua-ripple-wave"
                  :class="`aqua-ripple-wave-${i}`"
                />
                <span class="aqua-ripple-droplet" />
              </div>

              <!-- bounce：三顆玻璃珠依序彈跳，起跳與落地各壓扁一次 -->
              <div
                v-else
                class="aqua-bounce"
              >
                <span
                  v-for="i in 3"
                  :key="i"
                  class="aqua-bounce-bead"
                  :class="`aqua-bounce-bead-${i}`"
                />
              </div>
            </template>

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

            <!--
              指示器下方的提示文字：由 useLoading().open(tag, text) / setText(tag, text) 驅動，
              可在同一次載入中換階段。沒有文字時整段不渲染，版面不會多出空位。
              以 Transition 做淡入淡出，換階段時不會硬跳。
            -->
            <Transition
              name="loading-text"
              mode="out-in"
            >
              <p
                v-if="text"
                :key="text"
                class="cml-loading-text"
                role="status"
                aria-live="polite"
              >
                {{ text }}
              </p>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * Aqua 主題的指示器樣式；其他主題各只有一種樣式，會忽略此 prop。
     * - `ripple`：水滴漣漪（預設）
     * - `bounce`：玻璃珠彈跳
     */
    type?: CamelotLoadingType
  }>(),
  { type: 'ripple' },
)

const {
  isOpening, text,
} = useLoading()
const { themeMode } = useCamelotTheme()
</script>

<style scoped>
/* 指示器下方的提示文字 */
.cml-loading-text {
  max-width: 16rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
  /* 遮罩固定是半透明深色，這裡不吃 surface / on-surface：淺色模式下那組會看不見 */
  color: rgba(255, 255, 255, 0.88);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}
/* sci-fi 的資訊都走等寬字，文字也跟著 */
.scifi .cml-loading-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.08em;
  color: var(--cml-color-current-color, var(--color-primary));
}

.loading-text-enter-active,
.loading-text-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.loading-text-enter-from,
.loading-text-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

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
/* ===== Aqua：共用的玻璃球體填色 =====
   走色彩角色而非 surface：載入遮罩本身是半透明黑底，surface 色在深色模式下
   幾乎與遮罩同色，球會看不見。不透明填色也讓 backdrop-filter 失去意義。 */
.aqua-ripple-droplet,
.aqua-bounce-bead {
  background-image: linear-gradient(
    165deg,
    color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 58%, white),
    var(--cml-color-current-color, var(--color-primary))
  );
  box-shadow:
    inset 0 2px 2px 0 rgba(255, 255, 255, 0.58),
    0 0 14px color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 58%, transparent);
}

/* ===== Aqua ・ ripple：水滴漣漪 ===== */
.aqua-ripple {
  --cml-aqua-ripple-duration: 2.8s;
  position: relative;
  display: flex;
  width: 96px;
  height: 96px;
  align-items: center;
  justify-content: center;
}
.aqua-ripple-wave {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1.5px solid color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 70%, transparent);
  animation: aqua-ripple-out var(--cml-aqua-ripple-duration) cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}
/* 三道波錯開 1/3 週期，看起來是連續不斷的擴散而非一次一發 */
.aqua-ripple-wave-2 { animation-delay: calc(var(--cml-aqua-ripple-duration) / -3); }
.aqua-ripple-wave-3 { animation-delay: calc(var(--cml-aqua-ripple-duration) / -1.5); }
.aqua-ripple-droplet {
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  animation: aqua-ripple-breathe var(--cml-aqua-ripple-duration) ease-in-out infinite;
}
/* 先縮再脹：讀起來像「滴下去」才盪出漣漪 */
@keyframes aqua-ripple-out {
  0% { transform: scale(0.28); opacity: 0; }
  12% { opacity: 0.75; }
  100% { transform: scale(1); opacity: 0; }
}
@keyframes aqua-ripple-breathe {
  0%, 100% { transform: scale(1); }
  12% { transform: scale(0.82); }
  40% { transform: scale(1.06); }
}

/* ===== Aqua ・ bounce：玻璃珠彈跳 ===== */
.aqua-bounce {
  --cml-aqua-bounce-duration: 1.1s;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 64px;
}
.aqua-bounce-bead {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  transform-origin: center bottom;
  animation: aqua-bounce-bead var(--cml-aqua-bounce-duration) cubic-bezier(0.3, 0, 0.4, 1) infinite;
}
.aqua-bounce-bead-2 { animation-delay: calc(var(--cml-aqua-bounce-duration) / 8.5); }
.aqua-bounce-bead-3 { animation-delay: calc(var(--cml-aqua-bounce-duration) / 4.2); }
/* 起跳與落地各壓扁一次，空中略微拉長——沒有這兩下會像等速上下平移 */
@keyframes aqua-bounce-bead {
  0% { transform: translateY(0) scale(1, 1); }
  12% { transform: translateY(0) scale(1.18, 0.82); }
  50% { transform: translateY(-34px) scale(0.94, 1.06); }
  88% { transform: translateY(0) scale(1.18, 0.82); }
  100% { transform: translateY(0) scale(1, 1); }
}

/* 降級：停住動畫，留靜態的球體表示「進行中」 */
@media (prefers-reduced-motion: reduce) {
  .aqua-ripple-wave,
  .aqua-ripple-droplet,
  .aqua-bounce-bead {
    animation: none;
  }
  .aqua-ripple-wave {
    opacity: 0.35;
  }
}
</style>
