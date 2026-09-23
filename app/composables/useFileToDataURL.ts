const readAsDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result as string))
    reader.addEventListener('error', () => reject(reader.error ?? new Error('讀取檔案失敗')))
    reader.addEventListener('abort', () => reject(new Error('讀取檔案已中止')))
    reader.readAsDataURL(file)
  })
}

export const useFileToDataURL = (file: File) => {
  return useAsyncData(useFileKey(file), () => {
    return readAsDataURL(file)
  })
}
