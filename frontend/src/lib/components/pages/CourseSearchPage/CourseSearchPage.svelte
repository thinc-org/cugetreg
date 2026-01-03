<script lang="ts">
    import { Navbar } from "../../organisms/navbar/index.js";
    import { Footer } from "../../organisms/footer/index.js";
    import { SelectedCourse } from "../../organisms/selected-course/index.js";
    import { CourseCard } from "../../molecules/course-card/index.js";
    import { Input } from "../../atoms/input/index.js";
    import { Menu, Filter, BookMarked, Plus, ChevronDown } from "lucide-svelte"; 

    let { courses = [] } = $props(); 

    // --- STATES ---
    let openPanel = $state<"sidebar" | "filter_only" | "selected_only" | null>(null);
    let selectedSchedule = $state([]); 
    let searchQuery = $state("");
    let isDropdownOpen = $state(false); // สำหรับ Select ตารางเรียน

    // --- DROPDOWN STATES ---
    let activeDropdown = $state<"program" | "semester" | "sort" | null>(null);
    
    // 1. นานาชาติ
    let currentProgram = $state("นานาชาติ");
    const programOptions = ["ทวิภาค", "ตรีภาค", "นานาชาติ"];

    // 2. ภาคเรียน
    let currentSemester = $state("2566 / ภาคต้น");
    const semesterOptions = ["2568 / ฤดูร้อน", "2568 / 2", "2568 / 1", "2567 / ฤดูร้อน", "2567 / 2"];

    // 3. จัดลำดับตาม
    let currentSort = $state("จำนวนที่นั่ง");
    const sortOptions = ["จำนวนที่นั่ง", "ชื่อวิชา", "จำนวนที่นั่งเหลือ"];

    // ข้อมูลตารางเรียน
    let schedules = $state([
        { id: 1, label: "ตารางที่ 1" },
        { id: 2, label: "ลองสร้าง ถ้าชื่อยาวเกินไปเหรอ..." },
        { id: 3, label: "ตารางที่ 4" },
    ]);
    let activeSchedule = $state(schedules[0]);

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

    function selectSchedule(s) {
        activeSchedule = s;
        isDropdownOpen = false;
    }

    function addNewSchedule() {
        const newId = schedules.length + 1;
        schedules = [...schedules, { id: newId, label: `ตารางที่ ${newId}` }];
        activeSchedule = schedules[schedules.length - 1];
        isDropdownOpen = false;
    }

    function handleToggleCourse(courseItem) {
        const index = selectedSchedule.findIndex(s => s.course.code === courseItem.course.code);
        if (index === -1) {
            selectedSchedule = [...selectedSchedule, {
                id: Date.now(),
                course: courseItem.course,
                selectedSection: 1,
                colorVariant: "neutral",
                hidden: false,
                recommended: courseItem.recommended
            }];
        } else {
            selectedSchedule = selectedSchedule.filter(s => s.course.code !== courseItem.course.code);
        }
    }

    let filteredCourses = $derived(
        courses.filter(item => 
            (item.course?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.course?.code || "").includes(searchQuery)
        )
    );
</script>

