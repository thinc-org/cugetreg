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
    import { mockSchedule } from "../mockData";
    import type { Course, CourseSchedule, Day } from "../types";

    import { Share2, Ellipsis, Copy } from "lucide-svelte";
    import { formatTimePeriod, isMidtermConflict, isFinalsConflict } from "../utils"

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

        for (const other of schedule) {
            if (other === course || other.hidden) continue;

            const otherSection = other.course.sections[other.selectedSection];

            for (const period of courseSection) {
                for (const otherPeriod of otherSection) {
                    if (period.day !== otherPeriod.day) continue;

                    const periodStart = period.startTime;
                    const periodEnd = period.startTime + period.duration;
                    const otherPeriodStart = otherPeriod.startTime;
                    const otherPeriodEnd =
                        otherPeriod.startTime + otherPeriod.duration;

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

    let schedule = $state(mockSchedule);

    // TODO: Temporary
    let currentSchedule = $state("schedule 1");
    let isPublic = $state(false);

    const examsData = $derived.by(() => {
        let midterms: Record<string, CourseSchedule[]> = {};
        let finals: Record<string, CourseSchedule[]> = {};

        schedule.forEach((course) => {
            if (course.hidden) return;

            const { midterm, final } = course.course;

            if (midterm) {
                const date = midterm.date;
                if (date in midterms) midterms[date].push(course);
                else midterms[date] = [course];
            }

            if (final) {
                const date = final.date;
                if (date in finals) finals[date].push(course);
                else finals[date] = [course];
            }
        })

        return { midterms, finals };
    })

    const totalCredit = $derived(
        schedule.reduce(
            (acc, course) => acc + (course.hidden ? 0 : course.course.credit),
            0,
        ),
    );

    $effect(() => {
        schedule.forEach(
            (course, index) =>
                (schedule[index].conflicted = isConflicted(course)),
        );
    });
</script>

<Navbar />
<div class="w-full flex">
    <div class="flex-1 border-r border-neutral-200 overflow-hidden">
        <SelectedCourse bind:schedule class="border-b border-neutral-200" />

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

    <div class="flex-3 p-10">
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
                {#each schedule as courseSchedule}
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

        <div class="flex my-5">
            <div class="flex-1">
                <span class="text-2xl font-bold">Midterm</span>
                {#each Object.entries(examsData.midterms) as [date, courses]}
                    <div class="my-5">
                        <ExamCard 
                            date={date}
                            data={
                                courses.map(course => {
                                    const { id, course: courseData, colorVariant } = course;

                                    return {
                                        id: String(id),
                                        colour: isMidtermConflict(course, courses) ? "error" : (colorVariant as StatusColour),
                                        time: formatTimePeriod(courseData.midterm?.startTime, courseData.midterm?.duration),
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
                {#each Object.entries(examsData.finals) as [date, courses]}
                    <div class="my-5">
                        <ExamCard 
                            date={date}
                            data={
                                courses.map(course => {
                                    const { id, course: courseData, colorVariant } = course;

                                    return {
                                        id: String(id),
                                        colour: isFinalsConflict(course, courses) ? "error" : (colorVariant as StatusColour),
                                        time: formatTimePeriod(courseData.final?.startTime, courseData.final?.duration),
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
</div>

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
