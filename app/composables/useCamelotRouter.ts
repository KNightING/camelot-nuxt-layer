import type { RouteLocationNormalized, RouteQueryAndHash, RouteLocationRaw } from '#vue-router'

export interface NavigateToOptions {
  replace?: boolean
  redirectCode?: number
  external?: boolean
}

export type CamelotHistory = {
  path: string
  pos: number
}

export class CamelotPath {
  constructor(path: string) {
    this._path = path.replace(/\/\//g, '/')
    if (this._path !== '/' && this._path.endsWith('/')) {
      this._path = this._path.substring(0, this._path.length - 1)
    }
  }

  private _path: string

  public get path() {
    return this._path
  }

  public get fullPath() {
    let path = this._path
    if (path.charAt(0).toString() === '/') {
      path = path.substring(1, path.length)
    }
    return `${window.location.origin}${useRuntimeConfig().app.baseURL}${path}`
  }

  public async to(queryAndHash?: RouteQueryAndHash) {
    return await navigateTo({ path: this._path, ...queryAndHash })
  }

  public async replace(queryAndHash?: RouteQueryAndHash) {
    return await navigateTo(
      { path: this._path, ...queryAndHash },
      { replace: true },
    )
  }

  public append(path: string) {
    path = `${this._path}/${path}`.replace(/\/\//g, '/')
    return new CamelotPath(path)
  }
}

const historyStack = ref<CamelotHistory[]>([])

export const useCamelotRouter = () => {
  const router = useRouter()

  const findHistory = (to: RouteLocationRaw) => {
    return historyStack.value.find((item) => {
      if (typeof to === 'string') return item.path === to
      return item.path === to.path
    })
  }

  const single = async (to: RouteLocationRaw) => {
    const currentPos = window.history.state?.position || 0

    const target = findHistory(to)

    if (target && target.pos < currentPos) {
      const delta = target.pos - currentPos
      // 如果需要更新 Query，可以在 go 之後處理，或者搭配 replace
      router.go(delta)
      await router.replace(to)
    }
    else {
      await router.push(to)
    }
  }

  const syncHistory = (to: RouteLocationNormalized) => {
    const state = router.options.history.state
    const currentPos = state?.position as number
    if (currentPos === undefined) return

    const existingIndex = historyStack.value.findIndex(item => item.pos === currentPos)
    const existingHistory = historyStack.value[existingIndex]

    if (existingIndex !== -1 && existingHistory) {
      // 回歸或替換：更新最新的路徑細節 (包含新的 Query/Params)
      historyStack.value = historyStack.value.slice(0, existingIndex + 1)
      existingHistory.path = to.fullPath // 使用 fullPath 紀錄完整的 query/params
    }
    else {
      // 新增
      historyStack.value.push({
        path: to.path,
        pos: currentPos,
      })
    }
  }

  const canBack = () => {
    return !!useRouter().options.history.state.back
  }

  return {
    findHistory,
    syncHistory,
    back: router.back,
    forward: router.forward,
    push: router.push,
    replace: router.replace,
    go: router.go,
    single,
    canBack,
  }
}
