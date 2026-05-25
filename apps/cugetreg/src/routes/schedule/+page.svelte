<script lang="ts">
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import { getUserCartStore, useCartActions } from '$lib/stores/user-cart';

  import html2canvas from 'html2canvas-pro';
  import { ChevronLeft, ChevronRight, Copy, Share2 } from 'lucide-svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
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
  import { RenameSchedule } from '@cugetreg/ui/organisms/rename-schedule';
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
  } from '@cugetreg/zod-schemas/cart-response';

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

  // NOTE: Temporary: this should be global state
  // let scheduleList = $state(mockScheduleList)
  // let selectedSchedule = $state(untrack(() => scheduleList[0]))
  let showExamSchedule = $state<'List' | 'Schedule'>('Schedule');

  let timetableDiv = $state<HTMLElement | null>(null);

  let showRenameScheduleModal = $state(false);
  let showCreateScheduleModal = $state(false);
  let showDeleteScheduleModal = $state(false);
  let showViewCourseModal = $state(false);

  const userCart = getUserCartStore();
  const { renameCart, copyCart, deleteCart, createCart, pinCart } =
    useCartActions();

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
</script>

<div class="flex h-screen flex-col">
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
    <ViewCourse onExit={() => (showViewCourseModal = false)} />
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

  <div class="flex w-full flex-1 overflow-hidden">
    <div
      class="
            flex min-w-90 flex-1 flex-col overflow-hidden
            border-r border-neutral-200
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
    >
      <SelectTimetable
        class="border-b border-neutral-200 px-2 py-5"
        options={$userCart.cartList?.map((item) => ({
          name: item.name,
          id: item.id,
        })) ?? []}
        bind:value={$userCart.currentCartId}
      />
      {#if $userCart.currentCart}
        <SelectedCourse class="border-b border-neutral-200" />
      {:else}
        <SelectedCourse class="border-b border-neutral-200" />
      {/if}

      <div
        class="border-tangerine-500 text-tangerine-700 m-5 items-center rounded-2xl border-2 p-5"
      >
        <div class="text-center font-bold">
          CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง
        </div>
        <div class="text-center">
          สามารถลงทะเบียนเรียนได้ที่ <a href="https://www2.reg.chula.ac.th/"
            >https://www2.reg.chula.ac.th/</a
          >
          เพียงช่องทางเดียวเท่านั้น
        </div>
      </div>
    </div>

    <div class="flex-3 overflow-y-auto p-10">
      <div class="flex justify-between">
        <span class="text-4xl font-bold">ตารางเรียน</span>

        <EditSchedule
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
        ></EditSchedule>
      </div>
      <div class="bg-surface overflow-x-scroll p-8" bind:this={timetableDiv}>
        <div class="min-w-150">
          <Timetable startTime={7}>
            {#each $userCart.currentCart?.items as item (item.id)}
              {@render timetableCourseCard(item)}
            {/each}
          </Timetable>
        </div>
      </div>
      <div class="mx-5 mb-5 flex justify-end text-lg font-bold">
        หน่วยกิตรวม {totalCredit} / 22
      </div>

      <div class="flex">
        <Switch
          bind:checked={selectedSchedule.isPublic}
          label="เปิดเป็นสาธารณะ"
        />
        <div class="relative flex flex-1">
          <Input
            value="cugetreg.com/1232141413"
            disabled={!selectedSchedule.isPublic}
            readonly
          />

          <IconButton
            variant="ghost"
            disabled={!selectedSchedule.isPublic}
            class="absolute right-0 z-10 hover:cursor-pointer hover:bg-transparent"
          >
            <Copy />
          </IconButton>
        </div>
        <div>
          <IconButton class="aspect-square">
            <Share2 />
          </IconButton>
          <Button class="m-0 h-full" onclick={screenshotTimetable}
            >บันทึกเป็นภาพ</Button
          >
        </div>
      </div>

      <div class="mt-5 flex justify-center">
        <Button
          class="ring-0 outline-0 hover:bg-transparent!"
          onclick={() => {
            if (showExamSchedule === 'List') showExamSchedule = 'Schedule';
            else showExamSchedule = 'List';
          }}
          variant="outlined"
        >
          <ChevronLeft />
          {showExamSchedule}
          <ChevronRight />
        </Button>
      </div>

      {#if showExamSchedule === 'List'}
        {@render examList()}
      {:else}
        {@render examSchedule()}
      {/if}
    </div>
  </div>
</div>

{#snippet examSchedule()}
  <div class="my-5 text-xl font-bold">Midterm</div>
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

  <div class="my-5 text-xl font-bold">Finals</div>
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
{/snippet}

{#snippet examList()}
  <div class="flex items-center justify-center">
    <div class="my-5 inline-flex space-x-5">
      <div class="flex-1">
        <span class="text-2xl font-bold">Midterm</span>

        {#each examDateOrder.midterms as key (key)}
          <div class="my-5">
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
          <div class="my-5">
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
    {#each course.sections.find((sec) => sec.sectionNo === course.sectionNo)?.classes ?? [] as period, i (i)}
      {@const startTime = parsePeriodTime(period.periodStart)}
      {@const endTime = parsePeriodTime(period.periodEnd)}
      {@const color = isConflicted(courseNo, period)
        ? 'conflict'
        : ((course.color as ColorVariant) ?? 'primary')}

      {#if !isNaN(startTime) && !isNaN(endTime)}
        <TimetableCourseCard
          onclick={() => (showViewCourseModal = true)}
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
