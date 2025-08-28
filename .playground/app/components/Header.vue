<template>
  <header class="relative">
    <div
      :style="[
        `height:${height}px`,
      ]"
    />

    <CamelotGpu
      ref="realHeaderEl"
      class="z-50 bg-white fixed top-0 left-0 right-0 w-screen min-h-header flex flex-col justify-center"
    >
      <div class="w-full">
        <div
          class="py-8 transition-all duration-300"
          :class="{
            '!py-4': smallerHeader,
          }"
        >
          <div class="flex">
            <img
              class="transition-transform duration-300"
              :class="{
                'scale-[.85] origin-left': smallerHeader,
              }"
            >
            <div class="flex-1" />
            <div
              class="flex gap-6 items-center transition-transform duration-300"
              :class="{
                'scale-[.85] origin-right': smallerHeader,
              }"
            >
              <CamelotPopupV2
                v-model:open="open"
                disabled-shadow
                :z-index="70"
                disabled-close-when-scrolling
              >
                <span>點擊開啟會員</span>

                <template #popup>
                  <div class=" flex flex-col border border-outline-variant min-w-[205px] rounded-lg bg-surface gap-6 py-3 px-4 overflow-hidden">
                    <span
                      type="content1"
                      single-line
                    >
                      客戶資料
                    </span>
                    <span type="content1">
                      我的最愛
                    </span>
                    <span type="content1">
                      登出
                    </span>
                  </div>
                </template>
              </CamelotPopupV2>

              <span
                class=" flex items-center justify-center"
                type="title"
                hover-underline
              >
                首頁
              </span>
              <span
                class=" flex items-center justify-center"
                type="title"
                hover-underline
              >
                最新消息
              </span>
              <span
                class=" flex items-center justify-center"
                type="title"
                hover-underline
              >
                線上訂貨
              </span>
              <span
                class=" flex items-center justify-center"
                type="title"
                hover-underline
              >
                訂單查詢
              </span>

              <CamelotPopupV2
                :open="open"
                disabled-shadow
                :z-index="70"
                manual
              >
                <span ref="hoverMemberRef">Hover開啟會員</span>

                <template #popup>
                  <div class="flex flex-col border border-outline-variant min-w-[205px] rounded-lg bg-surface gap-6 py-3 px-4">
                    <span
                      type="content1"
                      single-line
                    >
                      客戶資料
                    </span>
                    <span type="content1">
                      我的最愛
                    </span>
                    <span type="content1">
                      登出
                    </span>
                  </div>
                </template>
              </CamelotPopupV2>
            </div>
          </div>
        </div>

        <slot name="bottom" />
      </div>
    </CamelotGpu>
  </header>
</template>

<script setup lang="ts">
const realHeaderEl = ref()

const { height } = useElementSize(realHeaderEl)

const windowScroll = useWindowScroll({
  throttle: 100,
})
const { y } = windowScroll
const smallerHeader = computed(() => y.value >= 100)

const open = ref(false)

const hoverMemberRef = useTemplateRef('hoverMemberRef')

const isHover = useElementHover(hoverMemberRef)

watch(isHover, (isHover) => {
  open.value = isHover
})
</script>

<style scoped>

</style>
