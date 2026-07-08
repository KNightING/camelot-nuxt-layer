<template>
  <!-- docked 時保留在容器內（被圓角 overflow 裁切）；水平需浮動時才 Teleport 至 body 固定視窗底 -->
  <Teleport
    to="body"
    :disabled="!floating"
  >
    <div
      v-if="visible"
      class="cml-overlay-scrollbar"
      :class="[orientation, { 'cml-overlay-scrollbar--floating': floating }]"
      :style="trackStyle"
    >
      <div
        class="cml-overlay-scrollbar__thumb"
        :style="thumbStyle"
        @pointerdown="onThumbDown"
        @pointermove="onThumbMove"
        @pointerup="onThumbUp"
        @pointercancel="onThumbUp"
        @pointerenter="onThumbEnter"
        @pointerleave="onThumbLeave"
      >
        <div
          class="cml-overlay-scrollbar__bar"
          :style="barStyle"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 目標捲動容器（附著其上，不自建容器） */
    container: HTMLElement | null
    /** 捲軸方向 */
    orientation: CamelotScrollbarOrientation
    /** 是否啟用「浮動到視窗底」（僅水平有意義） */
    floatingEnabled?: boolean
    /** 色彩角色：捲軸 thumb 上色 */
    color?: CamelotColorRole
    /** 主軸起點額外偏移（px）：例如垂直捲軸避開 sticky 表頭 */
    startInset?: number
  }>(),
  {
    floatingEnabled: false,
    color: 'primary',
    startInset: 0,
  },
)

const containerRef = toRef(props, 'container')

const {
  visible,
  floating,
  trackStyle,
  thumbStyle,
  barStyle,
  onThumbDown,
  onThumbMove,
  onThumbUp,
  onThumbEnter,
  onThumbLeave,
} = useCamelotOverlayScrollbar(
  containerRef,
  () => props.orientation,
  () => props.floatingEnabled,
  // Teleport 至 body 取不到元件內變數，改以全域角色色變數 var(--color-{role})
  () => `var(--color-${props.color})`,
  () => props.startInset,
)
</script>

<style scoped>
/* 定位（position/left/right/top/bottom）由 composable 依 docked/floating 態 inline 給值。
   僅 thumb 可互動，不攔截其餘點擊。 */
.cml-overlay-scrollbar {
  z-index: 35;
  pointer-events: none;
}

.cml-overlay-scrollbar--floating {
  z-index: 40;
}

.cml-overlay-scrollbar.horizontal {
  height: 10px;
}

.cml-overlay-scrollbar.vertical {
  width: 10px;
}

/* thumb：命中區（較大好抓取）；主軸尺寸/位移由 composable inline 驅動 */
.cml-overlay-scrollbar__thumb {
  position: absolute;
  pointer-events: auto;
  touch-action: none;
}

.cml-overlay-scrollbar.horizontal .cml-overlay-scrollbar__thumb {
  bottom: 0;
  height: 10px;
}

.cml-overlay-scrollbar.vertical .cml-overlay-scrollbar__thumb {
  right: 0;
  width: 10px;
}

/* bar：視覺膠囊；固定 12px，放大以 transform 動畫（水平 scaleY 往上、垂直 scaleX 往右）。
   顏色/淡邊由 composable inline 驅動。 */
.cml-overlay-scrollbar__bar {
  position: absolute;
  border-radius: 9999px;
  transition: transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.cml-overlay-scrollbar.horizontal .cml-overlay-scrollbar__bar {
  left: 0;
  right: 0;
  bottom: 0;
  height: 8px;
  transform-origin: center bottom;
}

.cml-overlay-scrollbar.vertical .cml-overlay-scrollbar__bar {
  top: 0;
  bottom: 0;
  right: 0;
  width: 8px;
  transform-origin: center right; /* 靠右、往左長 */
}
</style>
