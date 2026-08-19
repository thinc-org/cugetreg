<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { useSession } from '$lib/auth-client';
  import ExamsList from '$lib/components/exams-list.svelte';
  import TimetableBlockGroup from '$lib/components/timetable-block-group.svelte';
  import { useCartActions } from '$lib/stores/user-cart';
  import {
    calculateCredit,
    createElementScreenshot,
    getDays,
    getLatestTime,
    getMaxCredit,
    TIMETABLE_DEFAULT_END,
    TIMETABLE_DEFAULT_START,
  } from '$lib/utils/schedule';

  import { Eye, Info } from '@lucide/svelte';
  import { isAxiosError } from 'axios';
  import { Download } from 'lucide-svelte';
  import toast from 'svelte-french-toast';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { CustomizeScrollbar } from '@cugetreg/ui/atoms/customize-scrollbar';
  import { TimeTable as Timetable } from '@cugetreg/ui/atoms/timetable';
  import { YearSemesterChip } from '@cugetreg/ui/atoms/yearsemester-chip';
  import { Footer } from '@cugetreg/ui/organisms/footer';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  // TODO: Fix jank
  const owner = $derived(data.data.owner);
  const cart = $derived(data.data.cartData.cart);
  const exams = $derived(data.data.cartData.schedule.exams);

  // ================ HOOKS ================

  const session = useSession();
  const { importCart } = useCartActions();

  // ================ STATES ================

  let timetableDiv = $state<HTMLElement | undefined>();
  let innerWidth = $state(1024);

  // TODO: Add this
  let _selectedCartItemId = $state<string | undefined>(undefined);

  let scheduleTableRef = $state<HTMLElement | null>(null);

  // ================ DERIVED ================

  const scheduleDays = $derived(getDays(cart.items));
  const scheduleEndTime = $derived(
    getLatestTime(cart.items, TIMETABLE_DEFAULT_END),
  );

  const totalCredit = $derived(calculateCredit(cart.items));
  const maxCredit = $derived(getMaxCredit(cart.semester));

  function handleTimetableScreenshot() {
    createElementScreenshot(`${cart.name}_timetable`, timetableDiv);
  }

  async function handleImportTimetable() {
    try {
      await importCart(data.data.cartData);
      goto(resolve('/schedule'));
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        toast.error('Something went wrong importing timetable.', {
          position: 'bottom-right',
        });
      }
    }
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
              <span class="text-button2 shrink-0">โดย {owner}</span>

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
              <Download size={20} strokeWidth={2.5} class="text-on-surface" />
              <span class="text-on-surface font-medium">บันทึกภาพ</span>
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
            <Timetable
              startTime={TIMETABLE_DEFAULT_START}
              periodPerDay={scheduleEndTime - TIMETABLE_DEFAULT_START}
              days={scheduleDays}
            >
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
            หน่วยกิตรวม {totalCredit} / {maxCredit}
          </div>
        </div>
        <ExamsList {cart} {exams} />
      </div>
    </div>
  </div>
  <Footer />
</div>

{#if $session.data}
  <div
    class="fixed inset-x-0 bottom-8 z-50 mx-auto flex w-fit items-center justify-center"
  >
    <Button
      class="bg-primary w-[calc(100vw-2rem)] max-w-100 text-white shadow-lg"
      onclick={handleImportTimetable}>เพิ่มเข้าตารางของฉัน</Button
    >
  </div>
{/if}
