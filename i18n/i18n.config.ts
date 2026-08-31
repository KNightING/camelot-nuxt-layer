export default defineI18nConfig(() => ({
  // 這裡不設 fallbackLocale：Layer 宣告 locales: []，由消費端決定要登記哪些語系，
  // 因此也只有消費端知道 fallback 該落到哪個已註冊的 locale（範例見 .playground）。
  // 先前寫死 default: ['en'] 會指向未註冊的語系，該鏈在執行期不成立。
  globalInjection: true,
  legacy: false,
}))
