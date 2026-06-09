import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * 貼上 HTML 清洗：把 Word / Google Docs / 各家網頁亂七八糟的 HTML
 * 轉成乾淨的「文章樣式」HTML，交給 TipTap 解析。
 *
 * - 移除 <script>/<style>/<meta>/<link>/<o:p> 等
 * - 移除所有 class/id/style/align/lang/xml 等屬性
 *   - <img>/<a>/<source>/<picture> 例外保留語義必要屬性 (src/href/alt/srcset/width)
 * - <b> → <strong>，<i> → <em>，<font> → unwrap，<span>/<div> → unwrap 或轉 <p>
 * - 連續空段落收斂成一個換行
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'u', 's', 'del', 'ins', 'sub', 'sup',
  'code', 'pre', 'blockquote',
  'ul', 'ol', 'li',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
])

const UNWRAP_TAGS = new Set(['span', 'font', 'small', 'big', 'center', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav'])

// 各個 tag 允許保留的屬性
const ATTR_ALLOWLIST: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height', 'data-pending', 'data-align', 'data-caption']),
  source: new Set(['src', 'srcset', 'type']),
  picture: new Set([]),
}

const TAG_RENAME: Record<string, string> = {
  b: 'strong',
  i: 'em',
  strike: 's',
}

function cleanElement(el: Element): Element {
  let tag = el.tagName.toLowerCase()
  if (TAG_RENAME[tag]) {
    const renamed = el.ownerDocument!.createElement(TAG_RENAME[tag]!)
    while (el.firstChild) renamed.appendChild(el.firstChild)
    el.replaceWith(renamed)
    el = renamed
    tag = renamed.tagName.toLowerCase()
  }

  // 清屬性
  const allowed = ATTR_ALLOWLIST[tag] ?? new Set<string>()
  for (const attr of Array.from(el.attributes)) {
    if (!allowed.has(attr.name)) {
      el.removeAttribute(attr.name)
    }
  }

  // 對 <a target=_blank> 補 rel=noopener
  if (tag === 'a' && el.getAttribute('target') === '_blank') {
    el.setAttribute('rel', 'noopener noreferrer')
  }

  return el
}

function walkAndClean(root: Element): void {
  // 註解直接砍
  for (const c of Array.from(root.childNodes)) {
    if (c.nodeType === Node.COMMENT_NODE) c.parentNode?.removeChild(c)
  }
  // 危險／無語意 tags
  for (const dangerous of Array.from(root.querySelectorAll('script,style,meta,link,head,title,object,embed,iframe,form,input,button,svg'))) {
    dangerous.remove()
  }
  // Office namespace 開頭含 ":" 的 tags（如 <o:p>）直接砍
  for (const el of Array.from(root.querySelectorAll('*'))) {
    if (el.tagName.includes(':')) {
      el.remove()
    }
  }

  // BFS 遞迴清
  const queue: Element[] = Array.from(root.children)
  while (queue.length) {
    const el = queue.shift()!
    const tag = el.tagName.toLowerCase()

    if (!ALLOWED_TAGS.has(tag) && !UNWRAP_TAGS.has(tag) && !TAG_RENAME[tag]) {
      while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el)
      el.remove()
      continue
    }

    if (UNWRAP_TAGS.has(tag)) {
      // <div> 純含 inline 內容時包成 <p>
      if (tag === 'div' && Array.from(el.childNodes).every(n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && /^(a|strong|em|u|s|code|br|img|span|font|b|i)$/i.test((n as Element).tagName)))) {
        const p = el.ownerDocument!.createElement('p')
        while (el.firstChild) p.appendChild(el.firstChild)
        el.replaceWith(p)
        queue.push(p)
        continue
      }
      while (el.firstChild) {
        const child = el.firstChild
        el.parentNode?.insertBefore(child, el)
        if (child.nodeType === Node.ELEMENT_NODE) queue.push(child as Element)
      }
      el.remove()
      continue
    }

    cleanElement(el)
    queue.push(...Array.from(el.children))
  }

  // 連續空 <p>（包含只剩 nbsp 的）收斂
  let prevEmpty = false
  for (const p of Array.from(root.querySelectorAll('p'))) {
    const txt = (p.textContent ?? '').replace(/\u00a0/g, '').trim()
    const isEmpty = !txt && !p.querySelector('img,br')
    if (isEmpty && prevEmpty) {
      p.remove()
      continue
    }
    prevEmpty = isEmpty
  }
}

export function sanitizePastedHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  // 移除 Word 註解條件
  let normalized = html.replace(/<!--[\s\S]*?-->/g, '')
  // 移除 Word 的 <o:p> wrapper
  normalized = normalized.replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')

  const doc = new DOMParser().parseFromString(`<body>${normalized}</body>`, 'text/html')
  walkAndClean(doc.body)

  let out = doc.body.innerHTML
  // nbsp → 一般空白；多重空白收斂；連續空行收斂
  out = out.replace(/\u00a0/g, ' ')
  out = out.replace(/[ \t]{2,}/g, ' ')
  out = out.replace(/(\r?\n){3,}/g, '\n\n')
  return out.trim()
}

const pasteSanitizeKey = new PluginKey('pasteSanitize')

export const PasteSanitize = Extension.create({
  name: 'pasteSanitize',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: pasteSanitizeKey,
        props: {
          transformPastedHTML(html: string) {
            try {
              return sanitizePastedHtml(html)
            }
            catch {
              return html
            }
          },
        },
      }),
    ]
  },
})
