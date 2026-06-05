<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition>
        <template v-if="currentToast">
          <div
            :key="currentToast.id"
            class="fixed translate-x-[-50%] translate-y-[-50%] left-[50%]"
            :class="{
              'top-[50%] ': direction === 'center',
              'bottom-[10%]': direction === 'bottom',
              'top-[10%]': direction === 'top',
            }"
            :style="{ zIndex: props.zIndex }"
          >
            <div class="container" :class="[themeMode]">
              <slot :toast="currentToast">
                <!-- Cyber Layout -->
                <div
                  v-if="themeMode === 'cyber'"
                  class="toast-box cyber border border-[#ff0055] bg-black text-white py-3 px-5 shadow-2xl font-mono text-xs tracking-wider min-w-[240px] max-w-[400px] relative"
                >
                  <div class="cyber-brackets top-left-bracket">[</div>
                  <div class="cyber-brackets bottom-right-bracket">]</div>
                  <div class="text-[#00f0ff] uppercase font-bold text-[9px] mb-1 tracking-widest border-b border-gray-800 pb-0.5">
                    // BROADCAST_ALERT
                  </div>
                  <span>{{ currentToast?.message }}</span>
                </div>

                <!-- Sci-fi Layout -->
                <CamelotScifiFrame
                  v-else-if="themeMode === 'scifi'"
                  variant="2-corner"
                  focused
                  :show-grid="false"
                  :show-scanline="false"
                  class="toast-box scifi text-primary"
                >
                  <div class="py-2.5 px-5 bg-slate-950/95 font-mono text-xs tracking-wider">
                    <span>[STATUS_MSG]: {{ currentToast?.message }}</span>
                  </div>
                </CamelotScifiFrame>

                <!-- Cupertino Layout -->
                <div
                  v-else-if="themeMode === 'cupertino'"
                  class="toast-box cupertino bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-black/20 text-slate-800 dark:text-slate-100 text-sm rounded-[12px] py-3 px-5 shadow-xl font-medium min-w-[200px] text-center"
                >
                  {{ currentToast?.message }}
                </div>

                <!-- Material Layout (Default) -->
                <div
                  v-else
                  class="toast-box material bg-slate-800 dark:bg-slate-200 text-slate-100 dark:text-slate-900 text-sm rounded-[4px] py-3.5 px-6 shadow-lg min-w-[288px] max-w-[568px] flex items-center justify-between"
                >
                  {{ currentToast?.message }}
                </div>
              </slot>
            </div>
          </div>
        </template>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  zIndex?: number
  direction?: 'top' | 'bottom' | 'center'
}>(), {
  zIndex: 1000,
  direction: 'bottom',
})

const toast = useCamelotToast()
const { currentToast } = toast

const { themeMode } = useCamelotTheme()
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active .container,
.v-leave-active .container{
  transition: transform 0.4s ease;
}

.v-enter-from .container {
  transform: translateY(30px);
}

.v-leave-to .container {
  transform: translateY(-30px);
}

/* Cyber styles */
.toast-box.cyber {
  box-shadow: 0 0 15px rgba(255, 0, 85, 0.4);
}
.toast-box.cyber .cyber-brackets {
  position: absolute;
  color: #ff0055;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}
.toast-box.cyber .top-left-bracket { top: -2px; left: -6px; }
.toast-box.cyber .bottom-right-bracket { bottom: -2px; right: -6px; }
</style>
