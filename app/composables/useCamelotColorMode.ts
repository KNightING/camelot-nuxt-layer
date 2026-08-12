/**
 * 全站共用的深淺色模式實例。
 *
 * VueUse 的 `useColorMode` 每建立一個實例，就會註冊一份 watcher 在模式變動時往
 * `<html>` 寫 class。`useCamelotTheme()` 被每個 Camelot 元件呼叫，先前單頁可達數百個
 * 實例，導致切換一次深淺色就有數百份重複的 class 寫入與 watcher 執行——這是深淺色切換
 * 明顯比主題風格 / 色系切換卡頓的直接原因 (issue #17)。
 *
 * 模式是全站單一狀態，實例收斂為模組層一份即可。
 */
const camelotColorMode = useColorMode()

export const useCamelotColorMode = () => camelotColorMode
