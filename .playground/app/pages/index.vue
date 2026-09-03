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

        <!-- File Dropzone Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            File Dropzone (任意檔案・附件晶片)
          </h2>
          <span class="text-xs text-slate-400">拖曳任意檔案 → 晶片展示（圖片縮圖 / 型別色塊 icon + 檔名 + 型別標籤 + 角落移除）</span>
          <CamelotFileDropzone
            v-model="fileDropzoneFiles"
            :color="currentColorRole"
            class="mt-3"
          />
          <p class="mt-2 text-xs text-on-surface-variant">
            已選 {{ fileDropzoneFiles?.length ?? 0 }} 個檔案
          </p>

          <span class="mt-4 block text-xs text-slate-400">Headless（useCamelotFileDrop）：下方整塊是自定義拖曳區，圖片自排 grid 縮圖（重現 ImageDropzone grid 樣式）、其他檔案用 CamelotFileChip</span>
          <div
            class="mt-2 flex min-h-28 cursor-pointer flex-col justify-center gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors"
            :class="[
              headlessRoleClass,
              headlessDragOver
                ? 'border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_10%,transparent)]'
                : 'border-outline-variant hover:border-[var(--cml-color-current-color)]',
            ]"
            @dragover.prevent="headlessOnDragOver"
            @dragenter.prevent="headlessOnDragOver"
            @dragleave.prevent="headlessOnDragLeave"
            @drop.prevent="headlessOnDrop"
            @click="headlessPick()"
          >
            <p
              v-if="!headlessEntries.length"
              class="text-center text-sm text-on-surface-variant"
            >
              點擊或拖曳檔案到這個自定義區域
            </p>
            <div
              v-if="headlessImageEntries.length"
              class="grid grid-cols-6 gap-2"
            >
              <div
                v-for="x in headlessImageEntries"
                :key="x.e.key"
                class="group relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <img
                  :src="x.e.url"
                  :alt="x.e.file.name"
                  class="h-full w-full object-cover"
                >
                <button
                  type="button"
                  class="absolute right-1 top-1 hidden rounded-full bg-[var(--cml-color-current-color)] p-0.5 text-[var(--cml-color-current-on-color)] group-hover:block"
                  @click.stop="headlessRemoveAt(x.i)"
                >
                  <IMaterialSymbolsCloseRounded class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div
              v-if="headlessOtherEntries.length"
              class="flex flex-wrap gap-2"
            >
              <CamelotFileChip
                v-for="x in headlessOtherEntries"
                :key="x.e.key"
                :file="x.e.file"
                :color="currentColorRole"
                removable
                @click.stop
                @remove="headlessRemoveAt(x.i)"
              />
            </div>
          </div>
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

        <!-- Radio & Checkbox Groups Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Radio & Checkbox Groups
          </h2>

          <span class="text-xs text-slate-400">RadioGroup 水平（「貨到付款」逐選項 disabled）</span>
          <CamelotRadioGroup
            v-model="radioGroupVal"
            label="付款方式"
            :options="paymentOptions"
            :color="currentColorRole"
          />

          <span class="mt-2 text-xs text-slate-400">RadioGroup 垂直</span>
          <CamelotRadioGroup
            v-model="radioGroupVal"
            direction="vertical"
            :options="paymentOptions"
            :color="currentColorRole"
          />

          <span class="mt-2 text-xs text-slate-400">RadioGroup deselectable（點擊已選取項可取消，非必填情境）</span>
          <CamelotRadioGroup
            v-model="radioDeselectVal"
            deselectable
            :options="paymentOptions"
            :color="currentColorRole"
          />

          <span class="mt-3 text-xs text-slate-400">CheckboxGroup 水平（「簡訊」逐選項 disabled）</span>
          <CamelotCheckboxGroup
            v-model="checkboxGroupVal"
            label="通知管道"
            :options="notifyOptions"
            :color="currentColorRole"
          />

          <span class="mt-2 text-xs text-slate-400">CheckboxGroup 垂直</span>
          <CamelotCheckboxGroup
            v-model="checkboxGroupVal"
            direction="vertical"
            :options="notifyOptions"
            :color="currentColorRole"
          />

          <div class="text-xs text-slate-400 mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            Radio: {{ radioGroupVal }} <br>
            Deselectable Radio: {{ radioDeselectVal ?? '（未選）' }} <br>
            Checkbox: {{ checkboxGroupVal }}
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
            :searchable="false"
          />

          <CamelotSelectV2
            v-model="selectV2Val"
            :color="currentColorRole"
            label="Searchable selection"
            :options="options"
            :searchable="true"
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

        <!-- Select Options Card（選項渲染與篩選行為） -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Select ・ 選項進階（slot / filter / 寬度 / 觸發器）
          </h2>
          <p class="text-xs text-slate-400">
            聚焦在「選項」本身：怎麼畫、怎麼篩、選單多寬、選完關不關，以及用自訂元素當觸發器。
          </p>

          <!-- 1. #option：整份選項清單自訂外觀 -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              #option ・ 自訂每個選項
            </span>
            <CamelotSelectV2
              v-model="restaurantVal"
              :color="currentColorRole"
              label="帶說明與選中標記"
              :options="restaurantOptions"
              class="w-full"
            >
              <template #option="{ data: opt, isSelected }">
                <span
                  class="size-2 shrink-0 rounded-full"
                  :style="{ backgroundColor: opt.data?.tone }"
                />
                <span class="flex flex-1 flex-col text-left">
                  <span class="truncate">{{ opt.label ?? opt.name }}</span>
                  <span class="truncate text-xs opacity-60">{{ opt.data?.desc }}</span>
                </span>
                <span
                  v-if="isSelected"
                  class="shrink-0 text-xs font-bold"
                >✓</span>
              </template>
            </CamelotSelectV2>
          </div>

          <!-- 2. #option-<value>：只覆寫單一選項 -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              #option-&lt;value&gt; ・ 只覆寫其中一個
            </span>
            <CamelotSelectV2
              v-model="singleSlotVal"
              :color="currentColorRole"
              label="其餘選項維持預設外觀"
              :options="restaurantOptions"
              class="w-full"
            >
              <template #option-kr="{ data: opt }">
                <span class="flex-1 truncate text-left font-bold">
                  {{ opt.label ?? opt.name }}
                  <span class="ml-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-on-primary">推薦</span>
                </span>
              </template>
            </CamelotSelectV2>
          </div>

          <!-- 3. filterFunction：自訂搜尋條件（別名 / 縮寫也能命中） -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              filterFunction ・ 別名搜尋
            </span>
            <span class="text-xs text-slate-400">
              預設只比對 name / label / value；這裡加上別名，輸入 <code>kr</code>、<code>korean</code> 也能找到「韓式餐廳」。
            </span>
            <CamelotSelectV2
              v-model="aliasVal"
              :color="currentColorRole"
              label="輸入 kr / jp / hk 試試"
              :options="restaurantOptions"
              :filter-function="filterByAlias"
              search-placeholder="輸入中文或英文縮寫…"
              class="w-full"
            />
          </div>

          <!-- 3b. SelectOption.disable：單一選項停用 -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              SelectOption.disable ・ 單一選項停用
            </span>
            <span class="text-xs text-slate-400">
              「韓式餐廳」「日式餐廳」「法式餐廳」今日已額滿：仍列在清單裡（搜尋也找得到），但點不下去。
              首項就是停用的，因此 <code>default</code> 自動選值會跳過它、直接落在「港式餐廳」。
            </span>
            <CamelotSelectV2
              v-model="disabledOptionVal"
              :color="currentColorRole"
              label="部分選項停用"
              :options="partiallyDisabledOptions"
              class="w-full"
            />
          </div>

          <!-- 4. empty-options：空清單自訂 -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              #empty-options ・ 空狀態
            </span>
            <CamelotSelectV2
              v-model="emptyVal"
              :color="currentColorRole"
              label="沒有任何選項時"
              :options="[]"
              class="w-full"
            >
              <template #empty-options>
                <div class="flex flex-col items-center gap-1 py-4 text-center">
                  <span class="text-sm font-semibold">目前沒有可選的餐廳</span>
                  <span class="text-xs opacity-60">換個日期或放寬篩選條件再試一次</span>
                </div>
              </template>
            </CamelotSelectV2>
          </div>

          <!-- 5. popupWidthMode：選單寬度三種行為 -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              popupWidthMode ・ 選單寬度
            </span>
            <div class="grid gap-3 sm:grid-cols-3">
              <CamelotSelectV2
                v-model="widthFitVal"
                :color="currentColorRole"
                label="fit-content"
                :options="longLabelOptions"
                popup-width-mode="fit-content"
              />
              <CamelotSelectV2
                v-model="widthMinVal"
                :color="currentColorRole"
                label="min-target（預設）"
                :options="longLabelOptions"
                popup-width-mode="min-target"
              />
              <CamelotSelectV2
                v-model="widthSameVal"
                :color="currentColorRole"
                label="same-target"
                :options="longLabelOptions"
                popup-width-mode="same-target"
              />
            </div>
          </div>

          <!-- 6. disableCloseWhenSelected + optionsContainerMaxHeight -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              disableCloseWhenSelected ・ 選完不關閉
            </span>
            <span class="text-xs text-slate-400">
              連續比較多個選項時不用一直重開；<strong>再點一次已選中的那一項即視為確認並關閉</strong>。
              同時把選單高度壓到 120px 觀察捲動。
            </span>
            <CamelotSelectV2
              v-model="keepOpenVal"
              :color="currentColorRole"
              label="選了還是開著"
              :options="restaurantOptions"
              disable-close-when-selected
              :options-container-max-height="120"
              class="w-full"
            />
          </div>

          <!-- 7. 預設 slot：拿 selectedData 自訂觸發器 -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              #default ・ 自訂觸發器
            </span>
            <span class="text-xs text-slate-400">
              預設 slot 會拿到 <code>selectedData</code>（整個 option 物件，含泛型 <code>data</code>），可以完全自己畫觸發元素。
            </span>
            <CamelotSelectV2
              v-model="triggerVal"
              :color="currentColorRole"
              :options="restaurantOptions"
              class="w-fit"
            >
              <template #default="{ selectedData }">
                <CamelotButton
                  :color="currentColorRole"
                  is-container
                  :label="selectedData ? `${selectedData.label ?? selectedData.name} ▾` : '選擇餐廳 ▾'"
                />
              </template>
            </CamelotSelectV2>
          </div>

          <div class="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-400 dark:bg-slate-900/50">
            自訂選項：{{ restaurantVal || '—' }} ・
            單一 slot：{{ singleSlotVal || '—' }} ・
            別名搜尋：{{ aliasVal || '—' }} <br>
            部分停用：{{ disabledOptionVal || '—' }} <br>
            寬度：{{ widthFitVal || '—' }} / {{ widthMinVal || '—' }} / {{ widthSameVal || '—' }} <br>
            不關閉：{{ keepOpenVal || '—' }} ・
            觸發器：{{ triggerVal || '—' }}
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

          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Scoped colors ・ URL-driven ・ shared state
            </span>
            <p class="text-xs text-slate-400">
              下列兩者只覆寫 <code>primary</code> 與自訂鍵 <code>test</code>，其餘色票仍繼承全域主題；
              開啟後網址會帶上 query，可直接分享或用上一頁關閉；兩者共用同一組值。
            </p>
            <div class="flex flex-wrap gap-4">
              <CamelotButton
                :color="currentColorRole"
                is-container
                label="Open Scoped Dialog"
                @click="scopedDialogOpen = true"
              />
              <CamelotButton
                :color="currentColorRole"
                is-container
                label="Open Scoped Sheet"
                @click="scopedSheetOpen = true"
              />
            </div>
            <span class="text-xs text-slate-400">
              Shared: {{ overlaySharedCount }} ・ {{ overlaySharedOption }}
            </span>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ConfirmDialog
            </span>
            <p class="text-xs text-slate-400">
              最多三顆按鈕（反向 / 中立 / 正向），依 label 是否設定決定顯示；預設只有確認鈕且點擊即關閉。
            </p>
            <div class="flex flex-wrap gap-4">
              <CamelotButton
                :color="currentColorRole"
                label="三顆按鈕"
                @click="confirmThreeOpen = true"
              />
              <CamelotButton
                :color="currentColorRole"
                is-container
                label="僅預設確認鈕"
                @click="confirmDefaultOpen = true"
              />
            </div>
            <span class="text-xs text-slate-400">Last action: {{ confirmResult }}</span>
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

        <!-- Global Error Queue Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Global Error Queue
          </h2>
          <p class="text-xs text-slate-400">
            錯誤會累積成佇列並逐一顯示；轉換器負責格式轉換，攔截器負責副作用。
          </p>
          <div class="flex flex-wrap gap-4">
            <CamelotButton
              :color="currentColorRole"
              label="Push 3 Errors"
              @click="pushErrorQueue"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Custom API Error"
              @click="pushCustomApiError"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Simulate 401"
              @click="pushUnauthorizedError"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Retry / Close"
              @click="startRetryDemo"
            />
            <CamelotButton
              :color="currentColorRole"
              label="Page onConfirm"
              @click="pushPageControlledError"
            />
          </div>
          <p class="text-xs text-slate-400">
            佇列中：{{ camelotErrors.length }} 筆
          </p>
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
            <CamelotButton
              :color="currentColorRole"
              is-container
              label="Open Full Page"
              @click="drawerFullOpen = true"
            />
          </div>
          <p class="text-xs text-slate-400">
            「Open Full Page」是整個版面的 Drawer（<code>width="100vw"</code>，元件本身以
            <code>max-w-[90vw]</code> 收邊，保留一條可點擊關閉的遮罩），內含 Select / Popup /
            Dialog / Sheet 的啟動按鈕，用來檢查浮層會不會被 Drawer 面板蓋住；
            裡面另有「多層 Drawer」段落，可從 Drawer 再開 L2 / L3 Drawer 與其內的 Select / Sheet。
          </p>
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

        <!-- Cascade Menu Card（點擊觸發 → 子選單側邊飛出，無限階層） -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">
            Cascade Menu (popup flyout, multi-level)
          </h2>
          <span class="text-xs text-slate-400">點「設定」按鈕展開，含子項的列向右飛出子選單（空間不足自動翻轉），四主題 + CurrentColor</span>
          <div class="flex flex-wrap items-center gap-3">
            <CamelotCascadeMenu
              :items="cascadeMenuItems"
              :color="currentColorRole"
              @select="onCascadeSelect"
            >
              <CamelotButton
                :color="currentColorRole"
                label="設定 ▾"
              />
            </CamelotCascadeMenu>

            <CamelotCascadeMenu
              :items="cascadeMenuItems"
              :color="currentColorRole"
              submenu-trigger="click"
              @select="onCascadeSelect"
            >
              <CamelotButton
                :color="currentColorRole"
                is-container
                label="點擊展開模式 ▾"
              />
            </CamelotCascadeMenu>
          </div>
          <div class="mt-1 truncate text-xs text-slate-400">
            Selected: {{ cascadeSelected ?? '—' }}
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
          <div class="mt-4">
            <p class="mb-2 text-xs text-slate-400">
              TagGroup (v-model / 動態新增)
            </p>
            <CamelotTagGroup
              v-model="tagGroupValue"
              :color="currentColorRole"
              :continuous-add="false"
            />
            <p class="mt-2 text-xs text-slate-400">
              逐項顏色 / variant，Vue 鎖定不可刪、單次新增；新增項用群組預設色（{{ currentColorRole }}）
            </p>
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
          <div class="mb-3 flex flex-wrap items-center gap-6">
            <CamelotSwitch
              v-model="tableFloatingScrollbar"
              label="浮動水平捲軸"
              :color="currentColorRole"
            />
            <CamelotSwitch
              v-model="tableReserveVertical"
              label="保留垂直捲軸空間"
              :color="currentColorRole"
            />
            <CamelotSwitch
              v-model="tableReserveHorizontal"
              label="保留水平捲軸空間"
              :color="currentColorRole"
            />
          </div>
          <CamelotTable
            :columns="tableColumns"
            :data="pagedTableData"
            :pinned-top-rows="tablePinned"
            row-key="id"
            stripe
            height="480px"
            :color="currentColorRole"
            :floating-scrollbar="tableFloatingScrollbar"
            :reserve-vertical-scrollbar="tableReserveVertical"
            :reserve-horizontal-scrollbar="tableReserveHorizontal"
          >
            <template #cell-status="{ value }">
              <span
                class="rounded-full px-2 py-0.5 text-xs"
                :class="value === 'active' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'"
              >{{ value }}</span>
            </template>
            <template #cell-actions="{ row }">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="rounded-md px-2 py-1 text-xs text-primary hover:bg-primary/10"
                  @click="showRowDetail(row)"
                >
                  明細
                </button>
                <button
                  class="rounded-md px-2 py-1 text-xs text-error hover:bg-error/10"
                  @click="askDeleteRow(row)"
                >
                  刪除
                </button>
              </div>
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

          <!-- 刪除確認 dialog -->
          <CamelotBaseDialogV2
            v-model:open="deleteDialogOpen"
            :close-by-mask="true"
          >
            <div class="flex flex-col gap-4 min-w-[280px]">
              <h3 class="text-lg font-bold">
                確認刪除
              </h3>
              <p class="text-sm opacity-80">
                確定要刪除「{{ pendingDeleteRow?.name }}」嗎？此操作無法復原。
              </p>
              <div class="flex justify-end gap-2">
                <CamelotButton
                  is-container
                  label="取消"
                  @click="deleteDialogOpen = false"
                />
                <CamelotButton
                  color="error"
                  label="刪除"
                  @click="doDeleteRow"
                />
              </div>
            </div>
          </CamelotBaseDialogV2>
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

            <span class="text-xs text-slate-400">區間・緊湊模式（關閉節日 label）</span>
            <CamelotDateRangeV2
              :color="currentColorRole"
              label="活動區間（無 label）"
              :multi-calendars="true"
              :get-day-attributes="getDayAttributes"
              :show-day-label="false"
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

            <span class="text-xs text-slate-400 mt-2">各國語系（週名 / 月名 / 年月標題走 Intl；泰文為佛曆年）</span>
            <div class="flex flex-wrap gap-2">
              <CamelotButton
                v-for="loc in dateLocales"
                :key="loc.value ?? 'default'"
                :is-container="dateLocale !== loc.value"
                :class="dateLocale === loc.value ? '' : 'opacity-50'"
                :label="loc.label"
                @click="dateLocale = loc.value"
              />
            </div>
            <CamelotSwitch
              v-model="dateWeekMonday"
              label="週一為每週起始"
              :color="currentColorRole"
            />
            <CamelotDateV2
              :color="currentColorRole"
              label="語系日期"
              :locale="dateLocale"
              :week-starts-on="dateWeekMonday ? 1 : 0"
            />

            <span class="text-xs text-slate-400 mt-2">緊湊模式（關閉節日 label，不保留文字空間）</span>
            <CamelotSwitch
              v-model="dateShowDayLabel"
              label="顯示日期 label"
              :color="currentColorRole"
            />
            <CamelotDateV2
              :color="currentColorRole"
              label="緊湊日期"
              :get-day-attributes="getDayAttributes"
              :show-day-label="dateShowDayLabel"
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
              label="開啟 scoped dialog（帶 query）"
              @click="toPath('/').to({ query: { overlay: 'scoped-dialog', isDialog: 'true' } })"
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

      <!--
        Scoped overlays：Provider 只覆寫 primary 與自訂鍵 test，其餘色票繼承全域主題。
        內容只放內容，不自帶盒子、不用 w-screen —— 外框與寬度由 Base 元件負責。
      -->
      <CamelotCustomColorSchemeProvider
        :light-color-scheme="scopedOverlayLightColorScheme"
        :dark-color-scheme="scopedOverlayDarkColorScheme"
      >
        <CamelotBaseDialogV2
          v-model:open="scopedDialogOpen"
          :query="{ key: 'overlay', value: 'scoped-dialog' }"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-lg font-bold">
                Scoped Dialog
              </h3>
              <CamelotButton
                is-container
                label="關閉"
                @click="scopedDialogOpen = false"
              />
            </div>

            <OverlaySharedFields
              v-model:count="overlaySharedCount"
              v-model:option="overlaySharedOption"
              :options="options"
            />
          </div>
        </CamelotBaseDialogV2>

        <CamelotBaseBottomSheetV2
          v-model:open="scopedSheetOpen"
          tag="scoped-sheet"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-lg font-bold">
                Scoped Sheet
              </h3>
              <CamelotButton
                is-container
                label="關閉"
                @click="scopedSheetOpen = false"
              />
            </div>

            <OverlaySharedFields
              v-model:count="overlaySharedCount"
              v-model:option="overlaySharedOption"
              :options="options"
            />
          </div>
        </CamelotBaseBottomSheetV2>
      </CamelotCustomColorSchemeProvider>

      <CamelotConfirmDialog
        v-model:open="confirmThreeOpen"
        title="刪除這筆資料？"
        message="刪除後無法復原，確定要繼續嗎？"
        positive-label="刪除"
        positive-color="error"
        neutral-label="稍後再說"
        negative-label="取消"
        @positive="onConfirmAction('positive')"
        @neutral="onConfirmAction('neutral')"
        @negative="onConfirmAction('negative')"
      />

      <CamelotConfirmDialog
        v-model:open="confirmDefaultOpen"
        title="已儲存"
        message="設定已套用至目前的主題。"
        @positive="onConfirmAction('positive')"
      />

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

      <!--
        全版面 Drawer：疊層檢查點。
        內容刻意放滿 Select / Popup / CascadeMenu / Date / Time / Dialog / Sheet 的啟動點，
        且全部使用元件預設值（不傳 zIndex 等迴避用的 prop）——浮層一旦被面板蓋住就會直接看得到。
      -->
      <CamelotDrawer
        v-model:open="drawerFullOpen"
        position="left"
        width="100vw"
      >
        <template #header>
          <div class="flex items-center justify-between gap-4 border-b border-outline-variant/40 px-6 py-4">
            <div class="flex flex-col">
              <h3 class="text-lg font-bold">
                Full Page Drawer
              </h3>
              <span class="text-xs opacity-60">
                浮層疊層檢查點：Select / Popup / Dialog / Sheet
              </span>
            </div>
            <CamelotButton
              :color="currentColorRole"
              is-container
              label="關閉"
              @click="drawerFullOpen = false"
            />
          </div>
        </template>

        <div class="px-6 py-5">
          <DrawerOverlayFields
            v-model:option="drawerFullOption"
            :options="options"
            :color="currentColorRole"
          />
        </div>

        <template #footer>
          <div class="flex justify-end border-t border-outline-variant/40 px-6 py-4">
            <CamelotButton
              :color="currentColorRole"
              label="Close"
              @click="drawerFullOpen = false"
            />
          </div>
        </template>
      </CamelotDrawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isToday } from 'date-fns'

