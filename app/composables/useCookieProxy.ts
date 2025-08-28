import type { CookieOptions, CookieRef } from 'nuxt/app'

type ReadOnlyCookeOptions<T> = CookieOptions<T> & { readonly?: false | undefined }

class CookieProxy<T> {
  private _cookie: CookieRef<T>

  constructor(key: string, opts?: ReadOnlyCookeOptions<T>) {
    this._cookie = useCookie<T>(key, opts)
  }

  get cookie(): CookieRef<T | undefined> {
    return this._cookie
  }

  get value(): T | undefined {
    return this.cookie.value
  }

  set value(val: T) {
    this.cookie.value = val
  }

  public patch = (newValue: T) => {
    this.cookie.value = { ...this.cookie.value, ...newValue }
  }

  public del = () => {
    this.cookie.value = undefined
  }
}

export const useCookieProxy = <T>(key: string, opts?: ReadOnlyCookeOptions<T>) =>
  new CookieProxy(key, opts)
