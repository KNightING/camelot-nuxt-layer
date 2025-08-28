import { useStorageAsync } from '@vueuse/core'
import type {
  StorageLikeAsync,
  UseStorageAsyncOptions,
  RemovableRef,
} from '@vueuse/core'

class StorageProxy<T> {
  private _storage: RemovableRef<T>

  constructor(
    key: string,
    initialValue: MaybeRefOrGetter<T>,
    storageLike?: StorageLikeAsync,
    options?: UseStorageAsyncOptions<T>,
  ) {
    this._storage = useStorageAsync<T>(key, initialValue, storageLike, options)
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

  public patch = (newValue: T) => {
    this.storage.value = { ...this.storage.value, ...newValue }
  }

  public del = () => {
    this.storage.value = null
  }
}

export const useStorageProxy = <T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storageLike?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
) => new StorageProxy(key, initialValue, storageLike, options)
