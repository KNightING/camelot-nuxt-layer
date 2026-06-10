<template>
  <div>
    <!-- 置頂 Header -->
    <Header>
      <template #bottom>
        <div class="w-full bg-primary h-10 z-10" />
      </template>
    </Header>

    <!-- Beautiful Theme Selector & Demo section (放置於 Header 下方，加上 pt-4 避免重疊) -->
    <div class="p-6 pt-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">
        Camelot UI Style System Demo
      </h1>

      <!-- Theme and Color Selectors -->
      <div class="flex flex-wrap gap-6 items-center">
        <!-- Active Style Theme（控制項本身以 Camelot 元件呈現，跟著主題切換） -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Style Theme</span>
          <div class="flex flex-wrap gap-2">
            <CamelotButton
              v-for="t in themeOptions"
              :key="t.value"
              :is-container="themeMode !== t.value"
              :class="themeMode === t.value ? '' : 'opacity-50'"
              @click="themeMode = t.value"
            >
              {{ t.label }}
            </CamelotButton>
          </div>
        </div>

        <!-- Dark / Light Mode -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dark / Light Mode</span>
          <div class="flex flex-wrap gap-2">
            <CamelotButton
              v-for="m in colorModeOptions"
              :key="m.value"
              :is-container="colorMode !== m.value"
              :class="colorMode === m.value ? '' : 'opacity-50'"
              @click="colorMode = m.value"
            >
              {{ m.label }}
            </CamelotButton>
          </div>
        </div>

        <!-- Color Palette Role -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color Palette Role (Component prop)</span>
          <div class="flex flex-wrap gap-2">
            <CamelotButton
              v-for="c in colorRoles"
              :key="c"
              :color="c"
              :is-container="currentColorRole !== c"
              :class="currentColorRole === c ? '' : 'opacity-50'"
              @click="currentColorRole = c"
            >
              {{ c }}
            </CamelotButton>
          </div>
        </div>

        <!-- Global Brand Color -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global Brand Color (CSS Variable)</span>
          <div class="flex flex-wrap gap-2">
            <CamelotButton
              v-for="brand in brandColors"
              :key="brand.name"
              :is-container="activeBrandColorName !== brand.name"
              :class="activeBrandColorName === brand.name ? '' : 'opacity-50'"
              @click="changeBrandColor(brand)"
            >
              <span class="inline-flex items-center gap-1.5">
                <span
                  class="h-3 w-3 rounded-full"
                  :style="{ backgroundColor: brand.roles.primary.light }"
                />
                {{ brand.name }}
              </span>
            </CamelotButton>
          </div>
        </div>
      </div>

      <!-- Component Showcase -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <!-- Rich Text Editor (WYSIWYG) Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2 lg:col-span-3']">
          <h2 :class="cardTitleClass">
            Rich Text Editor (TipTap・四主題)
          </h2>
          <span class="text-xs text-slate-400">工具列跟隨主題與色彩角色；圖片上傳可插拔（此處用 demo handler 模擬）</span>
          <CamelotRichTextEditor
            v-model="richText"
            :color="currentColorRole"
            :upload-handler="demoUpload"
            placeholder="開始撰寫內容…（試試 H1 / 粗體 / 清單 / 連結 / 貼圖）"
            class="mt-3"
          />
          <details class="mt-2">
            <summary class="cursor-pointer text-xs text-slate-400">
              輸出 HTML
            </summary>
            <pre class="mt-1 max-h-40 overflow-auto rounded bg-surface-container p-2 text-[11px] text-on-surface-variant">{{ richText }}</pre>
          </details>
        </div>

        <!-- Image Dropzone Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Image Dropzone (拖曳/選擇・四主題)
          </h2>
          <span class="text-xs text-slate-400">grid 多格：圖片佔格、新增格在右側，達 {{ dropzoneMax }} 張後消失（也可拖曳）</span>
          <CamelotImageDropzone
            v-model="dropzoneFiles"
            :color="currentColorRole"
            layout="grid"
            :max="dropzoneMax"
            :columns="5"
            class="mt-3"
            @select="onDropzoneSelect"
          />
          <p class="mt-2 text-xs text-on-surface-variant">
            已選 {{ dropzoneFiles?.length ?? 0 }} / {{ dropzoneMax }} 張：{{ (dropzoneFiles ?? []).map(f => f.name).join('、') || '（無）' }}
          </p>

          <span class="mt-4 block text-xs text-slate-400">stacked（預設）：大區塊 + 下方預覽</span>
          <CamelotImageDropzone
            v-model="dropzoneFiles2"
            :color="currentColorRole"
            multiple
            class="mt-2"
          />
        </div>

        <!-- Button & Switch & Checkbox Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Basic Inputs & Controls
          </h2>

          <div class="flex items-center gap-4 flex-wrap">
            <CamelotButton
              :color="currentColorRole"
              label="Action"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Container"
              is-container
            />
            <CamelotButton
              :color="currentColorRole"
              label="Disabled"
              disabled
            />
          </div>

          <div class="flex items-center gap-6 mt-2">
            <CamelotSwitch
              v-model="switchVal"
              label="Notifications"
              :color="currentColorRole"
            />
            <CamelotSwitch
              :model-value="true"
              label="Disabled Switch"
              disabled
              :color="currentColorRole"
            />
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <CamelotCheckbox
              v-model="checkboxVal"
              label="Agree to terms"
              :color="currentColorRole"
            />
            <CamelotCheckbox
              :model-value="true"
              label="Disabled Checkbox"
              disabled
              :color="currentColorRole"
            />
          </div>
        </div>

        <!-- Input & Textarea Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Input & Textarea
          </h2>

          <CamelotInput
            v-model="inputTextVal"
            label="Username"
            placeholder="Enter your username..."
            :color="currentColorRole"
          />

          <CamelotInput
            model-value="Read-only value"
            label="Disabled Input"
            disabled
            :color="currentColorRole"
          />

          <CamelotInput
            v-model="inputTextVal"
            label="Custom Label Slot"
            placeholder="label 由 #label slot 自定義"
            :color="currentColorRole"
          >
            <template #label="{ label }">
              <span class="pl-1 text-sm font-bold text-[var(--cml-color-current-color)]">★ {{ label }}</span>
            </template>
          </CamelotInput>

          <CamelotTextarea
            v-model="textareaVal"
            label="Message"
            required
            placeholder="輸入訊息…"
            autosize
            :max-rows="6"
            :maxlength="200"
            show-count
            :color="currentColorRole"
          />

          <CamelotTextarea
            model-value="Disabled textarea content"
            label="Disabled Textarea"
            disabled
            :color="currentColorRole"
          />
        </div>

        <!-- Select Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Select
          </h2>

          <CamelotSelectV2
            v-model="selectVal"
            :color="currentColorRole"
            label="Choose option"
            :options="options"
          />

          <CamelotSelectV2
            v-model="selectV2Val"
            :color="currentColorRole"
            label="Searchable selection"
            :options="options"
            class="w-full"
          />

          <CamelotSelectV2
            :model-value="options[0]?.value"
            :color="currentColorRole"
            label="Disabled select"
            :options="options"
            disabled
            class="w-full"
          />

          <div class="text-xs text-slate-400 mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            Selected values: <br>
            Text: {{ inputTextVal }} <br>
            Dropdown: {{ selectVal }} <br>
            Search Select: {{ selectV2Val }} <br>
            Switch: {{ switchVal }} <br>
            Checkbox: {{ checkboxVal }}
          </div>
        </div>

        <!-- Dialog & Bottom Sheet Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Overlays (Dialog & Sheet)
          </h2>
          <p class="text-xs text-slate-400">
            Backdrop filters, curved corners, and clip-path structures change dynamically.
          </p>
          <div class="flex gap-4">
            <CamelotButton
              :color="currentColorRole"
              label="Open Dialog"
              @click="demoDialogOpen = true"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Open Sheet"
              @click="demoSheetOpen = true"
            />
          </div>
        </div>

        <!-- Tabs & Steps Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2']">
          <h2 :class="cardTitleClass">
            Navigation (Tabs & Steps)
          </h2>

          <div class="flex flex-col gap-2">
            <span class="text-xs text-slate-400">Themed Tabs Bar:</span>
            <CamelotTabs
              v-model="demoActiveTab"
              :options="demoTabsOptions"
              :color="currentColorRole"
            />
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <span class="text-xs text-slate-400">Themed Steps tracker:</span>
            <CamelotSteps
              v-model="demoActiveStep"
              :steps="demoStepsList"
              enable-change-by-click
              :color="currentColorRole"
            />
          </div>
        </div>

        <!-- Feedbacks, Skeletons & Spinner Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Loaders & Toast Feedback
          </h2>
          <div class="flex gap-4">
            <CamelotButton
              :color="currentColorRole"
              label="Run Loader"
              @click="triggerLoading"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Show Toast"
              @click="triggerToast"
            />
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400">Skeleton Loader:</span>
              <button
                type="button"
                class="text-xs text-slate-500 hover:text-primary underline cursor-pointer"
                @click="demoSkeletonLoading = !demoSkeletonLoading"
              >
                Toggle ({{ demoSkeletonLoading ? 'Loading' : 'Static' }})
              </button>
            </div>

            <div class="w-full h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 p-2 flex items-center gap-3">
              <CamelotSkeleton
                :is-loading="demoSkeletonLoading"
                class="w-10 h-10 rounded-full shrink-0"
              />
              <div class="flex-1 flex flex-col gap-1.5 h-full justify-center">
                <CamelotSkeleton
                  :is-loading="demoSkeletonLoading"
                  class="w-3/4 h-3.5 rounded"
                />
                <CamelotSkeleton
                  :is-loading="demoSkeletonLoading"
                  class="w-1/2 h-3 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Drawer (Floating & Fixed)
          </h2>
          <div class="flex flex-wrap gap-3">
            <CamelotButton
              :color="currentColorRole"
              label="Open Left"
              @click="drawerLeftOpen = true"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Open Right"
              @click="drawerRightOpen = true"
            />
            <CamelotButton
              :color="currentColorRole"
              :label="fixedDrawerOpen ? 'Collapse Fixed' : 'Expand Fixed'"
              @click="fixedDrawerOpen = !fixedDrawerOpen"
            />
          </div>
          <div class="flex h-40 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <CamelotDrawer
              v-model:open="fixedDrawerOpen"
              variant="fixed"
              position="left"
              width="160px"
            >
              <div class="p-3 text-sm">
                <div class="mb-2 font-bold">
                  Fixed Panel
                </div>
                <div class="opacity-70">
                  常駐側欄內容
                </div>
              </div>
            </CamelotDrawer>
            <div class="flex-1 p-3 text-sm opacity-70">
              主內容區（固定 Drawer 會推擠此區）
            </div>
          </div>
        </div>

        <!-- Tree Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Tree (Multi-level + Check)
          </h2>
          <CamelotTree
            v-model:checked="treeChecked"
            :color="currentColorRole"
            :nodes="treeNodes"
            checkable
            default-expand-all
          />
          <div class="mt-1 truncate text-xs text-slate-400">
            Checked: {{ treeChecked.join(', ') || '—' }}
          </div>
        </div>

        <!-- Menu Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Menu (3-level navigation)
          </h2>
          <CamelotMenu
            v-model="menuActive"
            :color="currentColorRole"
            :items="menuItems"
            default-expand-all
          />
          <div class="mt-1 truncate text-xs text-slate-400">
            Active: {{ menuActive }}
          </div>
        </div>

        <!-- Slider Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Slider / Range (step, marks, tooltip)
          </h2>

          <div class="flex flex-col gap-1">
            <span class="text-xs text-slate-400">Single（value = {{ sliderVal }}）</span>
            <CamelotSlider
              v-model="sliderVal"
              :color="currentColorRole"
              show-tooltip
            />
          </div>

          <div class="mt-3 flex flex-col gap-1">
            <span class="text-xs text-slate-400">Range（{{ sliderRangeVal[0] }} ~ {{ sliderRangeVal[1] }}）</span>
            <CamelotSlider
              v-model="sliderRangeVal"
              range
              :color="currentColorRole"
              show-tooltip
            />
          </div>

          <div class="mt-3 flex flex-col gap-1">
            <span class="text-xs text-slate-400">Step 20 + 間隔文字（value = {{ sliderStepVal }}）</span>
            <CamelotSlider
              v-model="sliderStepVal"
              :step="20"
              :height="8"
              :marks="[
                { value: 0, label: '低' },
                { value: 20, label: '20' },
                { value: 40, label: '40' },
                { value: 60, label: '60' },
                { value: 80, label: '80' },
                { value: 100, label: '高' },
              ]"
              :color="currentColorRole"
            />
          </div>
        </div>

        <!-- Tag Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Tag (color roles / variants)
          </h2>
          <div class="flex flex-wrap gap-2">
            <CamelotTag
              v-for="c in colorRoles"
              :key="c"
              :color="c"
            >
              {{ c }}
            </CamelotTag>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <CamelotTag
              :color="currentColorRole"
              variant="solid"
            >
              solid
            </CamelotTag>
            <CamelotTag
              :color="currentColorRole"
              variant="soft"
            >
              soft
            </CamelotTag>
            <CamelotTag
              :color="currentColorRole"
              variant="outline"
            >
              outline
            </CamelotTag>
            <CamelotTag
              v-for="t in tags"
              :key="t"
              :color="currentColorRole"
              closable
              @close="tags = tags.filter(x => x !== t)"
            >
              {{ t }}
            </CamelotTag>
          </div>
        </div>

        <!-- Breadcrumb Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Breadcrumb
          </h2>
          <CamelotBreadcrumb
            :items="breadcrumbItems"
            :color="currentColorRole"
            @select="(it) => useCamelotToast().open('前往 ' + it.label)"
          />
        </div>

        <!-- Notification Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Notifications (8 positions / title / action)
          </h2>
          <div class="grid grid-cols-3 gap-1.5 text-xs">
            <button
              v-for="p in toastPositions"
              :key="p"
              class="rounded-md border border-slate-300 px-2 py-1 text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-slate-700"
              @click="notify(p)"
            >
              {{ p }}
            </button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="text-xs text-slate-400 self-center">狀態系列：</span>
            <CamelotTag
              v-for="ty in toastTypes"
              :key="ty"
              :color="ty === 'info' ? 'primary' : ty"
              variant="soft"
              class="cursor-pointer"
              @click="notify('top-right', ty)"
            >
              {{ ty }}
            </CamelotTag>
          </div>
        </div>

        <!-- Timeline Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2 lg:col-span-3']">
          <h2 :class="cardTitleClass">
            Timeline (vertical alternate + horizontal, scroll fade-in)
          </h2>
          <div class="grid gap-8 md:grid-cols-2">
            <CamelotTimeline
              :items="timelineItems"
              side="alternate"
              animate
              :color="currentColorRole"
            />
            <CamelotTimeline
              :items="timelineItems"
              :color="currentColorRole"
            />
          </div>
          <div class="mt-6 overflow-x-auto">
            <CamelotTimeline
              :items="timelineItems"
              direction="horizontal"
              side="alternate"
              animate
              :color="currentColorRole"
            />
          </div>
        </div>

        <!-- Carousel Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2 lg:col-span-3']">
          <h2 :class="cardTitleClass">
            Carousel (effects / loop / autoplay / peek)
          </h2>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="eff in carouselEffects"
              :key="eff"
              class="rounded-md border px-2.5 py-1 text-xs transition-colors"
              :class="carouselEffect === eff ? 'border-primary bg-primary/10 text-primary' : 'border-slate-300 dark:border-slate-700 text-slate-500'"
              @click="carouselEffect = eff"
            >
              {{ eff }}
            </button>
            <label class="ml-2 flex items-center gap-1 text-xs text-slate-400">
              <input
                v-model="carouselLoop"
                type="checkbox"
              > loop
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400">
              <input
                v-model="carouselAutoplay"
                type="checkbox"
              > autoplay
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400">
              peek
              <input
                v-model.number="carouselPeek"
                type="number"
                min="0"
                max="2"
                class="w-12 rounded border border-slate-300 bg-transparent px-1 dark:border-slate-700"
              >
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400">
              <input
                v-model="carouselArrows"
                type="checkbox"
              > arrows
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400">
              <input
                v-model="carouselDots"
                type="checkbox"
              > dots
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400">
              <input
                v-model="carouselVertical"
                type="checkbox"
              > vertical
            </label>
          </div>

          <CamelotCarousel
            v-model="carouselIndex"
            :items="carouselItems"
            item-key="id"
            :effect="carouselEffect"
            :loop="carouselLoop"
            :autoplay="carouselAutoplay"
            :peek="carouselEffect === 'slide' || carouselEffect === 'coverflow' || carouselEffect === 'zoom' ? carouselPeek : 0"
            :gap="12"
            :direction="carouselVertical ? 'vertical' : 'horizontal'"
            :show-arrows="carouselArrows"
            :show-dots="carouselDots"
            :color="currentColorRole"
            height="240px"
          >
            <template #default="{ item, isActive }">
              <div
                class="flex h-full w-full items-center justify-center rounded-2xl text-2xl font-bold text-white transition-shadow"
                :class="isActive ? 'shadow-xl' : 'shadow'"
                :style="{ background: `hsl(${item.hue} 70% 55%)` }"
              >
                {{ item.title }}
              </div>
            </template>
          </CamelotCarousel>

          <!-- 外部連動的獨立指標（與上方 carousel 共用 v-model） -->
          <div class="mt-3 flex items-center justify-center gap-3">
            <span class="text-xs text-slate-400">外部指標：</span>
            <CamelotCarouselIndicator
              v-model="carouselIndex"
              :total="carouselItems.length"
              :color="currentColorRole"
            />
          </div>
        </div>

        <!-- Table Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2 lg:col-span-3']">
          <h2 :class="cardTitleClass">
            Table (Fixed header / columns / rows, zebra, hover)
          </h2>
          <CamelotTable
            :columns="tableColumns"
            :data="pagedTableData"
            :pinned-top-rows="tablePinned"
            row-key="id"
            stripe
            max-height="240px"
          >
            <template #cell-status="{ value }">
              <span
                class="rounded-full px-2 py-0.5 text-xs"
                :class="value === 'active' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'"
              >{{ value }}</span>
            </template>
          </CamelotTable>

          <div class="mt-3 flex justify-end">
            <CamelotPagination
              v-model="tablePage"
              v-model:page-size="tablePageSize"
              :total="tableData.length"
              :color="currentColorRole"
              show-total
              show-page-size
              :page-size-options="[5, 10, 20]"
            />
          </div>
        </div>

        <!-- Progress Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2 lg:col-span-3']">
          <h2 :class="cardTitleClass">
            Progress (Bar &amp; Circle)
          </h2>
          <div class="flex items-center gap-3">
            <input
              v-model.number="progressVal"
              type="range"
              min="0"
              max="100"
              class="w-48 accent-primary"
            >
            <span class="text-xs text-slate-400">value = {{ progressVal }}</span>
          </div>

          <div class="flex flex-col gap-3">
            <CamelotProgressBar
              :value="progressVal"
              :color="currentColorRole"
              show-label
            />
            <CamelotProgressBar
              :value="progressStep"
              :max="4"
              :color="currentColorRole"
              show-label
              label-mode="fraction"
            />
            <CamelotProgressBar
              indeterminate
              :color="currentColorRole"
            />
          </div>

          <div class="flex flex-wrap items-center gap-8 pt-2">
            <CamelotProgressCircle
              :value="progressVal"
              :color="currentColorRole"
              show-label
              :size="76"
            />
            <CamelotProgressCircle
              :value="progressStep"
              :max="4"
              :color="currentColorRole"
              show-label
              label-mode="fraction"
              :size="76"
            />
            <CamelotProgressCircle
              indeterminate
              :color="currentColorRole"
              :size="76"
            />
          </div>

          <div class="flex flex-wrap items-center gap-12 pt-4">
            <CamelotProgressStage
              :current="progressStep"
              :total="4"
              :color="currentColorRole"
              :size="110"
            />

            <!-- 可手動調整的測試用 ProgressStage -->
            <div class="flex items-center gap-5">
              <CamelotProgressStage
                :current="stageCurrent"
                :total="stageTotal"
                :color="currentColorRole"
                :size="110"
              />
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="w-12">目前</span>
                  <input
                    v-model.number="stageCurrent"
                    type="number"
                    min="0"
                    :max="stageTotal"
                    class="w-20 rounded-md border border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-700 outline-none focus:border-primary dark:border-slate-600 dark:text-slate-200"
                  >
                </label>
                <label class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="w-12">最大</span>
                  <input
                    v-model.number="stageTotal"
                    type="number"
                    min="1"
                    class="w-20 rounded-md border border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-700 outline-none focus:border-primary dark:border-slate-600 dark:text-slate-200"
                  >
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Date Pickers Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Date Pickers (mobile → centered modal)
          </h2>
          <div class="flex flex-col gap-3">
            <CamelotDateV2
              :color="currentColorRole"
              label="預約日期"
              placeholder="請選擇日期"
              :get-day-attributes="getDayAttributes"
            />
            <CamelotDateRangeV2
              :color="currentColorRole"
              label="活動區間"
              :multi-calendars="true"
              :get-day-attributes="getDayAttributes"
            />

            <span class="text-xs text-slate-400">區間含時間（24H・到分・起迄各自設定）</span>
            <CamelotDateRangeV2
              v-model="dateRangeTimeVal"
              :color="currentColorRole"
              label="會議時段"
              enable-time
              time-precision="minute"
              :multi-calendars="true"
            />

            <span class="text-xs text-slate-400">含時間（24H・到秒）</span>
            <CamelotDateV2
              v-model="dateTimeSec"
              :color="currentColorRole"
              enable-time
              placeholder="YYYY-MM-DD HH:mm:ss"
            />

            <span class="text-xs text-slate-400">含時間（12H・到分，關閉秒）</span>
            <CamelotDateV2
              v-model="dateTime12"
              :color="currentColorRole"
              enable-time
              time-precision="minute"
              hour-format="12"
              placeholder="YYYY-MM-DD hh:mm a"
            />

            <span class="text-xs text-slate-400">含時間（僅時，關閉分與秒）</span>
            <CamelotDateV2
              v-model="dateTimeHour"
              :color="currentColorRole"
              enable-time
              time-precision="hour"
              placeholder="YYYY-MM-DD HH"
            />
          </div>
        </div>

        <!-- Time Picker Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Time Picker (純時間・參考 DatePicker)
          </h2>

          <span class="text-xs text-slate-400">時:分（24 制）</span>
          <CamelotTimeV2
            v-model="timeVal"
            :color="currentColorRole"
            label="會議時間"
          />

          <span class="text-xs text-slate-400">時:分:秒（12 制）</span>
          <CamelotTimeV2
            v-model="timeVal12"
            :color="currentColorRole"
            time-precision="second"
            hour-format="12"
            placeholder="hh:mm:ss a"
          />

          <p class="text-xs text-on-surface-variant">
            v-model：{{ timeVal || '（無）' }} ／ {{ timeVal12 || '（無）' }}
          </p>
        </div>

        <!-- Virtual Scroll Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Virtual Scroll (variable height)
          </h2>
          <CamelotVirtualScroll
            :items="virtualListItems"
            item-key="id"
            max-height="200px"
            class="rounded-lg border border-outline-variant"
          >
            <template #default="{ item }">
              <div
                class="flex items-center border-b border-outline-variant px-3 text-sm text-on-surface"
                :style="{ minHeight: item.tall ? '72px' : '40px' }"
              >
                {{ item.label }}{{ item.tall ? '（較高列）' : '' }}
              </div>
            </template>
          </CamelotVirtualScroll>
          <span class="text-xs text-slate-400">虛擬滾動的 Select（大量選項）：</span>
          <CamelotSelectV2
            v-model="virtualValue"
            :color="currentColorRole"
            :options="largeOptionsForVirtual"
            virtual-scroll
            class="w-full"
          />
        </div>

        <!-- Utilities Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Utilities (Counter / Expanded / Image / Popup)
          </h2>
          <div class="flex items-start gap-4 flex-wrap">
            <CamelotNumberCounter
              v-model="v"
              label="Counter"
              :max="10"
              :min="0"
              :color="currentColorRole"
            />
            <CamelotNumberCounter
              :model-value="5"
              label="Disabled"
              disabled
              :color="currentColorRole"
            />
          </div>
          <div
            class="w-fit cursor-pointer text-sm text-primary"
            @click="expanded = !expanded"
          >
            ▸ Toggle Expanded
          </div>
          <CamelotExpanded :expanded="expanded">
            <div class="h-24 rounded-lg bg-gradient-to-b from-primary/40 to-primary/5" />
          </CamelotExpanded>
          <div class="flex items-center gap-3">
            <div class="h-24 w-24 overflow-hidden rounded-lg border border-outline-variant">
              <CamelotImageV2
                :src="url"
                class="h-full w-full object-cover"
              >
                <template #error>
                  <span class="flex h-full w-full items-center justify-center bg-surface-container text-xs text-error">load error</span>
                </template>
              </CamelotImageV2>
            </div>
            <CamelotPopupV2>
              <CamelotButton
                :color="currentColorRole"
                label="Open Popup"
              />
              <template #popup>
                <div class="flex flex-col gap-2 rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-lg">
                  <span>客戶資料</span>
                  <span>我的最愛</span>
                  <span>登出</span>
                </div>
              </template>
            </CamelotPopupV2>
          </div>
        </div>

        <!-- Routing Card（useCamelotRouter） -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Routing (useCamelotRouter)
          </h2>
          <div class="flex flex-col gap-2 text-xs text-slate-400">
            <span>canBack(): {{ canBack() }}</span>
            <span class="break-all">baseUrl: {{ useBaseUrl() }}</span>
          </div>
          <div class="flex flex-wrap gap-3">
            <CamelotButton
              :color="currentColorRole"
              label="前往 /page/1"
              @click="toPath('/page/1').to()"
            />
            <CamelotButton
              :color="currentColorRole"
              is-container
              label="上一頁 back()"
              :disabled="!canBack()"
              @click="back()"
            />
            <CamelotButton
              :color="currentColorRole"
              is-container
              label="go to /dialog"
              @click="toPath('/dialog').to()"
            />
          </div>
        </div>
      </div>

      <!-- Demo dialog overlays -->
      <CamelotBaseDialogV2
        v-model:open="demoDialogOpen"
        :close-by-mask="true"
      >
        <div class="flex flex-col items-center gap-4">
          <h3 class="text-lg font-bold">
            Themed Modal Dialog
          </h3>
          <p class="text-sm opacity-80 text-center">
            This dialog utilizes M3 card parameters, Cupertino frosted blur, or Sci-Fi clip-paths depending on the theme!
          </p>
          <CamelotButton
            :color="currentColorRole"
            label="Close Dialog"
            @click="demoDialogOpen = false"
          />
        </div>
      </CamelotBaseDialogV2>

      <CamelotBaseBottomSheetV2 v-model:open="demoSheetOpen">
        <div class="flex flex-col gap-4 p-4 min-w-[300px]">
          <h3 class="text-lg font-bold text-center">
            Themed Bottom Sheet
          </h3>
          <p class="text-sm opacity-80 text-center">
            Handles pull-up offsets, smooth slide-up actions, and border frame customizations dynamically.
          </p>
          <CamelotButton
            :color="currentColorRole"
            label="Dismiss"
            class="mx-auto"
            @click="demoSheetOpen = false"
          />
        </div>
      </CamelotBaseBottomSheetV2>

      <!-- Floating drawers -->
      <CamelotDrawer
        v-model:open="drawerLeftOpen"
        position="left"
      >
        <div class="flex w-full flex-col gap-2 p-4">
          <h3 class="px-2 text-lg font-bold">
            選單 Menu
          </h3>
          <p class="px-2 text-xs opacity-60">
            三階層導覽選單（獨立 CamelotMenu 元件，四種主題風格）
          </p>
          <CamelotMenu
            v-model="menuActive"
            :color="currentColorRole"
            :items="menuItems"
            default-expand-all
          />
          <div class="px-2 text-xs text-slate-400">
            Active: {{ menuActive }}
          </div>
        </div>
      </CamelotDrawer>

      <CamelotDrawer
        v-model:open="drawerRightOpen"
        position="right"
      >
        <div class="flex w-full flex-col gap-3 p-5">
          <h3 class="text-lg font-bold">
            Right Drawer
          </h3>
          <p class="text-sm opacity-70">
            浮動模式，從右側滑入。
          </p>
          <CamelotButton
            :color="currentColorRole"
            label="Close"
            @click="drawerRightOpen = false"
          />
        </div>
      </CamelotDrawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isToday } from 'date-fns'

