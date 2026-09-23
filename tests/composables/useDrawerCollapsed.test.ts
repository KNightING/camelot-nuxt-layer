import { describe, expect, it } from 'vitest'

describe('useDrawerCollapsed', () => {
  it('預設收合，且各處取得同一個狀態', () => {
    const a = useDrawerCollapsed()
    expect(a.value).toBe(true)
    a.value = false
    expect(useDrawerCollapsed().value).toBe(false)
  })
})
