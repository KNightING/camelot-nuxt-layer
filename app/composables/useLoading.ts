import type { DebounceFilterOptions } from '@vueuse/core'

type LoadingCloseable = () => void

type ErrorFn = (ex: unknown) => Promise<void> | void

interface LoadingState {
  tags: string[]
}

const state = ref<LoadingState>({
  tags: [],
})

export const useLoading = () => {
  const open = (tag: string): LoadingCloseable => {
    // state.value.tags.push(tag);
    state.value = {
      ...state.value,
      tags: [...state.value.tags, tag],
    }

    return () => close(tag)
  }

  const close = (tag?: string) => {
    if (tag) {
      // state.value.tags = state.value.tags.filter((value) => value != tag);
      state.value = {
        ...state.value,
        tags: state.value.tags.filter(value => value !== tag),
      }
    } else {
      state.value = {
        ...state.value,
        tags: [],
      }
    }
  }

  const isOpening = computed(() => {
    return state.value.tags.length > 0
  })

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
    } else {
      watchToggle(tag, refs, options)
    }
  }

  return {
    open,
    close,
    isOpening,
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
  } catch (ex) {
    if (errorFn) {
      await errorFn(ex)
    }
  } finally {
    if (finallyFn) {
      finallyFn()
    }
    pendingRef.value = false
  }
}
