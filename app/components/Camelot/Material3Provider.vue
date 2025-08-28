<template>
  <div ref="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Material3ColorSchemePartial } from '../../composables/useMaterial3ColorScheme'

const props = defineProps<{
  lightColorScheme?: Material3ColorSchemePartial
  darkColorScheme?: Material3ColorSchemePartial
}>()

const container = ref<HTMLElement>()

onMounted(() => {
  const { lightColorScheme: lcs, darkColorScheme: dcs } = useMaterial3ColorScheme(
    container,
    {
      lightColorScheme: props.lightColorScheme,
      darkColorScheme: props.darkColorScheme,
    },
  )
})
</script>

<style scoped></style>
