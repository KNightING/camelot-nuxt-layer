<!-- 包裝Ripple的元件  -->
<template>
  <div
    id="container"
    ref="container"
    @pointerdown="onPointerDown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ rippleColor?: string }>()

const container = useTemplateRef('container')

const rippleColorCss = useElCssVar('--cml-c-ripple-color', container, { inherit: false })

/**
 * 容器矩形只在點擊當下需要，故就地量測一次。
 * 先前以 useElementBounding 常駐追蹤，等於每個 Ripple 實例都掛著 window scroll/resize 監聽——
 * 而本元件會被 Button / Tabs / NumberCounter 使用，單頁可達數十個實例。
 */
const onPointerDown = (e: PointerEvent) => {
  const el = container.value
  if (!el) return

  const rect = el.getBoundingClientRect()

  // 斜邊長 = 圓的半徑
  // 但是size需要設定成直徑所以要*2
  const size = Math.sqrt(Math.pow(rect.height, 2) + Math.pow(rect.width, 2)) * 2
  el.style.setProperty('--ripple-size', `${size}px`)

  const ripples = document.createElement('span')
  ripples.className = 'ripple'
  ripples.style.left = `${e.clientX - rect.left}px`
  ripples.style.top = `${e.clientY - rect.top}px`

  el.appendChild(ripples)

  setTimeout(() => {
    ripples.remove()
  }, 650)
}

// let clearOnPointerUpTimeout: NodeJS.Timeout | null = null

// const onPointerUp = () => {
//   isPointerDown.value = false

//   if (clearOnPointerUpTimeout) {
//     clearTimeout(clearOnPointerUpTimeout)
//   }

//   clearOnPointerUpTimeout = setTimeout(() => {
//     document.querySelectorAll('.ripple').forEach((ripple) => {
//       ripple.remove()
//     })
//   }, 650)
// }

onUpdated(() => {
  const rgba = useColor().hexToRgbaArray(props.rippleColor)
  if (rgba) {
    rippleColorCss.value = `${rgba[0]},${rgba[1]},${rgba[2]}`
  }
})
</script>

<style scoped>
#container {
  position: relative;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
}

:deep(.ripple) {
  position: absolute;
  background: radial-gradient(#0000, var(--cml-c-ripple-color));
  transform: translate(-50%, -50%);
  pointer-events: none;
  border-radius: 50%;
  animation: animate 600ms ease-in;
}
@keyframes animate {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: var(--ripple-size);
    height: var(--ripple-size);
    opacity: 0;
  }
}
</style>