const getDayAttributes = (date: Date) => {
  if (isToday(date)) {
    return { label: '行憲紀念日' }
  }
}

const {
  toPath, canBack, back,
} = useCamelotRouter()
const loading = useLoading()

const { isOnBottom } = useScrollOnBottom()

const step = ref(0)
const expanded = ref(false)

const v = ref(0.3)

const globalColorScheme = useCustomColorScheme<{ test: string }>(undefined, {
  lightColorScheme: {
    test: '#F40fFF',
  },
  darkColorScheme: {
    primary: '#12FF00',
    test: '#140fF1',
  },
})

const elLightColorScheme = ref<Material3ColorSchemePartial>({
  primary: 'yellow',
})

const data
  = Array.from({ length: 21 }).map((_, rowIndex) => {
    return {
      name: `分類-${rowIndex}`,
      value: rowIndex,
    }
  })

const tabSelected = ref(0)
const department = ref('韓式餐廳')
const { url } = useRandomCatImg()

const options = ref([
  {
    name: '韓式餐廳',
    value: '韓式餐廳',
    label: '韓式餐廳',
  },
  {
    name: '港式餐廳',
    value: '港式餐廳',
    label: '港式餐廳',
  },
  {
    name: '日式餐廳',
    value: '日式餐廳',
    label: '日式餐廳',
  },
  {
    name: '中式餐廳',
    value: '中式餐廳',
    label: '中式餐廳',
  },
])

