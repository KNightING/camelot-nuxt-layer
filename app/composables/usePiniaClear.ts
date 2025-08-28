import { getActivePinia, type Pinia, type Store } from 'pinia'

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>
}

export const usePiniaReset = (): Record<string | 'all', () => void> => {
  const pinia = getActivePinia() as ExtendedPinia

  if (!pinia) {
    throw new Error('There is no stores')
  }

  const resetStores: Record<string, () => void> = {}

  pinia._s.forEach((store, name) => {
    try {
      resetStores[name] = () => store.$reset()
    } catch (e) {
    }
  })

  resetStores.all = () => {
    pinia._s.forEach((store) => {
      try {
        store.$reset()
      } catch (e) {
      }
    })
  }
  return resetStores
}

export const usePiniaDispose = (): Record<string | 'all', () => void> => {
  const pinia = getActivePinia() as ExtendedPinia

  if (!pinia) {
    throw new Error('There is no stores')
  }

  const disposeStores: Record<string, () => void> = {}

  pinia._s.forEach((store, name) => {
    try {
      disposeStores[name] = () => store.$dispose()
    } catch (e) {
    }
  })

  disposeStores.all = () => {
    pinia._s.forEach((store) => {
      try {
        store.$dispose()
      } catch (e) {
      }
    })
  }
  return disposeStores
}
