<template>
  <header class="relative min-h-[96px]">
    <div
      :style="[
        `height:${height || 96}px`,
      ]"
    />

    <CamelotGpu
      class="z-50 bg-white fixed top-0 left-0 right-0 w-screen min-h-header flex flex-col justify-center"
    >
      <div
        ref="realHeaderEl"
        class="w-full"
      >
        <div
          class="py-8 transition-all duration-300"
          :class="{
            'py-4!': smallerHeader,
          }"
        >
          <!--
            RWD：md 以上維持單列導覽；md 以下把導覽收進漢堡，展開後以整列寬度往下排。
            導覽內容只寫一份，靠 flex-wrap + w-full 切換橫列／直排，避免桌機與行動兩套 markup 走鐘。
          -->
          <div class="flex flex-wrap items-center gap-y-2 px-4 sm:px-6 lg:px-8">
            <img
              class="transition-transform duration-300"
              :class="{
                'scale-[.85] origin-left': smallerHeader,
              }"
            >
            <div class="flex-1" />

            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-lg text-xl text-on-surface md:hidden"
              :aria-expanded="navOpen"
              aria-label="切換導覽選單"
              @click="navOpen = !navOpen"
            >
              {{ navOpen ? '✕' : '☰' }}
            </button>

            <div
              class="w-full flex-col items-start gap-4 pt-2 transition-transform duration-300 md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:pt-0"
              :class="[
                navOpen ? 'flex' : 'hidden',
                { 'md:scale-[.85] md:origin-right': smallerHeader },
              ]"
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
                v-model:open="open"
                disabled-shadow
                :z-index="70"
                trigger-mode="hover"
              >
                <span>Hover開啟會員</span>

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

// md 以下的漢堡選單展開狀態；回到 md 以上時導覽一律顯示，不需要重設
const navOpen = ref(false)
</script>

<style scoped>

</style>
