export const useFileKey = (file: File): string => {
  return `${file.type}_${file.name}_${file.size}_${file.lastModified}`
}
