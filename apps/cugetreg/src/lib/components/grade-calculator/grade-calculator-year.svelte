<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  import GradeCalculatorTerm from './grade-calculator-term.svelte';
  import type { PlanYear } from './mock-data';

  interface GradeCalculatorYearProps {
    year: PlanYear;
    yearNumber: number;
    grades: Record<string, string>;
  }

  let {
    year,
    yearNumber,
    grades = $bindable(),
  }: GradeCalculatorYearProps = $props();

  let selectedOffset = $state(0);
  const maxOffset = $derived(Math.max(0, year.terms.length - 2));
  const offset = $derived(Math.min(selectedOffset, maxOffset));
  const visibleTerms = $derived(year.terms.slice(offset, offset + 2));
</script>

<section class="mt-10">
  <div class="mb-5 flex items-center justify-between">
    <h2 class="text-on-surface text-2xl font-semibold">
      ปี {yearNumber} ปีการศึกษา {year.academicYear}
    </h2>
    {#if maxOffset > 0}
      <div class="flex items-center gap-1">
        <button
          type="button"
          aria-label="เทอมก่อนหน้า"
          class="text-primary rounded p-1 disabled:text-neutral-200"
          disabled={offset === 0}
          onclick={() => (selectedOffset = offset - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="เทอมถัดไป"
          class="text-primary rounded p-1 disabled:text-neutral-200"
          disabled={offset === maxOffset}
          onclick={() => (selectedOffset = offset + 1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    {/if}
  </div>
  <div
    class="border-primary grid grid-cols-2 overflow-hidden rounded-2xl border"
  >
    {#each visibleTerms as term, i (term.semester)}
      <GradeCalculatorTerm
        {term}
        bind:grades
        class={i === 0 ? 'border-primary border-r' : ''}
      />
    {/each}
  </div>
</section>
