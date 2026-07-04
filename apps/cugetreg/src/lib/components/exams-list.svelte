<script lang="ts">
  import {
    getExamData,
    getExamDateOrder,
    isExamConflicted,
  } from '$lib/utils/schedule';

  import {
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    ListOrdered,
  } from 'lucide-svelte';

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
</script>

<div class="flex flex-row items-center justify-between lg:justify-center">
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

{#snippet examSchedule()}
  <div class="my-5 text-xl font-bold">Midterm</div>
  <div
    class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    bind:this={midtermTableRef}
  >
    <div class="min-w-150">
      <TimeTable
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
