<template>
  <ClientOnly>
    <CamelotColorSchemeProvider
      :light-color-scheme="elCustomLightColorScheme"
    >
      <div class="min-h-screen bg-surface transition-all duration-300 flex flex-col">
        <NuxtLoadingIndicator />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </CamelotColorSchemeProvider>
  </ClientOnly>
</template>

<script setup lang="ts">
const elCustomLightColorScheme = ref<CustomColorScheme<{ test: string }>>({
  primary: '#44ffFF',
  test: '#F40fFF',
})
</script>
