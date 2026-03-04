<template>
  <div class="flex gap-2">
    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="back()"
    >
      back {{ canBack() }}
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath(`/page/${nextCode}`).to()"
    >
      to page{{ nextCode }} (to)
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath(`/page/${nextCode}`).replace()"
    >
      to page{{ nextCode }} (replace)
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath(`/page/end`).to()"
    >
      to page/end (to)
    </button>
  </div>
</template>

<script lang="ts" setup>
const { toPath, back, canBack } = useCamelotRouter()

const route = useRoute()
const nextCode = computed(() => {
  return Number(route.params.code) + 1
})
</script>

<style>

</style>
