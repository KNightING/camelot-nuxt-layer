/** hexToRgbaArray 的回傳：[r, g, b, a]，其中 r/g/b 為 0-255，a 為 0-1 */
export type CamelotRgbaTuple = [number, number, number, number]

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

    // 3 碼 (RGB) 與 4 碼 (RGBA) 縮寫一律逐字元加倍展開
    if (hex.length === 3 || hex.length === 4) {
      hex = [...hex].map(char => char + char).join('')
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
  public hexToRgbaArray(hex: string | undefined): CamelotRgbaTuple | undefined {
    if (!hex) {
      return undefined
    }
    const fullHex = this.toFullHex(hex)
    if (!fullHex) {
      return undefined
    }

    // toFullHex 保證為 8 碼，故直接依位置切段；substring 恆回傳 string，
    // 不像索引存取會在 noUncheckedIndexedAccess 下帶 undefined。
    const body = fullHex.replace('#', '')
    const channel = (start: number) => parseInt(body.substring(start, start + 2), 16)

    return [channel(0), channel(2), channel(4), Math.floor((channel(6) * 10) / 255) / 10]
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

    const body = fullHex.replace('#', '')
    // 位移後夾在 0-255 再轉回 16 進位；不足兩碼補前導 0
    const shifted = (start: number) => {
      const value = Math.min(255, Math.max(0, parseInt(body.substring(start, start + 2), 16) + amt))
      return value.toString(16).padStart(2, '0')
    }

    const rr = shifted(0)
    const gg = shifted(2)
    const bb = shifted(4)

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
