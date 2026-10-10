<script lang="ts">
	import { EyeOff, Trash, X } from '@lucide/svelte';
	import { untrack } from 'svelte';

	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import type { Day } from '@cugetreg/utils/types';

	import type { ViewActivityData, ViewActivityUpdate } from '.';

	import { Button } from '../../atoms/button';
	import { IconButton } from '../../atoms/icon-button';
	import { Input } from '../../atoms/input';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '../../molecules/select';
	import {
		ACTIVITY_COLOR_OPTIONS,
		ACTIVITY_DAY_OPTIONS,
		validateActivityTime
	} from '../create-activity';

	interface ViewActivityProps {
		data: ViewActivityData | null;
		onExit?: () => void;
		onUpdate?: (id: string, fields: ViewActivityUpdate) => void;
		onRemove?: (id: string) => void;
	}

	let {
		data,
		onExit = () => {},
		onUpdate = () => {},
		onRemove = () => {}
	}: ViewActivityProps = $props();

	// Local copies of the time inputs so a half-typed value isn't sent until it
	// forms a valid range.
	let periodStart = $state(untrack(() => data?.periodStart ?? ''));
	let periodEnd = $state(untrack(() => data?.periodEnd ?? ''));
	let timeError = $state<string | null>(null);

	$effect(() => {
		if (data) {
			periodStart = data.periodStart;
			periodEnd = data.periodEnd;
			timeError = null;
		}
	});

	function commitTime() {
		if (!data) return;
		if (periodStart === data.periodStart && periodEnd === data.periodEnd) {
			timeError = null;
			return;
		}
		timeError = validateActivityTime(periodStart, periodEnd);
		if (timeError) return;
		onUpdate(data.id, { periodStart, periodEnd });
	}
</script>

{#if data}
	<div
		class="bg-surface max-h-[calc(100dvh-7rem)] w-[90vw] overflow-y-auto rounded-xl border border-neutral-200 p-5 md:w-[560px] md:p-6"
	>
		<div class="flex items-start justify-between gap-2">
			<h2 class="min-w-0 text-xl font-bold break-words text-[#353745] md:text-2xl">{data.title}</h2>
			<IconButton
				class="shrink-0 bg-transparent ring-0! outline-none! hover:cursor-pointer"
				aria-label="ปิด"
				onclick={onExit}
			>
				<X />
			</IconButton>
		</div>
		{#if data.description}
			<p class="mt-2 text-sm whitespace-pre-line text-[#353745] md:text-base">
				{data.description}
			</p>
		{/if}

		<div class="mt-4 space-y-1">
			<p class="text-caption leading-caption text-[#898EA7]">วันในสัปดาห์</p>
			<Select
				type="single"
				value={data.dayOfWeek}
				onValueChange={(v) => {
					if (v && data && v !== data.dayOfWeek) onUpdate(data.id, { dayOfWeek: v as Day });
				}}
			>
				<SelectTrigger
					class="bg-surface-container-lowest h-10 w-full border-none px-4"
					aria-label="เลือกวันในสัปดาห์"
				>
					{ACTIVITY_DAY_OPTIONS.find((d) => d.value === data.dayOfWeek)?.label}
				</SelectTrigger>
				<SelectContent class="z-100">
					<SelectGroup>
						{#each ACTIVITY_DAY_OPTIONS as option (option.value)}
							<SelectItem value={option.value} label={option.label} aria-label={option.label} />
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>

		<div class="mt-3 flex gap-3">
			<div class="flex-1 space-y-1">
				<label for="view-activity-start" class="text-caption leading-caption text-[#898EA7]"
					>เวลาเริ่ม</label
				>
				<Input
					id="view-activity-start"
					type="time"
					class="[&::-webkit-calendar-picker-indicator]:ml-auto"
					bind:value={periodStart}
					state={timeError ? 'error' : 'default'}
					onchange={commitTime}
				/>
			</div>
			<div class="flex-1 space-y-1">
				<label for="view-activity-end" class="text-caption leading-caption text-[#898EA7]"
					>เวลาจบ</label
				>
				<Input
					id="view-activity-end"
					type="time"
					class="[&::-webkit-calendar-picker-indicator]:ml-auto"
					bind:value={periodEnd}
					state={timeError ? 'error' : 'default'}
					onchange={commitTime}
				/>
			</div>
		</div>
		{#if timeError}
			<p class="text-error mt-1 text-sm">{timeError}</p>
		{/if}

		<p class="mt-5 mb-3 text-lg font-medium text-[#353745]">เลือกสีในตาราง</p>
		<div class="grid w-fit grid-cols-5 gap-3 md:grid-cols-10 md:gap-4">
			{#each ACTIVITY_COLOR_OPTIONS as option (option)}
				<Button
					variant="solid"
					color="primary"
					aria-label={`สี ${option}`}
					class={cn(
						'size-9 border p-0 hover:ring-0',
						courseColorVariants[option],
						data.color === option && 'outline-primary outline-[1.5px]! outline-offset-4',
						data.color === option && 'hover:outline-[1.5px]! hover:outline-solid!'
					)}
					onclick={() => onUpdate(data.id, { color: option })}
				/>
			{/each}
		</div>

		<div class="mt-6 flex flex-col gap-2 md:flex-row md:justify-between md:gap-3">
			<Button
				class="ring-primary-container w-full gap-2 md:flex-1"
				size="lg"
				variant="outlined"
				onclick={() => onUpdate(data.id, { hidden: !data.hidden })}
			>
				<EyeOff />
				{data.hidden ? 'แสดงในตาราง' : 'ซ่อนจากตาราง'}
			</Button>
			<Button
				class="w-full gap-2 md:flex-1"
				size="lg"
				variant="outlined"
				color="error"
				onclick={() => onRemove(data.id)}
			>
				<Trash />
				นำออกจากกิจกรรมของฉัน
			</Button>
		</div>
	</div>
{/if}
