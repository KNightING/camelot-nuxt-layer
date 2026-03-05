import type { UseFetchOptions } from 'nuxt/app'
import type { FetchContext, FetchResponse, FetchError, ResponseType } from 'ofetch'
import type { NitroFetchOptions } from 'nitropack/types'

/**
 * refresh token handler 回傳 true 代表刷新成功，false 代表刷新失敗（例如 refresh token 也過期了）
 */
export type RefreshTokenHandler = () => Promise<boolean>

/**
 * 判斷是否需要 refresh token 的自訂函式
 * 接收 response 物件，回傳 true 代表需要觸發 refresh token
 * 預設行為：判斷 response.status === 401
 *
 * @example
 * // 依據 response body 判斷
 * shouldRefreshToken: (response) => {
 *   return response.status === 401
 *     || response._data?.code === 'TOKEN_EXPIRED'
 * }
 */
export type ShouldRefreshTokenFn = (response: FetchResponse<any>) => boolean

const defaultShouldRefreshToken: ShouldRefreshTokenFn = response => response.status === 401

// ---- Token Refresh Lock ----
// 確保同一時間多個 API 同時收到 401 時，只會觸發一次 refresh token
let _refreshPromise: Promise<boolean> | null = null

const executeRefreshWithLock = async (handler: RefreshTokenHandler): Promise<boolean> => {
  if (_refreshPromise) {
    // 已經有一個 refresh 正在進行，等待它的結果
    return _refreshPromise
  }

  _refreshPromise = handler()
    .finally(() => {
      _refreshPromise = null
    })

  return _refreshPromise
}

export type Url = string | Request | Ref<string | Request> | (() => string | Request)

export enum ContentType {
  Json,
  MultiPartFormData,
}

export const useBasicToken = (account: string, pwd: string): string => {
  return btoa(`${account}:${pwd}`)
}

export type OnRequest = (context: FetchContext) => Promise<void> | void

export type OnResponse<R> = (context: FetchContext & {
  response: FetchResponse<R>
}) => Promise<void> | void

export type OnResponseError<R> = (context: FetchContext & {
  response: FetchResponse<R>
}) => Promise<void> | void

export const useBasicTokenRequest = (accountRef: MaybeRefOrGetter<string>, pwdRef: MaybeRefOrGetter<string>): OnRequest => {
  return ({ options }) => {
    const account = toValue(accountRef)
    const pwd = toValue(pwdRef)
    if (account.length <= 0 || pwd.length <= 0) {
      return
    }
    const token = useBasicToken(account, pwd)
    options.headers.set('Authorization', `Basic ${token}`)
  }
}

export const useBearerTokenRequest = (tokenRef: MaybeRefOrGetter<string>): OnRequest => {
  return ({ options }) => {
    const token = toValue(tokenRef)
    if (token.length <= 0) {
      return
    }
    options.headers.set('Authorization', `Bearer ${token}`)
  }
}

export const secureHeaderRequest: OnRequest = ({ options }) => {
  // 阻止瀏覽器探知檔案的 mime type
  options.headers.set('X-Content-Type-Options', 'nosniff')

  // 對 same-origin 的 URL 正常送出 Referer，但不對 cross-origin 送出
  options.headers.set('Referrer-Policy', 'same-origin')
}

export type ApiFetchOptions<
  DataT = any,
> = Omit<UseFetchOptions<DataT>, 'onRequest' | 'onRequestError' | 'onResponse' | 'onResponseError'> & {
  contentType?: ContentType
  /**
  * "default" 目前與 "clearNuxtData" 相同: 需先設定key
  */
  cachePolicy?: 'none' | 'cache'
  onRequests?: OnRequest[]
  onResponses?: OnResponse<DataT>[]
  onResponseErrors?: OnResponseError<DataT>[]
  addSecureHeaderRequest?: boolean
  transDateKeys?: string[]
  /**
   * 啟用自動 refresh token 機制
   * 當 shouldRefreshToken 條件成立時，會自動呼叫 refreshTokenHandler 刷新 token，
   * 並自動重新發送原始請求
   */
  autoRefreshToken?: boolean
  /**
   * refresh token 的實際處理函式
   * 回傳 true 代表刷新成功（token 已更新），false 代表刷新失敗
   * 需搭配 autoRefreshToken: true 使用
   */
  refreshTokenHandler?: RefreshTokenHandler
  /**
   * 自訂判斷是否需要 refresh token 的函式
   * 可依據 status code、response body 等任意條件判斷
   * 不設定則預設為 response.status === 401
   */
  shouldRefreshToken?: ShouldRefreshTokenFn
  /**
   * refresh retry 的最大次數，預設為 1
   */
  maxRefreshRetry?: number
}

