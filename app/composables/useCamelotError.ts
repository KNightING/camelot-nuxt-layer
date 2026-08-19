/**
 * 全域錯誤佇列。與 Nuxt 內建的 `useError` 互補而非取代——
 * `useError` 只承載單一致命錯誤且會切換到 `error.vue`，
 * 這裡處理的是「非致命、可累積、逐一提示」的錯誤。
 *
 * 管線分三段，職責互不重疊：
 * `handle(raw)` → resolve（轉換器鏈，純轉換）→ intercept（攔截器鏈，副作用）→ enqueue
 */

/** 錯誤的嚴重程度；顯示層據此決定色彩角色 */
export type CamelotErrorLevel = 'error' | 'warning' | 'info'

/**
 * Camelot 的統一錯誤模型。
 * `TData` 為原始 payload 的型別，由轉換器決定要帶什麼進來。
 */
export interface CamelotErrorType<TData = unknown> {
  /** 入列時自動補上，用於精準移除佇列中的特定錯誤 */
  id?: string
  title?: string
  message?: string
  /** 需要富文字時使用；與 message 二擇一。內容必須來自可信來源 */
  messageHtml?: string
  /** HTTP status 或後端自訂的錯誤代碼 */
  code?: string | number
  /** 未指定時顯示層視為 'error' */
  level?: CamelotErrorLevel
  /** 轉換器帶入的原始資料 */
  data?: TData
  /** 使用者關閉此錯誤後執行；攔截器可於此掛上導頁等後續動作 */
  onConfirm?: () => void
  zIndex?: number
}

/**
 * 把任意原始錯誤轉成 {@link CamelotErrorType} 的轉換器。
 * 只負責轉換，副作用一律交給 {@link CamelotErrorInterceptor}。
 */
export interface CamelotErrorResolver<TData = unknown> {
  /** 供除錯與註銷辨識；同名註冊視為覆蓋 */
  name: string
  /** 數字大者先試；未指定為 0 */
  priority?: number
  /** 回傳 undefined 代表「處理不了」，交給下一個轉換器 */
  resolve: (raw: unknown) => CamelotErrorType<TData> | undefined
}

/**
 * 對已轉換的錯誤做副作用（清除權限、記錄 log、掛上 onConfirm…）。
 * 於轉換完成後、入列前執行。
 */
export interface CamelotErrorInterceptor<TData = unknown> {
  /** 供除錯與註銷辨識；同名註冊視為覆蓋 */
  name: string
  /** 數字大者先跑；未指定為 0 */
  priority?: number
  /** 回傳 true 代表「已完全處理」，該錯誤不入列、不顯示 */
  intercept: (error: CamelotErrorType<TData>) => boolean | undefined
}

/** {@link push} 的選項 */
export interface CamelotErrorOptions {
  /** 為 true 時先清空佇列，只保留這一筆 */
  only?: boolean
}

/** 內建轉換器的優先權；設為最低，確保消費端註冊的一律先試 */
const BUILT_IN_RESOLVER_PRIORITY = -100

/**
 * 轉換器與攔截器都是函式，無法通過 SSR 序列化，
 * 因此註冊表為模組層單例而非 useState。
 */
const resolverRegistry = new Map<string, CamelotErrorResolver>()
const interceptorRegistry = new Map<string, CamelotErrorInterceptor>()

/** 依優先權排序後的快取；註冊／註銷時失效，避免每次 handle 都重排 */
let sortedResolvers: CamelotErrorResolver[] | null = null
let sortedInterceptors: CamelotErrorInterceptor[] | null = null

const byPriorityDesc = (a: { priority?: number }, b: { priority?: number }): number =>
  (b.priority ?? 0) - (a.priority ?? 0)

const getSortedResolvers = (): CamelotErrorResolver[] => {
  sortedResolvers ??= [...resolverRegistry.values()].sort(byPriorityDesc)
  return sortedResolvers
}

const getSortedInterceptors = (): CamelotErrorInterceptor[] => {
  sortedInterceptors ??= [...interceptorRegistry.values()].sort(byPriorityDesc)
  return sortedInterceptors
}

/**
 * 註冊錯誤轉換器，回傳註銷函式。
 * 通常於 plugin 內註冊，例如把後端的自訂錯誤格式轉成 CamelotErrorType。
 */
export const registerErrorResolver = <TData>(resolver: CamelotErrorResolver<TData>): (() => void) => {
  // resolve 的回傳值是協變的，CamelotErrorType<TData> 可安全視為 CamelotErrorType<unknown>
  resolverRegistry.set(resolver.name, resolver as CamelotErrorResolver)
  sortedResolvers = null

  return () => {
    resolverRegistry.delete(resolver.name)
    sortedResolvers = null
  }
}

/**
 * 註冊錯誤攔截器，回傳註銷函式。
 * 適合處理 401 這類需要副作用的錯誤：清除權限、掛上導頁的 onConfirm。
 */
