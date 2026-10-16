<script lang="ts">
  import { calculateGpa, sumCredits } from './grade';
  import type { PlanCourse } from './mock-data';

  interface GradeCalculatorSummaryProps {
    courses: PlanCourse[];
    grades: Record<string, string>;
  }

  let { courses, grades }: GradeCalculatorSummaryProps = $props();

  const gpax = $derived(calculateGpa(courses, grades));

  const status = $derived.by(() => {
    const hasGrade = courses.some(
      (course) =>
        course.gradingType === 'LETTER' && grades[course.id] !== undefined,
    );
    if (!hasGrade) return null;

    if (gpax >= 3.6) return 'เกียรตินิยมอันดับ 1';
    if (gpax >= 3.25) return 'เกียรตินิยมอันดับ 2';
    if (gpax < 2) return 'เกือบผ่านแล้ว สู้อีกนิด';
    if (gpax < 2.25) return 'ผ่านเฉียดฉิว';
    return null;
  });
</script>

<div class="mt-8 mb-10 flex flex-col items-center gap-1.5 md:mt-12 md:mb-16">
  {#if status}
    <p class="text-primary text-xl/8 font-semibold md:text-[28px]/9">
      {status}
    </p>
  {/if}
  <p class="text-on-surface text-xl/8 font-medium md:text-[28px]/9">
    GPAX
    <span class="text-primary ml-2 font-semibold">{gpax.toFixed(2)}</span>
  </p>
  <p class="text-on-surface text-base md:text-xl">
    หน่วยกิตรวม <span class="ml-1 font-semibold">{sumCredits(courses)}</span>
  </p>
</div>
