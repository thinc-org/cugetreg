<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

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

	const t = useTranslations(
		defineMessages({
			th: { section: 'Sec {section}' },
			en: { section: 'Sec {section}' }
		})
	);

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
	{#if course.code}
		<span class="max-w-full truncate text-left text-[15cqh]">{course.code}</span>
	{/if}
	<span class="max-w-full truncate text-left text-[16cqh] font-medium">{courseName}</span>
	{#if course.section !== undefined}
		<span class="max-w-full truncate text-left text-[15cqh]"
			>{course.bldg} {course.room} | {t('section', { section: course.section })}</span
		>
	{/if}
</div>
