<script lang="ts">
	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import type { ColorVariant, Day } from '@cugetreg/utils/types';

	import {
		ACTIVITY_COLOR_OPTIONS,
		ACTIVITY_DAY_OPTIONS,
		ACTIVITY_TITLE_MAX_LENGTH,
		type ActivityFormData,
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

	let title = $state('');
	let description = $state('');
	let daysOfWeek = $state<Day[]>([]);
	let periodStart = $state('');
	let periodEnd = $state('');
	let color = $state<ColorVariant>('pink');
	let submitted = $state(false);

	const titleError = $derived(title.trim() ? null : 'กรุณาระบุชื่อกิจกรรม');
	const dayError = $derived(daysOfWeek.length > 0 ? null : 'กรุณาเลือกวันอย่างน้อย 1 วัน');
	const timeError = $derived(validateActivityTime(periodStart, periodEnd));
	const isValid = $derived(!titleError && !dayError && !timeError);

	function handleConfirm() {
		submitted = true;
		if (!isValid) return;

		onConfirm({
			title: title.trim(),
			description: description.trim(),
			// Keep Monday→Sunday order regardless of click order
			daysOfWeek: ACTIVITY_DAY_OPTIONS.map((d) => d.value).filter((d) => daysOfWeek.includes(d)),
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
		เพิ่มกิจกรรม
	</h1>

	<div class="space-y-1">
		<label for="activity-title" class="text-caption leading-caption text-[#898EA7]"
			>ชื่อกิจกรรม</label
		>
		<Input
			id="activity-title"
			bind:value={title}
			state={submitted && titleError ? 'error' : 'default'}
			placeholder="ระบุชื่อกิจกรรม"
			maxlength={ACTIVITY_TITLE_MAX_LENGTH}
		/>
		<p class="text-caption leading-caption text-[#898EA7]">
			จำนวนตัวอักษร {title.length}/{ACTIVITY_TITLE_MAX_LENGTH}
		</p>
	</div>

	<div class="space-y-1">
		<p class="text-caption leading-caption text-[#898EA7]">วันในสัปดาห์ (เลือกได้หลายวัน)</p>
		<Select type="multiple" bind:value={daysOfWeek}>
			<SelectTrigger
				class={cn(
					'bg-surface-container-lowest w-full border-none px-4',
					submitted && dayError && 'ring-error ring-[1.5px]'
				)}
				aria-label="เลือกวันในสัปดาห์"
			>
				{#if daysOfWeek.length > 0}
					<span class="truncate">
						{ACTIVITY_DAY_OPTIONS.filter((d) => daysOfWeek.includes(d.value))
							.map((d) => d.label)
							.join(', ')}
					</span>
				{:else}
					<span class="text-neutral-400">เลือกวันในสัปดาห์</span>
				{/if}
			</SelectTrigger>
			<SelectContent class="z-100">
				<SelectGroup>
					{#each ACTIVITY_DAY_OPTIONS as option (option.value)}
						<SelectItem value={option.value} label={option.label} aria-label={option.label} check />
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>
	</div>

	<div class="flex gap-3">
		<div class="flex-1 space-y-1">
			<label for="activity-start" class="text-caption leading-caption text-[#898EA7]"
				>เวลาเริ่ม</label
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
			<label for="activity-end" class="text-caption leading-caption text-[#898EA7]">เวลาจบ</label>
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
			>รายละเอียดกิจกรรม</label
		>
		<textarea
			id="activity-description"
			bind:value={description}
			placeholder="ระบุรายละเอียดกิจกรรม"
			rows="4"
			class={cn(inputVariants({ state: 'default' }), 'h-auto resize-none py-3')}
		></textarea>
	</div>

	<div class="space-y-3">
		<p class="text-caption leading-caption text-[#898EA7]">เลือกสีในตาราง</p>
		<div class="mx-auto grid w-fit grid-cols-5 gap-3">
			{#each ACTIVITY_COLOR_OPTIONS as option (option)}
				<Button
					variant="solid"
					color="primary"
					aria-label={`สี ${option}`}
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
			ยกเลิก
		</Button>
		<Button
			variant="solid"
			color="primary"
			class="w-full"
			disabled={submitting}
			onclick={handleConfirm}
		>
			สร้าง
		</Button>
	</div>
</div>
