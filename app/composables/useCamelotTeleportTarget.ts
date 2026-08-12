import type { MaybeRefOrGetter } from 'vue'

/**
 * 決定浮層應該 Teleport 到哪裡。
 *
 * 原生 `<dialog>` 以 `showModal()` 開啟時會建立自己的 top layer，**該層之上沒有任何
 * 一般內容**——teleport 到 `body` 的浮層無論 z-index 開多高都會被壓在對話框底下，
 * 既看不見也點不到。因此浮層必須改 teleport 進最近的 `<dialog>` 祖先，成為對話框內的
 * 兄弟節點後，才輪得到 z-index 決定先後（見 wiki `features/layering.md`）。
 *
 * 所有 popup 概念的元件一律共用此判定，不要各自實作。
 */
export const useCamelotTeleportTarget = (
  anchor: MaybeRefOrGetter<HTMLElement | null | undefined>,
) => {
  const nearestDialog = computed(() => {
    const el = toValue(anchor)
    if (!el) {
      return undefined
    }

    return el.closest('dialog') ?? undefined
  })

  const teleportTarget = computed<HTMLElement | string>(
    () => nearestDialog.value ?? 'body',
  )

  return {
    nearestDialog,
    teleportTarget,
  }
}
