<script lang="ts">
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import StudyPlanTerm from '$lib/components/study-plan/study-plan-term.svelte';
  import { getCartSelectionController } from '$lib/stores/cart-selection.svelte';
  import {
    CART_PROMISE_KEY,
    type CartPromise,
    getUserCartStore,
  } from '$lib/stores/user-cart';

  import { BookMarked, Calculator, ChevronDown, Loader2, Menu } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { getContext } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { slide } from 'svelte/transition';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { EditSchedule } from '@cugetreg/ui/molecules/edit-schedule';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
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

  const userCart = getUserCartStore();
  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);
  const cartSelection = getCartSelectionController();

  let sidebarExpanded = $state(true);
  let openPanel = $state<string | null>(null);
  let activePanel = $state<string | null>('sidebar');
  let isCreditOpen = $state(true);
  let isFavoriteOpen = $state(true);
  let currentStudyPlanId = $state('study-plan-1');
  const mobileMedia = new MediaQuery('max-width: 767px', false);
  const isMobile = $derived(mobileMedia.current);

  function toggleSidebar() {
    sidebarExpanded = !sidebarExpanded;
    if (sidebarExpanded) openPanel = null;
  }

  function focusCredit() {
    if (sidebarExpanded && isCreditOpen && !isFavoriteOpen) {
      isCreditOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    isCreditOpen = true;
    isFavoriteOpen = false;
    activePanel = 'credit_only';
  }

  function focusFavorite() {
    if (sidebarExpanded && isFavoriteOpen && !isCreditOpen) {
      isFavoriteOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    isCreditOpen = false;
    isFavoriteOpen = true;
    activePanel = 'favorite_only';
  }

  const mockStudyPlans = [
    {
      id: 'study-plan-1',
      name: 'แผนการเรียน 1',
    },
  ];

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

<div class="relative flex h-full flex-col overflow-hidden bg-white">
  <div class="relative flex flex-1 overflow-hidden">
    <AppSidebar
      showSidebar={!isMobile}
      panelWidth="490px"
      bind:expanded={sidebarExpanded}
      bind:openPanel
      bind:activePanel
    >
      {#snippet iconItems()}
        <Sidebar.MenuItem>
          <div class="-mt-[0px]">
            <Sidebar.MenuButton
              onclick={toggleSidebar}
              isActive={sidebarExpanded && activePanel === 'sidebar'}
              size="lg"
              tooltipContent="เมนู"
              class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <Menu size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <div class="mt-[18px]">
            <Sidebar.MenuButton
              onclick={focusCredit}
              isActive={activePanel === 'credit_only'}
              size="lg"
              tooltipContent="หน่วยกิต"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <Calculator size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <div class="mt-[-10px]">
            <Sidebar.MenuButton
              onclick={focusFavorite}
              isActive={activePanel === 'favorite_only'}
              size="lg"
              tooltipContent="วิชาที่ถูกใจ"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <BookMarked size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
      {/snippet}

      {#snippet panelContent({ expanded })}
        {#if expanded}
          <div class="relative mb-6 flex flex-col gap-2">
            {#await cartPromise}
              <div
                class="flex items-center justify-center gap-2 px-2 py-8 text-gray-400"
              >
                <Loader2 class="animate-spin" size={24} />
                <span class="text-sm">กำลังโหลดตารางเรียน...</span>
              </div>
            {:then}
              <SelectTimetable
                class="px-2 pt-5"
                options={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                bind:value={
                  () => cartSelection.selectedId,
                  (id) => void cartSelection.select(id)
                }
                semester={$userCart.currentCart.semester}
                semesterType={$userCart.currentCart.studyProgram}
                academicYear={$userCart.currentCart.academicYear}
              />
            {:catch}
              <div
                class="flex items-center justify-center gap-2 px-2 py-8 text-sm text-red-400"
              >
                โหลดตารางเรียนไม่สำเร็จ
              </div>
            {/await}
          </div>
          <hr class="mb-6 border-t border-neutral-100" />

          {@render CreditContent()}
          {@render FavoriteContent()}
        {/if}
      {/snippet}

      <div class="flex min-h-full flex-col gap-8 bg-white px-6 py-8 md:px-12">
        <div class="flex flex-col gap-4">
          <div class="flex flex-row justify-between gap-6">
            <h1 class="text-3xl font-bold text-black">จัดแผนการเรียน</h1>

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

          <div class="flex w-full flex-row items-center justify-between gap-6">
            <div class="flex flex-row items-center gap-6 text-[16px] text-black">
              <p>คณะ{faculty.th}</p>
              <p>สาขา{data.user.department || '-'}</p>
            </div>
            <div class="flex shrink-0 items-center">
              <EditSchedule
                class="gap-2 lg:gap-0"
                bind:currentScheduleId={currentStudyPlanId}
                schedules={mockStudyPlans}
              />
            </div>
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
    </AppSidebar>
  </div>
</div>

{#snippet CreditContent(collapsible = true)}
  <div>
    {#if collapsible}
      <button
        onclick={() => (isCreditOpen = !isCreditOpen)}
        aria-expanded={isCreditOpen}
        class="mb-4 flex w-full items-center justify-between"
      >
        <h2 class="text-on-surface text-lg/[20px] font-medium">หน่วยกิต</h2>
        <ChevronDown
          size={20}
          class="text-gray-400 transition-transform duration-200 {isCreditOpen
            ? 'rotate-180'
            : ''}"
        />
      </button>
    {:else}
      <div class="mb-4 flex w-full items-center justify-between">
        <h2 class="text-on-surface text-lg/[20px] font-medium">หน่วยกิต</h2>
      </div>
    {/if}
    {#if !collapsible || isCreditOpen}
      <div transition:slide={{ duration: 250, easing: cubicOut }}></div>
    {/if}
    <hr class="mb-6 border-t border-neutral-100" />
  </div>
{/snippet}

{#snippet FavoriteContent(collapsible = true)}
  <div>
    {#if collapsible}
      <button
        onclick={() => (isFavoriteOpen = !isFavoriteOpen)}
        aria-expanded={isFavoriteOpen}
        class="mb-4 flex w-full items-center justify-between"
      >
        <h2 class="text-on-surface text-lg/[20px] font-medium">วิชาที่ถูกใจ</h2>
        <ChevronDown
          size={20}
          class="text-gray-400 transition-transform duration-200 {isFavoriteOpen
            ? 'rotate-180'
            : ''}"
        />
      </button>
    {:else}
      <div class="mb-4 flex w-full items-center justify-between">
        <h2 class="text-on-surface text-lg/[20px] font-medium">วิชาที่ถูกใจ</h2>
      </div>
    {/if}
    {#if !collapsible || isFavoriteOpen}
      <div transition:slide={{ duration: 250, easing: cubicOut }}></div>
    {/if}
    <hr class="mb-6 border-t border-neutral-100" />
  </div>
{/snippet}
