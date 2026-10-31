<script lang="ts">
  import { ChevronUp } from '@lucide/svelte';

  import { cn } from '@cugetreg/utils';

  import StudyPlanCourseCard from './study-plan-course-card.svelte';
  import StudyPlanSelectCoursePopover from './study-plan-select-course-popover.svelte';

  type CardColor = 'pink' | 'purple' | 'mint' | 'yellow';

  interface StudyPlanCourse {
    id: string;
    CourseCode: string;
    CourseName: string;
    CourseCredit: number;
    color?: CardColor;
    removable?: boolean;
  }

  interface StudyPlanTermProps {
    TermName: string;
    RequiredFacultyCredits: number;
    RequiredFacultyCreditsTarget: number;
    getEdCredit: number;
    getEdCreditTarget: number;
    totalCredits: number;
    totalCreditsTarget: number;
    courses: StudyPlanCourse[];
    open?: boolean;
    onAddCourse?: () => void;
    onRemoveCourse?: (id: string) => void;
    class?: string;
  }

  let {
    TermName,
    RequiredFacultyCredits,
    RequiredFacultyCreditsTarget,
    getEdCredit,
    getEdCreditTarget,
    totalCredits,
    totalCreditsTarget,
    courses,
    open = $bindable(true),
    onAddCourse,
    onRemoveCourse,
    class: className = '',
  }: StudyPlanTermProps = $props();
</script>

<section
  class={cn(
    'overflow-hidden rounded-[12px] border border-[#4A70C6] bg-white',
    className,
  )}
>
  <button
    type="button"
    class="flex w-full items-center justify-between gap-4 bg-blue-100 px-8 py-6 text-left"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <h2 class="text-[24px] font-bold text-[#4A70C6]">{TermName}</h2>
    <div
      class="flex flex-1 items-center justify-end gap-14 text-[18px] font-medium text-[#253A70]"
    >
      <p>
        วิชาบังคับคณะ {RequiredFacultyCredits}/{RequiredFacultyCreditsTarget}
      </p>
      <p>Gen-Ed {getEdCredit}/{getEdCreditTarget}</p>
      <p class="rounded-full bg-white px-6 py-2">
        หน่วยกิตรวม {totalCredits}/{totalCreditsTarget}
      </p>
      <ChevronUp
        size={24}
        strokeWidth={3}
        class={cn('transition-transform', !open && 'rotate-180')}
      />
    </div>
  </button>

  {#if open}
    <div class="flex flex-wrap gap-5 px-8 py-8">
      {#each courses as course (course.id)}
        <StudyPlanCourseCard
          CourseCode={course.CourseCode}
          CourseName={course.CourseName}
          CourseCredit={course.CourseCredit}
          color={course.color}
          removable={course.removable}
          onRemove={() => onRemoveCourse?.(course.id)}
        />
      {/each}

      <StudyPlanSelectCoursePopover onTriggerClick={onAddCourse} />
    </div>
  {/if}
</section>
