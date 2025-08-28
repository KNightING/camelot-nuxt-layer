export const useCanvasConvert = (canvasRef: MaybeRefOrGetter<HTMLCanvasElement>) => {
  const canvas = computed(() => toValue(canvasRef))

  const toBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve)
  })

  const toDataURL = (canvas: HTMLCanvasElement, type?: string | undefined, quality?: any) => canvas.toDataURL(type, quality)

  return {
    toBlob: () => toBlob(canvas.value),
    toDataURL: (type?: string | undefined, quality?: any) => toDataURL(canvas.value, type, quality),
  }
}
