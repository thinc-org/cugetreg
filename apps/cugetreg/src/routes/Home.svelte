<script lang="ts">
  import { useSession } from '$lib/auth-client';
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import { searchState } from '$lib/stores/search.svelte';
  import {
    CART_PROMISE_KEY,
    type CartPromise,
    getUserCartStore,
    useCartActions,
  } from '$lib/stores/user-cart';

  import {
    BookMarked,
    ChevronDown,
    Filter,
    Loader2,
    Menu,
    TriangleAlert,
  } from '@lucide/svelte';
  import { getContext, untrack } from 'svelte';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  import { Input } from '@cugetreg/ui/atoms/input';
  import { CourseCard } from '@cugetreg/ui/molecules/course-card';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import { Filter as FilterBar } from '@cugetreg/ui/organisms/filter-bar';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';

  let courses = $state.raw<any[]>([]);
  let isLoading = $state(false);
  let hasMore = $state(true);
  let totalResults = $state(0);
  let offset = $state(0);
  const limit = 20;

  let openPanel = $state<'sidebar' | 'filter_only' | 'selected_only' | null>(
    null,
  );
  let activePanel = $state<'sidebar' | 'filter_only' | 'selected_only' | null>(
    null,
  );
  let sidebarExpanded = $state(true);

  let timetableSection = $state<HTMLElement>();
  let filterSection = $state<HTMLElement>();
  let selectedSection = $state<HTMLElement>();

  let searchQuery = $state('');
  let debouncedSearchQuery = $state('');
  let searchTimeout: ReturnType<typeof setTimeout> | undefined;

  let isScheduleDropdownOpen = $state(false);
  let isFilterOpen = $state(true);
  let activeDropdown = $state<'program' | 'semester' | 'sort' | null>(null);

  let selectedGenEds = $state<string[]>([]);
  let selectedSpecial = $state<string[]>([]);
  let selectedFaculties = $state<string[]>([]);
  let selectedDays = $state<string[]>([]);
  let selectedEval = $state<string[]>([]);
  let startTime = $state('');
  let endTime = $state('');
  let fitSchedule = $state(false);
  let noConditions = $state(true);

  let currentProgram = $state('ทวิภาค');
  let currentSemester = $state('2566 / 1');
  let currentSort = $state('รหัสวิชา');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  let bottomSentinel = $state<HTMLElement | null>(null);

  const session = useSession();

  const programOptions = ['ทวิภาค', 'ตรีภาค', 'นานาชาติ'];
  const semesterOptions = [
    '2568 / ฤดูร้อน',
    '2568 / 2',
    '2568 / 1',
    '2567 / ฤดูร้อน',
    '2567 / 2',
    '2567 / 1',
    '2566 / 2',
    '2566 / 1',
  ];
  const sortOptions = ['รหัสวิชา', 'ชื่อวิชา'];

  const genEdMap: Record<string, string> = {
    sci: 'SC',
    hum: 'HU',
    soc: 'SO',
    int: 'IN',
  };
  const dayMap: Record<string, string> = {
    mon: 'MO',
    tue: 'TU',
    wed: 'WE',
    thu: 'TH',
    fri: 'FR',
    sat: 'SA',
    sun: 'SU',
  };
  const evalMap: Record<string, string> = {
    su: 'SU',
    grade: 'LETTER',
  };
  const KNOWN_DAYS = new Set(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']);

  function mapSemester(semester: string) {
    switch (semester) {
      case '1':
      case 'FIRST':
        return '1';
      case '2':
      case 'SECOND':
        return '2';
      case '3':
      case 'SUMMER':
        return '3';
      default:
        return '1';
    }
  }

  function parseTime(t: string): number | null {
    if (!t) return null;
    const m = t.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = Number(m[1]);
    const mm = Number(m[2]);
    if (h > 23 || mm > 59) return null;
    return h * 60 + mm;
  }

  function getParams() {
    const parts = currentSemester.split(' / ');
    return {
      academicYear: parts[0],
      semester:
        parts[1] === 'ฤดูร้อน'
          ? '3'
          : parts[1] === '2' || parts[1] === 'ภาคปลาย'
            ? '2'
            : '1',
      studyProgram:
        currentProgram === 'นานาชาติ'
          ? 'I'
          : currentProgram === 'ตรีภาค'
            ? 'T'
            : 'S',
    };
  }

  function mapCourse(item: any) {
    const { course: c, courseInfo: ci, reviewCount } = item;

    const totalMaxSeat = item.stats?.capacitySum || 0;
    const totalCurrentSeat =
      (item.stats?.capacitySum || 0) - (item.stats?.remainingSum || 0);

    const allDays = (c.sections ?? []).flatMap((s: any) =>
      (s.classes ?? []).map((cl: any) => cl.dayOfWeek),
    );

    const normalizeDay = (d: string) => {
      const up = String(d).toUpperCase();
      if (up.startsWith('MO') || up === '1') return 'MO';
      if (up.startsWith('TU') || up === '2') return 'TU';
      if (up.startsWith('WE') || up === '3') return 'WE';
      if (up.startsWith('TH') || up === '4') return 'TH';
      if (up.startsWith('FR') || up === '5') return 'FR';
      if (up.startsWith('SA') || up === '6') return 'SA';
      if (up.startsWith('SU') || up === '7' || up === '0') return 'SU';
      return KNOWN_DAYS.has(up.slice(0, 2)) ? up.slice(0, 2) : undefined;
    };

    const normalizeGened = (g: string) => {
      if (!g || g === 'NO') return [];
      const up = String(g).toUpperCase();
      if (up.startsWith('SC')) return ['SC'];
      if (up.startsWith('SO')) return ['SO'];
      if (up.startsWith('HU')) return ['HU'];
      if (up.startsWith('IN')) return ['IN'];
      return [up];
    };

    const validDays = Array.from(
      new Set(
        allDays
          .map((d: any) => normalizeDay(d))
          .filter((d: string | undefined): d is string => Boolean(d)),
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
        gened: normalizeGened(c.genEdType),
        review: reviewCount || 0,
        rating: item.rating || 0,
        days: validDays,
        gradingType: ci.gradingType,
      },
    };
  }

  async function fetchCourses(reset = true) {
    if (reset) {
      offset = 0;
      courses = [];
      hasMore = true;
    }

    if (!hasMore || isLoading) return;

    isLoading = true;
    try {
      const { academicYear, semester, studyProgram } = getParams();
      const params = new SvelteURLSearchParams({
        academicYear,
        semester,
        studyProgram,
        limit: limit.toString(),
        offset: offset.toString(),
        sortOrder: sortDirection,
      });

      if (searchState.debounced.trim()) {
        params.append('q', searchState.debounced.trim());
      }

      if (currentSort === 'ชื่อวิชา') {
        params.append('sortBy', 'NAME');
      }

      if (!noConditions) {
        if (selectedGenEds.length > 0) {
          params.append('genEdType', genEdMap[selectedGenEds[0]]);
        }
        if (selectedFaculties.length > 0) {
          params.append('faculty', selectedFaculties[0]);
        }
        if (selectedDays.length > 0) {
          params.append('day', dayMap[selectedDays[0]]);
        }
        if (selectedEval.length > 0) {
          params.append('assessment', evalMap[selectedEval[0]]);
        }
        if (startTime) params.append('timeStart', startTime);
        if (endTime) params.append('timeEnd', endTime);
        if (fitSchedule) {
          const userCart = getUserCartStore();

          let currentCartId = null;
          const unsub = userCart.subscribe(
            (s) => (currentCartId = s.currentCartId),
          );

          if (currentCartId) params.append('fitCartId', currentCartId);

          unsub();
        }
      }

      const res = await fetch(
        `http://localhost:3000/api/v1/courses?${params.toString()}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const json = await res.json();
      const data = json.data || [];
      totalResults = json.total || 0;

      const mapped = data.map(mapCourse);

      if (reset) {
        courses = mapped;
      } else {
        // Deduplicate by course code to prevent key collisions
        const existingCodes = new Set(courses.map((c) => c.course.code));
        const newUniqueItems = mapped.filter(
          (item) => !existingCodes.has(item.course.code),
        );
        courses = [...courses, ...newUniqueItems];
      }

      offset += limit;
      if (data.length < limit) {
        hasMore = false;
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      if (reset) courses = [];
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    // Term changes (Reset offset and clear list)
    currentSemester;
    currentProgram;
    untrack(() => fetchCourses(true));
  });

  $effect(() => {
    // Search & Filter changes (Reset offset and clear list)
    searchState.debounced;
    selectedGenEds;
    selectedFaculties;
    selectedDays;
    selectedEval;
    startTime;
    endTime;
    noConditions;
    currentSort;
    sortDirection;
    fitSchedule;
    untrack(() => fetchCourses(true));
  });

  $effect(() => {
    if (!bottomSentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          untrack(() => fetchCourses(false));
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(bottomSentinel);
    return () => observer.disconnect();
  });

  const userCart = getUserCartStore();
  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);
  const { addCourse, removeCourse, updateCourse } = useCartActions();

  function togglePanel(type: typeof openPanel) {
    if (sidebarExpanded) {
      if (type === 'sidebar') scrollToSection(timetableSection);
      if (type === 'filter_only') scrollToSection(filterSection);
      if (type === 'selected_only') scrollToSection(selectedSection);
      activePanel = type;
    } else {
      if (openPanel === type) {
        openPanel = null;
      } else {
        openPanel = type;
        activePanel = type;
      }
    }
  }

  function scrollToSection(el: HTMLElement | undefined) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function toggleDropdown(type: typeof activeDropdown) {
    activeDropdown = activeDropdown === type ? null : type;
  }
  function selectOption(type: 'program' | 'semester' | 'sort', value: string) {
    if (type === 'program') currentProgram = value;
    if (type === 'semester') currentSemester = value;
    if (type === 'sort') currentSort = value;
    activeDropdown = null;
  }
  function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  }

  function handleToggleCourse(courseItem: any) {
    const { code, sections } = courseItem.course;

    const courseInSchedule = $userCart.currentCart?.items.find(
      (cls) => cls.courseNo === code,
    );

    if (!courseInSchedule) {
      const firstAvailableSection =
        sections.find((sec: any) => !sec.closed) || sections[0];
      if (firstAvailableSection) {
        addCourse(code, firstAvailableSection.sectionNo);
      }
    } else {
      removeCourse(courseInSchedule.id);
    }
  }

  function handleSelectSection(courseItem: any, sectionNo: string) {
    const { code } = courseItem.course;
    const courseInSchedule = $userCart.currentCart?.items.find(
      (cls) => cls.courseNo === code,
    );
    if (courseInSchedule) {
      updateCourse(courseInSchedule.id, { sectionNo: Number(sectionNo) });
    } else {
      addCourse(code, Number(sectionNo));
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

  let sortedCourses = $derived.by(() => {
    const result = [...courses];
    result.sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
      if (currentSort === 'ชื่อวิชา') {
        const r = collatorTh.compare(a.course.name || '', b.course.name || '');
        return sortDirection === 'asc' ? r : -r;
      }
      const r = collatorDefault.compare(
        a.course.code || '',
        b.course.code || '',
      );
      return sortDirection === 'asc' ? r : -r;
    });
    return result;
  });

  let filteredCourses = $derived(courses);
  let displayedCourses = $derived(courses);

  function onSearchFilter() {
    if (openPanel === 'filter_only') openPanel = null;
  }

  let contextLabel = $derived.by(() => {
    const [year, sem] = currentSemester.split(' / ');
    const semTh =
      sem === 'ฤดูร้อน' ? 'ภาคฤดูร้อน' : sem === '2' ? 'ภาคปลาย' : 'ภาคต้น';
    return `ในปีการศึกษา ${year} ${semTh} หลักสูตร${currentProgram}`;
  });
</script>

<div class="relative flex h-screen flex-col overflow-hidden bg-white">
  <div class="relative flex flex-1 overflow-hidden">
    <Sidebar.Provider
      bind:open={sidebarExpanded}
      class="relative h-full min-h-0"
      style="--sidebar-width-icon: 4rem; --sidebar-width: 450px;"
    >
      {@render SidebarComponent()}
      <Sidebar.Inset>
        <main
          class="h-full min-w-0 flex-1 overflow-y-auto scroll-smooth bg-white"
        >
          <div class="flex min-h-full flex-col">
            <div class="mx-auto w-full max-w-[1200px] flex-1 p-8 lg:p-12">
              <div
                class="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-center"
              >
                <div class="flex items-baseline gap-3">
                  <h1 class="text-4xl font-bold text-[#1C1B1F]">วิชาเรียน</h1>
                  <span class="text-sm font-medium text-gray-400"
                    >({totalResults} ผลลัพธ์)</span
                  >
                </div>

                <div class="relative flex gap-2">
                  <div class="relative">
                    <button
                      onclick={() => toggleDropdown('program')}
                      class="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2 text-sm font-bold transition-colors hover:bg-gray-50"
                    >
                      {currentProgram}
                      <ChevronDown size={16} />
                    </button>
                    {#if activeDropdown === 'program'}
                      <div
                        class="absolute top-full right-0 z-[70] mt-2 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                      >
                        {#each programOptions as opt (opt)}
                          <button
                            onclick={() => selectOption('program', opt)}
                            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 {currentProgram ===
                            opt
                              ? 'bg-gray-50 font-bold'
                              : ''}">{opt}</button
                          >
                        {/each}
                      </div>
                    {/if}
                  </div>

                  <div class="relative">
                    <button
                      onclick={() => toggleDropdown('semester')}
                      class="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2 text-sm font-bold whitespace-nowrap transition-colors hover:bg-gray-50"
                    >
                      {currentSemester}
                      <ChevronDown size={16} />
                    </button>
                    {#if activeDropdown === 'semester'}
                      <div
                        class="absolute top-full right-0 z-[70] mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                      >
                        <div
                          class="custom-scrollbar flex max-h-[250px] flex-col overflow-y-auto py-1"
                        >
                          {#each semesterOptions as opt (opt)}
                            <button
                              onclick={() => selectOption('semester', opt)}
                              class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 {currentSemester ===
                              opt
                                ? 'bg-gray-50 font-bold'
                                : ''}">{opt}</button
                            >
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                  {#if activeDropdown}
                    <div
                      class="fixed inset-0 z-[65]"
                      onclick={() => (activeDropdown = null)}
                      role="button"
                      tabindex="0"
                      onkeydown={() => {}}
                    ></div>
                  {/if}
                </div>
              </div>

              <div class="mb-10 flex flex-col gap-1">
                <div class="flex flex-col gap-6 md:flex-row md:items-end">
                  <div class="flex flex-1 flex-col gap-1">
                    <span class="ml-1 text-xs text-gray-400">ค้นหา...</span>
                    <Input
                      bind:value={searchState.query}
                      onkeydown={(e: KeyboardEvent) => {
                        if (e.key === 'Enter') e.preventDefault();
                      }}
                      placeholder="พิมพ์ชื่อวิชา รหัสวิชา หรือคำค้นหาอื่นๆ..."
                      class="h-12 w-full rounded-xl border-none bg-[#F1F3F7] px-6 text-lg font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex w-full flex-col gap-1 md:w-64">
                    <span
                      class="ml-1 text-[10px] font-bold text-gray-400 uppercase"
                      >จัดลำดับตาม</span
                    >
                    <div class="relative flex items-center gap-3">
                      <button
                        onclick={() => toggleDropdown('sort')}
                        class="flex h-12 flex-1 items-center justify-between rounded-xl bg-[#F1F3F7] px-5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200"
                      >
                        <span>{currentSort}</span>
                        <ChevronDown size={18} class="text-gray-400" />
                      </button>
                      {#if activeDropdown === 'sort'}
                        <div
                          class="absolute top-full left-0 z-[70] mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                        >
                          {#each sortOptions as opt (opt)}
                            <button
                              onclick={() => selectOption('sort', opt)}
                              class="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 {currentSort ===
                              opt
                                ? 'bg-gray-50 font-bold'
                                : ''}">{opt}</button
                            >
                          {/each}
                        </div>
                      {/if}
                      <button
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

              <div
                class="grid grid-cols-1 gap-x-5 gap-y-6 pb-10 md:grid-cols-2"
              >
                {#if filteredCourses.length === 0 && !isLoading}
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
                    studyProgram: $userCart.currentCart.studyProgram,
                    academicYear: String($userCart.currentCart.academicYear),
                    semester: mapSemester($userCart.currentCart.semester),
                  })}
                  {#each displayedCourses as item (item.course.code)}
                    <CourseCard
                      course={item.course}
                      recommended={item.recommended}
                      selected={$userCart.currentCart?.items.some(
                        (v) => v.courseNo === item.course.code,
                      ) ?? false}
                      onSelect={() => handleToggleCourse(item)}
                      sections={getSectionOptions(item)}
                      selectedSection={getSelectedSection(item.course.code)}
                      onSelectSection={(v: string) =>
                        handleSelectSection(item, v)}
                      class="w-full max-w-full md:w-full"
                      courseUrl={`/course-page/${item.course.code}?${params.toString()}`}
                    />
                  {/each}

                  {#if hasMore}
                    <div
                      bind:this={bottomSentinel}
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

            <div class="mt-auto w-full border-t bg-white">
              <Footer />
            </div>
          </div>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  </div>
</div>

{#snippet SidebarComponent()}
  <Sidebar.Sidebar
    variant="sidebar"
    collapsible="icon"
    class="!absolute z-30 !h-full border-none"
  >
    <Sidebar.Content class="flex-row overflow-visible!">
      <Sidebar.Group
        class="w-(--sidebar-width-icon) shrink-0 items-center border-r bg-white p-0 pt-[1rem] pb-6 group-data-[variant=floating]:rounded-l-lg md:pt-[1.5rem]"
      >
        <Sidebar.GroupContent>
          <Sidebar.Menu class="gap-6">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => (sidebarExpanded = !sidebarExpanded)}
                isActive={sidebarExpanded && activePanel === 'sidebar'}
                size="lg"
                tooltipContent="เมนู"
                class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <Menu size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => togglePanel('filter_only')}
                isActive={activePanel === 'filter_only'}
                size="lg"
                tooltipContent="ตัวกรอง"
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <Filter size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            {#if $session.data}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  onclick={() => togglePanel('selected_only')}
                  isActive={activePanel === 'selected_only'}
                  size="lg"
                  tooltipContent="วิชาที่เลือก"
                  class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
                >
                  <BookMarked size="24" strokeWidth={2.5} />
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/if}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>

      {#if openPanel || sidebarExpanded}
        {#if !sidebarExpanded}
          <div
            class="fixed inset-0 z-40 bg-black/5"
            onclick={() => (openPanel = null)}
            role="button"
            tabindex="0"
            onkeydown={() => {}}
          ></div>
        {/if}
        <div
          class="bg-surface flex flex-1 flex-col overflow-hidden group-data-[state=collapsed]:absolute group-data-[state=collapsed]:top-4 group-data-[state=collapsed]:left-[calc(var(--sidebar-width-icon)+1rem)] group-data-[state=collapsed]:z-50 group-data-[state=collapsed]:max-h-[min(800px,calc(100%-2rem))] group-data-[state=collapsed]:w-[400px] group-data-[state=collapsed]:rounded-3xl group-data-[state=collapsed]:border group-data-[state=collapsed]:shadow-2xl md:px-8 md:pt-0 md:pb-8"
        >
          <div class="flex-1 overflow-y-auto pr-6 pb-10 md:pr-8">
            {#if (sidebarExpanded || openPanel === 'sidebar') && $session.data}
              <div
                bind:this={timetableSection}
                class="relative mb-6 flex flex-col gap-2"
              >
                {#await cartPromise}
                  <div
                    class="flex items-center justify-center gap-2 border-b border-neutral-200 px-2 py-8 text-gray-400"
                  >
                    <Loader2 class="animate-spin" size={24} />
                    <span class="text-sm">กำลังโหลดตารางเรียน...</span>
                  </div>
                {:then}
                  <SelectTimetable
                    class="border-b border-neutral-200 px-2 py-5"
                    options={$userCart.cartList?.map((item) => ({
                      name: item.name,
                      id: item.id,
                    })) ?? []}
                    bind:value={$userCart.currentCartId}
                    semester={$userCart.currentCart.semester}
                    semesterType={$userCart.currentCart.studyProgram}
                    academicYear={$userCart.currentCart.academicYear}
                  />
                {:catch}
                  <div
                    class="flex items-center justify-center gap-2 border-b border-neutral-200 px-2 py-8 text-sm text-red-400"
                  >
                    โหลดตารางเรียนไม่สำเร็จ
                  </div>
                {/await}
              </div>
              <hr class="mb-6 opacity-50" />
            {/if}

            {#if sidebarExpanded || openPanel === 'filter_only'}
              <div bind:this={filterSection}>
                <button
                  onclick={() => (isFilterOpen = !isFilterOpen)}
                  aria-expanded={isFilterOpen}
                  class="mb-6 flex w-full items-center justify-between"
                >
                  <span class="flex items-center gap-2">
                    <Filter size={20} />
                    <h2 class="text-xl font-bold">ตัวกรอง</h2>
                  </span>
                  <ChevronDown
                    size={20}
                    class="text-gray-500 transition-transform duration-200 {isFilterOpen
                      ? ''
                      : '-rotate-90'}"
                  />
                </button>
                {#if isFilterOpen}
                  <div class="mb-8 min-h-[650px]">
                    <FilterBar
                      bind:selectedGenEds
                      bind:selectedSpecial
                      bind:selectedFaculties
                      bind:selectedDays
                      bind:selectedEval
                      bind:startTime
                      bind:endTime
                      bind:fitSchedule
                      bind:noConditions
                      onsearch={onSearchFilter}
                    />
                  </div>
                {/if}
                <hr class="mb-6 opacity-50" />
              </div>
            {/if}

            {#if (sidebarExpanded || openPanel === 'selected_only') && $session.data}
              <div bind:this={selectedSection}>
                {#if $userCart.currentCart}
                  <SelectedCourse
                    variant="grouped"
                    class="border-b border-neutral-200"
                  />
                {:else}
                  <SelectedCourse class="border-b border-neutral-200" />
                {/if}
              </div>
            {/if}

            {#if sidebarExpanded || openPanel === 'sidebar'}
              <div
                class="mt-8 rounded-2xl border border-orange-300 px-5 py-4 text-center text-[15px] leading-relaxed text-orange-500"
              >
                <span class="font-bold"
                  >CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span
                ><br />
                สามารถลงทะเบียนเรียนได้ที่
                <a
                  href="https://www2.reg.chula.ac.th/"
                  target="_blank"
                  rel="noreferrer"
                  class="underline">https://www2.reg.chula.ac.th/</a
                ><br />
                เพียงช่องทางเดียวเท่านั้น
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </Sidebar.Content>
  </Sidebar.Sidebar>
{/snippet}
