import { afterEach, describe, expect, it, vi } from 'vitest'

describe('createAnchorName', () => {
  it('產生合法的 dashed-ident', () => {
    expect(createAnchorName('v-0')).toBe('--camelot-anchor-v-0')
  })

  it('移除 useId 可能帶出的冒號等非法字元', () => {
    expect(createAnchorName(':r1:')).toBe('--camelot-anchor-r1')
    expect(createAnchorName('a b/c')).toBe('--camelot-anchor-abc')
  })

  it('不同 id 得到不同名稱', () => {
    expect(createAnchorName('v-1')).not.toBe(createAnchorName('v-2'))
  })
})

describe('isCssAnchorSupported', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('沒有 CSS 物件（SSR）時回傳 false', () => {
    vi.stubGlobal('CSS', undefined)
    expect(isCssAnchorSupported()).toBe(false)
  })

  it('CSS.supports 不存在時回傳 false', () => {
    vi.stubGlobal('CSS', {})
    expect(isCssAnchorSupported()).toBe(false)
  })

  it('依 CSS.supports(anchor-name) 的結果回傳', () => {
    const supports = vi.fn().mockReturnValue(true)
    vi.stubGlobal('CSS', { supports })
    expect(isCssAnchorSupported()).toBe(true)
    expect(supports).toHaveBeenCalledWith('anchor-name', expect.stringMatching(/^--/))

    supports.mockReturnValue(false)
    expect(isCssAnchorSupported()).toBe(false)
  })
})
