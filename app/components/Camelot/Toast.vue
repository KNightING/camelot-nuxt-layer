<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition>
        <template v-if="currentToast">
          <div
            :key="currentToast.id"
            class="fixed  translate-x-[-50%] translate-y-[-50%] left-[50%]"
            :class="{
              'top-[50%] ': direction === 'center',
              'bottom-[10%]': direction === 'bottom',
              'top-[10%]': direction === 'top',
            }"
            :style="{ zIndex: props.zIndex }"
          >
            <div class="container">
              <slot :toast="currentToast">
                <div class="bg-gray-300/70 text-gray-800 text-lg rounded-md py-2 px-4">
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
