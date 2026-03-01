export const useRandomCatImg = () => {
  const url = ref('')
  const newCat = () => {
    // https://cataas.com/cat?r=${random code}
    // u don't fetch it, just return the url
    const randomCode = Math.random().toString(36).substring(2, 15)
    url.value = `https://cataas.com/cat?${randomCode}`
  }
  newCat()
  return { url, newCat }
}
