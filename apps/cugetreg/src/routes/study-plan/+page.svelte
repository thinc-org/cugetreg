<script lang="ts">
  import StudyPlanTerm from '$lib/components/study-plan/study-plan-term.svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
  import {
    FACULTIES,
    type FacultyId,
    UNKNOWN_FACULTY,
  } from '@cugetreg/utils/faculty';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const faculty = $derived(
    FACULTIES[data.user.faculty as FacultyId] ?? UNKNOWN_FACULTY,
  );

  const mockTerms = [
    {
      TermName: 'เทอม 1',
      RequiredFacultyCredits: 12,
      RequiredFacultyCreditsTarget: 19,
      getEdCredit: 0,
      getEdCreditTarget: 3,
      totalCredits: 20,
      totalCreditsTarget: 22,
      courses: [
        {
          id: 'term-1-2110101',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'pink',
        },
        {
          id: 'term-1-2110201',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'pink',
        },
        {
          id: 'term-1-2110301',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 6,
          color: 'pink',
        },
        {
          id: 'term-1-2301107',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'purple',
          removable: true,
        },
        {
          id: 'term-1-5500111',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'mint',
          removable: true,
        },
      ],
    },
    {
      TermName: 'เทอม 2',
      RequiredFacultyCredits: 9,
      RequiredFacultyCreditsTarget: 18,
      getEdCredit: 3,
      getEdCreditTarget: 3,
      totalCredits: 18,
      totalCreditsTarget: 22,
      courses: [
        {
          id: 'term-2-2110102',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'pink',
        },
        {
          id: 'term-2-2110202',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'pink',
        },
        {
          id: 'term-2-2302101',
          CourseCode: '0000000',
          CourseName: 'Course name',
          CourseCredit: 3,
          color: 'yellow',
          removable: true,
        },
      ],
    },
  ] as const;
</script>

<div class="flex h-full flex-col gap-8 overflow-auto bg-white px-6 py-8 md:px-12">
  <div class="flex flex-row justify-between gap-6">
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold text-black">จัดตารางเรียน</h1>
      <div class="flex flex-row gap-6 text-[16px] text-black">
        <p>คณะ{faculty.th}</p>
        <p>สาขา{data.user.department || '-'}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <Button
        variant="outlined"
        color="neutral"
        class="text-[#4A70C6] ring-[#4A70C6] hover:bg-[#4A70C6] hover:text-white"
      >
        คืนค่าเดิม
      </Button>
      <Button class="bg-[#4A70C6] text-white hover:ring-[#4A70C6]">
        คำนวนเกรด
      </Button>
    </div>
  </div>

  <div class="flex flex-col gap-6">
    {#each mockTerms as term (term.TermName)}
      <StudyPlanTerm
        TermName={term.TermName}
        RequiredFacultyCredits={term.RequiredFacultyCredits}
        RequiredFacultyCreditsTarget={term.RequiredFacultyCreditsTarget}
        getEdCredit={term.getEdCredit}
        getEdCreditTarget={term.getEdCreditTarget}
        totalCredits={term.totalCredits}
        totalCreditsTarget={term.totalCreditsTarget}
        courses={[...term.courses]}
      />
    {/each}
  </div>
</div>