const getDayAttributes = (date: Date) => {
  if (isToday(date)) {
    return {
      isHoliday: true,
      label: '我是今天啦',
    }
  }
  const day = date.getDay()
  // 週末標為假日並帶 label（讓「顯示日期 label」切換時整片高度差異明顯）
  if (day === 0 || day === 6) {
    return {
      isHoliday: true,
      label: '假日',
    }
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
  {
    name: '泰式餐廳',
    value: '泰式餐廳',
    label: '泰式餐廳',
  },
  {
    name: '越南料理',
    value: '越南料理',
    label: '越南料理',
  },
  {
    name: '義式餐廳',
    value: '義式餐廳',
    label: '義式餐廳',
  },
  {
    name: '法式餐廳',
    value: '法式餐廳',
    label: '法式餐廳',
  },
  {
    name: '美式餐廳',
    value: '美式餐廳',
    label: '美式餐廳',
  },
  {
    name: '墨西哥料理',
    value: '墨西哥料理',
    label: '墨西哥料理',
  },
  {
    name: '印度料理',
    value: '印度料理',
    label: '印度料理',
  },
  {
    name: '土耳其料理',
    value: '土耳其料理',
    label: '土耳其料理',
  },
  {
    name: '西班牙餐酒館',
    value: '西班牙餐酒館',
    label: '西班牙餐酒館',
  },
  {
    name: '素食餐廳',
    value: '素食餐廳',
    label: '素食餐廳',
  },
  {
    name: '海鮮餐廳',
    value: '海鮮餐廳',
    label: '海鮮餐廳',
  },
  {
    name: '火鍋店',
    value: '火鍋店',
    label: '火鍋店',
  },
])

