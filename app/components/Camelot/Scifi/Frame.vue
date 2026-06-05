<template>
  <div
    class="scifi-frame-wrapper"
    :style="[
      variant === '4-corner' ? { '--cml-frame-clip': 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)' } : {},
      !clipCorners ? { '--cml-frame-clip': 'none' } : {}
    ]"
  >
    <CamelotScifiReticle :active="activeReticle" />
    <div
      class="frame-container"
      :class="{ filled, focused, 'show-shine': showShine }"
      :style="{ '--cml-scifi-bg-opacity': showBorders ? undefined : '0%' }"
    >
      <div v-if="showCorners && clipCorners" class="corner-decoration top-left" />
      <div v-if="showCorners && clipCorners" class="corner-decoration bottom-right" />
      
      <div class="frame-inner">
        <div v-if="showGrid" class="grid-bg" />
        <div v-if="showPulse" class="pulse-bg" />
        <div v-if="showScanline" class="scanline" />
        <div class="shine-glide" />
        
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: '2-corner' | '4-corner'
    showGrid?: boolean
    showScanline?: boolean
    showPulse?: boolean
    focused?: boolean
    filled?: boolean
    showShine?: boolean
    activeReticle?: boolean
    showBorders?: boolean
    showCorners?: boolean
    clipCorners?: boolean
  }>(),
  {
    variant: '2-corner',
    showGrid: true,
    showScanline: true,
    showPulse: false,
    focused: false,
    filled: false,
    showShine: false,
    activeReticle: false,
    showBorders: true,
    showCorners: true,
    clipCorners: true,
  }
)
</script>

<style scoped>
.scifi-frame-wrapper {
  display: block;
  position: relative;
  box-sizing: border-box;
  transition: all 0.3s ease;
  --cml-scifi-color: var(--cml-color-current-color, var(--color-primary, currentColor));
  
  --cml-frame-clip: polygon(
    0% 0%, calc(100% - 10px) 0%, 100% 10px, 
    100% 100%, 10px 100%, 0% calc(100% - 10px)
  );
}

.frame-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  background: color-mix(in srgb, var(--cml-scifi-color) 40%, transparent);
  clip-path: var(--cml-frame-clip);
  padding: 1px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: background 0.3s ease;
}

.frame-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: color-mix(in srgb, var(--cml-scifi-color) var(--cml-scifi-bg-opacity, 5%), var(--cml-c-m3-surface, #fef7ff));
  clip-path: var(--cml-frame-clip);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.frame-container.filled {
  background: var(--cml-scifi-color);
}
.frame-container.filled .frame-inner {
  background: var(--cml-scifi-color);
}

/* Glow on focus */
.frame-container.focused {
  background: var(--cml-scifi-color);
  box-shadow: inset 0 0 15px color-mix(in srgb, var(--cml-scifi-color) 40%, transparent);
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--cml-scifi-color) 60%, transparent));
}

/* Shine Glide animation */
.shine-glide {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2) 50%,
    transparent
  );
  transform: skewX(-25deg);
  pointer-events: none;
  z-index: 10;
  opacity: 0;
}

.frame-container.show-shine .shine-glide {
  animation: shine-glide-anim 1s cubic-bezier(0.19, 1, 0.22, 1);
}

@keyframes shine-glide-anim {
  0% { left: -100%; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* Grid background */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(color-mix(in srgb, var(--cml-scifi-color) 10%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--cml-scifi-color) 10%, transparent) 1px, transparent 1px);
  background-size: 15px 15px;
  pointer-events: none;
  z-index: 0;
}

/* Pulse scan background */
.pulse-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg, 
    transparent 0%, 
    color-mix(in srgb, var(--cml-scifi-color), transparent 90%) 35%,
    color-mix(in srgb, var(--cml-scifi-color), transparent 70%) 50%, 
    color-mix(in srgb, var(--cml-scifi-color), transparent 90%) 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  pointer-events: none;
  z-index: 1;
  animation: pulse-scan-horizontal 3s linear infinite;
}

@keyframes pulse-scan-horizontal {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Scanline */
.scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--cml-scifi-color) 20%, transparent) 50%,
    transparent
  );
  background-size: 100% 4px;
  height: 100%;
  width: 100%;
  opacity: 0.1;
  pointer-events: none;
  z-index: 2;
  animation: scan 4s linear infinite;
}

@keyframes scan {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}

.content {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.corner-decoration {
  position: absolute;
  width: 24px;
  height: 24px;
  background: var(--cml-scifi-color);
  pointer-events: none;
  z-index: 5;
}
.top-left { 
  top: 0; 
  left: 0; 
  clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 3px, 3px 3px, 3px calc(100% - 6px), 0 100%);
}
.bottom-right { 
  bottom: 0; 
  right: 0; 
  clip-path: polygon(100% 100%, 0 100%, 6px calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 6px, 100% 0);
}
</style>
