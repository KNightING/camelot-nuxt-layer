export const useValueValidation = (
  target: MaybeRef<string | undefined>,
  options: {
    type: 'email' | 'mobile' | 'internationalMobile' | 'number' | 'phone' | 'phoneCanExtension' | 'taiwanIdNumber' | 'taiwanUniformNumber'
    allowUndefined?: boolean
  },
) =>
  computed(() => {
    const value = toValue(target)

    if (!value) {
      return options.allowUndefined ?? false
    }

    switch (options.type) {
      case 'email':
        return /^[\w\\-\\.]+@([\w\\-]+\.)+[\w\\-]{2,4}$/.test(value)
      case 'mobile':
        return /^[0-9]+$/.test(value)
      case 'internationalMobile':
        return /^\+\d{1,3}\d{8,9}$/.test(value)
      case 'phone':
        return /^0\d{8,9}$/.test(value)
      case 'phoneCanExtension':
        return /^0\d{8,9}(#\d+)?$/.test(value)
      case 'number':
        return /^[0-9]+$/.test(value)
      case 'taiwanIdNumber':
        return isValidTaiwanID(value)
      case 'taiwanUniformNumber':
        return isValidTaiwanUniformNumber(value)
    }

    return true
  })

function isValidTaiwanID(id: string) {
  if (!/^[A-Z][12]\d{8}$/.test(id)) return false

  // 英文字母對應的數值表
  const letterMap = {
    A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34,
    J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25,
    S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
  }

  // 取得第一碼對應的數值
  const firstChar = id[0]

  if (!useIsValidKey(firstChar, letterMap)) {
    return false
  }
  const firstNum = letterMap[firstChar]

  // 計算加總
  let sum = Math.floor(firstNum / 10) * 1 + (firstNum % 10) * 9
  for (let i = 1; i <= 8; i++) {
    sum += parseInt(id[i]) * (9 - i)
  }
  sum += parseInt(id[9]) // 最後一碼

  // 驗證規則：總和 % 10 必須等於 0
  return sum % 10 === 0
}

/**
 * 使用新邏輯驗證台灣統一編號是否正確
 *
 * 驗證規則：
 * 1. 輸入必須為8位數字。
 * 2. 每位數分別乘上對應的權重 [1, 2, 1, 2, 1, 2, 4, 1]。
 * 3. 若乘積為兩位數，則將十位與個位數相加（例如：7×2=14，則算 1+4=5）。
 * 4. 將所有位數計算後的數值加總，新邏輯要求總和必須能被 5 整除。
 * 5. 特例：若第7位（索引6）的數字為7，且 (sum+1) % 5 === 0 也視為合法。
 *
 * @param {string} id 統一編號（必須為8個數字）
 * @returns {boolean} 是否為合法統一編號
 */
function isValidTaiwanUniformNumber(id: string): boolean {
  // 格式檢查：必須為8位數字
  if (!/^\d{8}$/.test(id)) return false

  const weights = [1, 2, 1, 2, 1, 2, 4, 1]
  let sum = 0

  // 將每一位依權重計算後，其乘積各位數相加
  for (let i = 0; i < 8; i++) {
    const digit = parseInt(id[i], 10)
    const product = digit * weights[i]
    // 分解乘積為十位與個位數再相加
    sum += Math.floor(product / 10) + (product % 10)
  }

  // 新邏輯：檢查總和是否能被5整除
  if (sum % 5 === 0) {
    return true
  }
  // 特例處理：若第7位數為7，並且 (sum+1) 可被5整除，則也視為合法
  if (id[6] === '7' && ((sum + 1) % 5 === 0)) {
    return true
  }
  return false
}
