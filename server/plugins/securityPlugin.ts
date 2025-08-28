import { randomBytes } from 'node:crypto'

const LINK_RE = /<link([^>]*?>)/gi
const SCRIPT_RE = /<script([^>]*?>)/gi
const STYLE_RE = /<style([^>]*?>)/gi

export default defineNitroPlugin((nitroApp) => {
  if (!useRuntimeConfig().securityPlugin.enabled) {
    return
  }

  if (import.meta.prerender) {
    return
  }

  nitroApp.hooks.hook('request', async (event) => {
    if (!useRuntimeConfig().securityPlugin.useNonce) return
    if (event.context.security?.nonce) {
      // When rendering server-only (NuxtIsland) components, each component will trigger a request event.
      // The request context is shared between the event that renders the actual page and the island request events.
      // Make sure to only generate the nonce once.
      return
    }
    event.context.security = {
      nonce: randomBytes(16).toString('base64'),
    }
  })

  // Set the nonce attribute on all script, style, and link tags.
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    if (!useRuntimeConfig().securityPlugin.useNonce) return
    const nonce = event.context.security!.nonce!
    // Scan all relevant sections of the NuxtRenderHtmlContext
    type Section = 'body' | 'bodyAppend' | 'bodyPrepend' | 'head'
    const sections = ['body', 'bodyAppend', 'bodyPrepend', 'head'] as Section[]
    for (const section of sections) {
      html[section] = html[section].map((element) => {
        // Add nonce to all link tags
        element = element.replace(LINK_RE, (match, rest) => {
          return `<link nonce="${nonce}" ${rest}`
        })
        // Add nonce to all script tags
        element = element.replace(SCRIPT_RE, (match, rest) => {
          return `<script nonce="${nonce}" ${rest}`
        })
        // Add nonce to all style tags
        element = element.replace(STYLE_RE, (match, rest) => {
          return `<style nonce="${nonce}" ${rest}`
        })
        return element
      })
    }

    // Add meta header for Vite in development
    if (import.meta.dev) {
      html.head.push(
        `<meta property="csp-nonce" nonce="${nonce}">`,
      )
    }
  })

  nitroApp.hooks.hook('beforeResponse', (event) => {
    let nonce: string | undefined = undefined
    if (useRuntimeConfig().securityPlugin.useNonce) {
      nonce = event.context.security!.nonce!
    }

    let cacheControl = 'max-age=600'

    if (event.node.res.getHeader('content-type') === 'text/html;charset=utf-8') {
      cacheControl = 'no-store'
    }

    const header = {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cache-Control': cacheControl,
      'Content-Security-Policy': getCspString(nonce),
    }

    // foreach header
    for (const [key, value] of Object.entries(header)) {
      event.node.res.setHeader(key, value)
    }
  })

  // nitroApp.hooks.hook('render:response', (response, { event }) => {
  //   let cacheControl = 'max-age=600'

  //   if (response.headers && response.headers['content-type'] === 'text/html;charset=utf-8') {
  //     cacheControl = 'no-store'
  //   }

  //   const header = {
  //     'X-Content-Type-Options': 'nosniff',
  //     'Referrer-Policy': 'same-origin',
  //     'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  //     'Cache-Control': cacheControl,
  //     'Content-Security-Policy': getCspString(),
  //   }
  //   response.headers = { ...(response.headers ?? {}), ...header }
  // })
})

const cspImgSrc: string[] = [
  'data:',
]

const cspFontSrc: string[] = [
  'data:',
  'https://fonts.gstatic.com/',
  'http://fonts.gstatic.com/',
]

const cspFrameSrc: string[] = [
  '\'unsafe-inline\'',
]

const cspScriptSrc: string[] = [
  '\'unsafe-inline\'',
]

const cspStyleSrc: string[] = [
  'https://fonts.googleapis.com',
  '\'unsafe-inline\'',
]

const cspConnectSrc: string[] = [
]

const cspFrameAncestors: string[] = []

const combineCsp = (origin: string[], add: string[]) => {
  const newCspArray: string[] = [
    ...origin,
  ]

  for (const url of add) {
    if (url) {
      try {
        newCspArray.push(new URL(url).origin)
      } catch (e) {
        //
      }
    }
  }
  return newCspArray
}

const getCspString = (nonce: string | undefined) => {
  let result = ''
  result += 'default-src \'self\';'

  const config = useRuntimeConfig()

  const font = combineCsp(cspFontSrc, config.securityPlugin.contentSecurityPolicy.font)
  result += `font-src 'self' ${font.join(' ')}; `

  const frame = combineCsp(cspFrameSrc, config.securityPlugin.contentSecurityPolicy.frame)
  result += `frame-src 'self' ${frame.join(' ')}; `

  const frameAncestors = combineCsp(cspFrameAncestors, config.securityPlugin.contentSecurityPolicy.frameAncestors)
  result += `frame-ancestors 'self' ${frameAncestors.join(' ')}; `

  const media = combineCsp([], config.securityPlugin.contentSecurityPolicy.media)
  result += `media-src 'self' ${media.join(' ')}; `

  const object = combineCsp([], config.securityPlugin.contentSecurityPolicy.object)
  result += `object-src 'self' ${object.join(' ')}; `

  const manifest = combineCsp([], config.securityPlugin.contentSecurityPolicy.manifest)
  result += `manifest-src 'self' ${manifest.join(' ')}; `

  const worker = combineCsp([], config.securityPlugin.contentSecurityPolicy.worker)
  result += `worker-src 'self' ${worker.join(' ')}; `

  const script = combineCsp(cspScriptSrc, config.securityPlugin.contentSecurityPolicy.script)

  if (nonce) {
    result += `script-src 'self' ${script.join(' ')} 'nonce-${nonce}' 'strict-dynamic'; `
  } else {
    result += `script-src 'self' ${script.join(' ')}; `
  }

  const style = combineCsp(cspStyleSrc, config.securityPlugin.contentSecurityPolicy.style)
  result += `style-src 'self' ${style.join(' ')}; `

  const img = combineCsp(cspImgSrc, config.securityPlugin.contentSecurityPolicy.img)
  result += `img-src 'self' ${img.join(' ')}; `

  const connect = combineCsp(cspConnectSrc, config.securityPlugin.contentSecurityPolicy.connect)
  result += `connect-src 'self' ${connect.join(' ')}; `
  return result
}
