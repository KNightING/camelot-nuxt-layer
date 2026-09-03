import type { DebounceFilterOptions } from '@vueuse/core'

type LoadingCloseable = () => void

type ErrorFn = (ex: unknown) => Promise<void> | void

interface LoadingState {
  tags: string[]
  /** 各 tag 對應的提示文字；沒有文字的 tag 不會有鍵 */
  texts: Record<string, string>
}

const state = ref<LoadingState>({
  tags: [],
  texts: {},
})

export const useLoading = () => {
  const open = (tag: string, text?: string): LoadingCloseable => {
    // state.value.tags.push(tag);
    state.value = {
      ...state.value,
      tags: [...state.value.tags, tag],
      texts: typeof text === 'string'
        ? {
            ...state.value.texts,
            [tag]: text,
          }
        : state.value.texts,
    }

    return () => close(tag)
  }

  const close = (tag?: string) => {
    if (tag) {
      // state.value.tags = state.value.tags.filter((value) => value != tag);
      const {
        [tag]: _removed, ...restTexts
      } = state.value.texts
      state.value = {
        ...state.value,
        tags: state.value.tags.filter(value => value !== tag),
        texts: restTexts,
      }
    }
    else {
      state.value = {
        ...state.value,
        tags: [],
        texts: {},
      }
    }
  }

  /**
   * 更新某個 tag 的提示文字，用於同一次載入中切換階段
   * （例如「正在連線…」→「下載資料中…」→「整理結果…」）。
   *
   * 只對「目前開著的 tag」生效：已關閉的 tag 若還能寫入，文字會殘留到下一次開啟。
   */
  const setText = (tag: string, text: string) => {
    if (!state.value.tags.includes(tag)) return
    state.value = {
      ...state.value,
      texts: {
        ...state.value.texts,
        [tag]: text,
      },
    }
  }

  /**
   * 目前要顯示的提示文字。
   * 多個 tag 同時開啟時取「最後開啟且有文字」的那個——巢狀載入以內層為準較符合預期。
   */
  const text = computed(() => {
    for (let i = state.value.tags.length - 1; i >= 0; i--) {
      const tag = state.value.tags[i]
      const value = tag ? state.value.texts[tag] : undefined
      if (value) return value
    }
    return ''
  })

  const isOpening = computed(() => {
    return state.value.tags.length > 0
  })

  const isOpen = (tag: string) => {
    return state.value.tags.includes(tag)
  }

  const run = async <R = void>(
    tag: string,
    fn: () => Promise<R | undefined>,
    errorFn?: ErrorFn,
    pending?: Ref<boolean>) => {
    return running(
      async () => {
        open(tag)
        return await fn()
      },
      errorFn,
      () => {
        close(tag)
      },
      pending)
    // open(tag)
    // try {
    //   return await fn()
    // } catch (ex) {
    //   if (errorFn) {
    //     await errorFn(ex)
    //   }
    // } finally {
    //   close(tag)
    // }
  }

  const watchToggle = (tag: string, ref: Ref<boolean>, options?: {
    immediate?: boolean
  }) => {
    watch(ref, (isOpening) => {
      if (isOpening) {
        open(tag)
        return
      }
      close(tag)
    }, { immediate: options?.immediate ?? true })
  }

  const watcher = (tag: string, refs: Ref<boolean> | Ref<boolean>[], options?: {
    immediate?: boolean
  }) => {
    if (Array.isArray(refs)) {
      refs.forEach((ref, index) => {
        watchToggle(`tag:${index}`, ref, options)
      })
    }
    else {
      watchToggle(tag, refs, options)
    }
  }

  return {
    open,
    close,
    setText,
    text,
    isOpening,
    isOpen,
    run,
    watch: watcher,
  }
}

const loading = useLoading()

export const useLoadingFn = <T, P = void>(
  tag: string,
  fn: (params?: P) => Promise<T>,
  errorFn?: ErrorFn,
  pending?: Ref<boolean>,
) => {
  return async (params?: P) => {
    return loading.run(tag, async () => {
      return await fn(params)
    },
    errorFn,
    pending)
  }
}

export const useDebounceLoadingFn = <T, P = void>(
  tag: string,
  fn: (params?: P) => Promise<T>,
  errorFn?: ErrorFn,
  pending?: Ref<boolean>,
  ms?: MaybeRefOrGetter<number>,
  options?: DebounceFilterOptions,
) => {
  return useDebounceFn(
    useLoadingFn(tag, fn, errorFn, pending),
    ms,
    options)
}

export const useThrottleLoadingFn = <T, P = void>(
  tag: string,
  fn: (params?: P) => Promise<T>,
  errorFn?: ErrorFn,
  pending?: Ref<boolean>,
  ms?: MaybeRefOrGetter<number>,
  trailing?: boolean,
  leading?: boolean,
  rejectOnCancel?: boolean,
) => {
  return useThrottleFn(
    useLoadingFn(tag, fn, errorFn, pending),
    ms,
    trailing,
    leading,
    rejectOnCancel,
  )
}

export const running = async <R = void>(
  fn: () => Promise<R | undefined>,
  errorFn?: ErrorFn,
  finallyFn?: VoidFunction,
  pending?: Ref<boolean>) => {
  const pendingRef = pending ?? ref(false)
  pendingRef.value = true
  try {
    return await fn()
  }
  catch (ex) {
    if (errorFn) {
      await errorFn(ex)
    }
  }
  finally {
    if (finallyFn) {
      finallyFn()
    }
    pendingRef.value = false
  }
}