// Select 選項進階展示：帶泛型 data 的選項（供 #option slot 與自訂觸發器使用）
const restaurantOptions = ref<SelectOptions<{ desc: string, alias: string[], tone: string }>>([
  {
    name: '韓式餐廳',
    value: 'kr',
    label: '韓式餐廳',
    data: {
      desc: '烤肉、部隊鍋、韓式小菜吃到飽',
      alias: ['kr', 'korean', 'korea'],
      tone: '#e05252',
    },
  },
  {
    name: '港式餐廳',
    value: 'hk',
    label: '港式餐廳',
    data: {
      desc: '燒臘、粥粉麵飯、港式茶餐廳',
      alias: ['hk', 'hongkong', 'cantonese'],
      tone: '#e0a23f',
    },
  },
  {
    name: '日式餐廳',
    value: 'jp',
    label: '日式餐廳',
    data: {
      desc: '壽司、丼飯、居酒屋',
      alias: ['jp', 'japan', 'japanese'],
      tone: '#5aa9e0',
    },
  },
  {
    name: '中式餐廳',
    value: 'cn',
    label: '中式餐廳',
    data: {
      desc: '合菜、熱炒、家常菜',
      alias: ['cn', 'chinese'],
      tone: '#6fbf73',
    },
  },
  {
    name: '泰式餐廳',
    value: 'th',
    label: '泰式餐廳',
    data: {
      desc: '打拋豬、綠咖哩、月亮蝦餅',
      alias: ['th', 'thai', 'thailand'],
      tone: '#c76fbf',
    },
  },
  {
    name: '越南料理',
    value: 'vn',
    label: '越南料理',
    data: {
      desc: '河粉、法國麵包、生春捲',
      alias: ['vn', 'viet', 'vietnam'],
      tone: '#4fb8a8',
    },
  },
  {
    name: '義式餐廳',
    value: 'it',
    label: '義式餐廳',
    data: {
      desc: '手工義大利麵、窯烤披薩',
      alias: ['it', 'italy', 'italian', 'pizza'],
      tone: '#d97742',
    },
  },
  {
    name: '法式餐廳',
    value: 'fr',
    label: '法式餐廳',
    data: {
      desc: '前菜主餐甜點的完整套餐',
      alias: ['fr', 'france', 'french'],
      tone: '#7b7fd4',
    },
  },
  {
    name: '美式餐廳',
    value: 'us',
    label: '美式餐廳',
    data: {
      desc: '漢堡、烤肋排、啤酒',
      alias: ['us', 'usa', 'american', 'burger'],
      tone: '#d4614f',
    },
  },
  {
    name: '墨西哥料理',
    value: 'mx',
    label: '墨西哥料理',
    data: {
      desc: '塔可、墨西哥捲餅、莎莎醬',
      alias: ['mx', 'mexico', 'mexican', 'taco'],
      tone: '#cf9b3a',
    },
  },
  {
    name: '印度料理',
    value: 'in',
    label: '印度料理',
    data: {
      desc: '咖哩、烤餅、坦都里烤雞',
      alias: ['in', 'india', 'indian', 'curry'],
      tone: '#c98a2e',
    },
  },
  {
    name: '土耳其料理',
    value: 'tr',
    label: '土耳其料理',
    data: {
      desc: '沙威瑪、烤肉拼盤、優格醬',
      alias: ['tr', 'turkey', 'turkish', 'kebab'],
      tone: '#a86b4a',
    },
  },
  {
    name: '西班牙餐酒館',
    value: 'es',
    label: '西班牙餐酒館',
    data: {
      desc: 'Tapas、海鮮燉飯、火腿',
      alias: ['es', 'spain', 'spanish', 'tapas'],
      tone: '#c25c6b',
    },
  },
  {
    name: '素食餐廳',
    value: 'veg',
    label: '素食餐廳',
    data: {
      desc: '蔬食料理，含全素與蛋奶素',
      alias: ['veg', 'vegan', 'vegetarian'],
      tone: '#6aa84f',
    },
  },
  {
    name: '海鮮餐廳',
    value: 'sea',
    label: '海鮮餐廳',
    data: {
      desc: '現流海產、清蒸、生魚片',
      alias: ['sea', 'seafood'],
      tone: '#4f8fd4',
    },
  },
  {
    name: '火鍋店',
    value: 'hot',
    label: '火鍋店',
    data: {
      desc: '個人鍋、麻辣鴛鴦、涮涮鍋',
      alias: ['hot', 'hotpot', 'shabu'],
      tone: '#d4534f',
    },
  },
])

