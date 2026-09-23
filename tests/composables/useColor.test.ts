import { describe, expect, it } from 'vitest'

describe('useColor.hexToRgba', () => {
  it('未帶 alpha 時沿用色碼本身的透明度', () => {
    expect(useColor().hexToRgba('#ff000080')).toBe('rgba(255,0,0, 0.5)')
  })

  it('6 碼色碼預設不透明', () => {
    expect(useColor().hexToRgba('#00ff00')).toBe('rgba(0,255,0, 1)')
  })

  it('明確帶入的 alpha 優先', () => {
    expect(useColor().hexToRgba('#00ff00', 0.3)).toBe('rgba(0,255,0, 0.3)')
  })
})
