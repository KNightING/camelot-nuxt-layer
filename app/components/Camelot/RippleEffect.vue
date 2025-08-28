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

// let size: number | undefined = undefined;

const { height, width, x, y } = useElementBounding(container)

const rippleSizeCss = useElCssVar('--ripple-size', container)

const rippleColorCss = useElCssVar('--cml-c-ripple-color', container, { inherit: false })

watch([height, width], (nV) => {
  const height = nV[0]
  const width = nV[1]

  // 斜邊長 = 圓的半徑
  // 但是size需要設定成直徑所以要*2
  const size = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2)) * 2
  rippleSizeCss.value = `${size}px`
})

const onPointerDown = (e: MouseEvent) => {
  const ripples = document.createElement('span')
  ripples.className = 'ripple'
  ripples.style.left = `${e.clientX - x.value}px`
  ripples.style.top = `${e.clientY - y.value}px`

  container.value?.appendChild(ripples)

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
  background: radial-gradient(#0000, rgba(from var(--camelot-ripple-color) r g b / 1));
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
