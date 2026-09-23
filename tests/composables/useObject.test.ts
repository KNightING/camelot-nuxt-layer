import { describe, expect, it } from 'vitest'

describe('useObject.diff', () => {
  it('舊值為 null、新值為物件時視為整筆變更', () => {
    const { diff } = useObject()
    expect(diff<{ a: { b: number } | null }>({ a: null }, { a: { b: 1 } })).toEqual({ a: { b: 1 } })
  })

  it('舊值為基本型別、新值為物件時視為整筆變更', () => {
    const { diff } = useObject()
    expect(diff<{ a: unknown }>({ a: 1 }, { a: { b: 1 } })).toEqual({ a: { b: 1 } })
  })

  it('沒有差異時回傳空物件', () => {
    expect(useObject().diff({ a: { b: 1 } }, { a: { b: 1 } })).toEqual({})
  })
})

describe('useObject.deepClone', () => {
  it('深拷貝 Map 與 Set', () => {
    const inner = { x: 1 }
    const source = {
      m: new Map([['k', inner]]),
      s: new Set([inner]),
    }
    const copy = useObject().deepClone(source)
    expect(copy.m).toBeInstanceOf(Map)
    expect(copy.s).toBeInstanceOf(Set)
    expect(copy.m.get('k')).toEqual(inner)
    expect(copy.m.get('k')).not.toBe(inner)
    expect([...copy.s][0]).toEqual(inner)
    expect([...copy.s][0]).not.toBe(inner)
  })
})