const virtualValue = ref('')

const largeOptionsForVirtual = ref(
  Array.from({ length: 500 }).map((_, i) => ({
    name: `選項 ${i + 1}`,
    value: `option-${i + 1}`,
    label: `選項 ${i + 1}`,
  })),
)

// Demo specific state
const {
  themeMode, colorMode, setPrimaryColor, setThemeColor, triggerThemeTransition,
} = useCamelotTheme()
const currentColorRole = ref<'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'warning' | 'success'>('primary')

// Rich Text Editor 展示
const richText = ref('<h2>歡迎使用 Camelot 富文本編輯器</h2><p>支援 <strong>粗體</strong>、<em>斜體</em>、清單、引言、連結與圖片。</p><ul><li>四主題自動套用</li><li>圖片上傳可插拔</li></ul>')
// demo 上傳：模擬延遲後回傳一個可顯示的圖片 URL（實務上由使用端上傳到 GCS/S3 等）
async function demoUpload(file: File): Promise<string> {
  await new Promise(r => setTimeout(r, 600))
  return URL.createObjectURL(file)
}

// TimeV2 展示
const timeVal = ref<string>('')
const timeVal12 = ref<string>('14:30:00')

// ImageDropzone 展示
const dropzoneFiles = ref<File[] | null>(null)
const dropzoneFiles2 = ref<File[] | null>(null)
const dropzoneMax = 6
function onDropzoneSelect(files: File[]) {
  // 實務上可在此上傳；此處僅示範取得 File 陣列
  console.log('dropzone selected', files.map(f => f.name))
}