// 預設篩選只比對 name / label / value；這裡額外把 data.alias 納入，讓縮寫也能命中
const filterByAlias = (
  option: SelectOption<{ desc: string, alias: string[], tone: string }>,
  query: string,
) => {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return true
  const haystack = [
    option.name,
    option.label,
    String(option.value),
    ...(option.data?.alias ?? []),
  ]
  return haystack.some(text => text?.toLowerCase().includes(keyword))
}

const longLabelOptions = ref([
  {
    name: '短',
    value: 'short',
    label: '短',
  },
  {
    name: '中等長度的選項名稱',
    value: 'medium',
    label: '中等長度的選項名稱',
  },
  {
    name: '非常非常長的選項名稱，用來觀察選單寬度怎麼跟著變',
    value: 'long',
    label: '非常非常長的選項名稱，用來觀察選單寬度怎麼跟著變',
  },
])

// 部分選項停用：驗證 SelectOption.disable
const partiallyDisabledOptions = computed<SelectOptions<{ desc: string, alias: string[], tone: string }>>(
  () => restaurantOptions.value.map(option =>
    ['kr', 'jp', 'fr'].includes(String(option.value))
      ? {
          ...option,
          label: `${option.label ?? option.name}（今日已額滿）`,
          disable: true,
        }
      : option,
  ),
)

