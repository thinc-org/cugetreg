<script lang="ts">
  import { useCartActions } from '$lib/stores/user-cart';

  import { ChevronDown, Plus } from '@lucide/svelte';

  import { Modal } from '@cugetreg/ui/atoms/modal';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';

  type Schedule = {
    id: string;
    name: string;
    academicYear: number | string;
    semester: string;
    studyProgram: string;
  };

  interface ScheduleMismatchPopupProps {
    schedules: Schedule[];
    expectedYear: string | number;
    expectedSemester: string;
    expectedProgram: string;
    onConfirm: (scheduleId: string) => void;
    onClose: () => void;
  }

  let {
    schedules,
    expectedYear,
    expectedSemester,
    expectedProgram,
    onConfirm,
    onClose,
  }: ScheduleMismatchPopupProps = $props();

  let matchingSchedules = $derived(
    schedules.filter(
      (c) =>
        String(c.academicYear) === String(expectedYear) &&
        c.semester === expectedSemester &&
        c.studyProgram === expectedProgram,
    ),
  );

  let isDropdownOpen = $state(false);
  let selectedId = $state<string | 'NEW'>(
    matchingSchedules.length > 0 ? matchingSchedules[0].id : 'NEW',
  );

  let selectedLabel = $derived.by(() => {
    if (selectedId === 'NEW') return 'สร้างตารางเรียนใหม่...';
    const found = matchingSchedules.find((s) => s.id === selectedId);
    return found ? found.name : 'กรุณาเลือกตาราง...';
  });

  let showCreateScheduleModal = $state(false);

  function handleConfirm() {
    if (selectedId !== 'NEW') {
      onConfirm(selectedId);
    }
    onClose();
  }

  const { createCart } = useCartActions();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center">
  {#if !showCreateScheduleModal}
    <div class="absolute inset-0 flex items-center justify-center bg-black/40">
      <button
        type="button"
        class="absolute inset-0 h-full w-full cursor-default bg-transparent"
        onclick={onClose}
        aria-label="Close modal"
      ></button>

      <div class="relative w-full max-w-[420px] rounded-3xl bg-white p-8">
        <h2 class="mb-4 text-center text-xl font-semibold text-[#4a70c6]">
          ตารางเรียนไม่ตรงกับภาค/ปีที่คุณเลือก
        </h2>
        <p class="mb-2 text-center text-sm text-gray-600">
          กรุณาเลือกตารางที่สอดคล้องกับภาค/ปีที่คุณเลือกใหม่
        </p>

        <div class="relative mb-8">
          <button
            onclick={() => (isDropdownOpen = !isDropdownOpen)}
            class="flex w-full items-center justify-between rounded-xl border border-[#b8c9e6] bg-white px-4 py-2 text-left text-[15px] text-[#4a70c6]"
          >
            <span class="truncate pr-4">{selectedLabel}</span>
            <ChevronDown
              size={20}
              class="text-[#4a70c6] transition-transform duration-200 {isDropdownOpen
                ? 'rotate-180'
                : ''}"
            />
          </button>

          {#if isDropdownOpen}
            <div
              class="absolute top-full left-0 z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
            >
              <div class="max-h-[200px] overflow-y-auto py-1">
                {#each matchingSchedules as schedule (schedule.id)}
                  <button
                    onclick={() => {
                      selectedId = schedule.id;
                      isDropdownOpen = false;
                    }}
                    class="w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-gray-50 {selectedId ===
                    schedule.id
                      ? 'font-regular bg-[#f0f4f8] text-[#4a70c6]'
                      : 'text-gray-700'}"
                  >
                    {schedule.name}
                  </button>
                {/each}
              </div>

              <div class="border-t border-gray-100 bg-white p-1">
                <button
                  onclick={() => {
                    selectedId = 'NEW';
                    showCreateScheduleModal = true;
                    isDropdownOpen = false;
                  }}
                  class="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#2b4c8a]"
                >
                  <Plus size={16} />
                  เพิ่มตาราง
                </button>
              </div>
            </div>
          {/if}
        </div>

        <div class="flex gap-4">
          <button
            onclick={onClose}
            class="flex-1 rounded-xl bg-[#f0f2f5] py-2 text-[15px] font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            ยกเลิก
          </button>
          <button
            onclick={handleConfirm}
            class="flex-1 rounded-xl bg-[#e3f0ff] py-2 text-[15px] font-bold text-[#2b4c8a] transition-colors hover:bg-[#d0e6ff]"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  {/if}

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
</div>
