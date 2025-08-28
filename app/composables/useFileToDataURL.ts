const readAsDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      if (event.target) {
        resolve(event.target.result as string)
      }
    })
    reader.readAsDataURL(file)
  })
}

export const useFileToDataURL = (file: File) => {
  return useAsyncData(useFileKey(file), () => {
    return readAsDataURL(file)
  })
}