const disabledOptionVal = ref<string | undefined>()

const restaurantVal = ref('kr')
const singleSlotVal = ref('')
const aliasVal = ref('')
const emptyVal = ref('')
const widthFitVal = ref('medium')
const widthMinVal = ref('medium')
const widthSameVal = ref('medium')
const keepOpenVal = ref('')
const triggerVal = ref('jp')

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

// Radio / Checkbox Group 展示
const radioGroupVal = ref<string | number>('credit')
const radioDeselectVal = ref<string | number | undefined>('atm')
const checkboxGroupVal = ref<(string | number)[]>(['email'])
const paymentOptions: CamelotGroupOption[] = [
  {
    label: '信用卡',
    value: 'credit',
  },
  {
    label: 'ATM 轉帳',
    value: 'atm',
  },
  {
    label: '貨到付款',
    value: 'cod',
    disabled: true,
  },
  {
    label: '行動支付',
    value: 'mobile',
  },
]
const notifyOptions: CamelotGroupOption[] = [
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: '簡訊',
    value: 'sms',
    disabled: true,
  },
  {
    label: 'App 推播',
    value: 'push',
  },
  {
    label: 'LINE',
    value: 'line',
  },
]

// FileDropzone 展示
const fileDropzoneFiles = ref<File[] | null>(null)

