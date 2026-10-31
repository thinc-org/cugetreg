<script lang="ts">
  import { Plus, Search, X } from '@lucide/svelte';
  import { Popover } from 'bits-ui';

  import { cn } from '@cugetreg/utils';

  type CourseCategory = 'gened' | 'elective';
  type CardColor = 'purple' | 'mint' | 'yellow';
  type Filter = 'all' | CourseCategory;

  interface SelectableCourse {
    id: string;
    CourseCode: string;
    CourseName: string;
    CourseCredit: number;
    category: CourseCategory;
    color: CardColor;
  }

  interface StudyPlanSelectCoursePopoverProps {
    courses?: SelectableCourse[];
    open?: boolean;
    onTriggerClick?: () => void;
    onSelectCourse?: (id: string) => void;
    onRemoveCourse?: (id: string) => void;
    onAddFromMainTimetable?: () => void;
  }

  const mockCourses: SelectableCourse[] = [
    {
      id: 'select-1',
      CourseCode: '0000000',
      CourseName: 'Course name',
      CourseCredit: 6,
      category: 'gened',
      color: 'yellow',
    },
    {
      id: 'select-2',
      CourseCode: '0000000',
      CourseName: 'Course name',
      CourseCredit: 6,
      category: 'elective',
      color: 'purple',
    },
    {
      id: 'select-3',
      CourseCode: '0000000',
      CourseName: 'Course name',
      CourseCredit: 3,
      category: 'elective',
      color: 'mint',
    },
    {
      id: 'select-4',
      CourseCode: '0000000',
      CourseName: 'Course name',
      CourseCredit: 3,
      category: 'gened',
      color: 'yellow',
    },
  ];

  let {
    courses = mockCourses,
    open = $bindable(false),
    onTriggerClick,
    onSelectCourse,
    onRemoveCourse,
    onAddFromMainTimetable,
  }: StudyPlanSelectCoursePopoverProps = $props();

  let filter = $state<Filter>('all');

  const filters: { value: Filter; label: string; class: string }[] = [
    { value: 'all', label: 'ทั้งหมด', class: 'border-[#353745]' },
    { value: 'gened', label: 'Gen ed', class: 'border-yellow-500' },
    { value: 'elective', label: 'วิชาเลือก', class: 'border-teal-500' },
  ];

  const colorClass: Record<CardColor, string> = {
    purple: 'border-indigo-500 bg-indigo-100',
    mint: 'border-teal-500 bg-teal-100',
    yellow: 'border-yellow-500 bg-yellow-100',
  };

  const filteredCourses = $derived(
    filter === 'all'
      ? courses
      : courses.filter((course) => course.category === filter),
  );
</script>

<Popover.Root bind:open>
  <Popover.Trigger
    class="flex min-h-[100px] w-[170px] flex-col items-center justify-center gap-3 rounded-[16px] border-2 border-[#4A70C6] bg-white text-[#353745] transition-colors hover:bg-blue-50"
    onclick={onTriggerClick}
  >
    <Plus size={40} strokeWidth={2.5} class="text-[#4A70C6]" />
    <span class="text-[16px] font-medium">เพิ่มรายวิชา</span>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      side="right"
      align="start"
      sideOffset={16}
      collisionPadding={16}
      class="z-50 flex max-h-[min(480px,var(--bits-floating-available-height))] w-[min(400px,calc(100vw-32px))] flex-col gap-4 rounded-[16px] border border-neutral-300 bg-white p-6 text-[#353745] shadow-lg"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-[20px] font-bold text-[#4A70C6]">เลือกวิชา</h2>
        <Popover.Close
          class="flex size-8 items-center justify-center transition-colors hover:text-black"
          aria-label="ปิด"
        >
          <X size={24} strokeWidth={1.5} />
        </Popover.Close>
      </div>

      <div class="flex items-center gap-2">
        {#each filters as item (item.value)}
          <button
            type="button"
            class={cn(
              'rounded-[8px] border-2 px-3 py-0.5 text-[14px] font-medium transition-colors',
              item.class,
              filter === item.value ? 'bg-neutral-100' : 'bg-white',
            )}
            aria-pressed={filter === item.value}
            onclick={() => (filter = item.value)}
          >
            {item.label}
          </button>
        {/each}
        <button
          type="button"
          class="ml-auto flex size-8 items-center justify-center transition-colors hover:text-black"
          aria-label="ค้นหารายวิชา"
        >
          <Search size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div
        class="-mr-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2"
      >
        {#each filteredCourses as course (course.id)}
          <div
            class={cn(
              'relative shrink-0 rounded-[16px] border-2 px-5 py-4',
              colorClass[course.color],
            )}
          >
            <button
              type="button"
              class="flex w-full flex-col text-left"
              onclick={() => onSelectCourse?.(course.id)}
            >
              <span class="font-regular text-[16px] leading-6">
                {course.CourseCode}
              </span>
              <span class="font-regular text-[16px] leading-6">
                {course.CourseName}
              </span>
              <span class="font-regular mt-1 text-[16px] leading-6">
                {course.CourseCredit} หน่วยกิต
              </span>
            </button>
            <button
              type="button"
              class="absolute top-4 right-4 flex size-6 items-center justify-center transition-colors hover:text-black"
              aria-label="ลบรายวิชา"
              onclick={() => onRemoveCourse?.(course.id)}
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        {:else}
          <p class="py-8 text-center text-neutral-400">ไม่พบรายวิชา</p>
        {/each}
      </div>

      <button
        type="button"
        class="w-full rounded-[8px] bg-blue-100 py-2 text-[16px] font-medium text-[#253A70] transition-colors hover:bg-blue-200"
        onclick={onAddFromMainTimetable}
      >
        เพิ่มจากตารางเรียนหลัก
      </button>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
