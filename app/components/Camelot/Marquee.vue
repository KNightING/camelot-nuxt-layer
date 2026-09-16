<template>
  <!--
    跑馬燈：軌道內渲染兩份內容（第二份 aria-hidden），位移一份的長度後無縫接續。
    animation-duration 由 ResizeObserver 量到的單份尺寸 ÷ speed 算出；
    內容未超出容器、或 prefers-reduced-motion 時不捲動、只留一份。
    容器尺寸由使用端決定（水平預設為 block 撐滿；垂直方向需自行給高度）。
  -->
  <div
    ref="containerRef"
    class="cml-marquee overflow-hidden"
    :class="{ 'cml-marquee-pausable': pauseOnHover }"
    :style="{ '--cml-marquee-gap': gap }"
  >
    <div
      class="cml-marquee-track flex w-max"
      :class="[
        isVertical ? 'h-max flex-col' : 'items-center',
        directionClass,
        { 'cml-marquee-running': shouldAnimate, 'cml-marquee-paused': paused },
      ]"
      :style="{ '--cml-marquee-duration': `${duration}s` }"
    >
      <div
        ref="contentRef"
        class="cml-marquee-content flex shrink-0"
        :class="isVertical ? 'flex-col' : 'items-center'"
      >
        <slot />
      </div>
      <div
        v-if="shouldAnimate"
        class="cml-marquee-content flex shrink-0"
        :class="isVertical ? 'flex-col' : 'items-center'"
        aria-hidden="true"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize, usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    direction?: 'left' | 'right' | 'up' | 'down'
    /** 捲動速度（px/s） */
    speed?: number
    /** 滑鼠移入暫停 */
    pauseOnHover?: boolean
    /** 兩份內容之間、以及內容項目之間的間距（CSS 長度） */
    gap?: string
    /** 外部暫停 */
    paused?: boolean
  }>(),
  {
    direction: 'left',
    speed: 60,
    pauseOnHover: true,
    gap: '1rem',
    paused: false,
  },
)

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const contentRef = useTemplateRef<HTMLElement>('contentRef')

const isVertical = computed(() => props.direction === 'up' || props.direction === 'down')

const directionClass = computed(() => {
  switch (props.direction) {
    case 'right':
      return 'cml-marquee-x cml-marquee-reverse'
    case 'up':
      return 'cml-marquee-y'
    case 'down':
      return 'cml-marquee-y cml-marquee-reverse'
    default:
      return 'cml-marquee-x'
  }
})

const {
  width: containerW, height: containerH,
} = useElementSize(containerRef)
const {
  width: contentW, height: contentH,
} = useElementSize(contentRef)

const reducedMotion = usePreferredReducedMotion()

// 單份內容的行進距離（含 gap）；未超出容器就不需要捲
const travel = computed(() => (isVertical.value ? contentH.value : contentW.value))
const overflowing = computed(() => travel.value > (isVertical.value ? containerH.value : containerW.value))

const shouldAnimate = computed(() =>
  overflowing.value && reducedMotion.value !== 'reduce' && props.speed > 0,
)

// 距離除以速度；gap 以 px 量不到（是 CSS 長度），由 CSS 端在位移量裡一併吃掉（見 keyframes）
const duration = computed(() => (props.speed > 0 ? travel.value / props.speed : 0))
</script>

<style scoped>
.cml-marquee-track {
  gap: var(--cml-marquee-gap);
}

.cml-marquee-content {
  gap: var(--cml-marquee-gap);
}

.cml-marquee-running.cml-marquee-x {
  animation: cml-marquee-x var(--cml-marquee-duration) linear infinite;
}

.cml-marquee-running.cml-marquee-y {
  animation: cml-marquee-y var(--cml-marquee-duration) linear infinite;
}

.cml-marquee-reverse {
  animation-direction: reverse;
}

/* 特異度必須壓過上方 .cml-marquee-running.cml-marquee-x 的 animation 縮寫
   （縮寫會把 play-state 重設為 running），否則外部 paused 無效 */
.cml-marquee-track.cml-marquee-running.cml-marquee-paused,
.cml-marquee-pausable:hover .cml-marquee-track.cml-marquee-running {
  animation-play-state: paused;
}

/* 位移一份內容 + 一個 gap，第二份剛好接到第一份的起點 */
@keyframes cml-marquee-x {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - var(--cml-marquee-gap) / 2));
  }
}

@keyframes cml-marquee-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(-50% - var(--cml-marquee-gap) / 2));
  }
}
</style>