// Headless useCamelotFileDrop 展示：任意區域變拖曳區、展示全自定義
const headlessFiles = ref<File[] | null>(null)
const {
  dragOver: headlessDragOver,
  entries: headlessEntries,
  removeAt: headlessRemoveAt,
  pick: headlessPick,
  onDragOver: headlessOnDragOver,
  onDragLeave: headlessOnDragLeave,
  onDrop: headlessOnDrop,
} = useCamelotFileDrop({ model: headlessFiles })
const headlessRoleClass = useCamelotRoleColorClass(() => currentColorRole.value)
const headlessImageEntries = computed(() => headlessEntries.value
  .map((e, i) => ({
    e,
    i,
  }))
  .filter(x => x.e.kind === 'image'))
const headlessOtherEntries = computed(() => headlessEntries.value
  .map((e, i) => ({
    e,
    i,
  }))
  .filter(x => x.e.kind !== 'image'))

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
const tagGroupValue = ref<CamelotTagInput[]>([
  {
    label: 'Vue',
    color: 'success',
    locked: true,
  },
  {
    label: 'Nuxt',
    color: 'info',
  },
  {
    label: 'Tailwind',
    color: 'warning',
    variant: 'outline',
  },
])
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

// Scoped Overlay 展示：只覆寫 primary 與自訂鍵 test，其餘色票（surface / on-surface / outline…）
// 不設定，因此仍繼承全域主題與深淺色。
const scopedOverlayLightColorScheme: CustomColorScheme<{ test: string }> = {
  primary: '#140fF1',
  test: '#FFEA00',
}
const scopedOverlayDarkColorScheme: CustomColorScheme<{ test: string }> = {
  primary: '#FFEA00',
  test: '#140fF1',
}

