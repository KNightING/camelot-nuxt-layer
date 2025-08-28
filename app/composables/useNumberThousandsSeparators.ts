import { isClient } from '@vueuse/core'

// client only supports

let thousandSeparators: Intl.NumberFormat

export const useNumberThousandsSeparator = () => {
  function format(value: number | bigint) {
    return value.toLocaleString()
    // if (isClient) {
    //   if (thousandSeparators) {
    //     return thousandSeparators.format(value)
    //   } else {
    //     thousandSeparators = new Intl.NumberFormat(undefined, {
    //       maximumSignificantDigits: 3
    //     })
    //     return thousandSeparators.format(value)
    //   }
    // }
    // return value.toString()
  }

  return { format }
}
