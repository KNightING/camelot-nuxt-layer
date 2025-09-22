import type { PromisifyFn } from '@vueuse/core'

type UseFetchStreamReturn<T> = T & Promise<T>

export const useFetchStream = (
  url: MaybeRefOrGetter<string>,
  options: UseFetchStreamOptions = {},
) => {
  // 1. 建立響應式狀態
  const status = ref<'idle' | 'pending' | 'success' | 'aborted' | 'error'>('idle')
  const isStreaming = computed(() => status.value === 'pending')

  const error = shallowRef<Error | null>(null)
  // data 用來累積從 stream 收到的字串
  const data = ref<Uint8Array>(new Uint8Array())

  const {
    method = 'GET',
    headers = {},
    immediate = true,
    // 新增 onChunk 回呼，讓使用者可以處理每一塊收到的數據
    onChunk,
    // 新增 onFinish 回呼，在串流結束時觸發
    onFinish,
    // 新增 onError 回呼
    onError,
    keepData = true,
  } = options

  let abortController: AbortController | undefined

  // 中止請求的函數
  const abort = () => {
    status.value = 'aborted'
    abortController?.abort()
  }

  const shell = {
    data,
    status,
    isStreaming,
    error,
    abort,
    refresh: () => refresh(),
    clear: () => clear(),
  }

  const clear = () => {
    abortController?.abort()
    data.value = new Uint8Array()
    error.value = null
    status.value = 'idle'
    abortController = undefined
  }

  // 2. 核心 fetch 邏輯保持不變，但現在由 refresh/execute 函數包裹
  const refresh = async () => {
    // 重置狀態
    clear()
    status.value = 'pending'
    abortController = new AbortController()

    const realUrl = toValue(url)

    try {
      const response = await fetch(realUrl, {
        method,
        headers,
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      if (!response.body) {
        throw new Error('Response body is empty.')
      }

      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          await onFinish?.(data.value) // 串流結束時觸發回呼
          break
        }

        if (keepData) {
          data.value = concatUint8Arrays(data.value, value)
        }

        await onChunk?.(value) // 觸發 onChunk 回呼
      }

      status.value = 'success'
    }
    catch (e: any) {
      // 如果錯誤不是因為手動中止，才設置為 error 狀態
      if (e.name !== 'AbortError') {
        error.value = e
        status.value = 'error'
        onError?.(e)
        throw e // 讓 Promise reject
      }
    }
    finally {
      abortController = undefined
    }
  }

  const immediatePromise = immediate ? refresh() : Promise.resolve(shell)

  Object.assign(shell, {
    // 當外部 await shell 或 shell.then() 時，實際上是在操作 immediatePromise
    then: (onFulfilled: any, onRejected: any) => immediatePromise.then(onFulfilled, onRejected),
    catch: (onRejected: any) => immediatePromise.catch(onRejected),
    finally: (onFinally: any) => immediatePromise.finally(onFinally),
  })

  // 返回這個既是物件又是 Promise 的特殊物件
  // 我們使用型別斷言來告訴 TypeScript 我們知道自己在做什麼
  return shell as UseFetchStreamReturn<typeof shell>
}

// 擴充 Options 介面
export interface UseFetchStreamOptions {
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  immediate?: boolean
  onChunk?: (chunk: Uint8Array) => Promise<void>
  onFinish?: (fullData: Uint8Array) => Promise<void>
  onError?: (error: Error) => Promise<void>
  keepData?: boolean
}

const concatUint8Arrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const result = new Uint8Array(a.length + b.length)
  result.set(a, 0)
  result.set(b, a.length)
  return result
}
