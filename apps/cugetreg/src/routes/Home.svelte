<script lang="ts">
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import { Footer } from '@cugetreg/ui/organisms/footer'
  import { SelectedCourse } from '@cugetreg/ui/organisms/selected-course'
  import { Filter as FilterBar } from '@cugetreg/ui/organisms/filter-bar'
  import { CourseCard } from '@cugetreg/ui/molecules/course-card'
  import { Input } from '@cugetreg/ui/atoms/input'
  import { mockScheduleList } from '@cugetreg/utils/mock'
  import { Menu, Filter, BookMarked, Plus, ChevronDown, Loader2, TriangleAlert } from '@lucide/svelte'
  import { untrack } from 'svelte'
  import { slide, fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { goto } from '$app/navigation'

  let courses = $state<any[]>([])
  let isLoading = $state(false)
  const courseCache = new Map<string, any[]>()

  let openPanel = $state<'sidebar' | 'filter_only' | 'selected_only' | null>(null)

  let scheduleList = $state(mockScheduleList)
  let activeSchedule = $state(untrack(() => scheduleList[0]))

  let searchQuery = $state('')
  let debouncedSearchQuery = $state('')
  let searchTimeout: ReturnType<typeof setTimeout> | undefined;

  let isScheduleDropdownOpen = $state(false)
  let isFilterOpen = $state(true)
  let activeDropdown = $state<'program' | 'semester' | 'sort' | null>(null)

  let selectedGenEds = $state<string[]>([])
  let selectedSpecial = $state<string[]>([])
  let selectedFaculties = $state<string[]>([])
  let selectedDays = $state<string[]>([])
  let selectedEval = $state<string[]>([])
  let startTime = $state('')
  let endTime = $state('')
  let fitSchedule = $state(false)
  let noConditions = $state(true)

  let currentProgram = $state('ทวิภาค')
  let currentSemester = $state('2566 / 1')
  let currentSort = $state('รหัสวิชา')
  let sortDirection = $state<'asc' | 'desc'>('asc')

  let displayLimit = $state(20)
  let bottomSentinel = $state<HTMLElement | null>(null)

  const programOptions = ['ทวิภาค', 'ตรีภาค', 'นานาชาติ']
  const semesterOptions = [
    '2568 / ฤดูร้อน', '2568 / 2', '2568 / 1',
    '2567 / ฤดูร้อน', '2567 / 2', '2567 / 1',
    '2566 / 2', '2566 / 1',
  ]
  const sortOptions = ['รหัสวิชา', 'ชื่อวิชา']

  const genEdMap: Record<string, string> = {
    sci: 'SC', hum: 'HU', soc: 'SO', int: 'IN',
  }
  const dayMap: Record<string, string> = {
    mon: 'MO', tue: 'TU', wed: 'WE', thu: 'TH', fri: 'FR', sat: 'SA', sun: 'SU',
  }
  const evalMap: Record<string, string> = {
    su: 'SU', grade: 'LETTER',
  }
  const KNOWN_DAYS = new Set(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'])

  function parseTime(t: string): number | null {
    if (!t) return null
    const m = t.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return null
    const h = Number(m[1])
    const mm = Number(m[2])
    if (h > 23 || mm > 59) return null
    return h * 60 + mm
  }

  function getParams() {
    const parts = currentSemester.split(' / ')
    return {
      academicYear: parts[0],
      semester: parts[1] === 'ฤดูร้อน' ? '3' : (parts[1] === '2' || parts[1] === 'ภาคปลาย' ? '2' : '1'),
      studyProgram: currentProgram === 'นานาชาติ' ? 'I' : (currentProgram === 'ตรีภาค' ? 'T' : 'S')
    }
  }

  function mapCourse(c: any) {
        const totalMaxSeat = c.sections?.reduce((sum: number, sec: any) => sum + (sec.max ?? sec.capacity ?? 0), 0) || 0
        const totalCurrentSeat = c.sections?.reduce((sum: number, sec: any) => sum + (sec.regis ?? sec.enrolled ?? 0), 0) || 0

        const allDays = (c.sections ?? []).flatMap((s: any) => (s.classes ?? []).map((cl: any) => cl.dayOfWeek))

        const normalizeDay = (d: string): string | undefined => {
          const up = String(d ?? '').toUpperCase().slice(0, 2)
          return KNOWN_DAYS.has(up) ? up : undefined
        }

        const normalizeGened = (g: string) => {
            if (!g || g === 'NO') return [];
            const up = String(g).toUpperCase();
            if (up.startsWith('SC')) return ['SC'];
            if (up.startsWith('SO')) return ['SO'];
            if (up.startsWith('HU')) return ['HU'];
            if (up.startsWith('IN')) return ['IN'];
            return [up];
        };

        const validDays = Array.from(new Set(
          allDays.map((d: any) => normalizeDay(d)).filter((d: string | undefined): d is string => Boolean(d))
        ))

        const nameTh = (c.courseInfo?.courseNameTh || '').toLowerCase()
        const nameEn = (c.courseInfo?.courseNameEn || '').toLowerCase()
        const abbr = (c.courseInfo?.abbrName || '').toLowerCase()
        const code = (c.courseNo || '').toLowerCase()
        const searchString = `${code} ${abbr} ${nameTh} ${nameEn}`;

        return {
          recommended: false,
          searchString,
          course: {
            ...c,
            code: c.courseNo,
            name: c.courseInfo?.abbrName || c.courseInfo?.courseNameEn || c.courseInfo?.courseNameTh || '-',
            credit: Number(c.courseInfo?.credit) || 0,
            maxseat: totalMaxSeat,
            seat: totalCurrentSeat,
            gened: normalizeGened(c.genEdType),
            review: c.reviewCount || 0,
            rating: c.rating || 0,
            days: validDays,
            gradingType: c.courseInfo?.gradingType,
          },
        }
  }

  async function fetchCourses() {
    const { academicYear, semester, studyProgram } = getParams()
    const cacheKey = `${studyProgram}-${academicYear}-${semester}`

    const cached = courseCache.get(cacheKey)
    if (cached) {
      courses = cached
      isLoading = false
      return
    }

    isLoading = true
    try {
      const params = new URLSearchParams({
        academicYear,
        semester,
        studyProgram,
      })

      const res = await fetch(`http://localhost:3000/api/v1/courses?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) throw new Error(`Server error (${res.status})`)
      const json = await res.json()

      const mapped = (json.data || []).map(mapCourse)
      courseCache.set(cacheKey, mapped)
      courses = mapped
      return
    } catch (err) {
      console.error('Error fetching courses:', err)
      courses = []
    } finally {
      isLoading = false
    }
  }

  $effect(() => {
    currentSemester
    currentProgram
    fetchCourses()
  })

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) return;

    searchQuery = target.value;

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        debouncedSearchQuery = searchQuery;
    }, 250);
  }

  $effect(() => {
    if (!bottomSentinel) return;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            displayLimit += 20;
        }
    }, { rootMargin: '400px' });

    observer.observe(bottomSentinel);
    return () => observer.disconnect();
  });

  $effect(() => {
    debouncedSearchQuery; selectedGenEds; selectedFaculties; selectedDays; selectedEval;
    startTime; endTime; noConditions; currentSort; sortDirection;
    untrack(() => { displayLimit = 20; });
  });

  function togglePanel(type: typeof openPanel) { openPanel = openPanel === type ? null : type }
  function toggleDropdown(type: typeof activeDropdown) { activeDropdown = activeDropdown === type ? null : type }
  function selectOption(type: 'program' | 'semester' | 'sort', value: string) {
    if (type === 'program') currentProgram = value
    if (type === 'semester') currentSemester = value
    if (type === 'sort') currentSort = value
    activeDropdown = null
  }
  function toggleSortDirection() { sortDirection = sortDirection === 'asc' ? 'desc' : 'asc' }

  function handleAddSchedule() {
    const newSchedule = {
      name: `ตาราง ${scheduleList.length + 1}`,
      scheduleId: `local-${crypto.randomUUID()}`,
      schedule: [],
      semesterType: activeSchedule?.semesterType ?? 'Semester',
      semester: activeSchedule?.semester ?? currentSemester,
      isPublic: false,
    }
    scheduleList = [...scheduleList, newSchedule]
    activeSchedule = newSchedule
    isScheduleDropdownOpen = false
  }

  function getFirstSectionNo(courseItem: any): number {
    return Number(courseItem.course.sections?.[0]?.sectionNo) || 1
  }

  let nextScheduleItemId = $state(Date.now())
  function newScheduleItemId(): number {
    nextScheduleItemId += 1
    return nextScheduleItemId
  }

  function handleToggleCourse(courseItem: any) {
    if (!activeSchedule) return
    const index = activeSchedule.schedule.findIndex((s: any) => s.course.code === courseItem.course.code)
    if (index === -1) {
      activeSchedule.schedule = [
        ...activeSchedule.schedule,
        { id: newScheduleItemId(), course: courseItem.course, selectedSection: getFirstSectionNo(courseItem), colorVariant: 'neutral', hidden: false }
      ]
    } else {
      handleRemoveCourse(courseItem.course.code)
    }
  }

  function handleRemoveCourse(courseCode: string) {
    if (!activeSchedule) return
    activeSchedule.schedule = activeSchedule.schedule.filter((s: any) => s.course.code !== courseCode)
  }

  function handleSelectSection(courseItem: any, sectionNo: string) {
    if (!activeSchedule) return
    const secNum = Number(sectionNo)
    const index = activeSchedule.schedule.findIndex((s: any) => s.course.code === courseItem.course.code)
    if (index === -1) {
      activeSchedule.schedule = [
        ...activeSchedule.schedule,
        { id: newScheduleItemId(), course: courseItem.course, selectedSection: secNum, colorVariant: 'neutral', hidden: false }
      ]
    } else {
      activeSchedule.schedule[index].selectedSection = secNum
    }
  }

  function getSectionOptions(courseItem: any) {
    return (courseItem.course.sections ?? [])
      .map((sec: any) => ({ value: String(sec.sectionNo), label: `เซค ${sec.sectionNo}` }))
  }

  function getSelectedSection(courseCode: string): string {
    if (!activeSchedule) return ''
    const entry = activeSchedule.schedule.find((s: any) => s.course.code === courseCode)
    return entry ? String(entry.selectedSection) : ''
  }

  let filteredCourses = $derived.by(() => {
    let result = courses

    if (debouncedSearchQuery.trim() !== '') {
      const q = debouncedSearchQuery.toLowerCase().trim()
      result = result.filter((item) => {
        // ใช้ Fallback เผื่อ SearchString เตรียมตัวไม่ทันตอน Hot-reload
        if (item.searchString) return item.searchString.includes(q);
        const c = item.course;
        const nameTh = (c.courseInfo?.courseNameTh || '').toLowerCase()
        const nameEn = (c.courseInfo?.courseNameEn || '').toLowerCase()
        const abbr = (c.courseInfo?.abbrName || '').toLowerCase()
        const code = (c.code || '').toLowerCase()
        return nameTh.includes(q) || nameEn.includes(q) || abbr.includes(q) || code.includes(q)
      })
    }

    if (selectedGenEds.length > 0) {
      const targetGenEds = selectedGenEds.map(id => genEdMap[id])
      result = result.filter((item) => targetGenEds.includes(item.course.gened?.[0]))
    }
    if (selectedFaculties.length > 0) {
      result = result.filter((item) => selectedFaculties.includes((item.course.code || '').substring(0, 2)))
    }
    if (selectedDays.length > 0) {
      const targetDays = selectedDays.map(id => dayMap[id])
      result = result.filter((item) => (item.course.days || []).some((day: string) => targetDays.includes(day)))
    }
    if (selectedEval.length > 0) {
      const targetGrading = selectedEval.map(id => evalMap[id])
      result = result.filter((item) => targetGrading.includes(item.course.gradingType))
    }

    const startMin = parseTime(startTime)
    const endMin = parseTime(endTime)
    if (startMin !== null || endMin !== null) {
      const lo = startMin ?? 0
      const hi = endMin ?? 24 * 60
      result = result.filter((item) =>
        (item.course.sections || []).some((sec: any) =>
          (sec.classes || []).some((cl: any) => {
            const s = parseTime(cl.periodStart)
            const e = parseTime(cl.periodEnd)
            if (s === null || e === null) return false
            return s >= lo && e <= hi
          })
        )
      )
    }

    return [...result].sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
      let valA, valB
      switch (currentSort) {
        case 'ชื่อวิชา':
          valA = a.course.name || ''
          valB = b.course.name || ''
          return sortDirection === 'asc' ? valA.localeCompare(valB, 'th') : valB.localeCompare(valA, 'th')
        default:
          valA = a.course.code || ''
          valB = b.course.code || ''
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
    })
  })

  let displayedCourses = $derived(filteredCourses.slice(0, displayLimit))

  function onSearchFilter() {
    if (openPanel === 'filter_only') openPanel = null
  }

  let contextLabel = $derived.by(() => {
    const [year, sem] = currentSemester.split(' / ')
    const semTh = sem === 'ฤดูร้อน' ? 'ภาคฤดูร้อน' : sem === '2' ? 'ภาคปลาย' : 'ภาคต้น'
    return `ในปีการศึกษา ${year} ${semTh} หลักสูตร${currentProgram}`
  })
</script>

<div class="relative flex h-screen flex-col overflow-hidden bg-white">
  <Navbar />

  <div class="relative flex flex-1 overflow-hidden">
    <nav class="z-[65] flex w-16 shrink-0 flex-col items-center gap-6 border-r bg-white py-6">
      <button
        onclick={() => togglePanel('sidebar')}
        class="rounded-xl p-3 transition-all {openPanel === 'sidebar' ? 'bg-[#E9EEF6] text-[#004494]' : 'text-neutral-800 hover:bg-gray-100'}"
      >
        <Menu size="24" strokeWidth={2.5} />
      </button>
      <button
        onclick={() => togglePanel('filter_only')}
        class="rounded-xl p-3 transition-all {openPanel === 'filter_only' ? 'bg-[#E9EEF6] text-[#004494]' : 'text-neutral-800 hover:bg-gray-100'}"
      >
        <Filter size="24" strokeWidth={2.5} />
      </button>
      <button
        onclick={() => togglePanel('selected_only')}
        class="rounded-xl p-3 transition-all {openPanel === 'selected_only' ? 'bg-[#E9EEF6] text-[#004494]' : 'text-neutral-800 hover:bg-gray-100'}"
      >
        <BookMarked size="24" strokeWidth={2.5} />
      </button>
    </nav>

    {#if openPanel === 'filter_only' || openPanel === 'selected_only'}
      <div transition:fade={{ duration: 200 }} class="fixed inset-0 z-40 bg-black/5" onclick={() => (openPanel = null)} role="button" tabindex="0" onkeydown={() => {}}></div>
    {/if}

    {#if openPanel === 'sidebar'}
      <aside transition:slide={{ axis: 'x', duration: 280, easing: cubicOut }} class="relative z-50 flex h-full w-[450px] shrink-0 flex-col border-r bg-white">
        {@render panelContent()}
      </aside>
    {:else if openPanel}
      <aside transition:fly={{ x: -24, duration: 250, easing: cubicOut }} class="absolute top-0 left-16 z-50 m-4 flex h-[calc(100vh-2rem)] max-h-[90vh] w-[400px] flex-col rounded-[2.5rem] border bg-white shadow-2xl">
        {@render panelContent()}
      </aside>
    {/if}

    {#snippet panelContent()}
        <div class="flex h-full flex-col overflow-hidden p-6 md:p-8">
          <div class="custom-scrollbar flex-1 overflow-y-auto pr-2 pb-10">
            {#if openPanel === 'sidebar'}
              <div class="relative mb-6 flex flex-col gap-2">
                <label class="ml-1 text-[11px] font-medium text-gray-400">คุณกำลังจัดตารางเรียน...</label>
                <div class="flex items-center gap-2">
                  <button onclick={() => (isScheduleDropdownOpen = !isScheduleDropdownOpen)} class="flex h-14 flex-1 items-center justify-between overflow-hidden rounded-2xl border border-blue-500 bg-white px-5 shadow-sm transition-all hover:bg-gray-50">
                    <span class="mr-2 truncate text-lg font-bold text-[#1C1B1F]">{activeSchedule?.name || 'เลือกตาราง'}</span>
                    <ChevronDown size={24} class="shrink-0 text-gray-400" />
                  </button>
                  <div class="flex h-14 min-w-[100px] flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-white px-3 py-2 text-center shadow-sm">
                    <span class="text-[10px] leading-tight font-bold text-neutral-800">ทวิภาค</span>
                    <span class="text-[10px] leading-tight font-bold whitespace-nowrap text-neutral-800">{activeSchedule?.semester || '-'}</span>
                  </div>
                </div>

                {#if isScheduleDropdownOpen}
                  <div class="absolute top-[110%] left-0 z-[70] w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                    <div class="custom-scrollbar flex max-h-[200px] flex-col overflow-y-auto py-2">
                      {#each scheduleList as s}
                        <button onclick={() => { activeSchedule = s; isScheduleDropdownOpen = false }} class="px-5 py-3 text-left hover:bg-gray-50 {activeSchedule.scheduleId === s.scheduleId ? 'bg-gray-50 font-bold' : ''}">
                          <span class="block truncate text-[15px]">{s.name}</span>
                        </button>
                      {/each}
                    </div>
                    <button onclick={handleAddSchedule} class="flex w-full items-center justify-center gap-2 border-t p-4 font-bold text-[#004494] transition-colors hover:bg-gray-50">
                      <Plus size={18} strokeWidth={3} /> เพิ่มตาราง
                    </button>
                  </div>
                  <div class="fixed inset-0 z-[65]" onclick={() => (isScheduleDropdownOpen = false)} role="button" tabindex="0" onkeydown={() => {}}></div>
                {/if}
              </div>
              <hr class="mb-6 opacity-50" />
            {/if}

            {#if openPanel === 'sidebar' || openPanel === 'filter_only'}
              <button
                onclick={() => (isFilterOpen = !isFilterOpen)}
                aria-expanded={isFilterOpen}
                class="mb-6 flex w-full items-center justify-between"
              >
                <span class="flex items-center gap-2">
                  <Filter size={20} />
                  <h2 class="text-xl font-bold">ตัวกรอง</h2>
                </span>
                <ChevronDown size={20} class="text-gray-500 transition-transform duration-200 {isFilterOpen ? '' : '-rotate-90'}" />
              </button>
              {#if isFilterOpen}
                <div class="mb-8 min-h-[650px]">
                  <FilterBar
                    bind:selectedGenEds bind:selectedSpecial bind:selectedFaculties bind:selectedDays
                    bind:selectedEval bind:startTime bind:endTime bind:fitSchedule bind:noConditions onsearch={onSearchFilter}
                  />
                </div>
              {/if}
              {#if openPanel === 'sidebar'}
                <hr class="mb-6 opacity-50" />
              {/if}
            {/if}

            {#if openPanel === 'sidebar' || openPanel === 'selected_only'}
              {#if activeSchedule && activeSchedule.schedule.length > 0}
                {#key activeSchedule.scheduleId}
                  <SelectedCourse
                    variant="grouped"
                    bind:schedule={activeSchedule.schedule}
                    remove={handleRemoveCourse}
                    onArrange={() => goto('/schedule')}
                  />
                {/key}
              {:else}
                <div class="mb-4 flex items-center gap-2">
                  <BookMarked size={20} />
                  <h2 class="text-xl font-bold">วิชาที่เลือก <span class="ml-2 text-sm font-normal text-gray-400">0 หน่วยกิต</span></h2>
                </div>
                <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center text-[#004494]">
                  <BookMarked size={56} strokeWidth={1.5} />
                  <p class="text-lg font-bold text-[#1C1B1F]">เพิ่มวิชาที่สนใจ</p>
                  <p class="text-sm leading-relaxed text-gray-400">
                    เพิ่มวิชาด้วยการกดเลือกในรายวิชาที่สนใจ<br />
                    เพื่อนำมาจัดตารางเรียนและวางแผนการเรียน
                  </p>
                </div>
              {/if}
            {/if}

            {#if openPanel === 'sidebar'}
              <div class="mt-8 rounded-2xl border border-orange-300 px-5 py-4 text-center text-[15px] leading-relaxed text-orange-500">
                <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span><br />
                สามารถลงทะเบียนเรียนได้ที่
                <a href="https://www2.reg.chula.ac.th/" target="_blank" rel="noreferrer" class="underline">https://www2.reg.chula.ac.th/</a><br />
                เพียงช่องทางเดียวเท่านั้น
              </div>
            {/if}
          </div>
        </div>
    {/snippet}

    <main class="h-full min-w-0 flex-1 overflow-y-auto scroll-smooth bg-white">
      <div class="flex min-h-full flex-col">
        <div class="mx-auto w-full max-w-[1000px] flex-1 p-8 lg:p-12">
          <div class="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-baseline gap-3">
              <h1 class="text-4xl font-bold text-[#1C1B1F]">วิชาเรียน</h1>
              <span class="text-sm font-medium text-gray-400">({filteredCourses.length} ผลลัพธ์)</span>
            </div>

            <div class="relative flex gap-2">
              <div class="relative">
                <button onclick={() => toggleDropdown('program')} class="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2 text-sm font-bold transition-colors hover:bg-gray-50">
                  {currentProgram} <ChevronDown size={16} />
                </button>
                {#if activeDropdown === 'program'}
                  <div class="absolute top-full right-0 z-[70] mt-2 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                    {#each programOptions as opt}
                      <button onclick={() => selectOption('program', opt)} class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 {currentProgram === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                    {/each}
                  </div>
                {/if}
              </div>

              <div class="relative">
                <button onclick={() => toggleDropdown('semester')} class="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2 text-sm font-bold whitespace-nowrap transition-colors hover:bg-gray-50">
                  {currentSemester} <ChevronDown size={16} />
                </button>
                {#if activeDropdown === 'semester'}
                  <div class="absolute top-full right-0 z-[70] mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                    <div class="custom-scrollbar flex max-h-[250px] flex-col overflow-y-auto py-1">
                      {#each semesterOptions as opt}
                        <button onclick={() => selectOption('semester', opt)} class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 {currentSemester === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
              {#if activeDropdown}
                <div class="fixed inset-0 z-[65]" onclick={() => (activeDropdown = null)} role="button" tabindex="0" onkeydown={() => {}}></div>
              {/if}
            </div>
          </div>

          <div class="mb-10 flex flex-col gap-1">
            <div class="flex flex-col md:flex-row md:items-end gap-6">
              <div class="flex flex-1 flex-col gap-1">
                <span class="ml-1 text-xs text-gray-400">ค้นหา...</span>
                <Input
                  value={searchQuery}
                  oninput={handleSearch}
                  placeholder="พิมพ์ชื่อวิชา รหัสวิชา หรือคำค้นหาอื่นๆ..."
                  class="h-12 w-full rounded-xl border-none bg-[#F1F3F7] px-6 text-lg font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex w-full md:w-64 flex-col gap-1">
                <span class="ml-1 text-[10px] font-bold text-gray-400 uppercase">จัดลำดับตาม</span>
                <div class="relative flex items-center gap-3">
                  <button onclick={() => toggleDropdown('sort')} class="flex h-12 flex-1 items-center justify-between rounded-xl bg-[#F1F3F7] px-5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200">
                    <span>{currentSort}</span> <ChevronDown size={18} class="text-gray-400" />
                  </button>
                  {#if activeDropdown === 'sort'}
                    <div class="absolute top-full left-0 z-[70] mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                      {#each sortOptions as opt}
                        <button onclick={() => selectOption('sort', opt)} class="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 {currentSort === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                      {/each}
                    </div>
                  {/if}
                  <button onclick={toggleSortDirection} class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-[#004494] transition-all hover:bg-blue-50">
                    <div class="transition-transform duration-300 {sortDirection === 'asc' ? 'rotate-180' : 'rotate-0'}">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-x-5 gap-y-6 pb-10 md:grid-cols-2">
            {#if isLoading}
              <div class="col-span-full flex h-64 flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 class="animate-spin" size={40} />
                <p>กำลังโหลดข้อมูลวิชา...</p>
              </div>
            {:else if filteredCourses.length === 0}
              <div class="col-span-full flex flex-col items-center justify-center gap-2 py-24 text-center">
                <TriangleAlert size={72} strokeWidth={1.5} class="mb-2 text-[#4A6CF7]" />
                <p class="text-lg font-medium text-[#1C1B1F]">
                  ไม่พบรายวิชา{debouncedSearchQuery.trim() ? ` ${debouncedSearchQuery.trim()}` : ''}
                </p>
                <p class="text-base text-gray-500">{contextLabel}</p>
                <p class="mt-3 text-sm leading-relaxed text-gray-400">
                  ลองเปลี่ยนตัวเลือกภาคเรียน ปีการศึกษา หรือหลักสูตร<br />
                  ในตารางเรียน แล้วลองใหม่อีกครั้งนะ!
                </p>
              </div>
            {:else}
              {#each displayedCourses as item (item.course.code)}
                <CourseCard
                  course={item.course}
                  recommended={item.recommended}
                  selected={activeSchedule ? activeSchedule.schedule.some((s: any) => s.course.code === item.course.code) : false}
                  onSelect={() => handleToggleCourse(item)}
                  sections={getSectionOptions(item)}
                  selectedSection={getSelectedSection(item.course.code)}
                  onSelectSection={(v: string) => handleSelectSection(item, v)}
                  class="w-full md:w-full max-w-full"
                />
              {/each}

              {#if displayLimit < filteredCourses.length}
                <div bind:this={bottomSentinel} class="col-span-full flex h-24 items-center justify-center opacity-50">
                  <Loader2 class="animate-spin text-gray-400" size={24} />
                </div>
              {/if}
            {/if}
          </div>
        </div>

        <div class="mt-auto w-full border-t bg-white">
          <Footer />
        </div>
      </div>
    </main>
  </div>
</div>
