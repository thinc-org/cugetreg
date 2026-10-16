<script lang="ts">
  import { SEMESTER_LABEL_LONG } from '$lib/semesterOptions';

  import { cn } from '@cugetreg/utils';

  import { calculateGpa, sumCredits } from './grade';
  import GradeSelect from './grade-select.svelte';
  import type { PlanTerm } from './mock-data';

  interface GradeCalculatorTermProps {
    term: PlanTerm;
    grades: Record<string, string>;
    class?: string;
  }

  let {
    term,
    grades = $bindable(),
    class: className = '',
  }: GradeCalculatorTermProps = $props();

  const title = $derived(
    term.semester === 'SUMMER'
      ? SEMESTER_LABEL_LONG.SUMMER
      : `เทอม ${term.semester === 'FIRST' ? 1 : 2}`,
  );
</script>

<div class={cn('flex flex-1 flex-col', className)}>
  <div
    class="bg-primary-container flex items-center justify-between px-5 py-4 md:px-8 md:py-6"
  >
    <h3 class="text-primary text-lg font-semibold md:text-2xl">{title}</h3>
    <span
      class="text-on-primary-container rounded-full bg-white px-2 py-1 text-xs md:px-2.5 md:py-1.5 md:text-sm"
    >
      หน่วยกิตรวม {sumCredits(term.courses)}
    </span>
  </div>
  <table class="w-full text-sm md:text-base">
    <thead>
      <tr class="text-on-surface text-left">
        <th class="hidden w-1/4 pt-4 pb-2 pl-10 font-normal md:table-cell">
          รหัสวิชา
        </th>
        <th class="pt-4 pb-2 pl-6 font-normal md:pl-0">รายชื่อวิชา</th>
        <th class="w-[24%] pt-4 pb-2 text-center font-normal">หน่วยกิต</th>
        <th class="w-[14%] pt-4 pr-5 pb-2 text-right font-normal md:pr-10">
          <span class="inline-block w-10 text-center">เกรด</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each term.courses as course (course.id)}
        <tr class="text-on-surface">
          <td class="hidden py-3 pl-10 md:table-cell">{course.courseNo}</td>
          <td class="py-3 pl-6 md:pl-0">{course.courseName}</td>
          <td class="py-3 text-center">{course.credit}</td>
          <td class="py-3 pr-5 md:pr-10">
            <GradeSelect
              gradingType={course.gradingType}
              value={grades[course.id]}
              label={`เกรดวิชา ${course.courseNo}`}
              onChange={(grade) => {
                if (grade === undefined) delete grades[course.id];
                else grades[course.id] = grade;
              }}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div
    class="text-on-surface mt-auto flex items-center justify-between px-6 pt-4 pb-6 text-base font-semibold md:px-10 md:pt-5 md:pb-8 md:text-xl"
  >
    <span>GPA</span>
    <span>{calculateGpa(term.courses, grades).toFixed(2)}</span>
  </div>
</div>