export const registerErrorInterceptor = <TData>(interceptor: CamelotErrorInterceptor<TData>): (() => void) => {
  // intercept 的參數是逆變的，編譯器無法自行放行；
  // 但實際傳入的錯誤物件正是該轉換器產出的，其 data 型別相符
  interceptorRegistry.set(interceptor.name, interceptor as CamelotErrorInterceptor)
  sortedInterceptors = null

  return () => {
    interceptorRegistry.delete(interceptor.name)
    sortedInterceptors = null
  }
}

/** ofetch 的 FetchError 形狀；不用 instanceof 以避免跨 bundle 的多實例誤判 */
interface FetchErrorLike {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: unknown
}

const isFetchErrorLike = (raw: unknown): raw is FetchErrorLike =>
  typeof raw === 'object' && raw !== null && 'statusCode' in raw

const fetchErrorResolver: CamelotErrorResolver = {
  name: 'camelot:fetch-error',
  priority: BUILT_IN_RESOLVER_PRIORITY,
  resolve: (raw) => {
    if (!isFetchErrorLike(raw)) {
      return undefined
    }

    return {
      code: raw.statusCode,
      message: raw.statusMessage ?? raw.message,
      data: raw.data,
    }
  },
}

const nativeErrorResolver: CamelotErrorResolver = {
  name: 'camelot:native-error',
  priority: BUILT_IN_RESOLVER_PRIORITY,
  resolve: (raw) => {
    if (!(raw instanceof Error)) {
      return undefined
    }

    return {
      message: raw.message,
      data: raw,
    }
  },
}

const stringResolver: CamelotErrorResolver = {
  name: 'camelot:string',
  priority: BUILT_IN_RESOLVER_PRIORITY,
  resolve: (raw) => {
    if (typeof raw !== 'string') {
      return undefined
    }

    return { message: raw }
  },
}

/**
 * 內建通用轉換器，開箱可用且不含任何業務語意。
 * 專案專屬格式（例如 401 導向登入）一律由消費端註冊。
 */
for (const resolver of [fetchErrorResolver, nativeErrorResolver, stringResolver]) {
  registerErrorResolver(resolver)
}

/** 所有轉換器都落空時的保底，確保錯誤不會被靜默吞掉 */
const toFallbackError = (raw: unknown): CamelotErrorType => ({
  level: 'error',
  data: raw,
})

const resolveError = (raw: unknown): CamelotErrorType => {
  for (const resolver of getSortedResolvers()) {
    const resolved = resolver.resolve(raw)
    if (resolved) {
      return resolved
    }
  }

  return toFallbackError(raw)
}

/** 回傳 true 代表已被攔截，該錯誤不應入列 */
const interceptError = (error: CamelotErrorType): boolean =>
  getSortedInterceptors().some(interceptor => interceptor.intercept(error) === true)

let camelotError: ReturnType<typeof CreateCamelotError> | null = null

export const useCamelotError = () => {
  if (!camelotError) {
    camelotError = CreateCamelotError()
  }
  return camelotError
}

const CreateCamelotError = () => {
  const errorState = useState<CamelotErrorType[]>('Camelot:Errors', () => [])

  /** 顯示層一次只呈現一則，關閉後自動接續下一筆 */
  const currentError = computed(() => errorState.value[0] ?? null)

  const clear = () => {
    errorState.value = []
  }

  /**
   * 入列一筆已是 CamelotErrorType 的錯誤。
   * 原始錯誤請改用 {@link handle}，以經過轉換器與攔截器。
   */
  const push = (error: CamelotErrorType, options?: CamelotErrorOptions): string => {
    const clone: CamelotErrorType = {
      id: Math.random().toString(36).substring(2, 11),
      ...error,
    }

    if (options?.only) {
      clear()
    }

    errorState.value = [...errorState.value, clone]

    // push 一律補上 id，此處必不為 undefined
    return clone.id!
  }

  /**
   * 接收任意原始錯誤的唯一入口：轉換 → 攔截 → 入列。
   * 回傳入列後的 id；被攔截器攔下時回傳 undefined。
   */
  const handle = (raw: unknown, options?: CamelotErrorOptions): string | undefined => {
    if (raw === null || raw === undefined) {
      return undefined
    }

    const error = resolveError(raw)

    if (interceptError(error)) {
      return undefined
    }

    return push(error, options)
  }

  /** 移除錯誤並觸發其 onConfirm；未指定 id 時移除當前顯示的那一筆 */
  const dismiss = (id?: string) => {
    const target = id ? errorState.value.find(e => e.id === id) : currentError.value
    if (!target) {
      return
    }

    errorState.value = errorState.value.filter(e => e.id !== target.id)
    target.onConfirm?.()
  }

  const watchToggle = (errorRef: Ref<unknown>) => watch(errorRef, (raw) => {
    if (!raw) {
      return
    }

    handle(raw)
  }, { immediate: true })

  /** 監看 useFetch 回傳的 error ref（單個或多個），非空即送進 handle */
  const watcher = (errors: Ref<unknown> | Ref<unknown>[]) => {
    if (Array.isArray(errors)) {
      errors.forEach(error => watchToggle(error))
      return
    }

    watchToggle(errors)
  }

  return {
    errors: errorState,
    currentError,
    push,
    handle,
    dismiss,
    clear,
    registerErrorResolver,
    registerErrorInterceptor,
    watch: watcher,
  }
}
