<script lang="ts">
    import { Button } from "../lib/components/atoms/button";
    import { IconButton } from "../lib/components/atoms/icon-button";
    import { Input } from "../lib/components/atoms/input";
    import { Switch } from "../lib/components/atoms/switch";
    import { TimetableCourseCard } from "../lib/components/atoms/timetable";
    import Timetable from "../lib/components/atoms/timetable/timetable.svelte";
    import { ExamCard, type Exam, type StatusColour } from "../lib/components/molecules/exam-card"
    import * as Select from "../lib/components/molecules/select";
    import { Navbar } from "../lib/components/organisms/navbar";
    import { SelectedCourse } from "../lib/components/organisms/selected-course";
    import { mockScheduleList } from "../mockData";
    import type { CourseSchedule, Day } from "../types";

    import { Share2, Ellipsis, Copy, ChevronLeft, ChevronRight } from "lucide-svelte";
    import { isMidtermConflict, isFinalsConflict, formatExamTime, formatDate, discardTime, formatExamColumn } from "../utils"
    import SelectTimetable from "../lib/components/molecules/select-timetable/select-timetable.svelte"

    function getColumnFromDay(day: Day): number {
        switch (day) {
            case "MO":
                return 0;
            case "TU":
                return 1;
            case "WE":
                return 2;
            case "TH":
                return 3;
            case "FR":
                return 4;
            case "SA":
                return 5;
            case "SU":
                return 6;
        }
    }

    function isConflicted(course: CourseSchedule): boolean {
        const courseSection = course.course.sections[course.selectedSection];

        for (const other of selectedSchedule.schedule) {
            if (other === course || other.hidden) continue;

            const otherSection = other.course.sections[other.selectedSection];

            for (const period of courseSection) {
                for (const otherPeriod of otherSection) {
                    if (period.day !== otherPeriod.day) continue;

                    const periodStart = period.startTime;
                    const periodEnd = period.startTime + period.duration;
                    const otherPeriodStart = otherPeriod.startTime;
                    const otherPeriodEnd = otherPeriod.startTime + otherPeriod.duration;

                    if (
                        periodStart < otherPeriodEnd &&
                        otherPeriodStart < periodEnd
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // NOTE: Temporary: this should be global state
    let scheduleList = $state(mockScheduleList);
    let selectedSchedule = $state(scheduleList[0]);
    let showExamSchedule = $state<"List" | "Schedule">("Schedule");

    // TODO: Temporary
    let currentSchedule = $state("schedule 1");
    let isPublic = $state(false);

    const examSort = (a: string, b: string) => {
        const numA = Number(a);
        const numB = Number(b);

        if (numA === 0) return 1;
        else if (numB === 0) return -1;
        else return numA - numB;
    }

    const examsData = $derived.by(() => {
        let midterms: Record<number, CourseSchedule[]> = {};
        let finals: Record<number, CourseSchedule[]> = {};

        selectedSchedule.schedule.forEach((course) => {
            if (course.hidden) return;

            const { midterm, final } = course.course;

            if (midterm) {
                const formattedDate = discardTime(midterm.date.getTime());
                if (formattedDate in midterms) midterms[formattedDate].push(course);
                else midterms[formattedDate] = [course];
            } else {
                if (!(0 in midterms)) midterms[0] = [];
                midterms[0].push(course);
            }

            if (final) {
                const formattedDate = discardTime(final.date.getTime());
                if (formattedDate in finals) finals[formattedDate].push(course);
                else finals[formattedDate] = [course];
            } else {
                if (!(0 in midterms)) midterms[0] = [];
                finals[0].push(course);
            }
        });

        return { midterms, finals };
    });

    const examDateOrder = $derived.by(() => {
        let midterms: number[] = Object.keys(examsData.midterms).sort(examSort).map(x => Number(x));
        let finals: number[] = Object.keys(examsData.finals).sort(examSort).map(x => Number(x));

        return { midterms, finals };
    });

    const totalCredit = $derived(
        selectedSchedule.schedule.reduce(
            (acc, course) => acc + (course.hidden ? 0 : course.course.credit),
            0,
        ),
    );

    $effect(() => {
        selectedSchedule.schedule.forEach(
            (course, index) =>
                (selectedSchedule.schedule[index].conflicted = isConflicted(course)),
        );
    });
</script>

<div class="flex flex-col h-screen">
    <Navbar />
    <div class="w-full flex flex-1 overflow-hidden">
        <div class="
            flex flex-col flex-1 border-r border-neutral-200
            overflow-hidden
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        ">
            <SelectTimetable 
                class="px-2 py-5 border-b border-neutral-200"
                options={scheduleList}
                bind:value={selectedSchedule}
            />
            <SelectedCourse bind:schedule={selectedSchedule.schedule} class="border-b border-neutral-200" />

            <div
                class="border-2 border-tangerine-500 text-tangerine-700 m-5 p-5 items-center rounded-2xl"
            >
                <div class="text-center font-bold">
                    CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง
                </div>
                <div class="text-center">
                    สามารถลงทะเบียนเรียนได้ที่ <a
                        href="https://www2.reg.chula.ac.th/"
                        >https://www2.reg.chula.ac.th/</a
                    >
                    เพียงช่องทางเดียวเท่านั้น
                </div>
            </div>
        </div>

        <div class="flex-3 p-10 overflow-y-auto">
            <div class="flex justify-between">
                <span class="text-4xl font-bold">ตารางเรียน</span>

                <div class="flex">
                    <Select.Root type="single" bind:value={currentSchedule}>
                        <Select.Trigger>
                            {currentSchedule}
                        </Select.Trigger>
                        <Select.Content>
                            <!-- TODO: -->
                            <Select.Group>
                                {#each [1, 2, 3, 4] as item}
                                    <Select.Item
                                        value={`Schedule ${item}`}
                                        label={`Schedule ${item}`}
                                        aria-label={`Schedule ${item}`}
                                        role="option"
                                    />
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>

                    <IconButton class="aspect-square mx-3">
                        <Ellipsis />
                    </IconButton>
                </div>
            </div>
            <div class="p-8">
                <Timetable startTime={7}>
                    {#each selectedSchedule.schedule as courseSchedule}
                        {@render timeTableCourse(courseSchedule)}
                    {/each}
                </Timetable>
            </div>
            <div class="flex justify-end mx-5 mb-5 font-bold text-lg">
                หน่วยกิตรวม {totalCredit} / 22
            </div>

            <div class="flex">
                <Switch bind:checked={isPublic} label="เปิดเป็นสาธารณะ" />
                <div class="flex flex-1 relative">
                    <Input 
                        value="cugetreg.com/1232141413"
                        disabled={!isPublic}
                        readonly 
                    />

                    <IconButton 
                        variant="ghost" 
                        disabled={!isPublic}
                        class="absolute z-10 right-0 hover:cursor-pointer hover:bg-transparent"
                    >
                        <Copy /> 
                    </IconButton>
                </div>
                <div>
                    <IconButton class="aspect-square">
                        <Share2/>
                    </IconButton>
                    <Button class="h-full m-0">บันทึกเป็นภาพ</Button>
                </div>
            </div>

            <div class="flex justify-center mt-5">
                <Button
                    class="outline-0 ring-0 hover:bg-transparent!"
                    onclick={() => {
                        if (showExamSchedule === "List") showExamSchedule = "Schedule";
                        else showExamSchedule = "List";
                    }}
                    variant="outlined"
                >
                    <ChevronLeft />               
                    {showExamSchedule}
                    <ChevronRight />
                </Button>
            </div>

            {#if showExamSchedule === "List"}
                {@render examList()}
            {:else}
                {@render examSchedule()}
            {/if}
        </div>
    </div>
</div>


{#snippet examSchedule()}
    <div class="font-bold text-xl my-5">Midterm</div>
    <Timetable 
        startTime={7} 
        days={
            examDateOrder.midterms.map(time => formatDate(new Date(time)))
        }
    >
        {#each examDateOrder.midterms as key, index}
            {#each examsData.midterms[key] as exam}
                <TimetableCourseCard 
                    course={{
                        name: exam.course.name,
                        code: exam.course.code,
                        bldg: "",
                        room: "",
                        section: exam.selectedSection
                    }}
                    col={formatExamColumn(exam.course.midterm?.date) - 7}
                    row={index}
                    length={exam.course.midterm?.duration ?? 3}
                    color={exam.colorVariant}
                />
            {/each}
         {/each} 
    </Timetable>

    <div class="font-bold text-xl my-5">Finals</div>
    <Timetable 
        startTime={7} 
        days={
            examDateOrder.finals.map(time => formatDate(new Date(time)))
        }
    >
        {#each examDateOrder.finals as key, index}
            {#each examsData.finals[key] as examCourse}
                <TimetableCourseCard 
                    course={{
                        name: examCourse.course.name,
                        code: examCourse.course.code,
                        bldg: "",
                        room: "",
                        section: examCourse.selectedSection
                    }}
                    col={formatExamColumn(examCourse.course.final?.date) - 7}
                    row={index}
                    length={examCourse.course.final?.duration ?? 3}
                    color={examCourse.colorVariant}
                />
            {/each}
         {/each} 
    </Timetable>
{/snippet}

{#snippet examList()}
    <div class="flex justify-center  items-center">
        <div class="my-5 inline-flex space-x-5">
            <div class="flex-1">
                <span class="text-2xl font-bold">Midterm</span>

                {#each Object.keys(examsData.midterms).sort(examSort) as key}
                    <div class="my-5">
                        <ExamCard 
                            date={key == "0" ? "ยังไม่ประกาศ" : formatDate(new Date(Number(key)))}
                            data={
                                examsData.midterms[Number(key)].map(course => {
                                    const { id, course: courseData, colorVariant } = course;

                                    return {
                                        id: String(id),
                                        colour: isMidtermConflict(course, examsData.midterms[Number(key)]) ? "error" : (colorVariant as StatusColour),
                                        time: formatExamTime(courseData.midterm?.date, courseData.midterm?.duration),
                                        subject: courseData.name
                                    } as Exam
                                })
                            }
                        />
                    </div>
                {/each}
            </div>
            <div class="flex-1">
                <span class="text-2xl font-bold">Finals</span>

                {#each Object.keys(examsData.finals).sort(examSort) as key}
                    <div class="my-5">
                        <ExamCard 
                            date={key == "0" ? "ยังไม่ประกาศ" : formatDate(new Date(Number(key)))}
                            data={
                                examsData.finals[Number(key)].map(course => {
                                    const { id, course: courseData, colorVariant } = course;

                                    return {
                                        id: String(id),
                                        colour: isFinalsConflict(course, examsData.finals[Number(key)]) ? "error" : (colorVariant as StatusColour),
                                        time: formatExamTime(courseData.final?.date, courseData.final?.duration),
                                        subject: courseData.name
                                    } as Exam
                                })
                            }
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/snippet}

{#snippet timeTableCourse({
    course,
    selectedSection,
    hidden,
    colorVariant,
    conflicted,
}: CourseSchedule)}
    {#if !hidden}
        {#each course.sections[selectedSection] as period}
            <TimetableCourseCard
                course={{
                    name: course.name,
                    code: course.code,
                    bldg: period.building,
                    room: period.room,
                    section: selectedSection,
                }}
                length={period.duration}
                color={conflicted ? "conflict" : (colorVariant ?? "neutral")}
                row={getColumnFromDay(period.day)}
                col={period.startTime - 7}
            />
        {/each}
    {/if}
{/snippet}
