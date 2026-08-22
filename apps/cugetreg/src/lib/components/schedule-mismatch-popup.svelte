<script lang="ts">
  import {
    getSemesterShortOptions,
    getYearOptions,
  } from '$lib/semesterOptions';
  import { useCartActions } from '$lib/stores/user-cart';

  import { Plus } from '@lucide/svelte';

  import { Modal } from '@cugetreg/ui/atoms/modal';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
  } from '@cugetreg/ui/molecules/select';
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
    currentScheduleId: string;
    onConfirm: (scheduleId: string) => boolean | Promise<boolean>;
    onClose: () => void;
  }

  let {
    schedules,
    expectedYear,
    expectedSemester,
    expectedProgram,
    currentScheduleId = $bindable(),
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

  let selectedId = $derived(
    matchingSchedules.length > 0 ? matchingSchedules[0].id : '',
  );

  let selectedLabel = $derived.by(() => {
    if (selectedId === '') return 'สร้างตารางเรียนใหม่...';
    const found = matchingSchedules.find((s) => s.id === selectedId);
    return found ? found.name : 'สร้างตารางเรียนใหม่...';
  });

  let showCreateScheduleModal = $state(false);
  let isConfirming = $state(false);

  function setSelectedId(value: string) {
    selectedId = value;
    if (value === 'NEW') showCreateScheduleModal = true;
  }

  async function handleConfirm() {
    if (selectedId === 'NEW' || selectedId === '') {
      return;
    }
    const found = matchingSchedules.find((s) => s.id === selectedId);
    if (!found) {
      return;
    }
    isConfirming = true;
    try {
      const confirmed = await onConfirm(selectedId);
      if (confirmed) onClose();
    } finally {
      isConfirming = false;
    }
  }

  const { createCart } = useCartActions();

  const yearOptions = getYearOptions();
  const semesterOptions = getSemesterShortOptions();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center">
  {#if !showCreateScheduleModal}
    <div class="absolute inset-0 flex items-center justify-center bg-black/40">
      <button
        type="button"
        class="absolute inset-0 h-full w-full cursor-default bg-transparent"
        onclick={onClose}
        disabled={isConfirming}
        aria-label="Close modal"
      ></button>

      <div
        class="bg-surface-bright relative w-full max-w-[420px] rounded-3xl p-8"
      >
        <h2 class="text-primary mb-4 text-center text-xl font-semibold">
          ตารางเรียนไม่ตรงกับภาค/ปีที่คุณเลือก
        </h2>
        <p class="text-on-surface mb-2 text-center text-sm">
          กรุณาเลือกตารางที่สอดคล้องกับภาค/ปีที่คุณเลือกใหม่
        </p>

        <div class="relative mb-8">
          <Select type="single" bind:value={() => selectedId, setSelectedId}>
            <SelectTrigger
              class="border-surface-container text-primary bg-surface-bright w-full rounded-xl border px-4 py-3 text-left text-[15px]"
              aria-label="Select table"
            >
              {selectedLabel}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <div class="max-h-[200px] overflow-y-auto">
                  {#each matchingSchedules as schedule (schedule.id)}
                    <SelectItem
                      value={schedule.id}
                      label={schedule.name}
                      aria-label={schedule.name}
                    >
                      {schedule.name}
                    </SelectItem>
                  {/each}
                </div>

                <div
                  class="border-surface-container-low bg-surface-bright border-t p-1"
                >
                  <SelectItem
                    value="NEW"
                    label="เพิ่มตาราง"
                    aria-label="เพิ่มตาราง"
                  >
                    <div
                      class="text-on-surface flex items-center gap-2 font-bold"
                    >
                      <Plus size={16} />
                      เพิ่มตาราง
                    </div>
                  </SelectItem>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="flex gap-4">
          <!-- TODO: Remove hard-coded color -->
          <button
            type="button"
            onclick={onClose}
            disabled={isConfirming}
            class="bg-surface-container-low text-on-surface hover:bg-surface-container flex-1 rounded-xl py-2 text-[15px] font-bold transition-colors"
          >
            ยกเลิก
          </button>
          <!-- TODO: Remove hard-coded color -->
          <button
            type="button"
            onclick={handleConfirm}
            disabled={isConfirming}
            class="bg-primary text-on-primary hover:bg-primary-hover flex-1 rounded-xl py-2 text-[15px] font-bold transition-colors"
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
      {yearOptions}
      {semesterOptions}
      onConfirm={async (schedule: TimetableMetaData) => {
        if (
          String(schedule.academicYear) !== String(expectedYear) ||
          schedule.semester !== expectedSemester ||
          schedule.semesterType !== expectedProgram
        ) {
          return;
        }
        await createCart(
          schedule.name,
          schedule.isPublic,
          schedule.semesterType,
          schedule.semester,
          schedule.academicYear,
        );
        showCreateScheduleModal = false;
        if (currentScheduleId) {
          selectedId = currentScheduleId;
        } else {
          selectedId =
            matchingSchedules.length > 0 ? matchingSchedules[0].id : '';
        }
      }}
      onCancel={() => {
        showCreateScheduleModal = false;
        selectedId =
          matchingSchedules.length > 0 ? matchingSchedules[0].id : '';
      }}
    />
  </Modal>
</div>
