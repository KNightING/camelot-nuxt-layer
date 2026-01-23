<template>
  <div
    ref="targetRef"
  >
    <div @click="onTargetClick">
      <slot />
    </div>

    <Teleport
      :to="teleportTo"
    >
      <CamelotGpu
        class="fixed pointer-events-none"
        :style="{
          zIndex: zIndex || 10,
          width: `${width}px`,
          height: `${height}px`,
          top: `${y}px`,
          left: `${x}px`,
        }"
      >
        <div
          class="absolute w-fit pointer-events-auto"
          :class="{
            'mx-1': !disabledAutoSpace && (x === 0 || isRight),
            'right-0': isRight,
            'left-0': !isRight,
            'bottom-full': isBottom,
            'top-full': !isBottom,
            'shadow': !disabledShadow,
            'min-w-full': !disabledSameTargetWidth,
          }"
        >
          <CamelotExpanded
            ref="popupRef"
            :expanded="open"
          >
            <slot name="popup" />
          </CamelotExpanded>
        </div>
      </CamelotGpu>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { isClient, type MaybeElement, type MaybeElementRef } from '@vueuse/core'
import type { CamelotExpanded } from '#components'

/**
 * description: CamelotPopupV2 是一個可點擊開啟的彈出視窗組件，支持自動調整位置和大小。
 *
 * 注意: 因為使用fixed定位
 * 如果父元素有設定transform, perspective, filter, will-change等屬性，可能會導致fixed定位失效。
 * 這是一個 CSS 的重要概念，也是一個常見的「陷阱」。
 */
const props = defineProps<{
  zIndex?: number
  disabled?: boolean

  /**
   * 關閉陰影
   */
  disabledShadow?: boolean

  /**
   * 關閉window滑動時 自動關閉popup
   */
  disabledCloseWhenScrolling?: boolean

  /**
   * 自動調節左右空間
   */
  disabledAutoSpace?: boolean

  /**
   * 手動控制開啟關閉
   */
  manual?: boolean

  /**
   * 調整垂直位置
   */
  verticalPosition?: 'auto' | 'top' | 'bottom'

  isClickInside?: (string | MaybeElementRef<MaybeElement>)[]

  disabledClickOutside?: boolean

  /**
   * popup是否需要跟隨目標寬度
   */
  disabledSameTargetWidth?: boolean

  teleport?: string | MaybeElementRef<MaybeElement>
}>()

const open = defineModel<boolean>('open', { default: false })

const targetRef = useTemplateRef('targetRef')

const popupRef = useTemplateRef<InstanceType<typeof CamelotExpanded>>('popupRef')

const ignore = computed(() => {
  return [popupRef.value?.$el, ...(props.isClickInside ?? [])]
})

if (!props.manual && !props.disabledClickOutside) {
  onClickOutside(targetRef, event => open.value = false, {
    ignore: ignore,
  })
}

const { x, y, width, height, bottom, update } = useElementBounding(targetRef)

const { height: windowHeight, width: windowWidth } = useWindowSize()

useWindowScroll({
  onScroll(e) {
    if (!props.disabledCloseWhenScrolling) {
      open.value = false
    }
  },
})

/**
 * 是否超出視窗底部
 */
const isBottom = computed(() => {
  // 如果設定為top, 返回true, popup將永遠在目標上方
  if (props.verticalPosition === 'top') {
    return true
  }

  // 如果設定為bottom, 返回false, popup將永遠在目標下方
  if (props.verticalPosition === 'bottom') {
    return false
  }

  if (isClient) {
    return bottom.value + (popupRef.value?.contentHeight ?? 0) > windowHeight.value
  }
  return false
})

const isRight = computed(() => {
  if (isClient) {
    return x.value + (popupRef.value?.contentWidth ?? 0) > windowWidth.value
  }
  return false
})

const onTargetClick = () => {
  if (props.manual) {
    return
  }

  if (!props.disabled) {
    open.value = !open.value
  }
}

onUpdated(() => {
  if (props.disabled) {
    open.value = false
  }
})

const updateOnRequestAnimationFrame = () => {
  requestAnimationFrame(() => {
    update()
    updateOnRequestAnimationFrame()
  })
}

const parentIsDialog = computed(() => {
  const checkIsDialog = (el?: Element | null) => {
    if (!el) return undefined
    if (el.tagName.toLowerCase() === 'dialog') return el
    return checkIsDialog(el.parentElement)
  }

  if (targetRef.value) {
    return checkIsDialog(targetRef.value.parentElement)
  }
  return undefined
})

/**
 * 父元素有 dialog 的 dialog本身 會建立一個新的 top layer 導致z-index多高都不會超過dialog的layer
 */
const teleportTo = computed(() => {
  if (props.teleport) {
    return props.teleport
  }
  return parentIsDialog.value ? parentIsDialog.value : document.body
})

watch(targetRef, (targetRef) => {
  if (targetRef && targetRef instanceof HTMLElement) {
    const scrollParent = useScrollParent(targetRef)

    if (scrollParent.value) {
      // console.log(scrollParent.value)
      scrollParent.value.addEventListener('scroll', () => {
        // 在dialog中 關閉popup， 目前顯示有問題
        if (!props.disabledCloseWhenScrolling || parentIsDialog.value) {
          open.value = false
        }
      })
    }
  }
})

onMounted(() => {
  updateOnRequestAnimationFrame()
})
</script>

<style scoped>

</style>
