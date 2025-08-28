import type { RemovableRef, UseStorageOptions } from '@vueuse/core'

export class SessionStorageProxy<T> {
  private _storage: RemovableRef<T>

  constructor(
    key: string,
    initialValue: MaybeRefOrGetter<T>,
    options?: UseStorageOptions<T>,
  ) {
    this._storage = useSessionStorage<T>(key, initialValue, options)
  }

  get storage(): RemovableRef<T> {
    return this._storage
  }

  get value(): T {
    return this.storage.value
  }

  set value(val: T) {
    this.storage.value = val
  }

  public del = () => {
    this.storage.value = null
  }
}

export const useSessionStorageProxy = <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
) => new SessionStorageProxy(key, initialValue, options)
