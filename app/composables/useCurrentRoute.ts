/**
 * 目前useRoute()會發生未更新的問題，所以我們可以使用useRouter().currentRoute.value來取得目前的路由資訊
 *
 * issue: https://github.com/nuxt/nuxt/issues/28804
 * issue: https://github.com/nuxt/nuxt/issues/21340
 */
export const useCurrentRoute = () => useRouter().currentRoute.value
