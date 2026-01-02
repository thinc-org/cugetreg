<script lang="ts">
    import { Button } from "../lib/components/atoms/button";
    import { IconButton } from "../lib/components/atoms/icon-button";
    import { Input } from "../lib/components/atoms/input";
    import { Switch } from "../lib/components/atoms/switch";
    import { TimetableCourseCard } from "../lib/components/atoms/timetable";
    import Timetable from "../lib/components/atoms/timetable/timetable.svelte";
    import * as Select from "../lib/components/molecules/select";
    import { Footer } from "../lib/components/organisms/footer";
    import { Navbar } from "../lib/components/organisms/navbar";
    import { SelectedCourse } from "../lib/components/organisms/selected-course";
    import { mockSchedule } from "../mockData";
    import type { CourseSchedule, Day } from "../types";

    import { Share2, Ellipsis } from "lucide-svelte";

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
            <Input />
            <IconButton class="aspect-square">
                <Share2 class="" />
            </IconButton>
            <Button>บันทึกเป็นภาพ</Button>
        </div>

        <div class="flex my-5">
            <div class="flex-1">
                <span class="text-2xl font-bold">Midterm</span>
            </div>
            <div class="flex-1">
                <span class="text-2xl font-bold">Finals</span>
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
