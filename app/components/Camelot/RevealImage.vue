<template>
  <div
    class="reveal-image"
    :class="{
      play: trigger === 'auto' || (trigger === 'manual' && play),
      hover: trigger === 'hover',
    }"
    :style="{
      '--angle': angle,
      '--duration': duration,
      '--delay': delay,
      '--img-url': `url('${src}')`,
    }"
  >
    <img
      ref="img"
      :src="src"
      :alt="alt"
      draggable="false"
      class="bw-img"
    >
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  trigger?: 'auto' | 'hover' | 'manual'
  play?: boolean
  angle?: string
  duration?: string
  delay?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  trigger: 'auto',
  play: false,
  angle: '0deg',
  duration: '800ms',
  delay: '0s',
})
</script>

<style scoped>
/* 註冊為 <percentage> 才能在 keyframes 中平滑插值；不自行註冊時會依賴 RevealText 是否剛好載入 */
@property --p {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

/* 只用一個 <img>，黑白和彩色 reveal 效果用 ::before 偽元素 */
  .reveal-image {
    position: relative;
    display: inline-block;
    --p: 0%;
  }
  .reveal-image .bw-img {
    display: block;
    width: 100%;
    height: auto;
    filter: grayscale(1);
    user-select: none;
    pointer-events: none;
  }
  .reveal-image::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    user-select: none;
    background: var(--img-url) center/cover no-repeat;
    mask-image: linear-gradient(var(--angle), #000 0, #000 var(--p), transparent calc(var(--p) + 0.1%));
    -webkit-mask-image: linear-gradient(var(--angle), #000 0, #000 var(--p), transparent calc(var(--p) + 0.1%));
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    transition: mask-image 0.3s;
  }
  .reveal-image.play::after {
    animation: reveal-img var(--duration) linear var(--delay) forwards;
  }
  .reveal-image.hover:hover::after {
    animation: reveal-img var(--duration) linear var(--delay) forwards;
  }
@keyframes reveal-img {
  to { --p: 100%; }
}
/* 減少動畫：彩色層直接完整顯示，不播放揭示動畫 */
@media (prefers-reduced-motion: reduce) {
  .reveal-image::after { --p: 100%; }
  .reveal-image.play::after,
  .reveal-image.hover:hover::after { animation: none !important; }
}
</style>
