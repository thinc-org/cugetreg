<script lang="ts">
  import { Chip } from '@cugetreg/ui/atoms/chip';
  import { browser } from '$app/environment';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import ExamsList from '$lib/components/exams-list.svelte';
  import {
    calculateCredit,
    createElementScreenshot,
    getViewCourseData,
  } from '$lib/utils/schedule';

  import { Eye, Info } from '@lucide/svelte';
  import { Copy, Download, Share2 } from 'lucide-svelte';
  import { getContext } from 'svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { CustomizeScrollbar } from '@cugetreg/ui/atoms/customize-scrollbar';
  import { IconButton } from '@cugetreg/ui/atoms/icon-button';
  import { Input } from '@cugetreg/ui/atoms/input';
  import { Modal } from '@cugetreg/ui/atoms/modal';
  import { Switch } from '@cugetreg/ui/atoms/switch';
  import { TimeTable as Timetable } from '@cugetreg/ui/atoms/timetable';
  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';
  import { EditSchedule } from '@cugetreg/ui/molecules/edit-schedule';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import { ViewCourse } from '@cugetreg/ui/organisms/view-course';
  import TimetableBlockGroup from '$lib/components/timetable-block-group.svelte';
  import type { PageProps } from './$types';
  import { YearSemesterChip } from '@cugetreg/ui/atoms/yearsemester-chip';

  let { data }: PageProps = $props();

  const cart = $derived(data.data.cart);
  const exams = $derived(data.data.schedule.exams);

  // ================ HOOKS ================

  // const userCart = getUserCartStore();
  // const {
  //   renameCart,
  //   copyCart,
  //   deleteCart,
  //   createCart,
  //   pinCart,
  //   updateCourse,
  //   removeCourse,
  //   switchCart,
  //   updateCartMeta,
  // } = useCartActions();

  // ================ STATES ================

  let timetableDiv = $state<HTMLElement | undefined>();
  let innerWidth = $state(1024);

  let selectedCartItemId = $state<string | undefined>(undefined);

  let scheduleTableRef = $state<HTMLElement | null>(null);

  // ================ DERIVED ================

  const totalCredit = $derived(calculateCredit(cart.items));

  function handleTimetableScreenshot() {
    createElementScreenshot(`${cart.name}_timetable`, timetableDiv);
  }
</script>

<svelte:window bind:innerWidth />

<div class="relative flex h-full flex-col bg-white">
  <div class="relative flex flex-1 justify-center">
    <div class="flex min-h-full flex-col">
      <div class="mx-auto w-full max-w-[1200px] flex-1 p-6 lg:p-10">
        <div
          class="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div
            class="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-end lg:gap-4"
          >
            <div class="flex items-end gap-2">
              <Eye size={32} class="inline shrink-0" />

              <span
                class="text-[20px] font-bold break-words md:text-[30px] lg:text-4xl"
              >
                {cart.name}
              </span>
            </div>

            <div class="flex items-end gap-4">
              <!-- TODO: Add student ID, currently not in API -->
              <span class="text-button2 shrink-0">โดย 6738087921</span>

              <YearSemesterChip
                studyProgram={cart.studyProgram}
                year={cart.academicYear}
                semester={cart.semester}
                class="shrink-0 text-[12px]"
              />
            </div>
          </div>

          <!-- Mobile: compact download button -->
          <div class="lg:hidden">
            <Button
              class="m-0 flex items-center gap-1 border border-gray-200 bg-white"
              onclick={handleTimetableScreenshot}
            >
              <Download size={20} strokeWidth={2.5} class="text-[#353745]" />
              <span class="font-medium text-[#353745]">บันทึกภาพ</span>
            </Button>
          </div>

          <!-- Desktop: full download button -->
          <div class="hidden items-end lg:flex">
            <Button
              variant="outlined"
              color="neutral"
              onclick={handleTimetableScreenshot}
            >
              <Download />
              บันทึกภาพ
            </Button>
          </div>
        </div>
        <div
          class="bg-surface overflow-x-auto pt-4 pb-0 [scrollbar-width:none] lg:px-8 lg:py-8 [&::-webkit-scrollbar]:hidden"
          bind:this={timetableDiv}
          bind:this={scheduleTableRef}
        >
          <div class="min-w-150">
            <Timetable startTime={7}>
              {#each cart.items as course (course.id)}
                <TimetableBlockGroup {course} cartItems={cart.items} />
              {/each}
            </Timetable>
          </div>
        </div>
        <CustomizeScrollbar target={scheduleTableRef} />
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <Info class="stroke-error" size={16} />
            <span class="text-error">เพิ่มเข้าตารางของคุณเพื่อแก้ไข</span>
          </div>
          <div class="hidden items-center lg:mx-5 lg:flex lg:justify-end">
            หน่วยกิตรวม {totalCredit} / 22
          </div>
        </div>
        <ExamsList {cart} {exams} />
      </div>
    </div>
  </div>
  <Footer />
</div>

<div
  class="fixed inset-x-0 bottom-8 z-50 mx-auto flex w-fit items-center justify-center"
>
  <Button
    class="bg-primary w-[calc(100vw-2rem)] max-w-[400px] text-white shadow-lg"
    >เพิ่มเข้าตารางของฉัน</Button
  >
</div>