<div class="flex flex-col h-screen bg-white overflow-hidden relative">
    <Navbar />

    <div class="flex flex-1 overflow-hidden relative">
        <nav class="w-16 border-r flex flex-col items-center py-6 gap-6 bg-white z-[65]">
            <button onclick={() => togglePanel('sidebar')} class="p-3 rounded-xl transition-all {openPanel === 'sidebar' ? 'bg-[#E9EEF6] text-[#004494]' : 'hover:bg-gray-100 text-neutral-800'}">
                <Menu size="24" strokeWidth={2.5} />
            </button>
            <button onclick={() => togglePanel('filter_only')} class="p-3 rounded-xl transition-all {openPanel === 'filter_only' ? 'bg-[#E9EEF6] text-[#004494]' : 'hover:bg-gray-100 text-neutral-800'}">
                <Filter size="24" strokeWidth={2.5} />
            </button>
            <button onclick={() => togglePanel('selected_only')} class="p-3 rounded-xl transition-all {openPanel === 'selected_only' ? 'bg-[#E9EEF6] text-[#004494]' : 'hover:bg-gray-100 text-neutral-800'}">
                <BookMarked size="24" strokeWidth={2.5} />
            </button>
        </nav>

        {#if openPanel}
            <div class="fixed inset-0 z-40 bg-black/5" onclick={() => openPanel = null}></div>
            <aside class="absolute left-16 top-0 bg-white shadow-2xl z-50 border transition-all duration-200 animate-in slide-in-from-left {openPanel === 'sidebar' ? 'w-[450px] h-full rounded-none' : 'w-[400px] m-4 rounded-[2.5rem] h-auto max-h-[85vh] flex flex-col'}">
                <div class="p-8 flex flex-col h-full overflow-hidden">
                    {#if openPanel === 'sidebar'}
                        <div class="flex flex-col gap-2 mb-6 relative">
                            <label class="text-[11px] text-gray-400 font-medium ml-1">คุณกำลังจัดตารางเรียน...</label>
                            <div class="flex items-center gap-2">
                                <button onclick={() => isDropdownOpen = !isDropdownOpen} class="flex-1 h-14 bg-white border border-blue-500 rounded-2xl px-5 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-all overflow-hidden">
                                    <span class="text-lg font-bold text-[#1C1B1F] truncate mr-2">{activeSchedule.label}</span>
                                    <ChevronDown size={24} class="text-gray-400 shrink-0" />
                                </button>
                                <div class="h-14 px-3 py-2 bg-white border border-neutral-800 rounded-2xl flex flex-col justify-center items-center min-w-[100px] shadow-sm">
                                    <span class="text-[10px] font-bold text-neutral-800 leading-tight">ทวิภาค</span>
                                    <span class="text-[10px] font-bold text-neutral-800 leading-tight whitespace-nowrap">2566 / ภาคต้น</span>
                                </div>
                            </div>
                            {#if isDropdownOpen}
                                <div class="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden">
                                    <div class="flex flex-col py-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {#each schedules as s}
                                            <button onclick={() => selectSchedule(s)} class="px-5 py-3 text-left hover:bg-gray-50 {activeSchedule.id === s.id ? 'bg-gray-50 font-bold' : ''}">
                                                <span class="text-[15px] truncate block">{s.label}</span>
                                            </button>
                                        {/each}
                                    </div>
                                    <button onclick={addNewSchedule} class="w-full p-4 border-t flex items-center justify-center gap-2 text-[#004494] font-bold hover:bg-gray-50">
                                        <Plus size={18} strokeWidth={3} /> เพิ่มตาราง
                                    </button>
                                </div>
                                <div class="fixed inset-0 z-[65]" onclick={() => isDropdownOpen = false}></div>
                            {/if}
                        </div>
                        <hr class="mb-6 opacity-50"/>
                    {/if}
                    <h2 class="font-bold text-[#1C1B1F] mb-6 text-xl">{openPanel === 'sidebar' ? 'ตัวกรอง' : openPanel === 'filter_only' ? 'ตัวกรอง' : 'วิชาที่เลือก'}</h2>
                    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {#if openPanel === 'sidebar' || openPanel === 'filter_only'}
                             <div class="bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl p-10 text-center text-xs text-gray-300 mb-8">[ พื้นที่ตัวกรอง ]</div>
                        {/if}
                        {#if openPanel === 'sidebar' || openPanel === 'selected_only'}
                            {#if openPanel === 'sidebar'}<h2 class="font-bold text-[#1C1B1F] mb-4 text-xl">วิชาที่เลือก</h2>{/if}
                            <SelectedCourse bind:schedule={selectedSchedule} />
                        {/if}
                    </div>
                </div>
            </aside>
        {/if}

        <main class="flex-1 overflow-y-auto h-full bg-white scroll-smooth">
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
                                <Input bind:value={searchQuery} placeholder="ค้นหาวิชาเรียน" class="h-12 bg-[#F1F3F7] rounded-xl border-none px-6 text-lg font-medium w-full focus:ring-2 focus:ring-blue-500" />
                            </div>
                            
                            <div class="flex flex-col gap-1 w-64">
                                <span class="text-[10px] text-gray-400 font-bold ml-1 uppercase">จัดลำดับตาม</span>
                                <div class="flex items-center gap-3 relative">
                                    <button onclick={() => toggleDropdown('sort')} class="flex-1 h-12 bg-[#F1F3F7] rounded-xl flex items-center justify-between px-5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all">
                                        <span>{currentSort}</span>
                                        <ChevronDown size={18} class="text-gray-400" />
                                    </button>
                                    {#if activeDropdown === 'sort'}
                                        <div class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-[70] overflow-hidden">
                                            {#each sortOptions as opt}
                                                <button onclick={() => selectOption('sort', opt)} class="w-full px-5 py-3 text-left text-sm hover:bg-gray-50 {currentSort === opt ? 'bg-gray-50 font-bold' : ''}">{opt}</button>
                                            {/each}
                                        </div>
                                    {/if}
                                    <div class="flex items-center justify-center text-[#004494] h-12">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 pb-32">
                        {#each filteredCourses as item}
                            <CourseCard course={item.course} recommended={item.recommended} selected={selectedSchedule.some(s => s.course.code === item.course.code)} onclick={() => handleToggleCourse(item)} />
                        {/each}
                    </div>
                </div>
                <div class="w-full bg-white border-t mt-auto"><Footer /></div>
            </div>
        </main>
    </div>
</div>

<style>
    :global(body) { margin: 0; padding: 0; overflow: hidden; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>