<template>
  <div
    class="camelot-scifi-reticle"
    :class="{ active, hoverable }"
  >
    <div class="bracket top-left" />
    <div class="bracket top-right" />
    <div class="bracket bottom-left" />
    <div class="bracket bottom-right" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean
  hoverable?: boolean
}>()
</script>

<style scoped>
.camelot-scifi-reticle {
  display: block;
  position: absolute;
  inset: -8px;
  pointer-events: none;
  z-index: 10;
  --cml-reticle-color: var(--cml-color-current-color, var(--color-primary, currentColor));
}

.camelot-scifi-reticle.hoverable {
  pointer-events: auto;
}

.bracket {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--cml-reticle-color);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  opacity: 0;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  transform: translate(-12px, -12px);
}
.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  transform: translate(12px, -12px);
}
.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  transform: translate(-12px, 12px);
}
.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  transform: translate(12px, 12px);
}

.camelot-scifi-reticle.active .bracket,
.camelot-scifi-reticle.hoverable:hover .bracket {
  opacity: 1;
  filter: drop-shadow(0 0 5px var(--cml-reticle-color));
}

.camelot-scifi-reticle.active .top-left,
.camelot-scifi-reticle.hoverable:hover .top-left {
  transform: translate(0, 0);
}
.camelot-scifi-reticle.active .top-right,
.camelot-scifi-reticle.hoverable:hover .top-right {
  transform: translate(0, 0);
}
.camelot-scifi-reticle.active .bottom-left,
.camelot-scifi-reticle.hoverable:hover .bottom-left {
  transform: translate(0, 0);
}
.camelot-scifi-reticle.active .bottom-right,
.camelot-scifi-reticle.hoverable:hover .bottom-right {
  transform: translate(0, 0);
}
</style>
