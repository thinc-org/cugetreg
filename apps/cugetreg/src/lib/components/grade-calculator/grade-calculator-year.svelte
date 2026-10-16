<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';
  import { MediaQuery } from 'svelte/reactivity';

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

  const desktopMedia = new MediaQuery('min-width: 1280px', false);
  const termsPerView = $derived(desktopMedia.current ? 2 : 1);

  let selectedOffset = $state(0);
  const maxOffset = $derived(Math.max(0, year.terms.length - termsPerView));
  const offset = $derived(Math.min(selectedOffset, maxOffset));
  const visibleTerms = $derived(
    year.terms.slice(offset, offset + termsPerView),
  );
</script>

<section class="mt-8 md:mt-10">
  <div class="mb-3 flex items-center justify-between md:mb-5">
    <h2 class="text-on-surface text-base font-semibold md:text-2xl">
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
    class="border-primary grid overflow-hidden rounded-2xl border xl:grid-cols-2"
  >
    {#each visibleTerms as term, i (term.semester)}
      <GradeCalculatorTerm
        {term}
        bind:grades
        class={i === 0 ? 'border-primary xl:border-r' : ''}
      />
    {/each}
  </div>
</section>
