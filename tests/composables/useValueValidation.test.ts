import { describe, expect, it } from 'vitest'

const isEmail = (value: string) => useValueValidation(value, { type: 'email' }).value

describe('useValueValidation email', () => {
  it.each(['a-b@x.com', 'first.last@example.com', 'user+tag@mail.co', 'a_b@sub-domain.example.org'])('接受 %s', (value) => {
    expect(isEmail(value)).toBe(true)
  })

  it.each(['a\\b@x.com', 'no-at.com', 'a@b', 'a b@x.com'])('拒絕 %s', (value) => {
    expect(isEmail(value)).toBe(false)
  })
})