// 控制面板選項（以 Camelot 元件渲染，跟著主題切換）
const themeOptions = [
  {
    value: 'material',
    label: 'Material 3',
  },
  {
    value: 'cupertino',
    label: 'Cupertino',
  },
  {
    value: 'scifi',
    label: 'Sci-Fi HUD',
  },
  {
    value: 'aqua',
    label: 'Aqua Pill',
  },
] as const
const colorModeOptions = [
  {
    value: 'light',
    label: 'Light',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'auto',
    label: 'System',
  },
] as const
const colorRoles = ['primary', 'secondary', 'tertiary', 'error', 'warning', 'success'] as const

// Tag / Breadcrumb / Timeline / Notification demos
const tags = ref(['Vue', 'Nuxt', 'Tailwind'])
const breadcrumbItems = [
  {
    label: '首頁',
    value: 'home',
  },
  {
    label: '商品',
    value: 'products',
  },
  {
    label: '飲料',
    value: 'drinks',
  },
  {
    label: '珍珠奶茶',
    value: 'item',
  },
]
const timelineItems = [
  {
    title: '下單',
    content: '已收到您的訂單',
  },
  {
    title: '備貨',
    content: '商品整理中',
  },
  {
    title: '出貨',
    content: '已交付物流',
    image: 'https://picsum.photos/seed/camelot-timeline/400/240',
  },
  {
    title: '送達',
    content: '包裹已送達',
  },
]
const toastPositions = [
  'top-left', 'top', 'top-right',
  'left', 'center', 'right',
  'bottom-left', 'bottom', 'bottom-right',
] as const
const toastTypes = ['info', 'success', 'warning', 'error'] as const
const notify = (position: typeof toastPositions[number], type: typeof toastTypes[number] = 'info') => {
  useCamelotToast().open({
    title: type === 'info' ? '通知' : type,
    message: `顯示於 ${position}`,
    position,
    type,
    duration: 3000,
    action: {
      label: '查看',
      handler: () => useCamelotToast().open({
        message: '已查看',
        type: 'success',
        position: 'top',
      }),
    },
  })
}