const useApiFetch = <DataT>(
  url: Url,
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  options?: ApiFetchOptions<DataT>,
) => {
  if (!options) {
    options = {}
  }
  options.cachePolicy = options.cachePolicy ?? 'none'
  options.contentType = options.contentType ?? ContentType.Json
  options.addSecureHeaderRequest = options.addSecureHeaderRequest ?? true

  if (options && options.transDateKeys && options.transDateKeys.length > 0) {
    const reviveDatesByKeys = (obj: any, keys: string[]) => {
      if (!obj || typeof obj !== 'object') return obj

      for (const key of keys) {
        if (key in obj
          && (typeof obj[key] === 'string' || typeof obj[key] === 'number' || obj[key] instanceof Date)) {
          obj[key] = new Date(obj[key])
        }
      }
      return obj
    }

    options.transform = (response) => {
      const dateKeys = options?.transDateKeys || []
      if (Array.isArray(response)) {
        response.forEach(item => reviveDatesByKeys(item, dateKeys))
      }
      else {
        reviveDatesByKeys(response, dateKeys)
      }
      return response
    }
  }

  // 用來追蹤 useFetch 的 auto-retry 狀態
  let _useFetchRetryCount = 0
  const _maxRetry = options.maxRefreshRetry ?? 1
  const _shouldRefresh = options.shouldRefreshToken ?? defaultShouldRefreshToken

  const use = (coverOptions: ApiFetchOptions<DataT> = {}) => {
    const result = useFetch(
      url,
      {
        ...options,

        method,
        getCachedData(key: string) {
          if (options.cachePolicy === 'cache') {
            const data = useNuxtData<DataT>(key).data.value
            if (data) {
              return data
            }
          }
        },
        async onRequest(context: FetchContext<any, ResponseType>) {
          switch (options.contentType) {
            case ContentType.Json: {
              context.options.headers.set('Content-Type', 'application/json')
            }
          }

          if (options.addSecureHeaderRequest) {
            secureHeaderRequest(context)
          }

          if (options.onRequests) {
            for (const request of options.onRequests) {
              await request(context)
            }
          }
        },
        async onResponse(context: FetchContext<any, ResponseType> & { response: FetchResponse<DataT> }) {
          // refresh 成功後重新請求回來，重置 retry count
          _useFetchRetryCount = 0

          if (options.onResponses) {
            for (const onResponse of options.onResponses) {
              await onResponse(context)
            }
          }
        },
        async onResponseError(context: FetchContext<any, ResponseType> & { response: FetchResponse<DataT> }) {
          // 自動 refresh token 機制 for useFetch
          if (
            options.autoRefreshToken
            && options.refreshTokenHandler
            && _shouldRefresh(context.response)
            && _useFetchRetryCount < _maxRetry
          ) {
            _useFetchRetryCount++
            const refreshed = await executeRefreshWithLock(options.refreshTokenHandler)
            if (refreshed) {
              // token 已刷新，在 nextTick 後自動 refresh useFetch
              await nextTick()
              result.refresh()
              return
            }
          }

          if (options.onResponseErrors) {
            for (const onResponseError of options.onResponseErrors) {
              await onResponseError(context)
            }
          }
        },
        ...coverOptions,
      },
    )
    return result
  }

  const useFetchBetter = (coverOptions: ApiFetchOptions<DataT> = {}) => {
    const {
      data,
      refresh,
      error,
      clear,
      status,
    } = use(coverOptions)

    const idle = computed(() => {
      return status.value === 'idle'
    })

    const pending = computed(() => {
      return status.value === 'pending'
    })

    const success = computed(() => {
      return status.value === 'success'
    })

    return {
      data,
      refresh,
      error,
      clear,
      status,
      idle,
      pending,
      success,
    }
  }

  /**
   * Lazy for useFetchBetter
   *
   * No Watch
   * No Immediate
   * No Dedupe
   */
  const useLazyFetch = (coverOptions: ApiFetchOptions<DataT> = {}) => useFetchBetter({
    dedupe: 'defer',
    immediate: false,
    watch: false,
    ...coverOptions,
  })

  const _doFetch = (
    coverOptions: NitroFetchOptions<any> = {},
    _refreshSignal?: { needed: boolean },
  ): Promise<DataT> => {
    let header: HeadersInit | undefined

    if (isRef(options.headers)) {
      header = toValue(options.headers) as HeadersInit
    }
    else {
      header = options.headers as HeadersInit
    }

    let realUrl = url
    if (isRef(url)) {
      realUrl = toValue(url)
    }

    if (realUrl instanceof Request) {
      realUrl = realUrl.url
    }
    else if (realUrl instanceof Function) {
      realUrl = realUrl()
    }

    return $fetch<DataT>(realUrl as string,
      {
        method,
        baseURL: toValue(options.baseURL),
        headers: header,
        query: toValue(options.query),
        body: toValue(options.body),
        credentials: toValue(options.credentials),
        mode: toValue(options.mode),
        redirect: toValue(options.redirect),
        referrer: toValue(options.referrer),
        referrerPolicy: toValue(options.referrerPolicy),
        async onRequest(context: FetchContext<any, ResponseType>) {
          switch (options.contentType) {
            case ContentType.Json: {
              context.options.headers.set('Content-Type', 'application/json')
            }
          }

          if (options.addSecureHeaderRequest) {
            secureHeaderRequest(context)
          }

          if (options.onRequests) {
            for (const request of options.onRequests) {
              await request(context)
            }
          }
        },
        async onResponse(context: FetchContext<any, ResponseType> & { response: FetchResponse<DataT> }) {
          if (options.onResponses) {
            for (const onResponse of options.onResponses) {
              await onResponse(context)
            }
          }
        },
        async onResponseError(context: FetchContext<any, ResponseType> & { response: FetchResponse<DataT> }) {
          // 標記是否需要 refresh token（支援 ignoreResponseError 模式）
          if (
            _refreshSignal
            && options.autoRefreshToken
            && options.refreshTokenHandler
            && _shouldRefresh(context.response)
          ) {
            _refreshSignal.needed = true
          }

          if (options.onResponseErrors) {
            for (const onResponseError of options.onResponseErrors) {
              await onResponseError(context)
            }
          }
        },
        parseResponse: (response) => {
          const json = JSON.parse(response) as DataT
          const oOptions = toValue(options)
          if (response && oOptions && oOptions?.transform) {
            return oOptions.transform(json)
          }
          return json
        },
        ...coverOptions,
      }) as Promise<DataT>
  }

  const fetch = async (coverOptions: NitroFetchOptions<any> = {}, _retryCount = 0): Promise<DataT> => {
    const maxRetry = options.maxRefreshRetry ?? 1
    const refreshSignal = { needed: false }

    let result: DataT | undefined
    let caughtError: any = null

    try {
      result = await _doFetch(coverOptions, refreshSignal)
    }
    catch (error: any) {
      caughtError = error
    }

    // 自動 refresh token 機制 for $fetch
    // 透過 signal 模式，同時支援 ignoreResponseError（不拋異常）和一般模式（拋異常）
    if (refreshSignal.needed && _retryCount < maxRetry) {
      const refreshed = await executeRefreshWithLock(options.refreshTokenHandler!)
      if (refreshed) {
        // token 已刷新，重新呼叫原始 API
        return fetch(coverOptions, _retryCount + 1)
      }
    }

    if (caughtError) {
      throw caughtError
    }

    return result!
  }

  return {
    useFetch: use,
    useFetchBetter,
    useLazyFetch,
    fetch,
  }
}

