export const useRandom = (min = 0, max: number = Number.MAX_VALUE) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
