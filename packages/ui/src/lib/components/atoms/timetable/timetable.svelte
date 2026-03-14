<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { setContext, type Snippet } from 'svelte';

	import { cn } from '@cugetreg/utils';

	import { type TimeTableContext } from './index';

	const DAYS5 = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

	interface TimeTableProp {
		periodPerDay?: number;
		startTime: number;
		class?: ClassValue;
		days?: string[];
		children?: Snippet;
	}

	let {
		periodPerDay = 12,
		startTime = 6,
		class: className = undefined,
		days = DAYS5,
		children = undefined
	}: TimeTableProp = $props();

	let amountOfDays = $derived(days.length);

	setContext<TimeTableContext>('timetable-context', {
		get periodPerDay() {
			return periodPerDay;
		},
		get amountOfDays() {
			return amountOfDays;
		}
	});
</script>

<div
	class={cn('grid border-t border-l border-neutral-200', className)}
	style="
        grid-template-columns: repeat({periodPerDay + 1}, minmax(0, 1fr));
        grid-template-rows: auto repeat({amountOfDays + 1});
    "
>
	<div class="cell truncate border-r border-b border-neutral-200 bg-indigo-50! py-3.5">
		วัน/เวลา
	</div>
	<div
		class="grid divide-x divide-neutral-200"
		style="
            grid-column: span {periodPerDay} / span {periodPerDay};
            grid-template-columns: repeat({periodPerDay}, minmax(0, 1fr));
        "
	>
		{#each Array.from({ length: periodPerDay }) as _, i (i)}
			<div
				class="
                    cell @container-[size] items-end! justify-end! bg-indigo-50! px-2 py-3.5
                    text-right!
                "
			>
				<span class="text-sm">
					{i + startTime}
				</span>
			</div>
		{/each}
	</div>

	<div
		class="grid divide-y divide-neutral-200"
		style="grid-row: span {amountOfDays} / span {amountOfDays}"
	>
		{#each days as day (day)}
			<div class="cell @container-[size] aspect-square bg-indigo-50!">
				<span class="text-[20cqh]">
					{day}
				</span>
			</div>
		{/each}
	</div>

	<div
		class="relative"
		style="
            grid-row: span {amountOfDays} / span {amountOfDays};
            grid-column: span {periodPerDay} / span {periodPerDay};
        "
	>
		<div
			class="grid grid-cols-5"
			style="
                grid-template-columns: repeat({periodPerDay}, minmax(0, 1fr));
                grid-template-rows: repeat({amountOfDays}, minmax(0, 1fr));
            "
		>
			{#each Array.from({ length: periodPerDay * amountOfDays }) as _, i (i)}
				<div class="cell relative aspect-square"></div>
			{/each}
		</div>

		<div class="absolute top-0 left-0 h-full w-full">
			<div class="relative h-full w-full">
				{@render children?.()}
			</div>
		</div>
	</div>
</div>

<style>
	@reference "@cugetreg/ui/css";

	.cell {
		@apply flex items-center justify-center bg-white text-center;
		@apply border-r border-b border-neutral-200;
		@apply text-sm;
	}
</style>
