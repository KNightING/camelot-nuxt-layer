<template>
  <div class="flex gap-2">
    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="back"
    >
      back {{ canBack }}
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page3').to()"
    >
      to page3 (to)
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page3').replace()"
    >
      to page3 (replace)
    </button>
  </div>
</template>

<script lang="ts" setup>
const { toPath, back, canBack } = useCamelotRouter()
</script>

<style>

</style>
