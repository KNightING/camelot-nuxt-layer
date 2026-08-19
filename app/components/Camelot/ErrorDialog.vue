<template>
  <CamelotConfirmDialog
    v-model:open="open"
    :title="currentError?.title ?? title"
    :positive-label="currentError?.positive?.label ?? positiveLabel"
    :positive-color="currentError?.positive?.color ?? color"
    :neutral-label="currentError?.neutral?.label"
    :neutral-color="currentError?.neutral?.color ?? color"
    :negative-label="currentError?.negative?.label"
    :negative-color="currentError?.negative?.color ?? color"
    :close-by-mask="closeByMask"
    :auto-close="false"
    :z-index="currentError?.zIndex ?? zIndex"
    @positive="onAction('positive')"
    @neutral="onAction('neutral')"
    @negative="onAction('negative')"
  >
    <!-- messageHtml 僅由自家轉換器產出，型別文件已載明內容必須來自可信來源 -->
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="currentError?.messageHtml"
      class="text-sm opacity-80 break-words"
      v-html="currentError.messageHtml"
    />
    <!-- eslint-enable vue/no-v-html -->
    <p
      v-else
      class="text-sm opacity-80 whitespace-pre-line break-words"
    >
      {{ currentError?.message ?? fallbackMessage }}
    </p>
  </CamelotConfirmDialog>
</template>

<script setup lang="ts">
/** level 未指定時的預設色彩角色 */
const DEFAULT_LEVEL: CamelotErrorLevel = 'error'

withDefaults(
  defineProps<{
    /** 錯誤未帶 title 時的預設標題 */
    title?: string
    /** 錯誤未帶 message 也未帶 messageHtml 時的保底文字 */
    fallbackMessage?: string
    positiveLabel?: string
    /** 錯誤對話框預設不可由遮罩關閉，避免使用者略過未讀的錯誤 */
    closeByMask?: boolean
    /** 錯誤未帶 zIndex 時的預設層級 */
    zIndex?: number
  }>(),
  {
    title: '發生錯誤',
    fallbackMessage: '發生錯誤，請稍後再試',
    positiveLabel: '確認',
    closeByMask: false,
  },
)

const {
  currentError,
  dismiss,
  runAction,
} = useCamelotError()

/**
 * 佇列非空即開啟。BaseDialogV2 的遮罩／ESC 關閉一律會寫回這個 model，
 * 因此關閉路徑統一收斂到此 setter，不另接 cancel 事件以免重複 dismiss。
 * 佇列若還有下一筆會立刻遞補，對話框保持開啟並顯示下一則。
 */
const open = computed({
  get: () => !!currentError.value,
  set: (value) => {
    if (value) {
      return
    }

    dismiss()
  },
})

const color = computed<CamelotColorRole>(() => currentError.value?.level ?? DEFAULT_LEVEL)

/**
 * 錯誤未指定該角色的動作時（例如只給預設確認鈕），退回單純關閉。
 * 指定了才交給 runAction 處理 handler 與 close 旗標。
 */
const onAction = (role: CamelotConfirmAction) => {
  const action = currentError.value?.[role]
  if (!action) {
    dismiss()
    return
  }

  runAction(action, currentError.value?.id)
}
</script>
