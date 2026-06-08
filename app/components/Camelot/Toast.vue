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
            <div
              class="container"
              :class="[themeMode]"
            >
              <slot :toast="currentToast">
                <!-- Aqua Frosted Glass Layout -->
                <div
                  v-if="themeMode === 'aqua'"
                  class="toast-box aqua-glass text-on-surface min-w-[200px] max-w-[400px] rounded-2xl px-5 py-3 text-center text-sm font-medium"
                >
                  {{ currentToast?.message }}
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
</style>
