<template>
  <CamelotBaseDialogV2
    v-model:open="open"
    :close-by-mask="closeByMask"
    :tag="tag"
    :z-index="zIndex"
    :query="query"
    @cancel="emit('cancel')"
  >
    <div class="flex flex-col gap-4">
      <slot name="title">
        <h3
          v-if="title"
          class="text-lg font-bold"
        >
          {{ title }}
        </h3>
      </slot>

      <slot>
        <p
          v-if="message"
          class="text-sm opacity-80 whitespace-pre-line"
        >
          {{ message }}
        </p>
      </slot>

      <!-- 順序固定為 反向 → 中立 → 正向 並靠右，四種風格一致；外觀差異由 CamelotButton 承擔 -->
      <slot
        name="actions"
        :close="close"
      >
        <div class="flex flex-wrap items-center justify-end gap-3">
          <CamelotButton
            v-if="negativeLabel"
            :color="negativeColor"
            is-container
            :label="negativeLabel"
            @click="onAction('negative')"
          />
          <CamelotButton
            v-if="neutralLabel"
            :color="neutralColor"
            is-container
            :label="neutralLabel"
            @click="onAction('neutral')"
          />
          <CamelotButton
            v-if="positiveLabel"
            :color="positiveColor"
            :label="positiveLabel"
            @click="onAction('positive')"
          />
        </div>
      </slot>
    </div>
  </CamelotBaseDialogV2>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 標題；未設定且未使用 title slot 時不渲染標題列 */
    title?: string
    /** 內文；未設定且未使用預設 slot 時不渲染內文 */
    message?: string
    /** 正向按鈕文字；設為空字串可隱藏此鈕 */
    positiveLabel?: string
    /** 中立按鈕文字；未設定則不顯示 */
    neutralLabel?: string
    /** 反向按鈕文字；未設定則不顯示 */
    negativeLabel?: string
    positiveColor?: CamelotColorRole
    neutralColor?: CamelotColorRole
    negativeColor?: CamelotColorRole
    /** 點擊任一按鈕後是否自動關閉；需要非同步流程時設為 false 並自行控制 open */
    autoClose?: boolean
    /** 以下透傳 CamelotBaseDialogV2 */
    closeByMask?: boolean
    tag?: string
    zIndex?: number
    query?: CamelotDialogQuery
  }>(),
  {
    positiveLabel: '確認',
    positiveColor: 'primary',
    neutralColor: 'primary',
    negativeColor: 'error',
    autoClose: true,
    closeByMask: true,
  },
)

const emit = defineEmits<{
  positive: []
  neutral: []
  negative: []
  cancel: []
}>()

const open = defineModel<boolean>('open', { default: false })

const close = () => {
  open.value = false
}

const onAction = (action: CamelotConfirmAction) => {
  // defineEmits 產生的是多載簽章，聯集無法直接分派過去，逐一收窄成字面值才成立
  switch (action) {
    case 'positive':
      emit('positive')
      break
    case 'neutral':
      emit('neutral')
      break
    case 'negative':
      emit('negative')
      break
  }

  if (!props.autoClose) {
    return
  }

  close()
}
</script>
