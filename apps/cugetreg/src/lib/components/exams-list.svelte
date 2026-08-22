<script lang="ts">
  import {
    downloadICS,
    generateExamICS,
    getExamData,
    getExamDateOrder,
    getLatestExamTime,
    isExamConflicted,
    TIMETABLE_DEFAULT_END,
    TIMETABLE_DEFAULT_START,
  } from '$lib/utils/schedule';

  import {
    ChevronLeft,
    ChevronRight,
    Download,
    Grid3X3,
    ListOrdered,
  } from 'lucide-svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { CustomizeScrollbar } from '@cugetreg/ui/atoms/customize-scrollbar';
  import { TimeTable, TimetableCourseCard } from '@cugetreg/ui/atoms/timetable';
  import {
    type Exam,
    ExamCard,
    type StatusColour,
  } from '@cugetreg/ui/molecules/exam-card';
  import {
    formatDate,
    formatExamColumn,
    formatExamTime,
  } from '@cugetreg/utils';
  import type {
    CartWithItemsBase,
    ExamScheduleItem,
  } from '@cugetreg/zod-schemas';

  interface ExamsListProps {
    cart: CartWithItemsBase;
    exams: ExamScheduleItem[];
  }

  let { cart, exams }: ExamsListProps = $props();

  let midtermTableRef = $state<HTMLElement | null>(null);
  let finalTableRef = $state<HTMLElement | null>(null);
  let showExamSchedule = $state<'List' | 'Schedule'>('Schedule');

  const examsData = $derived(getExamData(cart, exams));
  const examDateOrder = $derived(getExamDateOrder(examsData));

  const midtermExams = $derived(
    examDateOrder.midterms.flatMap((key) => examsData.midterms[key] ?? []),
  );
  const finalExams = $derived(
    examDateOrder.finals.flatMap((key) => examsData.finals[key] ?? []),
  );
  const midtermEndTime = $derived(
    getLatestExamTime(midtermExams, TIMETABLE_DEFAULT_END),
  );
  const finalEndTime = $derived(
    getLatestExamTime(finalExams, TIMETABLE_DEFAULT_END),
  );

  function formatTableDate(date: Date) {
    const months = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear() + 543).slice(-2)}`;
  }

  function handleDownloadICS() {
    const icsContent = generateExamICS(cart, exams);
    downloadICS(`${cart.name}_exam-schedule`, icsContent);
  }
</script>

<div class="flex flex-row items-center justify-between lg:justify-center">
  <span class="mt-5 text-2xl font-bold lg:hidden">ตารางสอบ</span>
  <div class="hidden lg:mt-5 lg:flex lg:justify-center lg:gap-4">
    <!-- TODO: Remove hard-coded color -->
    <ChevronLeft
      onclick={() => (showExamSchedule = 'Schedule')}
      strokeWidth={3}
      class={showExamSchedule === 'Schedule'
        ? 'cursor-pointer text-[#4A70C6] transition-colors hover:text-[#3B5EAB]'
        : 'text-on-surface-disabled cursor-pointer transition-colors hover:text-[#B0B2C5]'}
    />
    <!-- TODO: Remove hard-coded color -->
    <ChevronRight
      onclick={() => (showExamSchedule = 'List')}
      strokeWidth={3}
      class={showExamSchedule === 'List'
        ? 'cursor-pointer text-[#4A70C6] transition-colors hover:text-[#3B5EAB]'
        : 'text-on-surface-disabled cursor-pointer transition-colors hover:text-[#B0B2C5]'}
    />
  </div>
  <div class="mt-5 flex justify-center lg:hidden lg:gap-4">
    <!-- TODO: Remove hard-coded color -->
    <div
      class="rounded-l-lg px-4 py-3 {showExamSchedule === 'Schedule'
        ? 'bg-[#4A70C6]'
        : 'bg-surface-container'}"
    >
      <ListOrdered
        size={18}
        onclick={() => (showExamSchedule = 'Schedule')}
        strokeWidth={1.5}
        class={showExamSchedule === 'Schedule'
          ? 'cursor-pointer text-white'
          : 'text-on-surface hover:text-on-surface cursor-pointer transition-colors'}
      />
    </div>
    <!-- TODO: Remove hard-coded color -->
    <div
      class="rounded-r-lg px-4 py-3 {showExamSchedule === 'List'
        ? 'bg-[#4A70C6]'
        : 'bg-surface-container'}"
    >
      <Grid3X3
        size={18}
        onclick={() => (showExamSchedule = 'List')}
        strokeWidth={1.5}
        class={showExamSchedule === 'List'
          ? 'cursor-pointer text-white'
          : 'text-on-surface hover:text-on-surface cursor-pointer transition-colors'}
      />
    </div>
  </div>
</div>

{#if showExamSchedule === 'List'}
  {@render examList()}
{:else}
  {@render examSchedule()}
{/if}

<div class="mt-4 flex justify-end">
  <Button
    variant="outlined"
    color="neutral"
    class="m-0 gap-2"
    onclick={handleDownloadICS}
  >
    <Download size={18} strokeWidth={2.5} />
    ตารางสอบ (.ICS)
  </Button>
</div>

{#snippet examSchedule()}
  <div class="my-5 text-xl font-bold">Midterm</div>
  <div
    class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    bind:this={midtermTableRef}
  >
    <div class="min-w-150">
      <TimeTable
        startTime={TIMETABLE_DEFAULT_START}
        periodPerDay={midtermEndTime - TIMETABLE_DEFAULT_START}
        days={examDateOrder.midterms
          .filter((time) => time !== 0)
          .map((time) => formatTableDate(new Date(time)))}
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
                  section: exam.sectionNo,
                }}
                col={formatExamColumn(exam.start ?? undefined) -
                  TIMETABLE_DEFAULT_START}
                row={index}
                length={exam.duration}
                color={exam.colorVariant}
              />
            {/if}
          {/each}
        {/each}
      </TimeTable>
    </div>
  </div>

  <CustomizeScrollbar target={midtermTableRef} />

  <div class="my-5 text-xl font-bold">Finals</div>
  <div
    class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    bind:this={finalTableRef}
  >
    <div class="min-w-150">
      <TimeTable
        startTime={TIMETABLE_DEFAULT_START}
        periodPerDay={finalEndTime - TIMETABLE_DEFAULT_START}
        days={examDateOrder.finals
          .filter((time) => time !== 0)
          .map((time) => formatTableDate(new Date(time)))}
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
                  section: examCourse.sectionNo,
                }}
                col={formatExamColumn(examCourse.start ?? undefined) -
                  TIMETABLE_DEFAULT_START}
                row={index}
                length={examCourse.duration}
                color={examCourse.colorVariant}
              />
            {/if}
          {/each}
        {/each}
      </TimeTable>
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
