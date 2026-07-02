<script lang="ts">
  import { browser } from '$app/environment';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import { getColumnFromDay } from '$lib/mapper';
  import {
    getSemesterShortOptions,
    getYearOptions,
  } from '$lib/semesterOptions';
  import {
    CART_PROMISE_KEY,
    type CartPromise,
    getUserCartStore,
    useCartActions,
  } from '$lib/stores/user-cart';
  import {
    calculateCredit,
    createElementScreenshot,
    getExamData,
    getExamDateOrder,
    getViewCourseData,
    isConflicted,
    isExamConflicted,
    parsePeriodTime,
  } from '$lib/utils/schedule';

  import { BookMarked, Loader2, Menu } from '@lucide/svelte';
  import {
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Grid3X3,
    ListOrdered,
    Share2,
  } from 'lucide-svelte';
  import { getContext } from 'svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { CustomizeScrollbar } from '@cugetreg/ui/atoms/customize-scrollbar';
  import { IconButton } from '@cugetreg/ui/atoms/icon-button';
  import { Input } from '@cugetreg/ui/atoms/input';
  import { Modal } from '@cugetreg/ui/atoms/modal';
  import { Switch } from '@cugetreg/ui/atoms/switch';
  import { TimetableCourseCard } from '@cugetreg/ui/atoms/timetable';
  import { TimeTable as Timetable } from '@cugetreg/ui/atoms/timetable';
  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';
  import { EditSchedule } from '@cugetreg/ui/molecules/edit-schedule';
  import {
    type Exam,
    ExamCard,
    type StatusColour,
  } from '@cugetreg/ui/molecules/exam-card';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import { RenameSchedule } from '@cugetreg/ui/organisms/rename-schedule';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
  import { ViewCourse } from '@cugetreg/ui/organisms/view-course';
  import {
    formatDate,
    formatExamColumn,
    formatExamTime,
  } from '@cugetreg/utils';
  import type { ColorVariant, Day } from '@cugetreg/utils/types';
  import type { CartItemDetail } from '@cugetreg/zod-schemas/carts-response';

  // ================ HOOKS ================

  const userCart = getUserCartStore();
  const {
    renameCart,
    copyCart,
    deleteCart,
    createCart,
    pinCart,
    updateCourse,
    removeCourse,
    switchCart,
    updateCartMeta,
  } = useCartActions();

  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);

  // ================ STATES ================

  let showExamSchedule = $state<'List' | 'Schedule'>('Schedule');

  let timetableDiv = $state<HTMLElement | undefined>();
  let innerWidth = $state(1024);

  let showRenameScheduleModal = $state(false);
  let showCreateScheduleModal = $state(false);
  let showDeleteScheduleModal = $state(false);
  let showViewCourseModal = $state(false);

  let selectedCartItemId = $state<string | undefined>(undefined);

  let scheduleTableRef = $state<HTMLElement | null>(null);
  let midtermTableRef = $state<HTMLElement | null>(null);
  let finalTableRef = $state<HTMLElement | null>(null);

  let sidebarExpanded = $state(true);
  let openPanel = $state<'sidebar' | 'selected_only' | null>(null);
  let activePanel = $state<'sidebar' | 'selected_only' | null>(null);

  let previousCartId = $state($userCart.currentCartId);

  // ================ DERIVED ================

  const viewCourseData = $derived(
    getViewCourseData(
      selectedCartItemId,
      $userCart.currentCart,
      $userCart.exams,
    ),
  );

  const examsData = $derived(
    getExamData($userCart.currentCart, $userCart.exams),
  );
  const examDateOrder = $derived(getExamDateOrder(examsData));
  const totalCredit = $derived(calculateCredit($userCart.currentCart.items));
  const publicCartURL = $derived.by(() => {
    if (!browser) return '';
    return `${window.location.host}/schedule/${$userCart.currentCart.id}`;
  });

  $effect(() => {
    if ($userCart.currentCartId && $userCart.currentCartId !== previousCartId) {
      previousCartId = $userCart.currentCartId;
      switchCart($userCart.currentCartId);
    }
  });

  function handleTimetableScreenshot() {
    createElementScreenshot(
      `${$userCart.currentCart.name}_timetable`,
      timetableDiv,
    );
  }

  function handlePublicToggle(isPublic: boolean) {
    updateCartMeta({
      visible: isPublic ? 'PUB' : 'PVT',
    });
  }
