<script lang="ts">
	import { getContext } from 'svelte';

	import { cn } from '@cugetreg/utils';

	import {
		type TimeTableCardColor,
		type TimeTableContext,
		type TimeTableCourse,
		timeTableCourseCardVariant
	} from './index';

	let context = getContext<TimeTableContext>('timetable-context');

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

	let courseName: string = $derived.by(() => {
		if (course.name.length > 20) {
			return course.abbrName ?? course.name;
		}
		return course.name;
	});
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
		<!-- <span class="truncate text-[13cqh]">{course.code}</span> -->
		<span class="truncate text-[15cqh] font-medium">{course.abbrName}</span>
		<span class="truncate text-[13cqh]">
			{course.bldg}
			{course.room}
		</span>
	{:else}
		<span class="truncate text-[15cqh]">{course.code}</span>
		<span class="truncate text-[16cqh] font-medium">{courseName}</span>
		<span class="truncate text-[15cqh]">{course.bldg} {course.room} | Sec {course.section}</span>
	{/if}
</div>
