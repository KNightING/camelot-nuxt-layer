<template>
  <div class="flex gap-2">
    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="back"
    >
      back {{ canBack() }}
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page2').to()"
    >
      to page2 (to)
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page2').replace()"
    >
      to page2 (replace)
    </button>
  </div>
</template>

<script lang="ts" setup>
const { toPath, back, canBack } = useCamelotRouter()
</script>

<style>

</style>
