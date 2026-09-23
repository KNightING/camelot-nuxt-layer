import { describe, expect, it } from 'vitest'

const link = (text: string) => useAutoLink(text).value

describe('useAutoLink', () => {
  it('跳脫 HTML，避免注入', () => {
    expect(link('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('網址中的數字不會再被當成電話', () => {
    const html = link('see https://example.com/orders/1234567890')
    expect(html).toBe('see <a href="https://example.com/orders/1234567890" target="_blank" rel="noopener noreferrer">https://example.com/orders/1234567890</a>')
  })

  it('網址中的 @ 不會再被當成 email', () => {
    const html = link('https://example.com/@user.name/profile')
    expect(html.match(/<a /g)?.length).toBe(1)
    expect(html).not.toContain('mailto:')
  })

  it('email 與電話各自轉成連結', () => {
    expect(link('mail a@b.com or call 0912-345-678')).toBe(
      'mail <a href="mailto:a@b.com">a@b.com</a> or call <a href="tel:0912345678">0912-345-678</a>',
    )
  })

  it('www 開頭補上 http', () => {
    expect(link('www.example.com')).toBe('<a href="http://www.example.com" target="_blank" rel="noopener noreferrer">www.example.com</a>')
  })

  it('停用選項生效', () => {
    expect(useAutoLink('a@b.com', { disabledEmail: true }).value).toBe('a@b.com')
  })

  it('連結文字中的 & 會跳脫，href 保留可用', () => {
    expect(link('https://x.com/?a=1&b=2')).toBe('<a href="https://x.com/?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">https://x.com/?a=1&amp;b=2</a>')
  })
})
