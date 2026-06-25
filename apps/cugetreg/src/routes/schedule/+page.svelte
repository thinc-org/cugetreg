<script lang="ts">
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import SelectedCourse from '$lib/components/selected-course.svelte';
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

  import { BookMarked, Loader2, Menu } from '@lucide/svelte';
  import html2canvas from 'html2canvas-pro';
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
    discardTime,
    formatDate,
    formatExamColumn,
    formatExamTime,
  } from '@cugetreg/utils';
  import type { ColorVariant, Day } from '@cugetreg/utils/types';
  import type {
    CartItemDetail,
    Period,
  } from '@cugetreg/zod-schemas/carts-response';

  // TODO: Move this somewhere else
  function parsePeriodTime(periodTime: string): number {
    const parts = periodTime.split(':');
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    return hour + minute / 60;
  }

  function getColumnFromDay(day: Day): number {
    switch (day) {
      case 'MO':
        return 0;
      case 'TU':
        return 1;
      case 'WE':
        return 2;
      case 'TH':
        return 3;
      case 'FR':
        return 4;
      case 'SA':
        return 5;
      case 'SU':
        return 6;
    }
  }

  function isConflicted(courseNo: string, period: Period): boolean {
    for (const other of $userCart.currentCart.items) {
      if (other.hidden || other.courseNo === courseNo) continue;

      const otherSection = other.sections.find(
        (sec) => sec.sectionNo === other.sectionNo,
      );

      const periodStartTime = parsePeriodTime(period.periodStart);
      const periodEndTime = parsePeriodTime(period.periodEnd);

      if (isNaN(periodStartTime) || isNaN(periodEndTime)) continue;

      for (const otherPeriod of otherSection?.classes ?? []) {
        const otherPeriodStartTime = parsePeriodTime(otherPeriod.periodStart);
        const otherPeriodEndTime = parsePeriodTime(otherPeriod.periodEnd);

        if (isNaN(otherPeriodStartTime) || isNaN(otherPeriodEndTime)) continue;

        if (period.dayOfWeek !== otherPeriod.dayOfWeek) continue;
        if (
          periodStartTime < otherPeriodEndTime &&
          otherPeriodStartTime < periodEndTime
        ) {
          return true;
        }
      }
    }
    return false;
  }

  async function screenshotTimetable() {
    if (!timetableDiv) return;

    const canvas = await html2canvas(timetableDiv, {
      backgroundColor: null,
      logging: false,
      useCORS: true,
      scale: 3,
    });

    const screenshot = canvas.toDataURL('image/jpeg');

    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `${selectedSchedule.name}_timetable.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  let showExamSchedule = $state<'List' | 'Schedule'>('Schedule');

  let timetableDiv = $state<HTMLElement | null>(null);
  let innerWidth = $state(1024);

  let showRenameScheduleModal = $state(false);
  let showCreateScheduleModal = $state(false);
  let showDeleteScheduleModal = $state(false);
  let showViewCourseModal = $state(false);

  let selectedCartItemId = $state<string | null>(null);

  let scheduleTableRef = $state<HTMLElement | null>(null);
  let midtermTableRef = $state<HTMLElement | null>(null);
  let finalTableRef = $state<HTMLElement | null>(null);

  let sidebarExpanded = $state(true);
  let openPanel = $state<'sidebar' | 'selected_only' | null>(null);
  let activePanel = $state<'sidebar' | 'selected_only' | null>(null);

  const viewCourseData = $derived.by(() => {
    if (!selectedCartItemId) return null;

    const selectedCartItem = $userCart.currentCart?.items.find(
      (item) => item.id === selectedCartItemId,
    );
    if (!selectedCartItem) return null;

    const midterm = $userCart.exams?.find(
      (e) => e.cartItemId === selectedCartItem?.id && e.type === 'MIDTERM',
    );
    const final = $userCart.exams?.find(
      (e) => e.cartItemId === selectedCartItem?.id && e.type === 'FINAL',
    );

    const data: ViewCourseData = {
      itemId: selectedCartItem.id,
      courseNo: selectedCartItem.courseNo,
      abbrName: selectedCartItem.course.abbrName,
      courseNameTh: selectedCartItem.course.courseNameTh,
      courseNameEn: selectedCartItem.course.courseNameEn,
      credit: selectedCartItem.course.credit,
      sections: selectedCartItem.sections.map((sec) => ({
        sectionNo: sec.sectionNo,
        closed: sec.closed,
        regis: sec.regis,
        max: sec.max,
        classes: sec.classes.map((cls) => ({
          type: cls.type,
          dayOfWeek: cls.dayOfWeek,
          periodStart: cls.periodStart,
          periodEnd: cls.periodEnd,
          building: cls.building,
          room: cls.room,
          professors: cls.professors,
        })),
      })),
      selectedSectionNo: selectedCartItem.sectionNo,
      color: (selectedCartItem.color as ColorVariant) ?? 'primary',
      midterm: midterm
        ? `${formatDate(new Date(midterm.start))} ${formatExamTime(new Date(midterm.start), (new Date(midterm.end).getTime() - new Date(midterm.start).getTime()) / (1000 * 60 * 60))}`
        : undefined,
      final: final
        ? `${formatDate(new Date(final.start))} ${formatExamTime(new Date(final.start), (new Date(final.end).getTime() - new Date(final.start).getTime()) / (1000 * 60 * 60))}`
        : undefined,
      isHidden: selectedCartItem.hidden,
    };

    return data;
  });

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
  } = useCartActions();

  type LocalExamData = {
    abbrName: string;
    cartItemId: string;
    courseNo: string;
    name: string;
    colorVariant: ColorVariant;
    start: Date | null;
    end: Date | null;
    duration: number; // calculated here
  };

  const examsData = $derived.by(() => {
    let midterms: Record<number, LocalExamData[]> = {};
    let finals: Record<number, LocalExamData[]> = {};

    if ($userCart && $userCart.exams) {
      for (const exam of $userCart.exams) {
        const course = $userCart.currentCart?.items.find(
          (item) => item.id === exam.cartItemId,
        );
        if (!course || course.hidden) continue;

        let dateVal = 0;
        let start: Date | null = null;
        let end: Date | null = null;
        let duration = 0;

        if (exam.start && exam.end) {
          start = new Date(exam.start);
          end = new Date(exam.end);
          dateVal = discardTime(start.getTime());
          duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }

        const data: LocalExamData = {
          cartItemId: exam.cartItemId,
          courseNo: exam.courseNo,
          name:
            course.course.courseNameEn ||
            course.course.courseNameTh ||
            exam.courseNo,
          abbrName: course.course.abbrName,
          colorVariant: (course.color ?? 'primary') as ColorVariant,
          start,
          end,
          duration,
        };

        if (exam.type === 'MIDTERM') {
          if (!midterms[dateVal]) midterms[dateVal] = [];
          midterms[dateVal].push(data);
        } else if (exam.type === 'FINAL') {
          if (!finals[dateVal]) finals[dateVal] = [];
          finals[dateVal].push(data);
        }
      }
    }

    return { midterms, finals };
  });

  const examSort = (a: string, b: string) => {
    const numA = Number(a);
    const numB = Number(b);

    if (numA === 0) return 1;
    else if (numB === 0) return -1;
    else return numA - numB;
  };

  const examDateOrder = $derived.by(() => {
    let midterms: number[] = Object.keys(examsData.midterms)
      .sort(examSort)
      .map((x) => Number(x));
    let finals: number[] = Object.keys(examsData.finals)
      .sort(examSort)
      .map((x) => Number(x));

    return { midterms, finals };
  });

  function isExamConflicted(exam: LocalExamData, others?: LocalExamData[]) {
    if (!exam.start || !exam.end) return false;
    if (!others) return false;

    const s1 = exam.start.getTime();
    const e1 = exam.end.getTime();

    for (const other of others) {
      if (other.cartItemId === exam.cartItemId) continue;
      if (!other.start || !other.end) continue;

      const s2 = other.start.getTime();
      const e2 = other.end.getTime();

      if (s1 < e2 && s2 < e1) return true;
    }

    return false;
  }

  const totalCredit = $derived(
    $userCart.currentCart?.items.reduce(
      (acc, item) => acc + (item.hidden ? 0 : Number(item.course.credit)),
      0,
    ) ?? 0,
  );

  let selectedSchedule = $state({
    name: 'ปี 2 เทอม 1',
    scheduleId: '1',
    schedule: [],
    semesterType: 'Semester',
    semester: '2566/1',
    isPublic: false,
  });

  // let currentScheduleId = $state($userCart.currentCart?.id ?? '');

  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);

  let previousCartId = $state($userCart.currentCartId);

  $effect(() => {
    if ($userCart.currentCartId && $userCart.currentCartId !== previousCartId) {
      previousCartId = $userCart.currentCartId;
      switchCart($userCart.currentCartId);
    }
  });
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
      scheduleName={selectedSchedule.name}
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
                  bind:checked={selectedSchedule.isPublic}
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
                bind:checked={selectedSchedule.isPublic}
                label="เปิดเป็นสาธารณะ"
              />
              {#if innerWidth < 1024}
                <Button
                  class="m-0 flex items-center gap-1 border border-gray-200 bg-white"
                  onclick={screenshotTimetable}
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
                  value="cugetreg.com/1232141413"
                  disabled={!selectedSchedule.isPublic}
                  readonly
                  class="w-full pr-10"
                />
                <IconButton
                  variant="ghost"
                  disabled={!selectedSchedule.isPublic}
                  class="absolute right-0 z-10 hover:cursor-pointer hover:bg-transparent"
                >
                  <Copy />
                </IconButton>
              </div>
              <IconButton class="aspect-square">
                <Share2 />
              </IconButton>
              {#if innerWidth >= 1024}
                <Button class="m-0" onclick={screenshotTimetable}>
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
      {@const color = isConflicted(courseNo, period)
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
