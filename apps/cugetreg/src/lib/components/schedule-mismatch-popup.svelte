<script lang="ts">
  import { useCartActions } from '$lib/stores/user-cart';

  import { ChevronDown, Plus } from '@lucide/svelte';

  import { Modal } from '@cugetreg/ui/atoms/modal';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';

  import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '@cugetreg/ui/molecules/select';

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

  let selectedId = $state<string>(
    matchingSchedules.length > 0 ? matchingSchedules[0].id : '',
  );

  let previousId = $state(selectedId);

  let selectedLabel = $derived.by(() => {
    if (selectedId === 'NEW' || selectedId === '') return 'สร้างตารางเรียนใหม่...';
    const found = matchingSchedules.find((s) => s.id === selectedId);
    return found ? found.name : 'สร้างตารางเรียนใหม่...';
  });

  let showCreateScheduleModal = $state(false);

  function handleConfirm() {
    if (selectedId === 'NEW' || selectedId === '') {
      return;
    }
    const found = matchingSchedules.find((s) => s.id === selectedId);
    if (!found) {
      return;
    }
    if (selectedId !== 'NEW') {
      onConfirm(selectedId);
    }
    onClose();
  }

  const { createCart } = useCartActions();

  $effect(() => {
    if(selectedId === 'NEW' && previousId !== 'NEW'){
      showCreateScheduleModal = true;
    }
    previousId = selectedId;
  });
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
          <Select type="single" bind:value={selectedId}>
            <SelectTrigger
              class="w-full rounded-xl border border-[#b8c9e6] bg-white px-4 py-3 text-left text-[15px] text-[#2b4c8a]" 
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

                <div class="border-t border-gray-100 bg-white p-1">
                  <SelectItem 
                    value="NEW" 
                    label="เพิ่มตาราง" 
                    aria-label="เพิ่มตาราง"
                  >
                    <div class="flex items-center gap-2 font-bold text-gray-600">
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
      onConfirm={async (schedule: TimetableMetaData) => {
        const newCartId = await createCart(
          schedule.name,
          schedule.isPublic,
          schedule.semesterType,
          schedule.semester,
          schedule.academicYear,
        );
        showCreateScheduleModal = false;
        if (newCartId) {
          selectedId = newCartId; 
        } else {
          selectedId = matchingSchedules.length > 0 ? matchingSchedules[0].id : '';
        }
      }}
      onCancel={() => {
        showCreateScheduleModal = false;
        selectedId = matchingSchedules.length > 0 ? matchingSchedules[0].id : '';
      }}
    />
  </Modal>
</div>