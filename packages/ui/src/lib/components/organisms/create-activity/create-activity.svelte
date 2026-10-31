<script lang="ts">
	import { defineMessages, useLocale, useTranslations } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import type { ColorVariant, Day } from '@cugetreg/utils/types';

	import {
		ACTIVITY_COLOR_OPTIONS,
		ACTIVITY_TITLE_MAX_LENGTH,
		type ActivityFormData,
		getActivityDayOptions,
		validateActivityTime
	} from '.';

	import { Button } from '../../atoms/button';
	import { Input, inputVariants } from '../../atoms/input';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '../../molecules/select';

	interface CreateActivityProp {
		onCancel?: () => void;
		onConfirm?: (activity: ActivityFormData) => void;
		/** Disable the confirm button while the parent is saving. */
		submitting?: boolean;
	}

	let {
		onCancel = () => {},
		onConfirm = () => {},
		submitting = false
	}: CreateActivityProp = $props();

	const locale = useLocale();
	const t = useTranslations(
		defineMessages({
			th: {
				heading: 'เพิ่มกิจกรรม',
				title: 'ชื่อกิจกรรม',
				titlePlaceholder: 'ระบุชื่อกิจกรรม',
				charCount: 'จำนวนตัวอักษร {count}/{max}',
				days: 'วันในสัปดาห์ (เลือกได้หลายวัน)',
				selectDays: 'เลือกวันในสัปดาห์',
				startTime: 'เวลาเริ่ม',
				endTime: 'เวลาจบ',
				description: 'รายละเอียดกิจกรรม',
				descriptionPlaceholder: 'ระบุรายละเอียดกิจกรรม',
				color: 'เลือกสีในตาราง',
				colorOption: 'สี {color}',
				titleError: 'กรุณาระบุชื่อกิจกรรม',
				dayError: 'กรุณาเลือกวันอย่างน้อย 1 วัน',
				cancel: 'ยกเลิก',
				create: 'สร้าง'
			},
			en: {
				heading: 'Add activity',
				title: 'Activity name',
				titlePlaceholder: 'Enter activity name',
				charCount: 'Characters {count}/{max}',
				days: 'Days of week (select multiple)',
				selectDays: 'Select days of week',
				startTime: 'Start time',
				endTime: 'End time',
				description: 'Activity details',
				descriptionPlaceholder: 'Enter activity details',
				color: 'Timetable color',
				colorOption: 'Color {color}',
				titleError: 'Please enter an activity name',
				dayError: 'Please select at least 1 day',
				cancel: 'Cancel',
				create: 'Create'
			}
		})
	);

	const dayOptions = $derived(getActivityDayOptions(locale.current));

	let title = $state('');
	let description = $state('');
	let daysOfWeek = $state<Day[]>([]);
	let periodStart = $state('');
	let periodEnd = $state('');
	let color = $state<ColorVariant>('pink');
	let submitted = $state(false);

	const titleError = $derived(title.trim() ? null : t('titleError'));
	const dayError = $derived(daysOfWeek.length > 0 ? null : t('dayError'));
	const timeError = $derived(validateActivityTime(periodStart, periodEnd, locale.current));
	const isValid = $derived(!titleError && !dayError && !timeError);

	function handleConfirm() {
		submitted = true;
		if (!isValid) return;

		onConfirm({
			title: title.trim(),
			description: description.trim(),
			// Keep Monday→Sunday order regardless of click order
			daysOfWeek: dayOptions.map((d) => d.value).filter((d) => daysOfWeek.includes(d)),
			periodStart,
			periodEnd,
			color
		});
	}
</script>

<div
	class="bg-surface flex max-h-[calc(100dvh-7rem)] w-[90vw] flex-col gap-5 overflow-y-auto rounded-xl border border-[#d6d7e1] p-6 sm:w-104 sm:p-10"
