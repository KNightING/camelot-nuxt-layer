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
        <CamelotToast />
        <CamelotErrorDialog />
        <CamelotLoading :type="aquaLoadingType" />
      </div>
    </CamelotColorSchemeProvider>
  </ClientOnly>
</template>

<script setup lang="ts">
// Loading 掛在 app.vue、切換 UI 在 pages/index.vue，用 useState 共用同一份狀態
const aquaLoadingType = useState<CamelotLoadingType>('aqua-loading-type', () => 'ripple')

const elCustomLightColorScheme = ref<CustomColorScheme<{ test: string }>>({
  primary: '#44ffFF',
  test: '#F40fFF',
})
</script>
