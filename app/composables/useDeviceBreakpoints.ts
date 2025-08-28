import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const useDeviceBreakpoints = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const isGreaterOrEqualSm = breakpoints.greaterOrEqual('sm')
  const isSmallerMd = breakpoints.smaller('md')
  const isGreaterOrEqualMd = breakpoints.greaterOrEqual('md')
  const isSmallerLg = breakpoints.smaller('lg')
  const isGreaterOrEqualLg = breakpoints.greaterOrEqual('lg')
  const isSmallerXl = breakpoints.smaller('xl')

  const isMobile = breakpoints.smaller('md')
  const isTablet = computed(() => {
    return isGreaterOrEqualMd.value && isSmallerLg.value
  })
  const isLaptop = computed(() => {
    return isGreaterOrEqualLg.value && isSmallerXl.value
  })
  const isDesktop = breakpoints.greaterOrEqual('xl')

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    breakpoints,
  }
}
