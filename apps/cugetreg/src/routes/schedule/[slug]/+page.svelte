<script lang="ts">
  import SelectedCourse from '$lib/components/selected-course.svelte';

  import html2canvas from 'html2canvas-pro';
  import { ChevronLeft, ChevronRight, Copy, Share2 } from 'lucide-svelte';
  import { untrack } from 'svelte';

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
  import { CreateTimetable } from '@cugetreg/ui/organisms/create-timetable';
  import { RenameSchedule } from '@cugetreg/ui/organisms/rename-schedule';
  import { ViewCourse } from '@cugetreg/ui/organisms/view-course';
  import {
    discardTime,
    formatDate,
    formatExamColumn,
    formatExamTime,
    isFinalsConflict,
    isMidtermConflict,
  } from '@cugetreg/utils';
  import type {
    ColorVariant,
    CourseSchedule,
    Day,
    Period,
    ScheduleList,
    ScheduleListItem,
  } from '@cugetreg/utils/types';

  import type { PageProps } from './$types';

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

  function isConflicted(course: CourseSchedule): boolean {
    const courseSection = course.course.sections[course.selectedSection] || [];

    for (const other of selectedSchedule.schedule) {
      if (other === course || other.hidden) continue;

      const otherSection = other.course.sections[other.selectedSection] || [];

      for (const period of courseSection) {
        for (const otherPeriod of otherSection) {
          if (period.day !== otherPeriod.day) continue;

          const periodStart = period.startTime;
          const periodEnd = period.startTime + period.duration;
          const otherPeriodStart = otherPeriod.startTime;
          const otherPeriodEnd = otherPeriod.startTime + otherPeriod.duration;

          if (periodStart < otherPeriodEnd && otherPeriodStart < periodEnd) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function duplicateCurrentSchedule() {
    const snapshot = $state.snapshot(selectedSchedule);
    const current = structuredClone(snapshot);

    scheduleList.push({
      ...current,
      name: `${selectedSchedule.name} Copy`,
      scheduleId: crypto.randomUUID(),
    });
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

  const { data }: PageProps = $props();

  const cartInfo = data.data.cart;

  const initialScheduleList: ScheduleList = [
    {
      name: cartInfo.name,
      scheduleId: cartInfo.id,
      semesterType: data.semesterType,
      semester: `${cartInfo.academicYear}/${cartInfo.semester}`,
      // isPublic: cartInfo.visible === 'PUBLIC',
      isPublic: true,
      schedule: cartInfo.items.map((item, index) => {
        const sectionsObj: Record<number, Period[]> = {};
        item.sections.forEach((sec) => {
          sectionsObj[sec.sectionNo] = sec.classes.map((cls) => {
            const [startH, startM] = cls.periodStart.split(':').map(Number);
            const [endH, endM] = cls.periodEnd.split(':').map(Number);
            const startTime = startH + startM / 60;
            const endTime = endH + endM / 60;

            return {
              day: cls.dayOfWeek.substring(0, 2).toUpperCase() as Day,
              startTime: startTime,
              duration: endTime - startTime,
              building: cls.building || '',
              room: cls.room || '',
            };
          });
        });

        const midtermExam = data.data.schedule.exams.find(
          (e) => e.cartItemId === item.id && e.type === 'MIDTERM',
        );
        const finalExam = data.data.schedule.exams.find(
          (e) => e.cartItemId === item.id && e.type === 'FINAL',
        );

        const parseExam = (examObj?: typeof midtermExam) => {
          if (!examObj) return undefined;
          const startDate = new Date(examObj.start);
          const endDate = new Date(examObj.end);
          return {
            date: startDate,
            duration:
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
          };
        };

        return {
          id: index + 1,
          course: {
            name: item.course.courseNameEn || item.course.courseNameTh,
            code: item.courseNo,
            credit: Number(item.course.credit),
            gened: [],
            sections: sectionsObj as any,
            midterm: parseExam(midtermExam),
            final: parseExam(finalExam),
          },
          selectedSection: item.sectionNo,
          hidden: item.hidden,
          colorVariant: (item.color as ColorVariant) || 'pink',
          conflicted: false,
        };
      }),
    },
  ];

  let scheduleList = $state(structuredClone(initialScheduleList));
  let selectedSchedule = $state(untrack(() => scheduleList[0]));
  let showExamSchedule = $state<'List' | 'Schedule'>('Schedule');

  let timetableDiv = $state<HTMLElement | null>(null);

  let showRenameScheduleModal = $state(false);
  let showCreateScheduleModal = $state(false);
  let showDeleteScheduleModal = $state(false);
  let showViewCourseModal = $state(false);

  const examSort = (a: string, b: string) => {
    const numA = Number(a);
    const numB = Number(b);

    if (numA === 0) return 1;
    else if (numB === 0) return -1;
    else return numA - numB;
  };

  const examsData = $derived.by(() => {
    let midterms: Record<number, CourseSchedule[]> = {};
    let finals: Record<number, CourseSchedule[]> = {};

    selectedSchedule.schedule.forEach((course) => {
      if (course.hidden) return;

      const { midterm, final } = course.course;

      if (midterm) {
        const formattedDate = discardTime(midterm.date.getTime());
        if (formattedDate in midterms) midterms[formattedDate].push(course);
        else midterms[formattedDate] = [course];
      } else {
        if (!(0 in midterms)) midterms[0] = [];
        midterms[0].push(course);
      }

      if (final) {
        const formattedDate = discardTime(final.date.getTime());
        if (formattedDate in finals) finals[formattedDate].push(course);
        else finals[formattedDate] = [course];
      } else {
        if (!(0 in finals)) finals[0] = [];
        finals[0].push(course);
      }
    });

    return { midterms, finals };
  });

  const examDateOrder = $derived.by(() => {
    let midterms: number[] = Object.keys(examsData.midterms)
      .sort(examSort)
      .map((x) => Number(x));
    let finals: number[] = Object.keys(examsData.finals)
      .sort(examSort)
      .map((x) => Number(x));

    return { midterms, finals };
  });

  const totalCredit = $derived(
    selectedSchedule.schedule.reduce(
      (acc, course) => acc + (course.hidden ? 0 : course.course.credit),
      0,
    ),
  );

  $effect(() => {
    selectedSchedule.schedule.forEach(
      (course, index) =>
        (selectedSchedule.schedule[index].conflicted = isConflicted(course)),
    );
  });
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
      bind:name={selectedSchedule.name}
      onCancel={() => (showRenameScheduleModal = false)}
      onConfirm={() => (showRenameScheduleModal = false)}
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
      onConfirm={(schedule: ScheduleListItem) => {
        scheduleList.push(schedule);
        selectedSchedule = schedule;
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
        scheduleList = scheduleList.filter(
          (schedule) => schedule !== selectedSchedule,
        );
        selectedSchedule = scheduleList[0];
        showDeleteScheduleModal = false;
      }}
    />
  </Modal>

  <div class="flex w-full flex-1 overflow-hidden">
    <div
      class="
            flex hidden max-w-[50vw] min-w-90 flex-1
            flex-col overflow-hidden
            border-r border-neutral-200
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
    >
      <SelectTimetable
        class="border-b border-neutral-200 px-2 py-5"
        options={scheduleList}
        bind:value={selectedSchedule}
      />
      <SelectedCourse
        variant="detailed"
        bind:schedule={cartInfo.items}
        class="border-b border-neutral-200"
      />

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

        <div class="hidden">
          <EditSchedule
            bind:selectedSchedule
            {scheduleList}
            onRename={() => (showRenameScheduleModal = true)}
            onDuplicate={duplicateCurrentSchedule}
            onAddSchedule={() => (showCreateScheduleModal = true)}
            onDelete={() => (showDeleteScheduleModal = true)}
          />
        </div>
      </div>
      <div class="bg-surface overflow-x-scroll p-8" bind:this={timetableDiv}>
        <div class="min-w-[600px]">
          <Timetable startTime={7}>
            {#each selectedSchedule.schedule as courseSchedule}
              {@render timeTableCourse(courseSchedule)}
            {/each}
          </Timetable>
        </div>
      </div>
      <div class="mx-5 mb-5 flex justify-end text-lg font-bold">
        หน่วยกิตรวม {totalCredit} / 22
      </div>

      <div class="flex hidden">
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
    days={examDateOrder.midterms.map((time) => formatDate(new Date(time)))}
  >
    {#each examDateOrder.midterms as key, index}
      {#each examsData.midterms[key] as exam}
        <TimetableCourseCard
          course={{
            name: exam.course.name,
            code: exam.course.code,
            bldg: '',
            room: '',
            section: exam.selectedSection,
          }}
          col={formatExamColumn(exam.course.midterm?.date) - 7}
          row={index}
          length={exam.course.midterm?.duration ?? 3}
          color={exam.colorVariant}
        />
      {/each}
    {/each}
  </Timetable>

  <div class="my-5 text-xl font-bold">Finals</div>
  <Timetable
    startTime={7}
    days={examDateOrder.finals.map((time) => formatDate(new Date(time)))}
  >
    {#each examDateOrder.finals as key, index}
      {#each examsData.finals[key] as examCourse}
        <TimetableCourseCard
          course={{
            name: examCourse.course.name,
            code: examCourse.course.code,
            bldg: '',
            room: '',
            section: examCourse.selectedSection,
          }}
          col={formatExamColumn(examCourse.course.final?.date) - 7}
          row={index}
          length={examCourse.course.final?.duration ?? 3}
          color={examCourse.colorVariant}
        />
      {/each}
    {/each}
  </Timetable>
{/snippet}

{#snippet examList()}
  <div class="flex items-center justify-center">
    <div class="my-5 inline-flex space-x-5">
      <div class="flex-1">
        <span class="text-2xl font-bold">Midterm</span>

        {#each Object.keys(examsData.midterms).sort(examSort) as key}
          <div class="my-5">
            <ExamCard
              date={key == '0'
                ? 'ยังไม่ประกาศ'
                : formatDate(new Date(Number(key)))}
              data={examsData.midterms[Number(key)].map((course) => {
                const { id, course: courseData, colorVariant } = course;

                return {
                  id: String(id),
                  colour: isMidtermConflict(
                    course,
                    examsData.midterms[Number(key)],
                  )
                    ? 'error'
                    : (colorVariant as StatusColour),
                  time: formatExamTime(
                    courseData.midterm?.date,
                    courseData.midterm?.duration,
                  ),
                  subject: courseData.name,
                } as Exam;
              })}
            />
          </div>
        {/each}
      </div>
      <div class="flex-1">
        <span class="text-2xl font-bold">Finals</span>

        {#each Object.keys(examsData.finals).sort(examSort) as key}
          <div class="my-5">
            <ExamCard
              date={key == '0'
                ? 'ยังไม่ประกาศ'
                : formatDate(new Date(Number(key)))}
              data={examsData.finals[Number(key)].map((course) => {
                const { id, course: courseData, colorVariant } = course;

                return {
                  id: String(id),
                  colour: isFinalsConflict(
                    course,
                    examsData.finals[Number(key)],
                  )
                    ? 'error'
                    : (colorVariant as StatusColour),
                  time: formatExamTime(
                    courseData.final?.date,
                    courseData.final?.duration,
                  ),
                  subject: courseData.name,
                } as Exam;
              })}
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
{/snippet}

{#snippet timeTableCourse({
  course,
  selectedSection,
  hidden,
  colorVariant,
  conflicted,
}: CourseSchedule)}
  {#if !hidden}
    {#each course.sections[selectedSection] || [] as period}
      <TimetableCourseCard
        onclick={() => (showViewCourseModal = true)}
        course={{
          name: course.name,
          code: course.code,
          bldg: period.building,
          room: period.room,
          section: selectedSection,
        }}
        length={period.duration}
        color={conflicted ? 'conflict' : (colorVariant ?? 'primary')}
        row={getColumnFromDay(period.day)}
        col={period.startTime - 7}
      />
    {/each}
  {/if}
{/snippet}