// 切換色彩角色時也觸發顏色漸變
watch(currentColorRole, () => triggerThemeTransition())
const switchVal = ref(false)
const checkboxVal = ref(false)
const inputTextVal = ref('')
const selectVal = ref('韓式餐廳')
const selectV2Val = ref('港式餐廳')

const demoDialogOpen = ref(false)
const demoSheetOpen = ref(false)
const demoStepsList = ref(['Init', 'Verify', 'Deploy', 'Success'])
const demoActiveStep = ref(1)
const demoTabsOptions = ref([
  {
    name: 'Dashboard',
    value: 'dash',
  },
  {
    name: 'Analytics',
    value: 'analytics',
  },
  {
    name: 'System Settings',
    value: 'settings',
  },
])
const demoActiveTab = ref('dash')
const demoSkeletonLoading = ref(true)

// Drawer demo state
const drawerLeftOpen = ref(false)
const drawerRightOpen = ref(false)
const fixedDrawerOpen = ref(true)

// Tree demo state
const treeChecked = ref<(string | number)[]>(['kr'])
const treeNodes = ref<CamelotTreeNode[]>([
  {
    label: '餐廳分類',
    value: 'cat',
    children: [
      {
        label: '亞洲',
        value: 'asia',
        children: [
          {
            label: '韓式',
            value: 'kr',
          },
          {
            label: '日式',
            value: 'jp',
          },
          {
            label: '中式',
            value: 'cn',
          },
        ],
      },
      {
        label: '西式',
        value: 'west',
        children: [
          {
            label: '義式',
            value: 'it',
          },
          {
            label: '美式',
            value: 'us',
          },
        ],
      },
    ],
  },
])