</script>

<svelte:window bind:innerWidth />

<div class="relative flex h-full flex-col overflow-hidden bg-white">
  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showRenameScheduleModal}
  >
    <RenameSchedule
      initialName={$userCart.currentCart.name}
      onCancel={() => (showRenameScheduleModal = false)}
      onConfirm={(name) => {
        renameCart(name);
        showRenameScheduleModal = false;
      }}
    />
  </Modal>
  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showCreateScheduleModal}
  >
    <CreateTimetable
      yearOptions={getYearOptions()}
      semesterOptions={getSemesterShortOptions()}
      onConfirm={(schedule: TimetableMetaData) => {
        createCart(
          schedule.name,
          schedule.isPublic,
          schedule.semesterType,
          schedule.semester,
          schedule.academicYear,
        );
        showCreateScheduleModal = false;
      }}
      onCancel={() => (showCreateScheduleModal = false)}
    />
  </Modal>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showViewCourseModal}
  >
    <ViewCourse
      data={viewCourseData}
      onExit={() => (showViewCourseModal = false)}
      onHide={(itemId, hidden) => updateCourse(itemId, { hidden })}
      onRemove={(itemId) => {
        removeCourse(itemId);
        showViewCourseModal = false;
      }}
      onChangeColor={(itemId, color) => updateCourse(itemId, { color })}
      onChangeSection={(itemId, sectionNo) =>
        updateCourse(itemId, { sectionNo })}
    />
  </Modal>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showDeleteScheduleModal}
  >
    <ConfirmDeleteSchedule
      scheduleName={$userCart.currentCart.name}
      onCancel={() => (showDeleteScheduleModal = false)}
      onConfirm={() => {
        showDeleteScheduleModal = false;
        deleteCart();
      }}
    />
  </Modal>

  <div class="relative flex flex-1 overflow-hidden">
    <AppSidebar
      showSidebar={innerWidth >= 1024}
      bind:expanded={sidebarExpanded}
      bind:openPanel
      bind:activePanel
    >
      {#snippet iconItems({
        toggleExpanded,
        togglePanel,
        expanded,
        openPanel,
        activePanel,
      })}
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            onclick={toggleExpanded}
            isActive={expanded && activePanel === 'sidebar'}
            size="lg"
            tooltipContent="ตารางเรียน"
            class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
          >
            <Menu size="24" strokeWidth={2.5} />
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            onclick={() =>
              togglePanel('selected_only', () => {
                document
                  .querySelector('[data-selected-section]')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              })}
            isActive={activePanel === 'selected_only'}
            size="lg"
            tooltipContent="วิชาที่เลือก"
            class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
          >
            <BookMarked size="24" strokeWidth={2.5} />
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      {/snippet}
      {#snippet panelContent({ openPanel, expanded })}
        {#if expanded || openPanel === 'sidebar'}
          <div class="relative mb-6 flex flex-col gap-2">
            {#await cartPromise}
              <div
                class="flex items-center justify-center gap-2 px-2 py-8 text-gray-400"
              >
                <Loader2 class="animate-spin" size={24} />
                <span class="text-sm">กำลังโหลดตารางเรียน...</span>
              </div>
            {:then}
              <SelectTimetable
                class="border-b border-neutral-200 px-2 py-5"
                options={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                bind:value={$userCart.currentCartId}
                semester={$userCart.currentCart.semester}
                semesterType={$userCart.currentCart.studyProgram}
                academicYear={$userCart.currentCart.academicYear}
              />
            {:catch}
              <div
                class="flex items-center justify-center gap-2 px-2 py-8 text-sm text-red-400"
              >
                โหลดตารางเรียนไม่สำเร็จ
              </div>
            {/await}
          </div>
          <hr class="mb-6 opacity-50" />

          {#if $userCart.currentCart}
            <div data-selected-section>
              <SelectedCourse class="border-b border-neutral-200" />
            </div>
          {/if}
          <hr class="mb-6 opacity-50" />

          <div
            class="rounded-2xl border border-orange-300 px-5 py-4 text-center text-[15px] leading-relaxed text-orange-500"
          >
            <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span
            ><br />
            สามารถลงทะเบียนเรียนได้ที่
            <a
              href="https://www2.reg.chula.ac.th/"
              target="_blank"
              rel="noreferrer"
              class="underline">https://www2.reg.chula.ac.th/</a
            ><br />
            เพียงช่องทางเดียวเท่านั้น
          </div>
        {:else if openPanel === 'selected_only'}
          {#if $userCart.currentCart}
            <SelectedCourse
              variant="grouped"
              class="border-b border-neutral-200"
            />
          {:else}
            <SelectedCourse class="border-b border-neutral-200" />
          {/if}
          <div
            class="mt-8 rounded-2xl border border-orange-300 px-5 py-4 text-center text-[15px] leading-relaxed text-orange-500"
          >
            <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span
            ><br />
            สามารถลงทะเบียนเรียนได้ที่
            <a
              href="https://www2.reg.chula.ac.th/"
              target="_blank"
              rel="noreferrer"
              class="underline">https://www2.reg.chula.ac.th/</a
            ><br />
            เพียงช่องทางเดียวเท่านั้น
          </div>
        {/if}
      {/snippet}
      <div class="flex min-h-full flex-col">
        <div class="mx-auto w-full max-w-[1200px] flex-1 p-6 lg:p-10">
          <div
            class="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex w-full items-center justify-between lg:w-auto">
              <span class="text-[20px] font-bold md:text-[30px] lg:text-4xl"
                >ตารางเรียน</span
              >
              <div class="lg:hidden">
                <Switch
                  checked={$userCart.currentCart.visible === 'PUB'}
                  onCheckedChange={handlePublicToggle}
                  label="เปิดเป็นสาธารณะ"
                />
              </div>
            </div>

            <div class="flex w-full items-center lg:w-auto">
              <EditSchedule
                class="gap-2 lg:gap-0"
                bind:currentScheduleId={$userCart.currentCartId}
                schedules={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                onRename={() => (showRenameScheduleModal = true)}
                onDuplicate={() => copyCart()}
                onAddSchedule={() => (showCreateScheduleModal = true)}
                onDelete={() => (showDeleteScheduleModal = true)}
                onPin={() => pinCart()}
              />
            </div>
          </div>
          <div
            class="bg-surface overflow-x-auto pt-4 pb-0 [scrollbar-width:none] lg:px-8 lg:py-8 [&::-webkit-scrollbar]:hidden"
            bind:this={timetableDiv}
            bind:this={scheduleTableRef}
          >
            <div class="min-w-150">
              <Timetable startTime={7}>
                {#each $userCart.currentCart?.items as item (item.id)}
                  {@render timetableCourseCard(item)}
                {/each}
              </Timetable>
            </div>
          </div>
          <CustomizeScrollbar target={scheduleTableRef} />
          <div
            class="hidden lg:mx-5 lg:mb-5 lg:flex lg:justify-end lg:text-lg lg:font-bold"
          >
            หน่วยกิตรวม {totalCredit} / 22
          </div>

          <div
            class="mt-4 flex w-full flex-col gap-2 lg:mt-0 lg:flex-row lg:items-center"
          >
            <div class="flex w-full items-center justify-between lg:w-auto">
              <Switch
                checked={$userCart.currentCart.visible === 'PUB'}
                onCheckedChange={handlePublicToggle}
                label="เปิดเป็นสาธารณะ"
              />
              {#if innerWidth < 1024}
                <Button
                  class="m-0 flex items-center gap-1 border border-gray-200 bg-white"
                  onclick={handleTimetableScreenshot}
                >
                  <Download
                    size={20}
                    strokeWidth={2.5}
                    class="text-[#353745]"
                  />
                  <span class="font-medium text-[#353745]">บันทึกภาพ</span>
                </Button>
              {/if}
            </div>
            <div class="flex w-full items-center gap-2 lg:flex-1">
              <div class="relative flex flex-1">
                <Input
                  value={publicCartURL}
                  disabled={$userCart.currentCart.visible === 'PVT'}
                  readonly
                  class="w-full pr-10"
                  onfocus={(e: FocusEvent) =>
                    (e.target as HTMLInputElement).select()}
                />
                <IconButton
                  variant="ghost"
                  disabled={$userCart.currentCart.visible === 'PVT'}
                  class="absolute right-0 z-10 hover:cursor-pointer hover:bg-transparent"
                  onclick={() => {
                    if (publicCartURL) {
                      navigator.clipboard.writeText(publicCartURL);
                    }
                  }}
                >
                  <Copy />
                </IconButton>
              </div>
              <IconButton class="aspect-square">
                <Share2 />
              </IconButton>
              {#if innerWidth >= 1024}
                <Button class="m-0" onclick={handleTimetableScreenshot}>
                  บันทึกเป็นภาพ
                </Button>
              {/if}
            </div>
          </div>

          <div
            class="flex flex-row items-center justify-between lg:justify-center"
          >
            <span class="mt-5 text-2xl font-bold lg:hidden">ตารางสอบ</span>
            <div class="hidden lg:mt-5 lg:flex lg:justify-center lg:gap-4">
              <ChevronLeft
                onclick={() => (showExamSchedule = 'Schedule')}
                strokeWidth={3}
                class={showExamSchedule === 'Schedule'
                  ? 'cursor-pointer text-[#4A70C6] transition-colors hover:text-[#3B5EAB]'
                  : 'cursor-pointer text-[#D6D7E1] transition-colors hover:text-[#B0B2C5]'}
              />
              <ChevronRight
                onclick={() => (showExamSchedule = 'List')}
                strokeWidth={3}
                class={showExamSchedule === 'List'
                  ? 'cursor-pointer text-[#4A70C6] transition-colors hover:text-[#3B5EAB]'
                  : 'cursor-pointer text-[#D6D7E1] transition-colors hover:text-[#B0B2C5]'}
              />
            </div>
            <div class="mt-5 flex justify-center lg:hidden lg:gap-4">
              <div
                class="rounded-l-lg px-4 py-3 {showExamSchedule === 'Schedule'
                  ? 'bg-[#4A70C6]'
                  : 'bg-gray-200'}"
              >
                <ListOrdered
                  size={18}
                  onclick={() => (showExamSchedule = 'Schedule')}
                  strokeWidth={1.5}
                  class={showExamSchedule === 'Schedule'
                    ? 'cursor-pointer text-[#FFFFFF]'
                    : 'cursor-pointer text-[#353745] transition-colors hover:text-black'}
                />
              </div>
              <div
                class="rounded-r-lg px-4 py-3 {showExamSchedule === 'List'
                  ? 'bg-[#4A70C6]'
                  : 'bg-gray-200'}"
              >
                <Grid3X3
                  size={18}
                  onclick={() => (showExamSchedule = 'List')}
                  strokeWidth={1.5}
                  class={showExamSchedule === 'List'
                    ? 'cursor-pointer text-[#FFFFFF]'
                    : 'cursor-pointer text-[#353745] transition-colors hover:text-black'}
                />
              </div>
            </div>
          </div>

          {#if showExamSchedule === 'List'}
            {@render examList()}
          {:else}
            {@render examSchedule()}
          {/if}
        </div>
        <div class="mt-auto w-full border-t bg-white">
          <Footer />
        </div>
      </div>
    </AppSidebar>
  </div>
</div>

{#snippet examSchedule()}
  <div class="my-5 text-xl font-bold">Midterm</div>
  <div
    class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    bind:this={midtermTableRef}
  >
    <div class="min-w-150">
      <Timetable
        startTime={7}
        days={examDateOrder.midterms
          .filter((time) => time !== 0)
          .map((time) => formatDate(new Date(time)))}
      >
        {#each examDateOrder.midterms.filter((time) => time !== 0) as key, index (key)}
          {#each examsData.midterms[key] as exam (exam.cartItemId)}
            {#if exam.start && exam.end}
              <TimetableCourseCard
                course={{
                  name: exam.name,
                  abbrName: exam.abbrName,
                  code: exam.courseNo,
                  bldg: '',
                  room: '',
                  section: 0,
                }}
                col={formatExamColumn(exam.start ?? undefined) - 7}
                row={index}
                length={exam.duration}
                color={exam.colorVariant}
              />
            {/if}
          {/each}
        {/each}
      </Timetable>
    </div>
  </div>

  <CustomizeScrollbar target={midtermTableRef} />

  <div class="my-5 text-xl font-bold">Finals</div>
  <div
    class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    bind:this={finalTableRef}
  >
    <div class="min-w-150">
      <Timetable
        startTime={7}
        days={examDateOrder.finals
          .filter((time) => time !== 0)
          .map((time) => formatDate(new Date(time)))}
      >
        {#each examDateOrder.finals.filter((time) => time !== 0) as key, index (key)}
          {#each examsData.finals[key] as examCourse (examCourse.cartItemId)}
            {#if examCourse.start && examCourse.end}
              <TimetableCourseCard
                course={{
                  abbrName: examCourse.abbrName,
                  name: examCourse.name,
                  code: examCourse.courseNo,
                  bldg: '',
                  room: '',
                  section: 0,
                }}
                col={formatExamColumn(examCourse.start ?? undefined) - 7}
                row={index}
                length={examCourse.duration}
                color={examCourse.colorVariant}
              />
            {/if}
          {/each}
        {/each}
      </Timetable>
    </div>
  </div>

  <CustomizeScrollbar target={finalTableRef} />
{/snippet}

{#snippet examList()}
  <div class="flex items-center justify-center">
    <div class="my-5 w-full space-x-5 lg:inline-flex lg:w-auto">
      <div class="flex-1">
        <span class="text-2xl font-bold">Midterm</span>

        {#each examDateOrder.midterms as key (key)}
          <div class="my-5 w-full min-w-0">
            <ExamCard
              date={key === 0 ? 'ยังไม่ประกาศ' : formatDate(new Date(key))}
              data={examsData.midterms[key].map((course) => {
                return {
                  id: course.cartItemId,
                  colour: isExamConflicted(course, examsData.midterms[key])
                    ? 'error'
                    : (course.colorVariant as StatusColour),
                  time: formatExamTime(
                    course.start ?? undefined,
                    course.duration,
                  ),
                  subject: course.name,
                } as Exam;
              })}
            />
          </div>
        {/each}
      </div>
      <div class="flex-1">
        <span class="text-2xl font-bold">Finals</span>

        {#each examDateOrder.finals as key (key)}
          <div class="my-5 w-full min-w-0">
            <ExamCard
              date={key === 0 ? 'ยังไม่ประกาศ' : formatDate(new Date(key))}
              data={examsData.finals[key].map((course) => {
                return {
                  id: course.cartItemId,
                  colour: isExamConflicted(course, examsData.finals[key])
                    ? 'error'
                    : (course.colorVariant as StatusColour),
                  time: formatExamTime(
                    course.start ?? undefined,
                    course.duration,
                  ),
                  subject: course.name,
                } as Exam;
              })}
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
{/snippet}

{#snippet timetableCourseCard(course: CartItemDetail)}
  {#if !course.hidden}
    {@const courseNo = course.courseNo}
    {@const section = course.sections.find(
      (sec) => sec.sectionNo === course.sectionNo,
    )}
    {#each section?.classes ?? [] as period, i (i)}
      {@const startTime = parsePeriodTime(period.periodStart)}
      {@const endTime = parsePeriodTime(period.periodEnd)}
      {@const color = isConflicted(
        courseNo,
        period,
        $userCart.currentCart.items,
      )
        ? 'conflict'
        : ((course.color as ColorVariant) ?? 'primary')}

      {#if !isNaN(startTime) && !isNaN(endTime)}
        <TimetableCourseCard
          onclick={() => {
            selectedCartItemId = course.id;
            showViewCourseModal = true;
          }}
          course={{
            abbrName: course.course.abbrName,
            name: course.course.courseNameEn,
            code: course.courseNo,
            bldg: period.building ?? '',
            room: period.room ?? '',
            section: course.sectionNo,
          }}
          {color}
          length={parsePeriodTime(period.periodEnd) -
            parsePeriodTime(period.periodStart)}
          row={getColumnFromDay(period.dayOfWeek as Day)}
          col={parsePeriodTime(period.periodStart) - 7}
        />
      {/if}
    {/each}
  {/if}
{/snippet}
