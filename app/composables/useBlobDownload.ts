export const useBlobDownload = (obj: Blob | MediaSource, fileName: string) => {
  // const link = document.createElement('a')

  // const obj = computed(() => toValue(objRef))
  // const fileName = computed(() => toValue(fileNameRef))

  // watch([obj, fileName], ([o, f]) => {
  //   if (o === null) {
  //     return
  //   }
  //   link.download = f
  //   link.href = URL.createObjectURL(o)
  // }, { immediate: true })

  // return () => link.click()

  const link = document.createElement('a')
  link.download = fileName
  link.href = URL.createObjectURL(obj)
  link.click()
  // 下載已由瀏覽器接手，下一輪事件循環再釋放，避免 object URL 常駐記憶體
  setTimeout(() => URL.revokeObjectURL(link.href))
}
