export const useIsValidKey = <T extends object>(
  key: PropertyKey,
  object: T,
): key is keyof T => {
  return key in object
}
