<template>
  <div class="container" :class="[themeMode]">
    <template
      v-for="(value, index) in steps"
      :key="index"
    >
      <div
        class="step"
        @click="onStepClick(index)"
      >
        <div class="step-icon-line-group">
          <div
            v-if="index < steps.length - 1"
            class="step-line"
            :class="{
              'step-line-complete': index < step,
            }"
          />
          <div class="step-dot-container">
            <slot
              name="dot"
              :value="value"
              :index="index"
              :is-complete="isComplete(index)"
              :is-doing="isDoing(index)"
            >
              <div
                class="step-dot"
                :class="{
                  'step-dot-doing': isDoing(index),
                  'step-dot-complete': isComplete(index),
                }"
              >
                <span
                  v-if="isComplete(index)"
                  class="step-dot-text-complete"
                >✓</span>
                <span
                  v-else
                  class="step-dot-text"
                  :class="{
                    'step-dot-text-doing': isDoing(index),
                  }"
                >{{ themeMode === 'cyber' ? `0${index + 1}` : index + 1 }}</span>
              </div>
            </slot>
          </div>
        </div>
        <slot
          name="content"
          :value="value"
          :index="index"
          :is-complete="isComplete(index)"
          :is-doing="isDoing(index)"
        >
          <span
            class="step-content"
            :class="{
              'step-content-complete': isComplete(index) || isDoing(index),
            }"
          >{{ value }}</span>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { themeMode } = useCamelotTheme()
const props = defineProps<{
  steps: string[]

  /**
   * 啟動點擊可以切換step
   */
  enableChangeByClick?: boolean

  /**
   * 禁止點擊切換到下一頁
   */
  disableClickToNext?: boolean

  /**
   * 禁止點擊切換到上一頁
   */
  disableClickToPrevision?: boolean
}>()

const step = defineModel<number>({ default: 0 })

const onStepClick = (index: number) => {
  if (!props.enableChangeByClick) {
    return
  }

  if (props.disableClickToNext && index > step.value) {
    return
  }

  if (props.disableClickToPrevision && index < step.value) {
    return
  }

  step.value = index
}

const isDoing = (index: number) => {
  return index === step.value
}

const isComplete = (index: number) => {
  return index < step.value
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  gap: 0.25rem;
  align-items: center;
}

.step-icon-line-group {
  position: relative;
  width: 100%;
}

.step-line {
  position: absolute;
  width: 100%;
  height: 0.125rem;
  background-color: var(--cml-c-m3-outline);
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
}

.step-line-complete {
  background-color: var(--cml-c-m3-primary) !important;
}

.step-dot-container {
  left: 50%;
  position: relative;
  width: max-content;
  transform: translate(-50%, 0%);
}

.step-dot {
  aspect-ratio: 1 / 1;
  display: flex;
  position: relative;
  justify-content: center;
  border-radius: 9999px;
  border-width: 2px;
  border-color: #9ca3af;
  width: 1.5rem;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  background-color: var(--cml-c-m3-surface);
}

.step-dot-doing {
  border-color: var(--cml-c-m3-primary) !important;
}

.step-dot-complete {
  border-color: var(--cml-c-m3-primary) !important;
  background-color: var(--cml-c-m3-primary) !important;
}

.step-dot-text {
  user-select: none;
  color: rgb(156 163 175 / 1);
}

.step-dot-text-doing {
  color: var(--cml-c-m3-primary) !important;
}

.step-dot-text-complete {
  user-select: none;
  color: var(--cml-c-m3-on-primary);
}

.step-content {
  color: #9ca3af;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.step-content-complete {
  color: var(--cml-c-m3-primary) !important;
}

/* Cupertino style overrides */
.container.cupertino .step-line {
  height: 2px;
  background-color: var(--cml-c-m3-outline-variant, #e0e0e0);
}
.container.cupertino .step-line-complete {
  background-color: var(--cml-color-current-color, var(--color-primary)) !important;
}
.container.cupertino .step-dot {
  width: 1.25rem;
  border-width: 1px;
}
.container.cupertino .step-dot-doing {
  background-color: var(--cml-color-current-color, var(--color-primary)) !important;
  border-color: var(--cml-color-current-color, var(--color-primary)) !important;
}
.container.cupertino .step-dot-doing .step-dot-text {
  color: #ffffff !important;
}

/* Sci-fi style overrides */
.container.scifi .step-line {
  height: 2px;
  border-bottom: 1px dashed var(--cml-color-current-color, var(--color-primary));
  background-color: transparent;
  box-shadow: 0 0 5px var(--cml-color-current-color, var(--color-primary));
}
.container.scifi .step-line-complete {
  border-bottom-style: solid;
}
.container.scifi .step-dot {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  width: 1.75rem;
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border-color: color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 40%, transparent);
}
.container.scifi .step-dot-doing {
  border-color: var(--cml-color-current-color, var(--color-primary)) !important;
  box-shadow: 0 0 8px var(--cml-color-current-color, var(--color-primary));
}
.container.scifi .step-dot-complete {
  background-color: var(--cml-color-current-color, var(--color-primary)) !important;
  border-color: var(--cml-color-current-color, var(--color-primary)) !important;
}
.container.scifi .step-content {
  font-family: monospace;
  letter-spacing: 1px;
}
/* Cyber style overrides */
.container.cyber .step-line {
  height: 4px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 0, 85, 0.4);
}
.container.cyber .step-line-complete {
  border-color: #00f0ff !important;
  background-color: #00f0ff !important;
  box-shadow: 0 0 10px #00f0ff;
}
.container.cyber .step-dot {
  clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);
  width: 2rem;
  height: 2rem;
  border-radius: 0;
  border-width: 1px;
  background-color: #000;
  border-color: #ff0055;
  color: #ff0055;
  font-family: monospace;
  font-weight: 700;
  font-size: 0.75rem;
}
.container.cyber .step-dot-doing {
  border-color: #00f0ff !important;
  color: #00f0ff !important;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
}
.container.cyber .step-dot-doing .step-dot-text {
  color: #00f0ff !important;
  text-shadow: 0 0 5px #00f0ff;
}
.container.cyber .step-dot-complete {
  background-color: #00f0ff !important;
  border-color: #00f0ff !important;
  color: #000 !important;
  box-shadow: 0 0 10px #00f0ff;
}
.container.cyber .step-dot-text-complete {
  color: #000 !important;
  font-weight: 900;
}
.container.cyber .step-content {
  font-family: monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #ff0055;
  opacity: 0.7;
}
.container.cyber .step-content-complete {
  color: #00f0ff !important;
  opacity: 1;
  text-shadow: 0 0 4px #00f0ff;
}
</style>
