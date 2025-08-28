<template>
  <slot />
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  lightColorScheme?: CustomColorScheme<T>
  darkColorScheme?: CustomColorScheme<T>
}>()

const { lightColorScheme, darkColorScheme, usedColorScheme } = useCustomColorScheme<T>(
  document.documentElement,
  {
    lightColorScheme: props.lightColorScheme,
    darkColorScheme: props.darkColorScheme,
  },
)

onUpdated(() => {
  lightColorScheme.value = { ...lightColorScheme.value, ...props.lightColorScheme }
  darkColorScheme.value = { ...darkColorScheme.value, ...props.darkColorScheme }
})

onMounted(() => {
  lightColorScheme.value = { ...lightColorScheme.value, ...props.lightColorScheme }
  darkColorScheme.value = { ...darkColorScheme.value, ...props.darkColorScheme }
})

defineExpose({ usedColorScheme })
</script>

<style scoped></style>
