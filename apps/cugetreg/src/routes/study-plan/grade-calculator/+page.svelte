<script lang="ts">
  import { resolve } from '$app/paths';
  import { getSavedGrades } from '$lib/components/grade-calculator/grade';
  import GradeCalculatorSummary from '$lib/components/grade-calculator/grade-calculator-summary.svelte';
  import GradeCalculatorYear from '$lib/components/grade-calculator/grade-calculator-year.svelte';
  import { mockStudyPlans } from '$lib/components/grade-calculator/mock-data';
  import { GOOGLE_FORM_URL } from '$lib/constants';

  import { ChevronLeft, Ellipsis, Grid2x2 } from '@lucide/svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { ReportProblem } from '@cugetreg/ui/molecules/report-problem';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { Footer } from '@cugetreg/ui/organisms/footer';

  let currentStudyPlanId = $state(mockStudyPlans[0].id);
  let grades = $state(getSavedGrades(mockStudyPlans[0]));

  const studyPlan = $derived(
    mockStudyPlans.find((plan) => plan.id === currentStudyPlanId) ??
      mockStudyPlans[0],
  );
  const allCourses = $derived(
    studyPlan.years.flatMap((year) =>
      year.terms.flatMap((term) => term.courses),
    ),
  );
</script>

<div class="relative flex min-h-screen flex-col bg-white">
  <div class="w-full flex-1 px-5 pt-8 pb-8 sm:px-8 md:pt-14 lg:px-12">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-4">
        <button
          type="button"
          aria-label="กลับ"
          class="hidden items-center justify-center rounded-lg p-1 transition-colors hover:bg-gray-100 active:bg-gray-200 md:flex"
          onclick={() => history.back()}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 class="text-on-surface text-xl font-bold md:text-[28px]">
          คำนวณเกรด
        </h1>
      </div>
      <div class="flex items-center gap-6">
        <Button
          variant="outlined"
          onclick={() => (grades = getSavedGrades(studyPlan))}
        >
          คืนค่าเดิม
        </Button>
        <Button href={resolve('/study-plan')} class="hidden md:inline-flex">
          จัดแผนการเรียน
        </Button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3 md:mt-8">
      <p class="text-on-surface flex gap-6 text-base">
        <span>{studyPlan.faculty}</span>
        <span>{studyPlan.major}</span>
      </p>
      <div class="flex items-center gap-2">
        <Select.Root
          type="single"
          value={currentStudyPlanId}
          onValueChange={(id) => {
            currentStudyPlanId = id;
            grades = getSavedGrades(studyPlan);
          }}
        >
          <Select.Trigger
            class="h-8 w-48 rounded-md border-neutral-300 px-2.5 text-base"
          >
            {studyPlan.name}
          </Select.Trigger>
          <Select.Content align="end">
            <Select.Group>
              {#each mockStudyPlans as plan (plan.id)}
                <Select.Item value={plan.id} label={plan.name} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <button
          type="button"
          aria-label="ตัวเลือกเพิ่มเติม"
          class="text-on-surface flex size-8 items-center justify-center rounded-md border border-neutral-300 hover:bg-gray-100"
        >
          <Ellipsis size={18} />
        </button>
      </div>
    </div>

    {#key studyPlan.id}
      {#each studyPlan.years as year, i (year.academicYear)}
        <GradeCalculatorYear {year} yearNumber={i + 1} bind:grades />
      {/each}
    {/key}

    <GradeCalculatorSummary courses={allCourses} {grades} />
  </div>

  <div class="mt-auto w-full border-t bg-white">
    <Footer />
  </div>

  <a
    href={resolve('/study-plan')}
    aria-label="จัดแผนการเรียน"
    class="bg-primary fixed right-6 bottom-20 z-40 flex size-16 items-center justify-center rounded-full text-white shadow-sm md:hidden"
  >
    <Grid2x2 size={28} />
  </a>

  <ReportProblem href={GOOGLE_FORM_URL} />
</div>
