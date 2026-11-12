<template>
  <div
    class="flex w-full flex-col gap-1 text-base"
    :class="[
      roleColorClass,
      {
        'items-end': isEnd,
        'items-start': !isEnd,
      },
    ]"
  >
    <div
      class="cml-chat-bubble max-w-[82%] px-3.5 py-2 break-words"
      :class="[
        bubbleClass,
        {
          'cml-chat-bubble-end': isEnd,
          'cml-chat-bubble-start': !isEnd,
        },
      ]"
    >
      <slot>{{ text }}</slot>
    </div>
    <div
      v-if="$slots.meta"
      class="px-1 text-xs text-on-surface-variant"
    >
      <slot name="meta" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 訊息文字；需要自訂內容時改用預設 slot */
    text?: string
    /** start 對方（靠左）/ end 自己（靠右） */
    side?: CamelotChatBubbleSide
    color?: CamelotColorRole
  }>(),
  {
    text: '',
    side: 'start',
    color: 'primary',
  },
)

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const isEnd = computed(() => props.side === 'end')

// 自己的訊息：強調色；尾巴那一角收小
const endBubbleClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-ink rounded-[1.125rem] rounded-br-md'
    case 'aqua':
      return 'aqua-fill rounded-2xl rounded-br-md text-[var(--cml-color-current-on-color)]'
    case 'scifi':
      return 'rounded-none border border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_18%,transparent)] font-mono text-[var(--cml-color-current-color)] shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_35%,transparent)]'
    case 'cupertino':
      return 'rounded-[18px] rounded-br-[4px] bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
    default:
      return 'rounded-2xl rounded-br-sm bg-[var(--cml-color-current-color)] text-[var(--cml-color-current-on-color)]'
  }
})

// 對方的訊息：中性底
const startBubbleClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'tactile-well rounded-[1.125rem] rounded-bl-md text-on-surface'
    case 'aqua':
      return 'aqua-track rounded-2xl rounded-bl-md text-on-surface'
    case 'scifi':
      return 'rounded-none border border-[color-mix(in_srgb,var(--cml-color-current-color)_30%,transparent)] bg-surface-container-lowest font-mono text-on-surface'
    case 'cupertino':
      return 'rounded-[18px] rounded-bl-[4px] bg-surface-container-highest text-on-surface'
    default:
      return 'rounded-2xl rounded-bl-sm bg-surface-container-high text-on-surface'
  }
})

const bubbleClass = computed(() => (isEnd.value ? endBubbleClass.value : startBubbleClass.value))
</script>

<style scoped>
/* 出現時從尾巴那一角長出來 */
.cml-chat-bubble {
  animation: cml-chat-bubble-in 0.45s var(--ease-spring) both;
}
.cml-chat-bubble-start { transform-origin: bottom left; }
.cml-chat-bubble-end { transform-origin: bottom right; }

@keyframes cml-chat-bubble-in {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cml-chat-bubble { animation: none; }
}
</style>
