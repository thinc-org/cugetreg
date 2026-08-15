<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { api } from '$lib/api';
  import { tryCatch } from '$lib/async-handler';
  import { useSession } from '$lib/auth-client';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import ScheduleMismatchPopup from '$lib/components/schedule-mismatch-popup.svelte';
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import { CourseResults } from '$lib/home/course-results.svelte';
  import { createHomeUrlSync } from '$lib/home/home-url-sync.svelte';
  import { infiniteScroll } from '$lib/home/infinite-scroll';
  import {
    normalizeDayMapper,
    normalizeGenedMapper,
    sortByMapper,
    studyProgramMapper,
  } from '$lib/mapper';
  import {
    getSemesterDisplayOptions,
    SEMESTER_LABEL_LONG,
    SEMESTER_LABEL_SHORT,
  } from '$lib/semesterOptions';
  import { getCartSelectionController } from '$lib/stores/cart-selection.svelte';
  import { loginPopupState } from '$lib/stores/login-popup.svelte';
  import { searchState } from '$lib/stores/search.svelte';
  import {
    CART_PROMISE_KEY,
    type CartPromise,
    getUserCartStore,
    useCartActions,
  } from '$lib/stores/user-cart';

  import {
    ArrowUpDown,
    BookMarked,
    ChevronDown,
    Filter,
    Loader2,
    Menu,
    TriangleAlert,
    X,
  } from '@lucide/svelte';
  import { isAxiosError } from 'axios';
  import { getContext, onDestroy, untrack } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { MediaQuery } from 'svelte/reactivity';
  import { fade, slide } from 'svelte/transition';
  import toast from 'svelte-french-toast';

  import { Input } from '@cugetreg/ui/atoms/input';
  import { CourseCard } from '@cugetreg/ui/molecules/course-card';
  import { FloatingButton } from '@cugetreg/ui/molecules/floating-button';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import { Filter as FilterBar } from '@cugetreg/ui/organisms/filter-bar';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
  import type { Day } from '@cugetreg/utils/types';
  import {
    type Semester,
    type SortBy,
    type StudyProgram,
    studyProgram,
  } from '@cugetreg/zod-schemas';

  const semesterOptions = getSemesterDisplayOptions();

  let lastUpdatedLabel = $state('');

  let sidebarExpanded = $state(true);
  let openPanel = $state<string | null>(null);
  let activePanel = $state<string | null>(null);
  const mobileMedia = new MediaQuery('max-width: 767px', false);
  const isMobile = $derived(mobileMedia.current);

  $effect(() => {
    untrack(() => fetchLastUpdated());
  });

  // let searchQuery = $state('');
  // let debouncedSearchQuery = $state('');
  // let searchTimeout: ReturnType<typeof setTimeout> | undefined;
  //
  // let isScheduleDropdownOpen = $state(false);
  let isFilterOpen = $state(true);
  let isSelectedOpen = $state(true);
  let activeModal = $state<'filter' | 'selected' | null>(null);

  let selectedGenEds = $state<string[]>([]);
  let selectedFaculties = $state<string[]>([]);
  let selectedDays = $state<string[]>([]);
  let selectedEval = $state<string[]>([]);
  let startTime = $state('');
  let endTime = $state('');
  let fitSchedule = $state(false);
  let noConditions = $state(false);
  let favoriteOnly = $state(false);
  let currentProgram = $state<StudyProgram>('S');
  let currentSemester = $state<Semester>('FIRST');
  let currentAY = $state<number>(2568);
  let currentSort = $state<SortBy>('NAME');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  createHomeUrlSync({
    read: () => ({
      selectedGenEds,
      selectedFaculties,
      selectedDays,
      selectedEval,
      startTime,
      endTime,
      fitSchedule,
      noConditions,
      favoriteOnly,
      currentProgram,
      currentSemester,
      currentAY,
    }),
    apply: (state) => {
      selectedGenEds = state.selectedGenEds;
      selectedFaculties = state.selectedFaculties;
      selectedDays = state.selectedDays;
      selectedEval = state.selectedEval;
      startTime = state.startTime;
      endTime = state.endTime;
      fitSchedule = state.fitSchedule;
      noConditions = state.noConditions;
      favoriteOnly = state.favoriteOnly;
      currentProgram = state.currentProgram;
      currentSemester = state.currentSemester;
      currentAY = state.currentAY;
    },
  });

  const mobileSortOptions = [
    { label: 'จำนวนที่นั่งมาก', field: 'CAPACITY_SUM', dir: 'desc' as const },
    { label: 'จำนวนที่นั่งน้อย', field: 'CAPACITY_SUM', dir: 'asc' as const },
    { label: 'เหลือที่นั่งมาก', field: 'REMAINING_SUM', dir: 'desc' as const },
    { label: 'เหลือที่นั่งน้อย', field: 'REMAINING_SUM', dir: 'asc' as const },
    { label: 'ชื่อวิชา A-Z', field: 'NAME', dir: 'asc' as const },
    { label: 'ชื่อวิชา Z-A', field: 'NAME', dir: 'desc' as const },
  ];

  const sortOptions = [
    { label: 'ชื่อวิชา', field: 'NAME' },
    { label: 'จำนวนที่นั่ง', field: 'CAPACITY_SUM' },
    { label: 'เหลือที่นั่ง', field: 'REMAINING_SUM' },
  ];

  function selectMobileSort(field: SortBy, dir: 'asc' | 'desc') {
    currentSort = field;
    sortDirection = dir;
  }

  let showMismatchPopup = $state(false);
  let pendingCourse = $state<{ courseNo: string; sectionNo: number } | null>(
    null,
  );
  let localSelectedSections: Record<string, number> = {};

  const session = useSession();
  const isLoggedIn = $derived(Boolean($session.data));
  const userCart = getUserCartStore();
  const cartSelection = getCartSelectionController();
  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);
  const { addCourse, removeCourse, updateCourse } = useCartActions();
  const stopCartSelectionSync = cartSelection.onSelected((cart) => {
    currentProgram = cart.studyProgram as StudyProgram;
    currentAY = cart.academicYear;
    currentSemester = cart.semester as Semester;
  });
  onDestroy(stopCartSelectionSync);

  const floatingOptions = [
    {
      label: 'ตัวกรอง',
      icon: Filter,
      onClick: () => {
        activeModal = 'filter';
      },
    },
    {
      label: 'วิชาที่เลือก',
      icon: BookMarked,
      onClick: () => {
        activeModal = 'selected';
      },
    },
  ];

  function mapCourse(item: any) {
    const { course: c, courseInfo: ci, reviewCount } = item;

    const totalMaxSeat = item.stats?.capacitySum || 0;
    const totalCurrentSeat =
      (item.stats?.capacitySum || 0) - (item.stats?.remainingSum || 0);

    const allDays = (c.sections ?? []).flatMap((s: any) =>
      (s.classes ?? []).map((cl: any) => cl.dayOfWeek),
    );

    const validDays = Array.from(
      new Set(
        allDays
          .map(normalizeDayMapper)
          .filter((d: Day | undefined): d is Day => Boolean(d)),
      ),
    );

    return {
      recommended: false,
      course: {
        ...c,
        courseInfo: ci,
        code: c.courseNo,
        name: ci.abbrName || ci.courseNameEn || ci.courseNameTh || '-',
        credit: Number(ci.credit) || 0,
        maxseat: totalMaxSeat,
        seat: totalCurrentSeat,
        gened: normalizeGenedMapper(c.genEdType),
        review: reviewCount || 0,
        rating: item.rating || 0,
        days: validDays,
        gradingType: ci.gradingType,
        isFavorite: c.isFavorite ?? false,
      },
    };
  }

  async function fetchLastUpdated() {
    const [response, err] = await tryCatch(api.get('/courses/last-updated'));
    if (err || !response.data.lastUpdated) return;

    const date = new Date(response.data.lastUpdated);
    const buddhistYear = String(date.getFullYear() + 543).slice(-2);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    lastUpdatedLabel = `วันที่ ${dd}/${mm}/${buddhistYear}  เวลา ${hh}.${min} น.`;
  }

  const courseResults = new CourseResults({
    mapCourse,
    getKey: (item) => item.course.code,
  });
  const courses = $derived(courseResults.courses);
  const isLoading = $derived(courseResults.isLoading);
  const hasMore = $derived(courseResults.hasMore);
  const totalResults = $derived(courseResults.totalResults);
  const infiniteScrollOptions = {
    onIntersect: () => courseResults.loadMore(),
  };

  $effect(() => {
    const fitCartId = fitSchedule ? $userCart.currentCartId : undefined;
    if (fitCartId) $userCart.currentCart;

    courseResults.reset({
      academicYear: currentAY,
      semester: currentSemester,
      studyProgram: currentProgram,
      search: searchState.debounced.trim(),
      sortBy: currentSort,
      sortOrder: sortDirection,
      noPrereq: noConditions,
      genEdTypes: [...selectedGenEds],
      faculties: [...selectedFaculties],
      days: [...selectedDays],
      assessment: selectedEval[0],
      timeStart: startTime || undefined,
      timeEnd: endTime || undefined,
      fitCartId,
      favorite: favoriteOnly && isLoggedIn,
    });
  });

  onDestroy(() => courseResults.destroy());

  const studyProgramLabel = $derived(studyProgramMapper(currentProgram));

  // --- Left-rail icon interaction model ---
  function openFull() {
    sidebarExpanded = true;
    isFilterOpen = true;
    isSelectedOpen = true;
    activePanel = 'sidebar';
  }

  $effect(() => {
    if (!favoriteOnly || $session.isPending || $session.data) return;
    favoriteOnly = false;
    loginPopupState.show = true;
  });

  function setFavorite(courseCode: string, isFavorite: boolean) {
    courseResults.courses = courseResults.courses.map((item) =>
      item.course.code === courseCode
        ? { ...item, course: { ...item.course, isFavorite } }
        : item,
    );
  }

  async function handleToggleFavorite(courseItem: any) {
    if (!$session.data) {
      loginPopupState.show = true;
      return;
    }

    const code = courseItem.course.code;
    const nextFavorite = !courseItem.course.isFavorite;

    setFavorite(code, nextFavorite);

    const [, error] = await tryCatch(
      nextFavorite
        ? api.put(`/courses/${code}/favorite`)
        : api.delete(`/courses/${code}/favorite`),
    );

    if (!error) return;

    setFavorite(code, !nextFavorite);
    if (isAxiosError(error) && error.response?.status === 401) {
      loginPopupState.show = true;
      return;
    }
    toast.error('Failed to remove favorite course, please try again', {
      position: 'bottom-right',
    });
  }

  function toggleSidebar() {
    if (sidebarExpanded) {
      sidebarExpanded = false;
    } else {
      openFull();
    }
  }
  // The rail icons close their section only when it is already the sole open
  // one. In every other state (collapsed, both sections open, or focused on the
  // other section) the press acts as a fresh focus.
  function focusFilter() {
    if (sidebarExpanded && isFilterOpen && !isSelectedOpen) {
      isFilterOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    isFilterOpen = true;
    isSelectedOpen = false;
    activePanel = 'filter_only';
  }
  function focusSelected() {
    if (sidebarExpanded && isSelectedOpen && !isFilterOpen) {
      isSelectedOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    isFilterOpen = false;
    isSelectedOpen = true;
    activePanel = 'selected_only';
  }

  function goToSchedule() {
    activeModal = null;
    goto(resolve('/schedule'));
  }

  function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  }

  function isMismatch(): boolean {
    const currentCart = $userCart.currentCart;
    if (!currentCart || !$session.data) return false;
    const isYearMismatch =
      String(currentCart.academicYear) !== String(currentAY);
    const isProgramMismatch = currentCart.studyProgram !== currentProgram;
    const isSemesterMismatch = currentCart.semester !== currentSemester;
    return isYearMismatch || isSemesterMismatch || isProgramMismatch;
  }

  function handleToggleCourse(courseItem: any) {
    if (!$session.data) {
      loginPopupState.show = true;
      return;
    }

    const { code, sections } = courseItem.course;
    const courseInSchedule = $userCart.currentCart?.items.find(
      (cls) => cls.courseNo === code,
    );
    const alreadySelectedSec =
      localSelectedSections[code] || getSelectedSection(code);

    if (isMismatch()) {
      if (alreadySelectedSec) {
        pendingCourse = {
          courseNo: code,
          sectionNo: Number(alreadySelectedSec),
        };
      } else {
        const firstAvailableSection =
          sections.find((sec: any) => !sec.closed) || sections[0];
        if (firstAvailableSection) {
          pendingCourse = {
            courseNo: code,
            sectionNo: firstAvailableSection.sectionNo,
          };
        }
      }
      showMismatchPopup = true;
      return;
    }

    if (!courseInSchedule) {
      if (alreadySelectedSec) {
        addCourse(code, Number(alreadySelectedSec));
        return;
      }
      const firstAvailableSection =
        sections.find((sec: any) => !sec.closed) || sections[0];
      if (firstAvailableSection) {
        addCourse(code, firstAvailableSection.sectionNo);
      }
    } else {
      removeCourse(courseInSchedule.id);
      localSelectedSections[code] = 0;
    }
  }

  function handleSelectSection(courseItem: any, sectionNo: string) {
    const { code } = courseItem.course;
    localSelectedSections[code] = Number(sectionNo);

    if (!$session.data) {
      loginPopupState.show = true;
      return;
    }

    if (isMismatch()) {
      pendingCourse = { courseNo: code, sectionNo: Number(sectionNo) };
      showMismatchPopup = true;
      return;
    }

    const courseInSchedule = $userCart.currentCart?.items.find(
      (cls) => cls.courseNo === code,
    );

    if (courseInSchedule) {
      updateCourse(courseInSchedule.id, { sectionNo: Number(sectionNo) });
    } else {
      pendingCourse = { courseNo: code, sectionNo: Number(sectionNo) };
    }
  }

  async function handleCartSelection(scheduleId: string) {
    await cartSelection.select(scheduleId);
  }

  async function handleScheduleChange(scheduleId: string): Promise<boolean> {
    const course = pendingCourse;
    if (!course) return false;

    try {
      const cart = await cartSelection.select(scheduleId);
      if (!cart) return false;

      const itemId = await addCourse(course.courseNo, course.sectionNo);
      if (!itemId) return false;

      pendingCourse = null;
      return true;
    } catch (error) {
      console.error('Failed to change schedule and add course:', error);
      return false;
    }
  }

  function getSectionOptions(courseItem: any) {
    return (courseItem.course.sections ?? []).map((sec: any) => ({
      value: String(sec.sectionNo),
      label: `เซค ${sec.sectionNo}`,
    }));
  }

  function getSelectedSection(courseCode: string): string {
    const entry = $userCart.currentCart?.items.find(
      (s: any) => s.courseNo === courseCode,
    );
    return entry ? String(entry.sectionNo) : '';
  }

  function onSearchFilter() {
    if (openPanel === 'filter_only') openPanel = null;
    if (activeModal === 'filter') activeModal = null;
  }

  let contextLabel = $derived(
    `ในปีการศึกษา ${currentAY} ${SEMESTER_LABEL_LONG[currentSemester]} หลักสูตร${studyProgramLabel}`,
  );
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
        <!--
          Each icon is nudged with a fixed margin so it lines up with its
          section header in the collapsed panel. These are pure layout offsets:
          nothing recomputes them, so the icons never shift when a section is
          opened or closed. Tune the three values if the headers change height.
        -->
        <Sidebar.MenuItem>
          <div class="-mt-[5px]">
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
          <div class="mt-[5px]">
            <Sidebar.MenuButton
              onclick={focusFilter}
              isActive={activePanel === 'filter_only'}
              size="lg"
              tooltipContent="ตัวกรอง"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <Filter size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        {#if $session.data}
          <Sidebar.MenuItem>
            <div class="mt-[-10px]">
              <Sidebar.MenuButton
                onclick={focusSelected}
                isActive={activePanel === 'selected_only'}
                size="lg"
                tooltipContent="วิชาที่เลือก"
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
              >
                <BookMarked size="20" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </div>
          </Sidebar.MenuItem>
        {/if}
      {/snippet}
      {#snippet panelContent({ expanded })}
        {#if expanded && $session.data}
          <div class="relative mb-6 flex flex-col gap-2">
            {#await cartPromise}
              <div
                class="flex items-center justify-center gap-2 border-b border-neutral-100 px-2 py-8 text-gray-400"
              >
                <Loader2 class="animate-spin" size={24} />
                <span class="text-sm">กำลังโหลดตารางเรียน...</span>
              </div>
            {:then}
              <SelectTimetable
                class="border-b border-neutral-100 px-2 py-5"
                options={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                bind:value={
                  () => cartSelection.selectedId,
                  (id) => void handleCartSelection(id)
                }
                semester={$userCart.currentCart.semester}
                semesterType={$userCart.currentCart.studyProgram}
                academicYear={$userCart.currentCart.academicYear}
              />
            {:catch}
              <div
                class="flex items-center justify-center gap-2 border-b border-neutral-100 px-2 py-8 text-sm text-red-400"
              >
                โหลดตารางเรียนไม่สำเร็จ
              </div>
            {/await}
          </div>
          <hr class="mb-6 border-t border-neutral-100" />
        {/if}

        {#if expanded}
          {@render FilterContent()}
        {/if}

        {#if expanded && $session.data}
          {@render SelectedContent()}
        {/if}

        {#if expanded}
          {@render WarningContent()}
        {/if}
      {/snippet}
      <div class="flex min-h-full flex-col">
        <div class="mx-auto w-full max-w-[1200px] flex-1 p-4 md:p-8 lg:p-12">
          <div
            class="mb-2 flex flex-row items-center justify-between gap-2 md:gap-4"
          >
            <div class="flex items-baseline gap-2 md:gap-3">
              <h1
                class="text-xl font-bold text-[#4A70C6] md:text-4xl md:text-black"
              >
                วิชาเรียน
              </h1>
              <span
                class="text-[10px] font-medium whitespace-nowrap text-gray-400 md:text-sm"
                >({totalResults} ผลลัพธ์)</span
              >
            </div>

            <div class="relative flex shrink-0 gap-2">
              <Select.Root type="single" bind:value={currentProgram}>
                <Select.Trigger
                  class="flex h-6 items-center gap-2 rounded-full border border-neutral-800 px-2 py-0.5 text-[10px] font-bold transition-colors hover:bg-gray-50 focus:ring-offset-0 md:h-auto md:px-3 md:py-1.5 md:py-2 md:text-sm md:text-xs"
                >
                  {studyProgramLabel}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each studyProgram.options as option (option)}
                      <Select.Item
                        value={option}
                        label={option}
                        aria-label={option}
                        role="option"
                        check={true}
                      >
                        {studyProgramMapper(option)}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>

              <Select.Root
                type="single"
                bind:value={
                  () => `${currentAY}/${currentSemester}`,
                  (v) => {
                    const [ay, sem] = v.split('/');
                    currentAY = Number(ay);
                    currentSemester = sem as Semester;
                  }
                }
              >
                <Select.Trigger
                  class="flex h-6 items-center gap-2 rounded-full border border-neutral-800 px-2 py-1.5 text-[10px] font-bold transition-colors hover:bg-gray-50 focus:ring-offset-0 md:h-auto md:px-3 md:py-2 md:text-sm md:text-xs"
                >
                  {`${currentAY} / ${SEMESTER_LABEL_SHORT[currentSemester]}`}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each semesterOptions as option (`${option.value.ay}/${option.value.semester}`)}
                      <Select.Item
                        value={`${option.value.ay}/${option.value.semester}`}
                        label={option.label}
                        aria-label={option.label}
                        role="option"
                        check={true}
                      >
                        {option.label}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <div class="mb-10 flex flex-col gap-1">
            <div class="flex flex-row items-end gap-3 md:gap-6">
              <div class="flex flex-1 flex-col gap-1">
                <span class="ml-1 hidden text-xs text-gray-400 md:flex"
                  >ค้นหา...</span
                >
                <Input
                  bind:value={searchState.query}
                  onkeydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder={isMobile
                    ? 'ค้นหา...'
                    : 'พิมพ์ชื่อวิชา รหัสวิชา หรือคำค้นหาอื่นๆ...'}
                  class="h-10 w-full rounded-xl border-none bg-[#F1F3F7] px-4 text-sm font-medium placeholder:text-neutral-300 focus:ring-2 focus:ring-blue-500 md:h-12 md:px-6 md:text-lg"
                />
              </div>
              <!-- Mobile sort: "เรียงตาม" + dropdown (Select) -->
              <div class="flex h-12 items-center self-end md:hidden">
                <Select.Root
                  type="single"
                  value={`${currentSort}:${sortDirection}`}
                  onValueChange={(v) => {
                    const [field, dir] = v.split(':');
                    selectMobileSort(field as SortBy, dir as 'asc' | 'desc');
                  }}
                >
                  <Select.Trigger
                    showArrow={false}
                    class="text-primary h-auto w-auto gap-1.5 rounded-none border-0 bg-transparent p-0 text-base font-bold whitespace-nowrap shadow-none hover:opacity-80 focus:ring-0 focus:ring-offset-0"
                  >
                    <span
                      class="flex items-center gap-1 text-xs md:gap-1.5 md:text-base"
                    >
                      เรียงตาม
                      <ArrowUpDown
                        size={isMobile ? 16 : 20}
                        strokeWidth={2.5}
                      />
                    </span>
                  </Select.Trigger>
                  <Select.Content align="end" class="w-48">
                    <Select.Group>
                      {#each mobileSortOptions as opt (opt.label)}
                        <Select.Item
                          value={`${opt.field}:${opt.dir}`}
                          label={opt.label}
                        >
                          {opt.label}
                        </Select.Item>
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>

              <!-- Desktop sort: original "จัดลำดับตาม" layout -->
              <div class="hidden w-full flex-col gap-1 md:flex md:w-64">
                <span class="ml-1 text-[10px] font-bold text-gray-400 uppercase"
                  >จัดลำดับตาม</span
                >
                <div class="relative flex items-center gap-3">
                  <Select.Root bind:value={currentSort} type="single">
                    <Select.Trigger
                      class="flex h-12 flex-1 items-center justify-between rounded-xl bg-[#F1F3F7] px-5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200"
                    >
                      {sortByMapper(currentSort)}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        {#each sortOptions as option (option.field)}
                          <Select.Item
                            value={option.field}
                            label={option.label}
                            role="option"
                          />
                        {/each}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                  <button
                    aria-label="sort direction"
                    onclick={toggleSortDirection}
                    class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-[#004494] transition-all hover:bg-blue-50"
                  >
                    <div
                      class="transition-transform duration-300 {sortDirection ===
                      'asc'
                        ? 'rotate-180'
                        : 'rotate-0'}"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path d="M12 5v14M19 12l-7 7-7-7" /></svg
                      >
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile: stacked warning card -->
          <div
            class="bg-warning-container/60 mb-6 flex items-center gap-2 rounded-2xl px-5 py-4 text-sm leading-relaxed text-neutral-600 md:hidden"
          >
            <TriangleAlert
              size={16}
              strokeWidth={2}
              class="text-warning-hover shrink-0"
            />
            <div>
              <p class="font-sans text-[10px] text-[#353745]">
                ข้อมูลอาจมีการเปลี่ยนแปลง<br />
                โปรดตรวจสอบข้อมูลกับสำนักทะเบียนทุกครั้งก่อนลงทะเบียนเรียน<br />
                {#if lastUpdatedLabel}
                  Update ข้อมูลล่าสุด&nbsp;&nbsp;{lastUpdatedLabel}
                {/if}
              </p>
            </div>
          </div>

          <!-- Desktop: single-row warning bar -->
          <div
            class="bg-warning-container/60 mb-6 hidden items-center justify-between gap-4 rounded-2xl px-5 py-3 text-sm leading-relaxed text-neutral-600 md:flex"
          >
            <div class="flex items-center gap-3">
              <TriangleAlert
                size={24}
                strokeWidth={2}
                class="text-warning-hover shrink-0"
              />
              <span
                >ข้อมูลอาจมีการเปลี่ยนแปลง
                โปรดตรวจสอบข้อมูลกับสำนักทะเบียนทุกครั้งก่อนลงทะเบียนเรียน</span
              >
            </div>
            {#if lastUpdatedLabel}
              <span class="shrink-0 whitespace-nowrap">
                Update ข้อมูลล่าสุด&nbsp;&nbsp;{lastUpdatedLabel}
              </span>
            {/if}
          </div>

          <div class="grid grid-cols-1 gap-x-5 gap-y-6 pb-10 md:grid-cols-2">
            {#if courses.length === 0 && !isLoading}
              <div
                class="col-span-full flex flex-col items-center justify-center gap-2 py-24 text-center"
              >
                <TriangleAlert
                  size={72}
                  strokeWidth={1.5}
                  class="mb-2 text-[#4A6CF7]"
                />
                <p class="text-lg font-medium text-[#1C1B1F]">
                  ไม่พบรายวิชา{searchState.debounced.trim()
                    ? ` ${searchState.debounced.trim()}`
                    : ''}
                </p>
                <p class="text-base text-gray-500">{contextLabel}</p>
                <p class="mt-3 text-sm leading-relaxed text-gray-400">
                  ลองเปลี่ยนตัวเลือกภาคเรียน ปีการศึกษา หรือหลักสูตร<br />
                  ในตารางเรียน แล้วลองใหม่อีกครั้งนะ!
                </p>
              </div>
            {:else}
              {@const params = new URLSearchParams({
                studyProgram: currentProgram,
                academicYear: String(currentAY),
                semester: currentSemester,
              })}
              {#each courses as item (item.course.code)}
                <CourseCard
                  course={item.course}
                  recommended={item.recommended}
                  selected={$userCart.currentCart?.items.some(
                    (v) => v.courseNo === item.course.code,
                  ) ?? false}
                  onSelect={() => handleToggleCourse(item)}
                  sections={getSectionOptions(item)}
                  selectedSection={getSelectedSection(item.course.code)}
                  onSelectSection={(v: string) => handleSelectSection(item, v)}
                  favorite={item.course.isFavorite ?? false}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                  class="w-full max-w-full md:w-full"
                  courseUrl={`/course-page/${item.course.code}?${params.toString()}`}
                />
              {/each}

              {#if hasMore && !isLoading}
                <div
                  use:infiniteScroll={infiniteScrollOptions}
                  class="col-span-full flex h-24 items-center justify-center opacity-50"
                >
                  <Loader2 class="animate-spin text-gray-400" size={24} />
                </div>
              {/if}
            {/if}

            {#if isLoading}
              <div
                class="col-span-full flex h-64 flex-col items-center justify-center gap-3 text-gray-400"
              >
                <Loader2 class="animate-spin" size={40} />
                <p>กำลังโหลดข้อมูลวิชา...</p>
              </div>
            {/if}
          </div>
        </div>
        {#if showMismatchPopup}
          <ScheduleMismatchPopup
            schedules={$userCart.cartList ?? []}
            expectedYear={currentAY}
            expectedProgram={currentProgram}
            currentScheduleId={cartSelection.selectedId}
            expectedSemester={currentSemester}
            onConfirm={handleScheduleChange}
            onClose={() => (showMismatchPopup = false)}
          />
        {/if}
        <div class="mt-auto w-full border-t bg-white">
          <Footer />
        </div>
      </div>
    </AppSidebar>
  </div>
  <div class="lg:hidden">
    {#if !activeModal}
      <div transition:fade={{ duration: 200 }}>
        <FloatingButton options={floatingOptions} />
      </div>
    {/if}
  </div>

  {#if activeModal}
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      transition:fade={{ duration: 200 }}
    >
      <div
        class="custom-scrollbar relative flex max-h-[85vh] w-full max-w-[400px] flex-col overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          class="absolute top-7 right-5 bg-white"
          onclick={() => (activeModal = null)}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        {#if activeModal === 'filter'}
          {@render FilterContent(false)}
        {:else if activeModal === 'selected'}
          <div class="flex flex-col gap-6">
            {@render SelectedContent(false)}
            {@render WarningContent()}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

{#snippet FilterContent(collapsible = true)}
  <div>
    {#if collapsible}
      <button
        onclick={() => (isFilterOpen = !isFilterOpen)}
        aria-expanded={isFilterOpen}
        class="mb-4 flex w-full items-center justify-between"
      >
        <h2 class="text-on-surface text-lg/[20px] font-medium">ตัวกรอง</h2>
        <ChevronDown
          size={20}
          class="text-gray-400 transition-transform duration-200 {isFilterOpen
            ? 'rotate-180'
            : ''}"
        />
      </button>
    {:else}
      <div class="mb-4 flex w-full items-center justify-between">
        <h2 class="text-on-surface text-lg/[20px] font-medium">ตัวกรอง</h2>
      </div>
    {/if}
    {#if !collapsible || isFilterOpen}
      <div transition:slide={{ duration: 250, easing: cubicOut }}>
        <hr class="mb-4 border-t border-neutral-100" />
        <div class="mb-6">
          <FilterBar
            bind:selectedGenEds
            bind:selectedFaculties
            bind:selectedDays
            bind:selectedEval
            bind:startTime
            bind:endTime
            bind:fitSchedule
            bind:noConditions
            bind:favoriteOnly
            onsearch={onSearchFilter}
          />
        </div>
      </div>
    {/if}
    <hr class="mb-6 border-t border-neutral-100" />
  </div>
{/snippet}

{#snippet SelectedContent(collapsible = true)}
  <div>
    {#if $userCart.currentCart}
      <SelectedCourse
        variant="grouped"
        bind:open={isSelectedOpen}
        {collapsible}
        onArrange={goToSchedule}
        headerDivider
        class="border-b border-neutral-100"
      />
    {:else}
      <SelectedCourse {collapsible} class="border-b border-neutral-100" />
    {/if}
  </div>
{/snippet}

{#snippet WarningContent()}
  <div
    class="border-secondary text-on-secondary-container mt-8 rounded-2xl border px-5 py-4 text-center text-xs/[18px]"
  >
    <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span><br />
    สามารถลงทะเบียนเรียนได้ที่
    <a
      href="https://www2.reg.chula.ac.th/"
      target="_blank"
      rel="noreferrer"
      class="underline"
    >
      https://www2.reg.chula.ac.th/
    </a><br />
    เพียงช่องทางเดียวเท่านั้น
  </div>
{/snippet}
