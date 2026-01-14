<script lang="ts">
    import {
        timeTableCourseCardVariant,
        type TimeTableCardColor,
        type TimeTableContext,
        type TimeTableCourse,
    } from "./index";
    import { cn } from "../../../../utils";
    import { getContext } from "svelte";

    let context = getContext<TimeTableContext>("timetable-context");

    interface TimeTableCourseCardProp {
        course: TimeTableCourse;
        color?: TimeTableCardColor;
        length?: number;
        col?: number;
        row?: number;
        [key: string]: unknown;
    }

    const {
        course,
        color,
        length = 2,
        col = 0,
        row = 0,
        ...rest
    }: TimeTableCourseCardProp = $props();
</script>

<div
    style="
        --cols: {context.periodPerDay};
        --rows: {context.amountOfDays};
        --len: {length};
        --x: {row};
        --y: {col};
    "
    class={cn(timeTableCourseCardVariant({ color }))}
    {...rest}
>
    <!-- NOTE: Scaling on some resolution is kinda wonky -->
    {#if length === 1}
        <span class="text-[15cqh] truncate">{course.code}</span>
        <span class="text-[16cqh] font-bold truncate">{course.name}</span>
        <span class="text-[15cqh] truncate">
            {course.bldg}
            {course.room}
        </span>
    {:else}
        <span class="truncate text-[16cqh]">{course.code}</span>
        <span class="truncate text-[20cqh] font-bold">{course.name}</span>
        <span class="truncate text-[16cqh]"
            >{course.bldg} {course.room} | Sec {course.section}</span
        >
    {/if}
</div>