// Menu demo state (3+ levels)
const menuActive = ref<string | number>('dashboard')
const menuItems = ref<CamelotMenuItem[]>([
  {
    label: '儀表板',
    value: 'dashboard',
  },
  {
    label: '訂單管理',
    value: 'orders',
    children: [
      {
        label: '全部訂單',
        value: 'orders-all',
      },
      {
        label: '待處理',
        value: 'orders-pending',
        children: [
          {
            label: '今日',
            value: 'orders-pending-today',
          },
          {
            label: '本週',
            value: 'orders-pending-week',
          },
        ],
      },
      {
        label: '已完成',
        value: 'orders-done',
      },
    ],
  },
  {
    label: '商品',
    value: 'products',
    children: [
      {
        label: '分類',
        value: 'products-cat',
        children: [
          {
            label: '飲料',
            value: 'products-cat-drink',
          },
          {
            label: '餐點',
            value: 'products-cat-food',
          },
        ],
      },
      {
        label: '庫存',
        value: 'products-stock',
      },
    ],
  },
  {
    label: '設定',
    value: 'settings',
  },
])

// Progress demo state
const progressVal = ref(65)
const progressStep = ref(1)
const stageCurrent = ref(3)
const stageTotal = ref(8)

// Table demo state
const tableColumns = ref<CamelotTableColumn[]>([
  {
    key: 'id',
    title: 'ID',
    width: '70px',
    fixed: 'left',
  },
  {
    key: 'name',
    title: '名稱',
    width: '160px',
    fixed: 'left',
  },
  {
    key: 'category',
    title: '分類',
    width: '120px',
  },
  {
    key: 'city',
    title: '城市',
    width: '120px',
  },
  {
    key: 'rating',
    title: '評分',
    width: '100px',
    align: 'right',
  },
  {
    key: 'price',
    title: '價位',
    width: '120px',
    align: 'right',
  },
  {
    key: 'phone',
    title: '電話',
    width: '170px',
  },
  {
    key: 'status',
    title: '狀態',
    width: '110px',
    fixed: 'right',
    align: 'center',
  },
])

