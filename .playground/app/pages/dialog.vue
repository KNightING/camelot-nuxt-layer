<template>
  <div>
    <CamelotCustomColorSchemeProvider
      :light-color-scheme="lightColorScheme"
      :dark-color-scheme="darkColorScheme"
    >
      <div
        class="text-c-test bg-primary"
        @click="open = true"
      >
        open dialog
      </div>

      <CamelotBaseDialogV2
        v-model:open="open"
        :close-by-mask="false"
        :query="{
          key: 'dialog',
          value: 'test',
        }"
      >
        <div class="bg-transparent text-on-surface overflow-hidden rounded-lg shadow">
          <div
            class="flex flex-col items-stretch"
          >
            <div class="overflow-hidden shadow flex flex-col w-[90vw] h-[30vh] bg-surface-container ">
              <div class="flex justify-end">
                <i-material-symbols-close
                  class="text-primary text-lg m-1 cursor-pointer"
                  @click="open = false"
                />
              </div>
              <div class="flex-1 overflow-auto bg-gradient-to-b from-red-700 to-violet-300">
                <CamelotNumberCounter
                  v-model="v"
                  class="w-4"
                  :max="10"
                  :min="0"
                  min-step-by-value
                  used-min-step-by-value
                />

                <div class="flex flex-col items-stretch py-1 overflow-auto">
                  <div class="w-20 h-20" />
                  <CamelotSelectV2
                    v-model="department"
                    :options="options"
                    class="!w-72 mx-4"
                    disabled-close-when-scrolling
                  >
                    <div
                      class="w-full border bg-background text-black-700 border-black-300 focus:border-primary-500 outline-none rounded-lg px-4 py-2 text-base caret-primary-500 flex"
                    >
                      <span class="flex-1">{{ department }}</span>
                    </div>
                  </CamelotSelectV2>
                </div>
                <div class="h-[600px]" />
              </div>
            </div>
          </div>
        </div>
      </CamelotBaseDialogV2>
    </CamelotCustomColorSchemeProvider>

    <div class="h-[1000px]" />
    <div
      class="text-c-test bg-primary"
      @click="open = true"
    >
      open dialog
    </div>

    <div
      class="text-c-test bg-primary my-4"
      @click="openBottomSheet = true"
    >
      open BottomSheet
    </div>

    <CamelotBaseBottomSheetV2
      v-model:open="openBottomSheet"
      tag="bottom"
    >
      <div class="overflow-hidden rounded-t-xl shadow flex flex-col w-screen h-[30vh] bg-surface-container ">
        <div class="flex justify-end">
          <i-material-symbols-close
            class="text-primary text-lg m-1 cursor-pointer"
            @click="openBottomSheet = false"
          />
        </div>
        <div class="flex-1 overflow-auto bg-gradient-to-b from-red-700 to-violet-800">
          <CamelotNumberCounter
            v-model="v"
            class="w-4"
            :max="10"
            :min="0"
            min-step-by-value
            used-min-step-by-value
          />
          <div
            class="text-c-test bg-primary"
            @click="open = true"
          >
            open dialog
          </div>
          <CamelotSelectV2
            v-model="department"
            :options="options"
            class="!w-72 mx-4"
          >
            <div
              class="w-full border bg-background text-black-700 border-black-300 focus:border-primary-500 outline-none rounded-lg px-4 py-2 text-base caret-primary-500 flex"
            >
              <span class="flex-1">{{ department }}</span>
            </div>
          </CamelotSelectV2>
          <div class="h-[600px]" />
        </div>
      </div>
    </CamelotBaseBottomSheetV2>

    <div
      class="text-c-test bg-primary"
      @click="openLoading"
    >
      open loading
    </div>
    <CamelotLoading />
  </div>
</template>

<script setup lang="ts">
const v = ref(0.3)

const { lightColorScheme, darkColorScheme } = useCustomColorScheme<{ test: string }>(undefined, {
  lightColorScheme: {
    primary: '#140fF1',
    test: '#FFEA00',
  },
  darkColorScheme: {
    primary: '#FFEA00',
    test: '#140fF1',
  },
})

const open = ref(false)

const openBottomSheet = ref(false)

const openLoading = async () => {
  const closeable = useLoading().open('test')
  await useDelay(3000)
  closeable()
}

const department = ref('韓式餐廳')

const options = ref([
  {
    name: '韓式餐廳',
    value: '韓式餐廳',
  },
  {
    name: '港式餐廳',
    value: '港式餐廳',
  },
  {
    name: '日式餐廳',
    value: '日式餐廳',
  },
  {
    name: '中式餐廳',
    value: '中式餐廳',
  },
])
</script>

<style scoped></style>
