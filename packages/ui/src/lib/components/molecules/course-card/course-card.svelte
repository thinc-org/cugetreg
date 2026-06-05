<script lang="ts">
	import { Check, Dot, Plus } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';

	import type { Course } from './index.js';

	import { Button } from '../../atoms/button/index.js';
	import { Chip } from '../../atoms/chip/index.js';
	import { DayChip } from '../../atoms/day-chip/index.js';
	import { GenedChip } from '../../atoms/gened-chip/index.js';
	import { RecommendedTag } from '../../atoms/recommended-tag/index.js';
	import * as Select from '../../molecules/select/index.js';

	interface Props {
		class?: string | undefined | null;
		course?: Course;
		selected?: boolean;
		recommended?: boolean;
		specialType?: string;
		onSelect?: () => void;
		sections?: Array<{ value: string; label: string }>;
		selectedSection?: string;
		onSelectSection?: (value: string) => void;
		courseUrl?: string;
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		course,
		selected = $bindable(false),
		recommended = false,
		specialType,
		onSelect,
		sections,
		selectedSection = $bindable(''),
		onSelectSection,
		courseUrl = '',
		...rest
	}: Props = $props();

	export const onButtonClick = (event?: MouseEvent) => {
		event?.stopPropagation();
		if (onSelect) {
			onSelect();
			return;
		}
		selected = !selected;
	};
</script>

<div
	class={cn(
		'relative flex w-[334px] flex-col gap-3 rounded-xl px-4 py-5 ring-2 ring-neutral-100 md:w-[440px] md:p-6',
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
			<a
				class="sm:text-body2 md:text-body1 font-medium hover:cursor-pointer hover:underline"
				href={courseUrl}
			>
				{course?.name}
			</a>
		</div>
		<div class="flex gap-1">
			{#if specialType}
				<Chip class="border border-indigo-500 bg-white text-indigo-700">{specialType}</Chip>
			{/if}
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
	<div class="flex flex-row items-center justify-between gap-2">
		{#if sections && sections.length === 1}
			<div
				class="text-caption md:text-body2 rounded-button flex h-7 w-36 items-center justify-center border border-neutral-200 text-neutral-700 md:h-9 md:w-48"
			>
				{sections[0].label}
			</div>
		{:else if sections && sections.length > 1}
			<Select.Root
				type="single"
				bind:value={
					() => selectedSection,
					(v) => {
						selectedSection = v;
						onSelectSection?.(v);
					}
				}
			>
				<Select.Trigger class="text-caption md:text-body2 rounded-button h-7 w-36 md:h-9 md:w-48">
					{selectedSection
						? (sections.find((s) => s.value === selectedSection)?.label ?? 'เลือกเซคชัน')
						: 'เลือกเซคชัน'}
				</Select.Trigger>
				<Select.Content role="listbox">
					<Select.Group>
						{#each sections as sec (sec.value)}
							<Select.Item value={sec.value} label={sec.label} role="option">
								{sec.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else}
			<Button
				variant="outlined"
				color="neutral"
				class="text-caption md:text-body2 h-7 w-36 md:h-9 md:w-48"
				disabled
			>
				ไม่มีเซคชัน
			</Button>
		{/if}
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
				เลือกแล้ว <Check size="16" strokeWidth="3" />
			</Button>
		{/if}
	</div>
</div>
