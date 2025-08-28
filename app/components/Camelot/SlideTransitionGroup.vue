<template>
  <div class="relative flex h-full w-full justify-center items-center">
    <TransitionGroup
      :name="animeDirection"
      mode="out-in"
    >
      <template
        v-for="(item, idx) of items"
        :key="item.key"
      >
        <template v-if="idx === currentIndex">
          <div
            class="absolute"
          >
            <slot
              :item="item"
              :data="item.data"
              :index="idx"
            />
          </div>
        </template>
      </template>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  items: Items<T>
}>()

const animeDirection = ref('slide-left')

const currentIndex = defineModel<number>({ default: 0 })

const prev = () => {
  if (currentIndex.value <= 0) {
    return
  }
  animeDirection.value = 'slide-right'
  currentIndex.value--
}

const next = () => {
  if (currentIndex.value >= props.items.length) {
    return
  }
  animeDirection.value = 'slide-left'
  currentIndex.value++
}

defineExpose({
  prev,
  next,
})
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active{
  transition: all .4s ease-in-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
   transform: translateX(100%);
}
</style>
