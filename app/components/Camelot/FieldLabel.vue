<template>
  <span
    v-if="label"
    class="text-on-surface"
    :class="themeMode === 'scifi'
      ? 'text-xs uppercase tracking-[0.1em]'
      : 'text-sm font-medium'"
  >{{ label }}<span
    v-if="required"
    class="ml-0.5 text-error"
  >*</span></span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    required?: boolean
  }>(),
  {
    label: '',
    required: false,
  },
)

const { themeMode } = useCamelotTheme()
</script>
