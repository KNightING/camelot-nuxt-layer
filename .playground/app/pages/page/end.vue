<template>
  <div class="flex gap-2">
    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page/1').single()"
    >
      single to page1
    </button>

    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page/1').single({ mode: 'only' })"
    >
      single to page1 (only)
    </button>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const { toPath, back, canBack } = useCamelotRouter()
</script>

<style>

</style>
