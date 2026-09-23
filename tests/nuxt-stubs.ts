import { ref } from 'vue'
import type { Ref } from 'vue'

const states = new Map<string, Ref<unknown>>()

/** Nuxt `useState` 的測試替身：同 key 共用同一個 ref */
export const useState = <T>(key: string, init?: () => T): Ref<T> => {
  if (!states.has(key)) states.set(key, ref(init?.()) as Ref<unknown>)
  return states.get(key) as Ref<T>
}

/** 清空所有 `useState`，供測試之間隔離 */
export const resetStates = () => states.clear()

/** Nuxt `useAsyncData` 的測試替身：立即執行 handler，回傳可 await 的 { data, error } */
export const useAsyncData = <T>(_key: string, handler: () => Promise<T>) => {
  const data = ref<T | null>(null)
  const error = ref<unknown>(null)
  const promise = handler()
    .then((value) => { data.value = value })
    .catch((e) => { error.value = e })
    .then(() => ({
      data,
      error,
    }))
  return Object.assign(promise, {
    data,
    error,
  })
}
