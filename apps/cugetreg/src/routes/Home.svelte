<script lang="ts">
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import { Footer } from '@cugetreg/ui/organisms/footer'
  import { SelectedCourse } from '@cugetreg/ui/organisms/selected-course'
  import { Filter as FilterBar } from '@cugetreg/ui/organisms/filter-bar'

  import { CourseCard } from '@cugetreg/ui/molecules/course-card'
  import { Input } from '@cugetreg/ui/atoms/input'

  import {
    mockScheduleList,
    courseComPres,
    courseAppDev,
    courseEffectCareer,
    courseCalculusI,
    courseLongName,
    courseAI,
  } from '@cugetreg/utils/mock';

  import { Menu, Filter, BookMarked, Plus, ChevronDown } from '@lucide/svelte'
  import { untrack } from 'svelte'

  const mockAllCourses = [
    { course: courseComPres, recommended: true },
    { course: courseAppDev, recommended: true },
    { course: courseEffectCareer, recommended: false },
    { course: courseCalculusI, recommended: false },
    { course: courseLongName, recommended: false },
    { course: courseAI, recommended: true },
  ]

  let { courses = mockAllCourses } = $props()

  // --- STATES ---
  let openPanel = $state<'sidebar' | 'filter_only' | 'selected_only' | null>(
    null,
  )
  let scheduleList = $state(mockScheduleList)
  let activeSchedule = $state(untrack(() => scheduleList[0]))
  let searchQuery = $state('')
  let isScheduleDropdownOpen = $state(false)
  let activeDropdown = $state<'program' | 'semester' | 'sort' | null>(null)

  // --- Filter States ---
  let selectedGenEds = $state([])
  let selectedSpecial = $state([])
  let selectedFaculties = $state([])
  let selectedDays = $state([])
  let selectedEval = $state([])
  let startTime = $state('')
  let endTime = $state('')
  let fitSchedule = $state(false)
  let noConditions = $state(true)

  // --- Header Values ---
  let currentProgram = $state('นานาชาติ')
  let currentSemester = $state('2566 / ภาคต้น')
  let currentSort = $state('จำนวนที่นั่ง')
  let sortDirection = $state<'asc' | 'desc'>('desc')

  const programOptions = ['ทวิภาค', 'ตรีภาค', 'นานาชาติ']
  const semesterOptions = [
    '2568 / ฤดูร้อน',
    '2568 / 2',
    '2568 / 1',
    '2567 / ฤดูร้อน',
    '2567 / 2',
  ]
  const sortOptions = ['จำนวนที่นั่ง', 'ชื่อวิชา', 'จำนวนที่นั่งเหลือ']

  const genEdMap: Record<string, string> = {
    sci: 'SC',
    hum: 'HU',
    soc: 'SO',
    int: 'IN',
  }
  const dayMap: Record<string, string> = {
    mon: 'MO',
    tue: 'TU',
    wed: 'WE',
    thu: 'TH',
    fri: 'FR',
    sat: 'SA',
    sun: 'SU',
  }

  // --- LOGIC ---
  function togglePanel(type: typeof openPanel) {
    openPanel = openPanel === type ? null : type
  }

  function toggleDropdown(type: typeof activeDropdown) {
    activeDropdown = activeDropdown === type ? null : type
  }

  function selectOption(type: 'program' | 'semester' | 'sort', value: string) {
    if (type === 'program') currentProgram = value
    if (type === 'semester') currentSemester = value
    if (type === 'sort') currentSort = value
    activeDropdown = null
  }

  function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
  }

  function handleToggleCourse(courseItem: any) {
    if (!activeSchedule) return
    const index = activeSchedule.schedule.findIndex(
      (s) => s.course.code === courseItem.course.code,
    )
    if (index === -1) {
      activeSchedule.schedule.push({
        id: crypto.randomUUID(),
        course: courseItem.course,
        selectedSection: 1,
        colorVariant: 'neutral',
        hidden: false,
      })
    } else {
      activeSchedule.schedule = activeSchedule.schedule.filter(
        (s) => s.course.code !== courseItem.course.code,
      )
    }
  }

  let filteredCourses = $derived.by(() => {
    let result = courses.filter((item) => {
      const matchSearch =
        (item.course?.name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.course?.code || '').includes(searchQuery)
      if (!matchSearch) return false
      if (noConditions) return true
      if (selectedGenEds.length > 0) {
        const courseGenEds = item.course.gened || []
        const targetGenEds = selectedGenEds.map((id: string) => genEdMap[id])
        if (!targetGenEds.some((code: string) => courseGenEds.includes(code)))
          return false
      }
      if (selectedDays.length > 0) {
        const courseDays = item.course.days || []
        const targetDays = selectedDays.map((id: string) => dayMap[id])
        if (!targetDays.some((day: string) => courseDays.includes(day)))
          return false
      }
      return true
    })

    return result.sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
      let valA, valB
      switch (currentSort) {
        case 'ชื่อวิชา':
          valA = a.course.name || ''
          valB = b.course.name || ''
          return sortDirection === 'asc'
            ? valA.localeCompare(valB, 'th')
            : valB.localeCompare(valA, 'th')
        case 'จำนวนที่นั่ง':
          valA = a.course.maxseat || 0
          valB = b.course.maxseat || 0
          break
        case 'จำนวนที่นั่งเหลือ':
          valA = (a.course.maxseat || 0) - (a.course.seat || 0)
          valB = (b.course.maxseat || 0) - (b.course.seat || 0)
          break
        default:
          valA = a.course.code
          valB = b.course.code
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA
    })
  })

  function onSearchFilter() {}
