export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { syncHistory } = useCamelotRouter()

  // 在導航完全結束、URL 已變更、history.state 已更新後執行
  router.afterEach((to) => {
    syncHistory(to)
  })
})
