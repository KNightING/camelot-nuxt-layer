class ColorUtil {
  public isCorrectHex(hex: string): boolean {
    if (hex[0] === '#') {
      hex = hex.substring(1, hex.length)
    }
    return /^([\dA-Fa-f]{6}|[\dA-Fa-f]{3}|[\dA-Fa-f]{4}|[\dA-Fa-f]{8})$/.test(
      hex,
    )
  }

  public toFullHex(hex: string | undefined): string | undefined {
    if (!hex) {
      return undefined
    }

    if (hex[0] === '#') {
      hex = hex.substring(1, hex.length)
    }

    if (!this.isCorrectHex(hex)) {
      return undefined
    }

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    if (hex.length === 4) {
      hex
        = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }

    if (hex.length === 6) {
      hex = `${hex}FF`
    }

    return `#${hex}`
  }

  /**
   *
   * @param hex
   * @returns [r,g,b,a]
   */
  public hexToRgbaArray(hex: string | undefined) {
    if (!hex) {
      return undefined
    }
    const fullHex = this.toFullHex(hex)
    if (!fullHex) {
      return undefined
    }

    const array = fullHex
      .replace('#', '')
      .match(/.{2}/g)!
      .map(c => parseInt(c, 16))

    return [array[0], array[1], array[2], Math.floor((array[3] * 10) / 255) / 10]
  }

  // alpha's range is from 0 to 1
  public hexToRgba(
    hex: string | undefined,
    alpha?: number,
  ): string | undefined {
    const array = this.hexToRgbaArray(hex)
    if (!array) {
      return undefined
    }

    return `rgba(${array[0]},${array[1]},${array[2]}, ${alpha ?? Math.floor((array[3] * 10) / 255) / 10
    })`
  }

  /**
   * @param color Hex value format: #ffffff or ffffff
   */
  public shade(hex: string | undefined, amt: number): string | undefined {
    if (!hex) {
      return undefined
    }
    const fullHex = this.toFullHex(hex)
    if (!fullHex) {
      return undefined
    }

    const [r, g, b, a] = fullHex
      .replace('#', '')
      .match(/.{2}/g)!
      .map(c =>
        Math.min(255, Math.max(0, parseInt(c, 16) + amt)).toString(16),
      )

    const rr = (r.length < 2 ? '0' : '') + r
    const gg = (g.length < 2 ? '0' : '') + g
    const bb = (b.length < 2 ? '0' : '') + b

    return `#${rr}${gg}${bb}${fullHex.substring(
      fullHex.length - 2,
      fullHex.length,
    )}`
  }

  public lightness(hex: string | undefined): string | undefined {
    if (hex) {
      return this.shade(hex, 40)
    }
  }

  public darkness(hex: string | undefined): string | undefined {
    if (hex) {
      return this.shade(hex, -40)
    }
  }
}

const colorUtil = new ColorUtil()

export const useColor = () => colorUtil
