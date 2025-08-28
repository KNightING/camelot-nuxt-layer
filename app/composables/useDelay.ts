export const useDelay = async (milliseconds: MaybeRef<number>) => {
  return await new Promise<void>((resolve) => {
    setTimeout(resolve, toValue(milliseconds))
  })
}
