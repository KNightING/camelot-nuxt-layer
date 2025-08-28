<template>
  <div ref="provider">
    <slot />
  </div>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  lightColorScheme?: CustomColorScheme<T>
  darkColorScheme?: CustomColorScheme<T>
}>()

const provider = useTemplateRef('provider')

const { lightColorScheme, darkColorScheme, usedColorScheme } = useCustomColorScheme<T>(
  provider,
  {
    lightColorScheme: props.lightColorScheme,
    darkColorScheme: props.darkColorScheme,
  },
)

onUpdated(() => {
  lightColorScheme.value = { ...lightColorScheme.value, ...props.lightColorScheme }
  darkColorScheme.value = { ...darkColorScheme.value, ...props.darkColorScheme }
})

defineExpose({ usedColorScheme })
</script>

<style scoped></style>