const tablePinned = ref([
  {
    id: 0,
    name: '★ 本月推薦',
    category: '韓式',
    city: '台北',
    rating: '4.9',
    price: '$$$',
    phone: '02-0000-0000',
    status: 'active',
  },
])

const tableData = ref(
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: `店家 ${i + 1}`,
    category: ['韓式', '日式', '中式', '義式'][i % 4],
    city: ['台北', '台中', '高雄'][i % 3],
    rating: (3 + (i % 20) / 10).toFixed(1),
    price: `$${100 + i * 15}`,
    phone: `02-1234-${1000 + i}`,
    status: i % 3 === 0 ? 'inactive' : 'active',
  })),
)

// Carousel demo
const carouselEffects = ['slide', 'fade', 'zoom', 'coverflow', 'cardStack', 'flip'] as const
const carouselEffect = ref<typeof carouselEffects[number]>('slide')
const carouselIndex = ref(0)
const carouselLoop = ref(true)
const carouselAutoplay = ref(false)
const carouselPeek = ref(0)
const carouselArrows = ref(true)
const carouselDots = ref(true)
const carouselVertical = ref(false)
const carouselItems = ref(
  Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Slide ${i + 1}`,
    hue: (i * 60) % 360,
  })),
)

const textareaVal = ref('')

// DatePicker time demo
const dateTimeSec = ref(new Date())
const dateTime12 = ref(new Date())
const dateTimeHour = ref(new Date())
const dateRangeTimeVal = ref<[Date, Date] | null>(null)

// Slider demo
const sliderVal = ref(40)
const sliderRangeVal = ref<[number, number]>([20, 70])
const sliderStepVal = ref(4)

// VirtualScroll demo：可變高度的長清單
const virtualListItems = ref(
  Array.from({ length: 500 }).map((_, i) => ({
    id: i,
    label: `項目 ${i + 1}`,
    tall: i % 5 === 0,
  })),
)

// Pagination + Table 結合：父層自行切片
const tablePage = ref(1)
const tablePageSize = ref(5)
const pagedTableData = computed(() => {
  const start = (tablePage.value - 1) * tablePageSize.value
  return tableData.value.slice(start, start + tablePageSize.value)
})

const cardClass = computed(() => {
  if (themeMode.value === 'scifi') {
    return 'p-6 bg-slate-950/60 border border-primary/25 relative font-mono text-primary shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] transition-all flex flex-col gap-4'
  }
  else if (themeMode.value === 'cupertino') {
    return 'p-6 bg-slate-100/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-black/30 shadow-md text-slate-800 dark:text-slate-100 transition-all flex flex-col gap-4'
  }
  else {
    return 'p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all flex flex-col gap-4'
  }
})

const cardTitleClass = computed(() => {
  if (themeMode.value === 'scifi') {
    return 'text-lg font-bold tracking-wider text-primary border-b border-primary/20 pb-1.5'
  }
  else if (themeMode.value === 'cupertino') {
    return 'text-lg font-semibold text-slate-800 dark:text-slate-100'
  }
  else {
    return 'text-lg font-semibold text-slate-800 dark:text-white'
  }
})

const triggerToast = () => {
  useCamelotToast().open('Global Toast active in ' + themeMode.value + ' style theme!')
}

const triggerLoading = async () => {
  const close = useLoading().open('Loading theme presets...')
  await useDelay(2500)
  close()
}

const brandColors = [
  {
    name: 'Blue',
    roles: {
      primary: {
        light: '#0061a4',
        dark: '#9ecaFF',
      },
      onPrimary: {
        light: '#ffffff',
        dark: '#003258',
      },
      secondary: {
        light: '#008bb0',
        dark: '#80e2ff',
      },
      onSecondary: {
        light: '#ffffff',
        dark: '#003544',
      },
      tertiary: {
        light: '#9c27b0',
        dark: '#f3c2ff',
      },
      onTertiary: {
        light: '#ffffff',
        dark: '#570068',
      },
      error: {
        light: '#ba1a1a',
        dark: '#ffb4ab',
      },
      onError: {
        light: '#ffffff',
        dark: '#690005',
      },
      warning: {
        light: '#e68500',
        dark: '#ffbe6b',
      },
      onWarning: {
        light: '#ffffff',
        dark: '#4b2800',
      },
      success: {
        light: '#00875a',
        dark: '#63e6be',
      },
      onSuccess: {
        light: '#ffffff',
        dark: '#003822',
      },
    },
  },
  {
    name: 'Emerald',
    roles: {
      primary: {
        light: '#00875a',
        dark: '#63e6be',
      },
      onPrimary: {
        light: '#ffffff',
        dark: '#003822',
      },
      secondary: {
        light: '#009688',
        dark: '#80cbc4',
      },
      onSecondary: {
        light: '#ffffff',
        dark: '#003731',
      },
      tertiary: {
        light: '#689f38',
        dark: '#c5e1a5',
      },
      onTertiary: {
        light: '#ffffff',
        dark: '#243a00',
      },
      error: {
        light: '#ba1a1a',
        dark: '#ffb4ab',
      },
      onError: {
        light: '#ffffff',
        dark: '#690005',
      },
      warning: {
        light: '#f57c00',
        dark: '#ffb74d',
      },
      onWarning: {
        light: '#ffffff',
        dark: '#4d2000',
      },
      success: {
        light: '#009624',
        dark: '#81c784',
      },
      onSuccess: {
        light: '#ffffff',
        dark: '#003308',
      },
    },
  },
  {
    name: 'Violet',
    roles: {
      primary: {
        light: '#6750a4',
        dark: '#d0bcff',
      },
      onPrimary: {
        light: '#ffffff',
        dark: '#381e72',
      },
      secondary: {
        light: '#ab47bc',
        dark: '#ea80fc',
      },
      onSecondary: {
        light: '#ffffff',
        dark: '#5c007a',
      },
      tertiary: {
        light: '#e91e63',
        dark: '#ff80ab',
      },
      onTertiary: {
        light: '#ffffff',
        dark: '#5f002b',
      },
      error: {
        light: '#ba1a1a',
        dark: '#ffb4ab',
      },
      onError: {
        light: '#ffffff',
        dark: '#690005',
      },
      warning: {
        light: '#ffa000',
        dark: '#ffe082',
      },
      onWarning: {
        light: '#ffffff',
        dark: '#4c2d00',
      },
      success: {
        light: '#00875a',
        dark: '#63e6be',
      },
      onSuccess: {
        light: '#ffffff',
        dark: '#003822',
      },
    },
  },
  {
    name: 'Rose',
    roles: {
      primary: {
        light: '#ba1a1a',
        dark: '#ffb4ab',
      },
      onPrimary: {
        light: '#ffffff',
        dark: '#690005',
      },
      secondary: {
        light: '#e91e63',
        dark: '#ff80ab',
      },
      onSecondary: {
        light: '#ffffff',
        dark: '#5f002b',
      },
      tertiary: {
        light: '#e65100',
        dark: '#ffb74d',
      },
      onTertiary: {
        light: '#ffffff',
        dark: '#4d1c00',
      },
      error: {
        light: '#e01919',
        dark: '#ffb3b3',
      },
      onError: {
        light: '#ffffff',
        dark: '#680003',
      },
      warning: {
        light: '#f57c00',
        dark: '#ffb74d',
      },
      onWarning: {
        light: '#ffffff',
        dark: '#4d2000',
      },
      success: {
        light: '#00875a',
        dark: '#63e6be',
      },
      onSuccess: {
        light: '#ffffff',
        dark: '#003822',
      },
    },
  },
  {
    name: 'Amber',
    roles: {
      primary: {
        light: '#8b5000',
        dark: '#ffb85d',
      },
      onPrimary: {
        light: '#ffffff',
        dark: '#4b2800',
      },
      secondary: {
        light: '#f57c00',
        dark: '#ffb74d',
      },
      onSecondary: {
        light: '#ffffff',
        dark: '#4d2000',
      },
      tertiary: {
        light: '#558b2f',
        dark: '#aeec88',
      },
      onTertiary: {
        light: '#ffffff',
        dark: '#1b3b00',
      },
      error: {
        light: '#ba1a1a',
        dark: '#ffb4ab',
      },
      onError: {
        light: '#ffffff',
        dark: '#690005',
      },
      warning: {
        light: '#ff6f00',
        dark: '#ffe082',
      },
      onWarning: {
        light: '#ffffff',
        dark: '#4c2d00',
      },
      success: {
        light: '#00875a',
        dark: '#63e6be',
      },
      onSuccess: {
        light: '#ffffff',
        dark: '#003822',
      },
    },
  },
]

const activeBrandColorName = ref('Blue')

const changeBrandColor = (brand: typeof brandColors[0]) => {
  activeBrandColorName.value = brand.name
  Object.entries(brand.roles).forEach(([role, colors]) => {
    setThemeColor(role, colors.light, colors.dark)
  })
}
</script>

<style scoped></style>
