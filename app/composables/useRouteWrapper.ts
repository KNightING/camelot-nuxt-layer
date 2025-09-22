import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from '#vue-router'

export const useRouteWrapper = (path: string) => {
  const router = useRouter()
  const route = useRoute()

  return {
    to: (options?: RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) => {
      return router.push({ path, ...(options ?? {}) })
    },
    replace: (options?: RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) => {
      return router.replace({ path, ...(options ?? {}) })
    },
    path,
  }
}
