import type { RouteLocationNormalized, RouteQueryAndHash, RouteLocationRaw } from '#vue-router'

export interface NavigateToOptions {
  replace?: boolean
  redirectCode?: number
  external?: boolean
}

export type CamelotHistory = {
  path: string
  name?: string | symbol | null
  pos: number
}

export type SingleOptions = {
  replace?: boolean
  checkName?: boolean
  /**
   * task 是 會從HistoryStack中找到，如果有重複的，會直接跳轉到該頁面
   * only 是 清除HistoryStack中所有頁面的紀錄，然後再跳轉到該頁面
   */
  mode?: 'task' | 'only'
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

  public get name() {
    return useRouter().resolve(this._path).name
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

  public async single(options?: SingleOptions & {
    queryAndHash?: RouteQueryAndHash
  }) {
    const { single } = useCamelotRouter()
    return await single({ path: this._path, ...options?.queryAndHash }, { ...options })
  }

  public append(path: string) {
    path = `${this._path}/${path}`.replace(/\/\//g, '/')
    return new CamelotPath(path)
  }
}

const historyStack = ref<CamelotHistory[]>([])

export const useCamelotRouter = () => {
  const router = useRouter()

  const findHistory = (to: RouteLocationRaw, options?: {
    checkName?: boolean
  }) => {
    const { checkName = true } = options || {}

    // 透過 router.resolve 解析出完整的路由資訊，藉此取得 route name
    const resolved = router.resolve(to)

    return historyStack.value.find((item) => {
      // 1. 如果有 name，代表是具名路由，只要 name 相同就被視為是「同一頁」 (忽略 Params 差異)
      if (checkName && resolved.name && item.name === resolved.name) return true

      // 2. 退回使用 path 進行基礎比對
      if (typeof to === 'string') return item.path === to || item.path === resolved.path
      return item.path === to.path || item.path === resolved.path
    })
  }

  const single = async (to: RouteLocationRaw, options?: SingleOptions) => {
    const {
      checkName = true,
      replace = true,
      mode = 'task',
    } = options || {}

    const currentPos = window.history.state?.position || 0

    if (mode === 'only') {
      if (historyStack.value.length > 0) {
        const firstHistory = historyStack.value[0]
        if (firstHistory && currentPos > firstHistory.pos) {
          const delta = firstHistory.pos - currentPos
          // 退回我們有紀錄的最深處 (Hard Reset)
          router.go(delta)
        }
      }
      // 將我們自己的歷史紀錄清空
      historyStack.value = []

      // 替換成目標頁面，作為新的起點
      // delay
      await new Promise(resolve => setTimeout(resolve, 100))
      await router.replace(to)
      return
    }

    const target = findHistory(to, { checkName })

    if (target && target.pos < currentPos) {
      const delta = target.pos - currentPos
      // 如果需要更新 Query，可以在 go 之後處理，或者搭配 replace
      router.go(delta)
      await new Promise(resolve => setTimeout(resolve, 100))
      await router.replace(to)
    }
    else {
      // 如果不存在歷史紀錄，就直接導向
      if (replace) {
        await router.replace(to)
        return
      }

      await router.push(to)
    }
  }

  const toPath = (path: string) => {
    return new CamelotPath(path)
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
      existingHistory.name = to.name
    }
    else {
      // 新增
      historyStack.value.push({
        path: to.path,
        name: to.name,
        pos: currentPos,
      })
    }
  }

  const canBack = () => {
    return !!useRouter().options.history.state.back
  }

  /**
   * @description 導向上一頁
   * @param inApp 是否檢查 App 內歷史堆疊
   */
  const back = (inApp: boolean = true) => {
    if (inApp && !canBack()) return
    router.back()
  }

  return {
    findHistory,
    syncHistory,
    back,
    forward: router.forward,
    push: router.push,
    replace: router.replace,
    go: router.go,
    single,
    canBack,
    toPath,
  }
}
