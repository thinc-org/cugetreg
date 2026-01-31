<script lang="ts">
	import { Check, Dot, Plus } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';

	import type { Course } from './index.js';

	import { Button } from '../../atoms/button/index.js';
	import { DayChip } from '../../atoms/day-chip/index.js';
	import { GenedChip } from '../../atoms/gened-chip/index.js';
	import { RecommendedTag } from '../../atoms/recommended-tag/index.js';

	interface Props {
		class?: string | undefined | null;
		course?: Course;
		selected?: boolean;
		recommended?: boolean;
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		course,
		selected = $bindable(false),
		recommended = false,
		...rest
	}: Props = $props();

	export const onButtonClick = () => {
		selected = !selected;
	};
</script>

<div
	class={cn(
		'relative flex h-[164px] w-[334px] flex-col gap-3 rounded-xl px-4 py-5 ring-2 ring-neutral-100 md:h-[194px] md:w-[440px] md:p-6',
		className
	)}
	{...rest}
>
	{#if recommended}
		<RecommendedTag class="absolute top-[-9.5px] left-0" />
	{/if}
	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-col">
			<div class="text-caption font-medium">{course?.code}</div>
			<div class="sm:text-body2 md:text-body1 font-medium">
				{course?.name}
			</div>
		</div>
		<div class="flex gap-1">
			{#each course?.gened ?? [] as gened (gened)}
				<GenedChip type={gened} />
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div class="text-caption flex flex-row items-center font-normal text-neutral-400">
			<span>{course?.credit} หน่วยกิต</span>
			<Dot color="#EDEDF1" size="16" />
			<span>ที่นั่ง GenEd {course?.seat} / {course?.maxseat}</span>
			<Dot color="#EDEDF1" size="16" />
			<span>{course?.review} รีวิว</span>
		</div>
		<div class="flex gap-2">
			{#each course?.days ?? [] as day (day)}
				<DayChip {day} />
			{/each}
		</div>
	</div>
	<div class="flex flex-row items-center justify-between">
		<Button
			variant="outlined"
			color="neutral"
			class="text-caption md:text-body2 h-7 w-36 md:h-9 md:w-48"
		>
			เลือกเซคชัน
		</Button>
		{#if !selected}
			<Button
				variant="outlined"
				color="primary"
				onclick={onButtonClick}
				class="text-caption md:text-body2 h-7 w-36 md:h-9 md:w-48"
				size="sm"
			>
				เลือก <Plus size="16" strokeWidth="3" />
			</Button>
		{:else}
			<Button
				color="primary"
				onclick={onButtonClick}
				class="text-caption md:text-body2 h-7 w-36 md:h-9 md:w-48"
			>
				เลือก <Check size="16" strokeWidth="3" />
			</Button>
		{/if}
	</div>
</div>