>
	<h1 class="text-h2 leading-h2 text-center font-medium tracking-[0.15px] text-[#353745]">
		{t('heading')}
	</h1>

	<div class="space-y-1">
		<label for="activity-title" class="text-caption leading-caption text-[#898EA7]"
			>{t('title')}</label
		>
		<Input
			id="activity-title"
			bind:value={title}
			state={submitted && titleError ? 'error' : 'default'}
			placeholder={t('titlePlaceholder')}
			maxlength={ACTIVITY_TITLE_MAX_LENGTH}
		/>
		<p class="text-caption leading-caption text-[#898EA7]">
			{t('charCount', { count: title.length, max: ACTIVITY_TITLE_MAX_LENGTH })}
		</p>
	</div>

	<div class="space-y-1">
		<p class="text-caption leading-caption text-[#898EA7]">{t('days')}</p>
		<Select type="multiple" bind:value={daysOfWeek}>
			<SelectTrigger
				class={cn(
					'bg-surface-container-lowest w-full border-none px-4',
					submitted && dayError && 'ring-error ring-[1.5px]'
				)}
				aria-label={t('selectDays')}
			>
				{#if daysOfWeek.length > 0}
					<span class="truncate">
						{dayOptions
							.filter((d) => daysOfWeek.includes(d.value))
							.map((d) => d.label)
							.join(', ')}
					</span>
				{:else}
					<span class="text-neutral-400">{t('selectDays')}</span>
				{/if}
			</SelectTrigger>
			<SelectContent class="z-100">
				<SelectGroup>
					{#each dayOptions as option (option.value)}
						<SelectItem value={option.value} label={option.label} aria-label={option.label} check />
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>
	</div>

	<div class="flex gap-3">
		<div class="flex-1 space-y-1">
			<label for="activity-start" class="text-caption leading-caption text-[#898EA7]"
				>{t('startTime')}</label
			>
			<Input
				id="activity-start"
				type="time"
				class="[&::-webkit-calendar-picker-indicator]:ml-auto"
				bind:value={periodStart}
				state={submitted && timeError ? 'error' : 'default'}
			/>
		</div>
		<div class="flex-1 space-y-1">
			<label for="activity-end" class="text-caption leading-caption text-[#898EA7]"
				>{t('endTime')}</label
			>
			<Input
				id="activity-end"
				type="time"
				class="[&::-webkit-calendar-picker-indicator]:ml-auto"
				bind:value={periodEnd}
				state={submitted && timeError ? 'error' : 'default'}
			/>
		</div>
	</div>

	<div class="space-y-1">
		<label for="activity-description" class="text-caption leading-caption text-[#898EA7]"
			>{t('description')}</label
		>
		<textarea
			id="activity-description"
			bind:value={description}
			placeholder={t('descriptionPlaceholder')}
			rows="4"
			class={cn(inputVariants({ state: 'default' }), 'h-auto resize-none py-3')}
		></textarea>
	</div>

	<div class="space-y-3">
		<p class="text-caption leading-caption text-[#898EA7]">{t('color')}</p>
		<div class="mx-auto grid w-fit grid-cols-5 gap-3">
			{#each ACTIVITY_COLOR_OPTIONS as option (option)}
				<Button
					variant="solid"
					color="primary"
					aria-label={t('colorOption', { color: option })}
					class={cn(
						'size-8 border hover:ring-0',
						courseColorVariants[option],
						color === option && 'outline-primary outline-[1.5px]! outline-offset-4',
						color === option && 'hover:outline-[1.5px]! hover:outline-solid!'
					)}
					onclick={() => (color = option)}
				/>
			{/each}
		</div>
	</div>

	{#if submitted && !isValid}
		<p class="text-error text-center text-sm">{titleError ?? dayError ?? timeError}</p>
	{/if}

	<div class="flex w-full gap-6">
		<Button variant="solid" color="neutral" class="w-full" onclick={() => onCancel()}>
			{t('cancel')}
		</Button>
		<Button
			variant="solid"
			color="primary"
			class="w-full"
			disabled={submitting}
			onclick={handleConfirm}
		>
			{t('create')}
		</Button>
	</div>
</div>
