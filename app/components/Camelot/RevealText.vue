<template>
  <span
    class="reveal-text"
    :class="{
      play: trigger === 'auto' || (trigger === 'manual' && play),
      hover: trigger === 'hover',
    }"
    :style="{
      '--angle': angle,
      '--duration': duration,
      '--delay': delay,
      '--fill': fill,
      '--bg-size': bgSize,
    }"
    :data-text="text"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  text: string
  trigger?: 'auto' | 'hover' | 'manual'
  play?: boolean
  angle?: string
  duration?: string
  delay?: string
  fill?: string
  bgSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'auto',
  play: false,
  angle: '0deg',
  duration: '500ms',
  delay: '0s',
  fill: '#ff4d4f',
  bgSize: 'auto',
})
</script>

<style scoped>
@property --p {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

.reveal-text {
  position: relative;
  display: inline-block;
  font-size: 64px;
  color: #111;
  --p: 0%;
  overflow: hidden;
}

.reveal-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: transparent;
  -webkit-text-fill-color: transparent;
  background: var(--fill);
  background-size: var(--bg-size);
  background-position: center;
  -webkit-background-clip: text;
  background-clip: text;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 1;
  -webkit-mask-image: linear-gradient(var(--angle), #000 0, #000 var(--p), transparent calc(var(--p) + 0.1%));
  mask-image: linear-gradient(var(--angle), #000 0, #000 var(--p), transparent calc(var(--p) + 0.1%));
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

/* 自動 / 手動播放 */
.reveal-text.play::after {
  animation: reveal var(--duration) linear var(--delay) forwards;
}

/* hover 模式 */
.reveal-text.hover:hover::after {
  animation: reveal var(--duration) linear var(--delay) forwards;
}

@keyframes reveal {
  to { --p: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-text::after { --p: 100%; }
  .reveal-text.play::after,
  .reveal-text.hover:hover::after { animation: none !important; }
}
</style>
