<script setup lang="ts">
const { myLayer } = useAppConfig()
</script>

<template>
  <button class="rounded-md border-2 bg-blue-400 p-2 text-white">
    <div>
      <h1>Hello Camelot!</h1>
      <pre>{{ myLayer }}</pre>
    </div>
  </button>
</template>
