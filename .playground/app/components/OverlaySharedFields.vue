<template>
  <div class="flex flex-col gap-4">
    <p class="text-xs opacity-70">
      這兩個控制項在 Dialog 與 Sheet 中綁定同一組 state，任一側修改另一側即時反映。
    </p>

    <div class="flex items-center justify-between gap-4">
      <span class="text-sm">Shared count</span>
      <CamelotNumberCounter
        v-model="count"
        :max="10"
        :min="0"
      />
    </div>

    <CamelotSelectV2
      v-model="option"
      label="Shared option"
      :options="options"
      class="w-full"
    />

    <p class="text-xs">
      目前值：<span class="text-c-test font-semibold">{{ count }} ・ {{ option }}</span>
      <br>
      <span class="opacity-70">
        上方數值以自訂鍵 <code>test</code> 上色，按鈕與強調色用被覆寫的 <code>primary</code>，
        背景與文字則繼承全域主題。
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: { name: string, value: string, label: string }[]
}>()

const count = defineModel<number>('count', { required: true })
const option = defineModel<string>('option', { required: true })
</script>