export const useBaseApi = (baseOptions: ApiFetchOptions<any>) => {
  const get = <DataT>(url: Url, options?: ApiFetchOptions<DataT>) =>
    useApiFetch<DataT>(url, 'get', {
      ...baseOptions,
      ...(options ?? {}),
    })

  const post = <DataT>(url: Url, options?: ApiFetchOptions<DataT>) =>
    useApiFetch<DataT>(url, 'post', {
      ...baseOptions,
      ...(options ?? {}),
    })

  const put = <DataT>(url: Url, options?: ApiFetchOptions<DataT>) =>
    useApiFetch<DataT>(url, 'put', {
      ...baseOptions,
      ...(options ?? {}),
    })

  const patch = <DataT>(url: Url, options?: ApiFetchOptions<DataT>) =>
    useApiFetch<DataT>(url, 'patch', {
      ...baseOptions,
      ...(options ?? {}),
    })

  const del = <DataT>(url: Url, options?: ApiFetchOptions<DataT>) =>
    useApiFetch<DataT>(url, 'delete', {
      ...baseOptions,
      ...(options ?? {}),
    })

  return {
    get,
    post,
    patch,
    put,
    del,
  }
}

export class BaseApi {
  private baseOptions: ApiFetchOptions<any>
  public api: ReturnType<typeof useBaseApi>

  public constructor(baseOptions: ApiFetchOptions<any>) {
    this.baseOptions = baseOptions
    this.api = useBaseApi(this.baseOptions)
  }
}
