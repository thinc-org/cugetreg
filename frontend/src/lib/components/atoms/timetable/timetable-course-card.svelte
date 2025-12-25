<script lang="ts">
    import {
        timeTableCourseCardVariant,
        type TimeTableCardColor,
        type TimeTableContext,
        type TimeTableCourse,
    } from "./index";
    import { cn } from "../../../../utils";
    import { getContext } from "svelte";

    // TODO: Add hover + onclick

    const context = getContext<TimeTableContext>("timetable-context");

    const numCol = context.periodPerDay;
    const numRow = context.amountOfDays;

    interface TimeTableCourseCardProp {
        course: TimeTableCourse;
        color?: TimeTableCardColor;
        length?: number;
        col?: number;
        row?: number;
    }

    const {
        course,
        color,
        length = 2,
        col = 0,
        row = 0,
    }: TimeTableCourseCardProp = $props();
</script>

<div
    style="
        --cols: {numCol};
        --rows: {numRow};
        --len: {length};
        --x: {row};
        --y: {col};
    "
    class={cn(timeTableCourseCardVariant({ color }))}
>
    {#if length === 1}
        <span class="text-[1.8cqh] truncate">{course.name}</span>
        <span class="text-[1.5cqh] truncate">{course.bldg} {course.room}</span>
        <span class="text-[1.3cqh]">Sec {course.section}</span>
    {:else}
        <span class="text-[1.8cqh]">{course.code}</span>
        <span class="text-[2cqh]">{course.name}</span>
        <span class="text-[1.8cqh]">
            {course.bldg}
            {course.room} | Sec {course.section}
        </span>
    {/if}
</div>
