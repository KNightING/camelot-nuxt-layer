export default defineNuxtRouteMiddleware((to, from) => {
  if (useRuntimeConfig().public.replaceEndSplash !== true) {
    return
  }

  if (to.path !== '/' && to.path.endsWith('/')) {
    const path = to.path.substring(0, to.path.length - 1)
    return navigateTo({
      ...to,
      path,
    })
  }
})
