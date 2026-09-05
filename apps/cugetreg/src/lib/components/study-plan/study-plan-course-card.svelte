<script lang="ts">
  import { X } from '@lucide/svelte';
  import { cn } from '@cugetreg/utils';
  type CardColor = 'pink' | 'purple' | 'mint' | 'yellow';

  interface StudyPlanCourseCardProps {
    CourseCode: string;
    CourseName: string;
    CourseCredit: number;
    color?: CardColor;
    removable?: boolean;
    onRemove?: () => void;
    class?: string;
  }

  let {
    CourseCode,
    CourseName,
    CourseCredit,
    color = 'pink',
    removable = false,
    onRemove,
    class: className = '',
  }: StudyPlanCourseCardProps = $props();

  const colorClass = $derived(
    {
      pink: 'border-pink-500 bg-pink-300',
      purple: 'border-indigo-500 bg-indigo-300',
      mint: 'border-teal-500 bg-teal-300',
      yellow: 'border-yellow-500 bg-yellow-300',
    }[color],
  );
</script>

<article
  class={cn(
    'relative flex min-h-[100px] w-[170px] flex-col justify-center rounded-[16px] border-2 px-5 py-4 text-[#353745]',
    colorClass,
    className,
  )}
>
  {#if removable}
    <button
      type="button"
      class="absolute top-4 right-4 flex size-6 items-center justify-center text-[#353745] transition-colors hover:text-black"
      aria-label="ลบรายวิชา"
      onclick={onRemove}
    >
      <X size={20} strokeWidth={3} />
    </button>
  {/if}

  <p class="text-[16px] leading-6 font-regular">{CourseCode}</p>
  <p class="text-[16px] leading-6 font-regular">{CourseName}</p>
  <p class="mt-1 text-[16px] leading-6 font-regular">
    {CourseCredit} หน่วยกิต
  </p>
</article>
