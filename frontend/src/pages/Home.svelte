<script lang="ts">
  
  import { Navbar } from "../lib/components/organisms/navbar/index.js";
  import { Footer } from "../lib/components/organisms/footer/index.js";
  import { SelectedCourse } from "../lib/components/organisms/selected-course/index.js";
  import { CourseCard } from "../lib/components/molecules/course-card/index.js";
  import { Input } from "../lib/components/atoms/input/index.js";
  import { FilterBar } from "../lib/components/organisms/filter-bar/index.js";
import { Menu, Filter, BookMarked, Plus, ChevronDown } from "lucide-svelte"; 
  import { untrack } from "svelte";
  import { mockScheduleList, courseComPres, courseAppDev, courseEffectCareer, courseCalculusI, courseLongName, courseAI } from "../mockData";

  const mockAllCourses = [
    { course: courseComPres, recommended: true },
    { course: courseAppDev, recommended: true },
    { course: courseEffectCareer, recommended: false },
    { course: courseCalculusI, recommended: false },
    { course: courseLongName, recommended: false },
    { course: courseAI, recommended: true },
  ];

  let { courses = mockAllCourses } = $props(); 

  // --- STATES ---
  let openPanel = $state<"sidebar" | "filter_only" | "selected_only" | null>(null);
  let scheduleList = $state(mockScheduleList);
  let activeSchedule = $state(untrack(() => scheduleList[0]));
  let searchQuery = $state("");
  let isScheduleDropdownOpen = $state(false); 
  let activeDropdown = $state<"program" | "semester" | "sort" | null>(null);

  // --- Filter States ---
  let selectedGenEds = $state([]);
  let selectedSpecial = $state([]);
  let selectedFaculties = $state([]);
  let selectedDays = $state([]);
  let selectedEval = $state([]);
  let startTime = $state('');
  let endTime = $state('');
  let fitSchedule = $state(false);
  let noConditions = $state(true); 

  // --- Header Values ---
  let currentProgram = $state("นานาชาติ");
  let currentSemester = $state("2566 / ภาคต้น");
  let currentSort = $state("จำนวนที่นั่ง");
  let sortDirection = $state<'asc' | 'desc'>('desc'); 

  const programOptions = ["ทวิภาค", "ตรีภาค", "นานาชาติ"];
  const semesterOptions = ["2568 / ฤดูร้อน", "2568 / 2", "2568 / 1", "2567 / ฤดูร้อน", "2567 / 2"];
  const sortOptions = ["จำนวนที่นั่ง", "ชื่อวิชา", "จำนวนที่นั่งเหลือ"];

  const genEdMap: Record<string, string> = { 'sci': 'SC', 'hum': 'HU', 'soc': 'SO', 'int': 'IN' };
  const dayMap: Record<string, string> = { 'mon': 'MO', 'tue': 'TU', 'wed': 'WE', 'thu': 'TH', 'fri': 'FR', 'sat': 'SA', 'sun': 'SU' };

  // --- LOGIC ---
  function togglePanel(type: typeof openPanel) {
    openPanel = openPanel === type ? null : type;
  }

  function toggleDropdown(type: typeof activeDropdown) {
    activeDropdown = activeDropdown === type ? null : type;
  }

  function selectOption(type: "program" | "semester" | "sort", value: string) {
    if (type === "program") currentProgram = value;
    if (type === "semester") currentSemester = value;
    if (type === "sort") currentSort = value;
    activeDropdown = null;
  }

  function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  }

  function handleToggleCourse(courseItem: any) {
    if (!activeSchedule) return;
    const index = activeSchedule.schedule.findIndex(s => s.course.code === courseItem.course.code);
    if (index === -1) {
      activeSchedule.schedule.push({
        id: crypto.randomUUID(), 
        course: courseItem.course,
        selectedSection: 1, 
        colorVariant: "neutral",
        hidden: false,
      });
    } else {
      activeSchedule.schedule = activeSchedule.schedule.filter(s => s.course.code !== courseItem.course.code);
    }
  }

  let filteredCourses = $derived.by(() => {
    let result = courses.filter(item => {
      const matchSearch = (item.course?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.course?.code || "").includes(searchQuery);
      if (!matchSearch) return false;
      if (noConditions) return true;
      if (selectedGenEds.length > 0) {
          const courseGenEds = item.course.gened || [];
          const targetGenEds = selectedGenEds.map((id: string) => genEdMap[id]);
          if (!targetGenEds.some((code: string) => courseGenEds.includes(code))) return false;
      }
      if (selectedDays.length > 0) {
          const courseDays = item.course.days || [];
          const targetDays = selectedDays.map((id: string) => dayMap[id]);
          if (!targetDays.some((day: string) => courseDays.includes(day))) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
      let valA, valB;
      switch (currentSort) {
        case "ชื่อวิชา":
          valA = a.course.name || "";
          valB = b.course.name || "";
          return sortDirection === 'asc' ? valA.localeCompare(valB, 'th') : valB.localeCompare(valA, 'th');
        case "จำนวนที่นั่ง": 
          valA = a.course.maxseat || 0;
          valB = b.course.maxseat || 0;
          break;
        case "จำนวนที่นั่งเหลือ":
          valA = (a.course.maxseat || 0) - (a.course.seat || 0);
          valB = (b.course.maxseat || 0) - (b.course.seat || 0);
          break;
        default: 
          valA = a.course.code;
          valB = b.course.code;
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  });

  function onSearchFilter() { }
</script>

<div class="flex flex-col h-screen bg-white overflow-hidden relative">
  <Navbar />

  <div class="flex flex-1 overflow-hidden relative">
    
    <nav class="w-16 border-r flex flex-col items-center py-6 gap-6 bg-white z-[65] shrink-0">
      <button onclick={() => togglePanel('sidebar')} 
        class="p-3 rounded-xl transition-all {openPanel === 'sidebar' ? 'bg-[#E9EEF6] text-[#004494]' : 'hover:bg-gray-100 text-neutral-800'}">
        <Menu size="24" strokeWidth={2.5} />
      </button>
      <button onclick={() => togglePanel('filter_only')} 
        class="p-3 rounded-xl transition-all {openPanel === 'filter_only' ? 'bg-[#E9EEF6] text-[#004494]' : 'hover:bg-gray-100 text-neutral-800'}">
        <Filter size="24" strokeWidth={2.5} />
      </button>
      <button onclick={() => togglePanel('selected_only')} 
        class="p-3 rounded-xl transition-all {openPanel === 'selected_only' ? 'bg-[#E9EEF6] text-[#004494]' : 'hover:bg-gray-100 text-neutral-800'}">
        <BookMarked size="24" strokeWidth={2.5} />
      </button>
    </nav>

    {#if openPanel === 'filter_only' || openPanel === 'selected_only'}
      <div class="fixed inset-0 z-40 bg-black/5" onclick={() => openPanel = null}></div>
    {/if}

    {#if openPanel}
      <aside 
        class="
            bg-white z-50 flex flex-col transition-all duration-300 ease-in-out
            {openPanel === 'sidebar' 
                ? 'relative h-full w-[450px] shrink-0 border-r' /* Sidebar: ดันเนื้อหา, เต็มจอ, เหลี่ยม */
                : 'absolute left-16 top-0 w-[400px] m-4 rounded-[2.5rem] h-auto max-h-[90vh] shadow-2xl border' /* Filter/Selected: ลอยทับ, มน, มี gap */
            } 
        "
      >
        <div class="p-8 flex flex-col h-full overflow-hidden">
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
            
            {#if openPanel === 'sidebar'}
              <div class="flex flex-col gap-2 mb-6 relative">
                <label class="text-[11px] text-gray-400 font-medium ml-1">คุณกำลังจัดตารางเรียน...</label>
                <div class="flex items-center gap-2">
                  <button onclick={() => isScheduleDropdownOpen = !isScheduleDropdownOpen} class="flex-1 h-14 bg-white border border-blue-500 rounded-2xl px-5 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-all overflow-hidden">
                    <span class="text-lg font-bold text-[#1C1B1F] truncate mr-2">{activeSchedule?.name || "เลือกตาราง"}</span>
                    <ChevronDown size={24} class="text-gray-400 shrink-0" />
                  </button>
                  <div class="h-14 px-3 py-2 bg-white border border-neutral-800 rounded-2xl flex flex-col justify-center items-center min-w-[100px] shadow-sm text-center">
                    <span class="text-[10px] font-bold text-neutral-800 leading-tight">ทวิภาค</span>
                    <span class="text-[10px] font-bold text-neutral-800 leading-tight whitespace-nowrap">{activeSchedule?.semester || "-"}</span>
                  </div>
                </div>

                {#if isScheduleDropdownOpen}
                  <div class="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden">
                    <div class="flex flex-col py-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {#each scheduleList as s}
                        <button onclick={() => { activeSchedule = s; isScheduleDropdownOpen = false; }} class="px-5 py-3 text-left hover:bg-gray-50 {activeSchedule.scheduleId === s.scheduleId ? 'bg-gray-50 font-bold' : ''}">
                          <span class="text-[15px] truncate block">{s.name}</span>
                        </button>
                      {/each}
                    </div>
                    <button class="w-full p-4 border-t flex items-center justify-center gap-2 text-[#004494] font-bold hover:bg-gray-50 transition-colors">
                      <Plus size={18} strokeWidth={3} /> เพิ่มตาราง
                    </button>
                  </div>
                  <div class="fixed inset-0 z-[65]" onclick={() => isScheduleDropdownOpen = false}></div>
                {/if}
              </div>
              <hr class="mb-6 opacity-50"/>
            {/if}

            {#if openPanel === 'sidebar' || openPanel === 'filter_only'}
              <div class="flex items-center gap-2 mb-6">
                <Filter size={20}/> <h2 class="font-bold text-xl">ตัวกรอง</h2>
              </div>
              <div class="mb-8 h-full"> 
                  <FilterBar 
                    bind:selectedGenEds bind:selectedSpecial bind:selectedFaculties bind:selectedDays bind:selectedEval
                    bind:startTime bind:endTime bind:fitSchedule bind:noConditions onsearch={onSearchFilter}
                  />
              </div>
              {#if openPanel === 'sidebar'} <hr class="mb-6 opacity-50"/> {/if}
            {/if}

            {#if openPanel === 'sidebar' || openPanel === 'selected_only'}
              <div class="flex items-center gap-2 mb-4">
                <BookMarked size={20}/> 
                <h2 class="font-bold text-xl">วิชาที่เลือก <span class="text-sm font-normal text-gray-400 ml-2">
                    {activeSchedule?.schedule.reduce((acc, curr) => acc + curr.course.credit, 0) ?? 0} หน่วยกิต
                </span></h2>
              </div>
              {#if activeSchedule}
                <SelectedCourse bind:schedule={activeSchedule.schedule} />
              {/if}
            {/if}
          </div>
        </div>
      </aside>
    {/if}

    <main class="flex-1 overflow-y-auto h-full bg-white scroll-smooth min-w-0">
      <div class="flex flex-col min-h-full">
        <div class="p-8 lg:p-12 max-w-[1200px] mx-auto w-full flex-1">
          
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-baseline gap-3">
              <h1 class="text-4xl font-bold text-[#1C1B1F]">วิชาเรียน</h1>
              <span class="text-sm text-gray-400 font-medium">({filteredCourses.length} ผลลัพธ์)</span>
            </div>
            
            <div class="flex gap-2 relative">
                <div class="relative">
                    <button onclick={() => toggleDropdown('program')} class="px-5 py-2 border border-neutral-800 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        {currentProgram} <ChevronDown size={16} />
                    </button>
                    {#if activeDropdown === 'program'}
                        <div class="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[70] overflow-hidden">
                            {#each programOptions as opt}
                                <button onclick={() => selectOption('program', opt)} class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 {currentProgram === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                            {/each}
                        </div>
                    {/if}
                </div>
                <div class="relative">
                    <button onclick={() => toggleDropdown('semester')} class="px-5 py-2 border border-neutral-800 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors whitespace-nowrap">
                        {currentSemester} <ChevronDown size={16} />
                    </button>
                    {#if activeDropdown === 'semester'}
                        <div class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[70] overflow-hidden">
                            <div class="flex flex-col py-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {#each semesterOptions as opt}
                                    <button onclick={() => selectOption('semester', opt)} class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 {currentSemester === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
                {#if activeDropdown} <div class="fixed inset-0 z-[65]" onclick={() => activeDropdown = null}></div> {/if}
            </div>
          </div>

          <div class="flex flex-col gap-1 mb-10">
            <div class="flex items-end gap-6">
                <div class="flex-1 flex flex-col gap-1">
                    <span class="text-xs text-gray-400 ml-1">ค้นหา...</span>
                    <Input bind:value={searchQuery} placeholder="" class="h-12 bg-[#F1F3F7] rounded-xl border-none px-6 text-lg font-medium w-full focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="flex flex-col gap-1 w-64">
                    <span class="text-[10px] text-gray-400 font-bold ml-1 uppercase">จัดลำดับตาม</span>
                    <div class="flex items-center gap-3 relative">
                        <button onclick={() => toggleDropdown('sort')} class="flex-1 h-12 bg-[#F1F3F7] rounded-xl flex items-center justify-between px-5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all">
                            <span>{currentSort}</span> <ChevronDown size={18} class="text-gray-400" />
                        </button>
                        {#if activeDropdown === 'sort'}
                            <div class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-[70] overflow-hidden">
                                {#each sortOptions as opt}
                                    <button onclick={() => selectOption('sort', opt)} class="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 {currentSort === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                                {/each}
                            </div>
                        {/if}
                        <button onclick={toggleSortDirection} class="flex items-center justify-center text-[#004494] h-12 w-12 rounded-xl hover:bg-blue-50 transition-all cursor-pointer">
                            <div class="transition-transform duration-300 {sortDirection === 'asc' ? 'rotate-180' : 'rotate-0'}">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-32">
            {#each filteredCourses as item}
              <CourseCard 
                course={item.course} 
                recommended={item.recommended} 
                selected={activeSchedule ? activeSchedule.schedule.some(s => s.course.code === item.course.code) : false} 
                onclick={() => handleToggleCourse(item)} 
                class="w-full"
              />
            {/each}
          </div>
        </div>
        
        <div class="w-full bg-white border-t mt-auto">
          <Footer />
        </div>
      </div>
    </main>
  </div>
</div>