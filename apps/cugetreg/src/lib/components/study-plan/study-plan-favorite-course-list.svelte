<script lang="ts">
  import { Plus, Trash2 } from '@lucide/svelte';
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
  import type { Type as GenedType } from '@cugetreg/ui/atoms/gened-chip';
  import { cn } from '@cugetreg/utils';

  interface FavoriteCourse {
    id: string;
    courseCode: string;
    courseName: string;
    genEdType?: GenedType;
  }

  interface StudyPlanFavoriteCourseListProps {
    courses: FavoriteCourse[];
    class?: string;
    onAddCourse?: (id: string) => void;
    onRemoveCourse?: (id: string) => void;
  }

  let {
    courses,
    class: className = '',
    onAddCourse,
    onRemoveCourse,
  }: StudyPlanFavoriteCourseListProps = $props();
</script>

<div class={cn('flex flex-col', className)}>
  {#each courses as course (course.id)}
    <div class="flex items-center gap-3 py-3">
      <button
        type="button"
        class="text-primary flex shrink-0 items-center justify-center p-1"
        aria-label="เพิ่มรายวิชา"
        onclick={() => onAddCourse?.(course.id)}
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex items-center gap-2">
          <span class="text-[10px]/[15px] text-neutral-400">
            {course.courseCode}
          </span>
          {#if course.genEdType}
            <GenedChip type={course.genEdType} class="px-2 py-0 text-[10px]" />
          {/if}
        </div>
        <span class="text-on-surface truncate text-xs">
          {course.courseName}
        </span>
      </div>

      <button
        type="button"
        class="shrink-0 rounded-md p-1 text-neutral-700 transition-colors hover:bg-neutral-100"
        aria-label="ลบวิชาที่ถูกใจ"
        onclick={() => onRemoveCourse?.(course.id)}
      >
        <Trash2 size={18} strokeWidth={2.5} />
      </button>
    </div>
  {/each}
</div>
