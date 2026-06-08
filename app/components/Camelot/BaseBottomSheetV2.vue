<template>
  <CamelotBaseDialogV2>
    <template #wrapper>
      <div
        class="wrapper"
        :class="[themeMode]"
      >
        <!-- Sci-fi Layout -->
        <CamelotScifiFrame
          v-if="themeMode === 'scifi'"
          variant="2-corner"
          focused
          :show-grid="false"
          class="w-screen max-h-[85vh] text-primary"
        >
          <div class="p-4 bg-slate-950/90 overflow-auto">
            <div class="w-12 h-1 bg-primary/30 rounded-full mx-auto mb-4" />
            <slot />
          </div>
        </CamelotScifiFrame>

        <!-- Cupertino Layout -->
        <div
          v-else-if="themeMode === 'cupertino'"
          class="sheet-container cupertino-sheet w-screen max-h-[85vh] rounded-t-[20px] bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-black/20 p-4 shadow-2xl overflow-auto"
        >
          <div class="w-10 h-1.5 bg-slate-400/50 rounded-full mx-auto mb-4" />
          <slot />
        </div>

        <!-- Aqua Frosted Glass Layout -->
        <div
          v-else-if="themeMode === 'aqua'"
          class="sheet-container aqua-sheet aqua-glass max-h-[85vh] w-screen overflow-auto rounded-t-3xl p-4"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-on-surface/20" />
          <slot />
        </div>

        <!-- Material Layout (Default) -->
        <div
          v-else
          class="sheet-container material-sheet w-screen max-h-[85vh] rounded-t-[28px] bg-surface-container-low p-4 shadow-2xl overflow-auto border-t border-outline-variant/10"
        >
          <div class="w-8 h-1 bg-outline-variant rounded-full mx-auto mb-4" />
          <slot />
        </div>
      </div>
    </template>
  </CamelotBaseDialogV2>
</template>

<script setup lang="ts">
const { themeMode } = useCamelotTheme()
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100vh);
}

dialog {
  position: fixed;
  height: 100vh;
  pointer-events: painted;
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
}

.wrapper {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 60;
  animation: slide-up 0.35s cubic-bezier(0.32, 0.94, 0.6, 1) forwards;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
