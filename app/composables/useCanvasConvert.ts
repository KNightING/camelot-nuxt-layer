export const useCanvasConvert = (canvasRef: MaybeRefOrGetter<HTMLCanvasElement>) => {
  const canvas = computed(() => toValue(canvasRef))

  const toBlob = (canvas: HTMLCanvasElement, type?: string, quality?: number) => new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })

  const toDataURL = (canvas: HTMLCanvasElement, type?: string | undefined, quality?: any) => canvas.toDataURL(type, quality)

  return {
    toBlob: (type?: string, quality?: number) => toBlob(canvas.value, type, quality),
    toDataURL: (type?: string | undefined, quality?: any) => toDataURL(canvas.value, type, quality),
  }
}
