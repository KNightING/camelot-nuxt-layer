import type { FetchError } from 'ofetch'

type ErrorRefType = FetchError | Error | any | null

export const useErrorRef = () => {
  const error = ref<ErrorRefType> ()

  const watchToggle = (err: Ref<ErrorRefType>) => watch(err, (err) => {
    error.value = err
  }, { immediate: true })

  const watcher = (errors: Ref<ErrorRefType> | Ref<ErrorRefType>[]) => {
    if (Array.isArray(errors)) {
      errors.forEach(error => watchToggle(error))
    } else {
      watchToggle(errors)
    }
  }

  return {
    error,
    watch: watcher,
  }
}
