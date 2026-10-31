<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { Check, Dot, Heart, Plus } from '@lucide/svelte';

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
		favorite?: boolean;
		showFavorite?: boolean;
		onToggleFavorite?: () => void;
		closed?: boolean;
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
		favorite = $bindable(false),
		showFavorite = true,
		closed = false,
		onToggleFavorite,
		...rest
	}: Props = $props();

	const t = useTranslations(
		defineMessages({
			th: {
				credits: '{credit} หน่วยกิต',
				closed: 'ปิด',
				seats: 'ที่นั่ง {seat} / {maxseat}',
				reviews: '{review} รีวิว',
				selectSection: 'เลือกเซคชัน',
				noSection: 'ไม่มีเซคชัน',
				select: 'เลือก',
				selected: 'เลือกแล้ว',
				removeFavorite: 'นำออกจากวิชถูกใจ',
				addFavorite: 'เพิ่มเป็นวิชาที่ถูกใจ'
			},
			en: {
				credits: '{credit} credits',
				closed: 'Closed',
				seats: 'Seats {seat} / {maxseat}',
				reviews: '{review} reviews',
				selectSection: 'Select section',
				noSection: 'No sections',
				select: 'Select',
				selected: 'Selected',
				removeFavorite: 'Remove from favorites',
				addFavorite: 'Add to favorites'
			}
		})
	);

	export const onButtonClick = (event?: MouseEvent) => {
		event?.stopPropagation();
		if (onSelect) {
			onSelect();
			return;
		}
		selected = !selected;
	};

	const isSeatFull = $derived(
		course?.seat !== undefined && course?.maxseat !== undefined && course.seat >= course.maxseat
	);

	const onFavoriteClick = (event?: MouseEvent) => {
		event?.stopPropagation();
		if (onToggleFavorite) {
			onToggleFavorite();
			return;
		}
		favorite = !favorite;
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
			<span>{t('credits', { credit: course?.credit ?? '' })}</span>
			<Dot color="#EDEDF1" size="16" />

			{#if closed}
				<span class="text-red-500">{t('closed')}</span>
			{:else}
				<span class={isSeatFull ? 'text-red-500' : undefined}
					>{t('seats', { seat: course?.seat ?? '', maxseat: course?.maxseat ?? '' })}</span
				>
			{/if}

			<Dot color="#EDEDF1" size="16" />
			<span>{t('reviews', { review: course?.review ?? '' })}</span>
		</div>
		<div class="flex min-h-6.5 gap-2">
			{#each course?.days ?? [] as day (day)}
				<DayChip {day} />
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-row items-center gap-2">
		{#if sections && sections.length === 1}
			<div
				class="md:text-body2 rounded-button flex h-9 min-w-0 flex-1 items-center justify-center border border-neutral-200 text-sm text-neutral-700 md:h-9"
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
				<Select.Trigger class="md:text-body2 rounded-button h-9 min-w-0 flex-1 text-sm md:h-9">
					{selectedSection
						? (sections.find((s) => s.value === selectedSection)?.label ?? t('selectSection'))
						: t('selectSection')}
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
				class="md:text-body2 h-9 min-w-0 flex-1 text-sm md:h-9"
				disabled
			>
				{t('noSection')}
			</Button>
		{/if}
		{#if !selected}
			<Button
				variant="outlined"
				color="primary"
				onclick={onButtonClick}
				class="md:text-body2 h-9 min-w-0 flex-1 text-sm md:h-9"
				size="sm"
			>
				{t('select')}
				<Plus size="16" strokeWidth="3" />
			</Button>
		{:else}
			<Button
				color="primary"
				onclick={onButtonClick}
				class="md:text-body2 h-9 min-w-0 flex-1 text-sm md:h-9"
			>
				{t('selected')}
				<Check size="16" strokeWidth="3" />
			</Button>
		{/if}
		{#if showFavorite}
			<button
				type="button"
				aria-label={favorite ? t('removeFavorite') : t('addFavorite')}
				aria-pressed={favorite}
				onclick={onFavoriteClick}
				class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-blue-300/40"
			>
				<Heart
					size="22"
					strokeWidth="2"
					class={favorite ? 'fill-blue-700 text-blue-700' : 'fill-white text-blue-500'}
				/>
			</button>
		{/if}
	</div>
</div>