const scopedDialogOpen = ref(false)
const scopedSheetOpen = ref(false)

// Dialog 與 Sheet 共用同一組值：任一側修改，另一側即時反映
const overlaySharedCount = ref(3)
const overlaySharedOption = ref('韓式餐廳')

// ConfirmDialog 展示
const confirmThreeOpen = ref(false)
const confirmDefaultOpen = ref(false)
const confirmResult = ref('（尚未操作）')

const onConfirmAction = (action: CamelotConfirmAction) => {
  confirmResult.value = `收到 ${action} 事件`
}
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
// 全版面 Drawer：浮層疊層檢查點（內容見 DrawerOverlayFields）
const drawerFullOpen = ref(false)
const drawerFullOption = ref('韓式餐廳')

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

// Cascade Menu demo state（popup 飛出式多階層選單）
const cascadeSelected = ref<string | number | null>(null)
const cascadeMenuItems = ref<CamelotCascadeMenuItem[]>([
  {
    label: '帳號設定',
    value: 'account',
    children: [
      {
        label: '個人資料',
        value: 'account-profile',
      },
      {
        label: '安全性',
        value: 'account-security',
        children: [
          {
            label: '變更密碼',
            value: 'account-security-pwd',
          },
          {
            label: '兩步驟驗證',
            value: 'account-security-2fa',
            children: [
              {
                label: '簡訊驗證',
                value: 'account-security-2fa-sms',
              },
              {
                label: 'Authenticator App',
                value: 'account-security-2fa-app',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '外觀',
    value: 'appearance',
    children: [
      {
        label: '主題',
        value: 'appearance-theme',
        children: [
          {
            label: 'Material',
            value: 'appearance-theme-material',
          },
          {
            label: 'Cupertino',
            value: 'appearance-theme-cupertino',
          },
          {
            label: 'Sci-Fi',
            value: 'appearance-theme-scifi',
          },
          {
            label: 'Aqua',
            value: 'appearance-theme-aqua',
          },
        ],
      },
      {
        label: '字級',
        value: 'appearance-fontsize',
      },
    ],
  },
  {
    label: '語言與地區',
    value: 'locale',
    children: [
      {
        label: '時區（選項很多 → 可滾動）',
        value: 'locale-tz',
        children: Array.from({ length: 40 }).map((_, i) => ({
          label: `UTC${i - 12 >= 0 ? '+' : ''}${i - 12}:00 區域 ${i + 1}`,
          value: `tz-${i}`,
        })),
      },
      {
        label: '語言',
        value: 'locale-lang',
        children: [
          {
            label: '正體中文',
            value: 'lang-zh-tw',
          },
          {
            label: 'English',
            value: 'lang-en',
          },
          {
            label: '日本語',
            value: 'lang-ja',
          },
        ],
      },
    ],
  },
  {
    divider: true,
    label: '',
    value: 'divider-1',
  },
  {
    label: '通知',
    value: 'notifications',
  },
  {
    label: '說明與支援',
    value: 'help',
    disabled: true,
  },
  {
    label: '登出',
    value: 'logout',
  },
])
const onCascadeSelect = (item: CamelotCascadeMenuItem) => {
  cascadeSelected.value = item.value
  useCamelotToast().open('已選擇：' + item.label)
}

// Progress demo state
const progressVal = ref(65)
const progressStep = ref(1)
const stageCurrent = ref(3)
const stageTotal = ref(8)

// Table demo state
const tableFloatingScrollbar = ref(true)
const tableReserveVertical = ref(true)
const tableReserveHorizontal = ref(true)
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
    key: 'address',
    title: '地址',
    width: '280px',
  },
  {
    key: 'email',
    title: 'Email',
    width: '240px',
  },
  {
    key: 'hours',
    title: '營業時間',
    width: '180px',
  },
  {
    key: 'manager',
    title: '店長',
    width: '140px',
  },
  {
    key: 'note',
    title: '備註',
    width: '200px',
  },
  {
    key: 'status',
    title: '狀態',
    width: '110px',
    fixed: 'right',
    align: 'center',
  },
  {
    key: 'actions',
    title: '操作',
    width: '170px',
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
    address: '台北市中正區重慶南路一段 1 號',
    email: 'featured@example.com',
    hours: '10:00–22:00',
    manager: '總監',
    note: '精選店家',
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
    address: `台北市信義區松壽路 ${i + 1} 號 ${(i % 12) + 1} 樓`,
    email: `store${i + 1}@example.com`,
    hours: ['11:00–21:00', '10:30–22:00', '12:00–20:30'][i % 3] ?? '',
    manager: `${['王', '李', '陳', '林'][i % 4]}經理`,
    note: `近期評論 ${i * 3 + 5} 則`,
    status: i % 3 === 0 ? 'inactive' : 'active',
  })),
)

type TableRow = typeof tableData.value[number]

// 操作欄：明細 → 跳 notify；刪除 → 先跳確認 dialog，確認後才移除
const showRowDetail = (row: TableRow) => {
  useCamelotToast().open({
    title: `明細 - ${row.name}`,
    message: `分類：${row.category}｜城市：${row.city}｜評分：${row.rating}｜電話：${row.phone}`,
    type: 'info',
    position: 'top-right',
    duration: 4000,
  })
}

const deleteDialogOpen = ref(false)
const pendingDeleteRow = ref<TableRow | null>(null)

const askDeleteRow = (row: TableRow) => {
  pendingDeleteRow.value = row
  deleteDialogOpen.value = true
}

const doDeleteRow = () => {
  const row = pendingDeleteRow.value
  if (!row) {
    return
  }
  const index = tableData.value.findIndex(r => r.id === row.id)
  if (index !== -1) {
    tableData.value.splice(index, 1)
  }
  deleteDialogOpen.value = false
  pendingDeleteRow.value = null
  useCamelotToast().open({
    message: `已刪除 ${row.name}`,
    type: 'success',
    position: 'top-right',
  })
}

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

// DatePicker 語系 / 緊湊 demo
const dateLocales: { label: string, value: string | undefined }[] = [
  {
    label: '預設(中文)',
    value: undefined,
  },
  {
    label: '繁中',
    value: 'zh-Hant-TW',
  },
  {
    label: '簡中',
    value: 'zh-Hans-CN',
  },
  {
    label: '英文',
    value: 'en-US',
  },
  {
    label: '日文',
    value: 'ja-JP',
  },
  {
    label: '韓文',
    value: 'ko-KR',
  },
  {
    label: '泰文(佛曆)',
    value: 'th-TH',
  },
  {
    label: '阿拉伯(RTL文字)',
    value: 'ar',
  },
]
const dateLocale = ref<string | undefined>(undefined)
const dateWeekMonday = ref(false)
const dateShowDayLabel = ref(true)

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

// ---- Global Error Queue Demo ----

/** 模擬某個後端的自訂錯誤格式，用來示範「換了 API 格式只要註冊轉換器」 */
interface DemoApiErrorPayload {
  errorCode: string
  errorMessage: string
}

const {
  errors: camelotErrors,
  push: pushError,
  handle: handleError,
  dismiss: dismissError,
} = useCamelotError()

const isDemoApiErrorPayload = (raw: unknown): raw is DemoApiErrorPayload =>
  typeof raw === 'object' && raw !== null && 'errorCode' in raw && 'errorMessage' in raw

// 轉換器只做純轉換，副作用交給攔截器
registerErrorResolver<DemoApiErrorPayload>({
  name: 'demo:api-error',
  priority: 100,
  resolve: (raw) => {
    if (!isDemoApiErrorPayload(raw)) {
      return undefined
    }

    return {
      code: raw.errorCode,
      message: raw.errorMessage,
      data: raw,
    }
  },
})

// 401 的三段式處理：轉換 → 攔截（清權限 + 掛導頁）→ 入列顯示
registerErrorResolver({
  name: 'demo:unauthorized',
  priority: 200,
  resolve: (raw) => {
    if (!(raw instanceof Response) || raw.status !== 401) {
      return undefined
    }

    return {
      code: 401,
      message: '登入逾期，請重新登入',
    }
  },
})

registerErrorInterceptor({
  name: 'demo:unauthorized',
  intercept: (error) => {
    if (error.code !== 401) {
      return
    }

    // 真實專案在此清除權限狀態；demo 僅以 toast 表示已執行
    useCamelotToast().open('已清除登入狀態')
    error.onConfirm = () => useCamelotToast().open('導向登入頁')
  },
})

const pushErrorQueue = () => {
  pushError({
    title: '第 1 則',
    message: '佇列中的第一則錯誤。',
    level: 'error',
  })
  pushError({
    title: '第 2 則',
    message: '關閉上一則後才會顯示這一則。',
    level: 'warning',
  })
  pushError({
    title: '第 3 則',
    message: '佇列清空後對話框才會關閉。',
    level: 'info',
  })
}

const pushCustomApiError = () => {
  handleError({
    errorCode: 'E_QUOTA',
    errorMessage: '額度不足，請聯絡管理員。',
  })
}

const pushUnauthorizedError = () => {
  handleError(new Response(null, {
    status: 401,
  }))
}

const demoRetryCount = ref(0)

const retryMessage = computed(() => demoRetryCount.value <= 0
  ? '無法取得資料，請稍後再試。'
  : '無法取得資料，請稍後再試。（已重試 ' + demoRetryCount.value + ' 次）')

/** 模擬一直失敗的重試：關閉對話框 → 轉 3 秒 → 錯誤再次入列 */
const retryDemoRequest = async () => {
  // close: false 的用途：由呼叫端自行決定關閉時機，
  // 這裡先關掉對話框，loading 才不會被它蓋住
  dismissError()

  const closeLoading = useLoading().open('重新連線中...')
  await useDelay(3000)
  closeLoading()

  demoRetryCount.value += 1
  pushRetryableError()
}

const pushRetryableError = () => {
  pushError({
    title: '連線失敗',
    message: retryMessage.value,
    positive: {
      label: '重試',
      close: false,
      handler: retryDemoRequest,
    },
    negative: {
      label: '關閉',
    },
  })
}

const startRetryDemo = () => {
  demoRetryCount.value = 0
  pushRetryableError()
}

const pushPageControlledError = () => {
  handleError({
    errorCode: 'E_FORM',
    errorMessage: '表單送出失敗。',
  }, {
    onConfirm: () => useCamelotToast().open('由 page 指定的 confirm 處理'),
  })
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
