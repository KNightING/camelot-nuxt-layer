import { describe, expect, expectTypeOf, it } from 'vitest'

describe('useIsValidKey', () => {
  it('執行期判斷 key 是否存在', () => {
    expect(useIsValidKey('a', { a: 1 })).toBe(true)
    expect(useIsValidKey('b', { a: 1 })).toBe(false)
  })

  it('型別收窄成物件的 key', () => {
    const obj = {
      a: 1,
      b: 'x',
    }
    const key: string = 'a'
    if (useIsValidKey(key, obj)) {
      expectTypeOf(key).toEqualTypeOf<'a' | 'b'>()
      expect(obj[key]).toBe(1)
    }
  })
})