</script>

<div class="relative flex h-screen flex-col overflow-hidden bg-white">
  <Navbar />

  <div class="relative flex flex-1 overflow-hidden">
    <nav
      class="z-[65] flex w-16 shrink-0 flex-col items-center gap-6 border-r bg-white py-6"
    >
      <button
        onclick={() => togglePanel('sidebar')}
        class="rounded-xl p-3 transition-all {openPanel === 'sidebar'
          ? 'bg-[#E9EEF6] text-[#004494]'
          : 'text-neutral-800 hover:bg-gray-100'}"
      >
        <Menu size="24" strokeWidth={2.5} />
      </button>
      <button
        onclick={() => togglePanel('filter_only')}
        class="rounded-xl p-3 transition-all {openPanel === 'filter_only'
          ? 'bg-[#E9EEF6] text-[#004494]'
          : 'text-neutral-800 hover:bg-gray-100'}"
      >
        <Filter size="24" strokeWidth={2.5} />
      </button>
      <button
        onclick={() => togglePanel('selected_only')}
        class="rounded-xl p-3 transition-all {openPanel === 'selected_only'
          ? 'bg-[#E9EEF6] text-[#004494]'
          : 'text-neutral-800 hover:bg-gray-100'}"
      >
        <BookMarked size="24" strokeWidth={2.5} />
      </button>
    </nav>

    {#if openPanel === 'filter_only' || openPanel === 'selected_only'}
      <div
        class="fixed inset-0 z-40 bg-black/5"
        onclick={() => (openPanel = null)}
      ></div>
    {/if}

    {#if openPanel}
      <aside
        class="
            z-50 flex flex-col bg-white transition-all duration-300 ease-in-out
            {openPanel === 'sidebar'
          ? 'relative h-full w-[450px] shrink-0 border-r' /* Sidebar: ดันเนื้อหา, เต็มจอ, เหลี่ยม */
          : 'absolute top-0 left-16 m-4 h-auto max-h-[90vh] w-[400px] rounded-[2.5rem] border shadow-2xl'} 
        "
      >
        <div class="flex h-full flex-col overflow-hidden p-8">
          <div class="custom-scrollbar flex-1 overflow-y-auto pr-2">
            {#if openPanel === 'sidebar'}
              <div class="relative mb-6 flex flex-col gap-2">
                <label class="ml-1 text-[11px] font-medium text-gray-400"
                  >คุณกำลังจัดตารางเรียน...</label
                >
                <div class="flex items-center gap-2">
                  <button
                    onclick={() =>
                      (isScheduleDropdownOpen = !isScheduleDropdownOpen)}
                    class="flex h-14 flex-1 items-center justify-between overflow-hidden rounded-2xl border border-blue-500 bg-white px-5 shadow-sm transition-all hover:bg-gray-50"
                  >
                    <span class="mr-2 truncate text-lg font-bold text-[#1C1B1F]"
                      >{activeSchedule?.name || 'เลือกตาราง'}</span
                    >
                    <ChevronDown size={24} class="shrink-0 text-gray-400" />
                  </button>
                  <div
                    class="flex h-14 min-w-[100px] flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-white px-3 py-2 text-center shadow-sm"
                  >
                    <span
                      class="text-[10px] leading-tight font-bold text-neutral-800"
                      >ทวิภาค</span
                    >
                    <span
                      class="text-[10px] leading-tight font-bold whitespace-nowrap text-neutral-800"
                      >{activeSchedule?.semester || '-'}</span
                    >
                  </div>
                </div>

                {#if isScheduleDropdownOpen}
                  <div
                    class="absolute top-[110%] left-0 z-[70] w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
                  >
                    <div
                      class="custom-scrollbar flex max-h-[200px] flex-col overflow-y-auto py-2"
                    >
                      {#each scheduleList as s}
                        <button
                          onclick={() => {
                            activeSchedule = s
                            isScheduleDropdownOpen = false
                          }}
                          class="px-5 py-3 text-left hover:bg-gray-50 {activeSchedule.scheduleId ===
                          s.scheduleId
                            ? 'bg-gray-50 font-bold'
                            : ''}"
                        >
                          <span class="block truncate text-[15px]"
                            >{s.name}</span
                          >
                        </button>
                      {/each}
                    </div>
                    <button
                      class="flex w-full items-center justify-center gap-2 border-t p-4 font-bold text-[#004494] transition-colors hover:bg-gray-50"
                    >
                      <Plus size={18} strokeWidth={3} /> เพิ่มตาราง
                    </button>
                  </div>
                  <div
                    class="fixed inset-0 z-[65]"
                    onclick={() => (isScheduleDropdownOpen = false)}
                  ></div>
                {/if}
              </div>
              <hr class="mb-6 opacity-50" />
            {/if}

            {#if openPanel === 'sidebar' || openPanel === 'filter_only'}
              <div class="mb-6 flex items-center gap-2">
                <Filter size={20} />
                <h2 class="text-xl font-bold">ตัวกรอง</h2>
              </div>
              <div class="mb-8 h-full">
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
              {#if openPanel === 'sidebar'}
                <hr class="mb-6 opacity-50" />
              {/if}
            {/if}

            {#if openPanel === 'sidebar' || openPanel === 'selected_only'}
              <div class="mb-4 flex items-center gap-2">
                <BookMarked size={20} />
                <h2 class="text-xl font-bold">
                  วิชาที่เลือก <span
                    class="ml-2 text-sm font-normal text-gray-400"
                  >
                    {activeSchedule?.schedule.reduce(
                      (acc, curr) => acc + curr.course.credit,
                      0,
                    ) ?? 0} หน่วยกิต
                  </span>
                </h2>
              </div>
              {#if activeSchedule}
                <SelectedCourse bind:schedule={activeSchedule.schedule} />
              {/if}
            {/if}
          </div>
        </div>
      </aside>
    {/if}

    <main class="h-full min-w-0 flex-1 overflow-y-auto scroll-smooth bg-white">
      <div class="flex min-h-full flex-col">
        <div class="mx-auto w-full max-w-[1200px] flex-1 p-8 lg:p-12">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-baseline gap-3">
              <h1 class="text-4xl font-bold text-[#1C1B1F]">วิชาเรียน</h1>
              <span class="text-sm font-medium text-gray-400"
                >({filteredCourses.length} ผลลัพธ์)</span
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
                    {#each programOptions as opt}
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
                      {#each semesterOptions as opt}
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
                ></div>
              {/if}
            </div>
          </div>

          <div class="mb-10 flex flex-col gap-1">
            <div class="flex items-end gap-6">
              <div class="flex flex-1 flex-col gap-1">
                <span class="ml-1 text-xs text-gray-400">ค้นหา...</span>
                <Input
                  bind:value={searchQuery}
                  placeholder=""
                  class="h-12 w-full rounded-xl border-none bg-[#F1F3F7] px-6 text-lg font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex w-64 flex-col gap-1">
                <span class="ml-1 text-[10px] font-bold text-gray-400 uppercase"
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
                      {#each sortOptions as opt}
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

          <div class="grid grid-cols-1 gap-4 pb-32 md:grid-cols-2">
            {#each filteredCourses as item}
              <CourseCard
                course={item.course}
                recommended={item.recommended}
                selected={activeSchedule
                  ? activeSchedule.schedule.some(
                      (s) => s.course.code === item.course.code,
                    )
                  : false}
                onclick={() => handleToggleCourse(item)}
                class="w-full"
              />
            {/each}
          </div>
        </div>

        <div class="mt-auto w-full border-t bg-white">
          <Footer />
        </div>
      </div>
    </main>
  </div>
</div>
