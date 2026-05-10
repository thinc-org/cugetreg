<script lang="ts">
	import { BookMarked, Equal, Eye, EyeOff, Trash2 } from '@lucide/svelte';
	import { removeItem, SortableList, sortItems } from '@rodrigodagostino/svelte-sortable-list';
	import type { ClassValue } from 'clsx';

	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import type { ColorVariant, CourseSchedule, ScheduleData } from '@cugetreg/utils/types';

	import * as Accordion from '../../atoms/accordion';
	import { Button } from '../../atoms/button';
	import { GenedChip } from '../../atoms/gened-chip';
	import { IconButton } from '../../atoms/icon-button';
	import { ColorPicker } from '../../molecules/colorpicker';
	import * as Select from '../../molecules/select';

	function handleDragEnd(e: SortableList.RootEvents['ondragend']) {
		const { draggedItemIndex, targetItemIndex, isCanceled } = e;
		if (!isCanceled && typeof targetItemIndex === 'number' && draggedItemIndex !== targetItemIndex)
			schedule = sortItems(schedule, draggedItemIndex, targetItemIndex);
	}

	function handleRemoveClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const item = target.closest<HTMLLIElement>('.ssl-item');
		const itemIndex = Number(item?.dataset.itemIndex);
		if (!item || itemIndex < 0) return;
		schedule = removeItem(schedule, itemIndex);
	}

	interface SelectedCourseProp {
		class?: ClassValue;
		schedule: ScheduleData;
		variant?: 'simple' | 'detailed';
		remove?: (courseCode: string) => void;
	}

	let {
		class: className = undefined,
		schedule = $bindable(),
		variant = 'detailed',
		remove
	}: SelectedCourseProp = $props();

	const totalCredit = $derived(
		schedule.reduce((acc, course) => acc + (course.hidden ? 0 : course.course.credit), 0)
	);

	let showChangeColorModal = $state(false);
	let currentColorVariant = $state<ColorVariant>('neutral');
	let initialColorVariant = $state<ColorVariant>('neutral');
	let changeColorFor = $state<number | undefined>();
	let modalPosition = $state({
		x: 0,
		y: 0
	});

	$effect(() => {
		if (changeColorFor) {
			const index = schedule.findIndex((x) => x.id === changeColorFor);
			schedule[index].colorVariant = currentColorVariant;
		}
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && showChangeColorModal) {
			showChangeColorModal = false;
		}
	}}
/>

<div class={cn(className)}>
	<Accordion.Root class="w-full" type="single" value="selected-course">
		<Accordion.Item value="selected-course">
			<Accordion.Trigger class="border-b border-neutral-200">
				<div class="flex">
					<BookMarked class="mr-2" />
					<span class="">วิชาที่เลือก</span>
					<span class="ml-2 flex items-baseline-last text-xs font-light text-neutral-400"
						>{totalCredit} หน่วยกิต</span
					>
				</div>
			</Accordion.Trigger>
			<Accordion.Content>
				<SortableList.Root
					ondragend={handleDragEnd}
					hasLockedAxis
					transition={{
						duration: 160,
						easing: 'cubic-bezier(0.2, 1, 0.1, 1)'
					}}
					gap={0}
					class="max-h-[40vh] grow overflow-y-scroll"
				>
					{#each schedule as course, index (course.id)}
						<SortableList.Item id={course.id.toString()} {index} class="my-0">
							<div class="ssl-item-content">
								{@render selectedCourseItem(course)}
							</div>
						</SortableList.Item>
					{/each}
				</SortableList.Root>
				<div class="px-2">
					<Button class="w-full" color="primary">ค้นหาวิชาเรียน</Button>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
	{#if showChangeColorModal}
		{@render changeColorModal()}
	{/if}
</div>

{#snippet selectedCourseItem(course: CourseSchedule)}
	<div
		data-hidden={course.hidden}
		class="
            data-[hidden=true]:text-primary-500 my-1 flex
            p-1
            font-light
        "
	>
		<div
			data-variant={variant}
			class="flex items-center justify-center data-[variant=simple]:hidden"
		>
			<IconButton
				class="bg-transparent hover:cursor-pointer"
				onclick={() => (course.hidden = !course.hidden)}
			>
				{#if course.hidden}
					<EyeOff class="stroke-primary-500" />
				{:else}
					<Eye />
				{/if}
			</IconButton>
		</div>

		<div class="flex flex-1 flex-col justify-center overflow-hidden">
			<div class="flex flex-nowrap text-[0.6rem]">
				{course.course.code}

				{#if variant === 'detailed'}
					{#each course.course.gened as gened (gened)}
						<GenedChip type={gened} class="mx-1 bg-transparent px-2 py-0 text-[0.6rem]" />
					{/each}
				{/if}
			</div>
			<div class="truncate text-sm">
				{course.course.name}
			</div>
		</div>

		<div
			data-variant={variant}
			class="flex flex-1 items-center justify-center px-2 data-[variant=detailed]:hidden"
		>
			<div class="flex-1 justify-center">
				{#each course.course.gened as gened (gened)}
					<GenedChip type={gened} class="mx-1 bg-transparent px-2 py-0 text-sm" />
				{/each}
			</div>

			<div class="flex-1 justify-center">
				{course.course.credit} นก.
			</div>
		</div>

		<div class="flex items-center">
			<div data-variant={variant} class="flex w-12 text-sm data-[variant=simple]:hidden">
				<Select.Root
					type="single"
					bind:value={
						() => String(course.selectedSection), (v) => (course.selectedSection = Number(v))
					}
				>
					<Select.Trigger
						showArrow={false}
						class={cn(
							'rounded-sm p-0',
							course.conflicted && 'border-red-800 bg-red-300 text-red-800'
						)}
					>
						<div class="flex h-full w-full items-center justify-center text-xs">
							เซค {course.selectedSection}
						</div>
					</Select.Trigger>
					<Select.Content role="listbox">
						<Select.Group>
							{#each Object.keys(course.course.sections) as section (section)}
								<Select.Item
									value={`${section}`}
									label={`เซค ${section}`}
									aria-label={`Sec ${section}`}
									role="option"
								/>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div
				data-variant={variant}
				class="flex items-center justify-center data-[variant=simple]:hidden"
			>
				<Button
					class={cn(
						'm-2 aspect-square rounded-lg border hover:ring-0',
						courseColorVariants[course.colorVariant ?? 'primary']
					)}
					onclick={(e: MouseEvent) => {
						modalPosition.x = e.clientX;
						modalPosition.y = e.clientY;
						changeColorFor = course.id;
						showChangeColorModal = true;
						initialColorVariant = course.colorVariant ?? 'primary';
						currentColorVariant = course.colorVariant ?? 'primary';
					}}
				/>
			</div>
			<div class="flex">
				<SortableList.ItemRemove onclick={() => remove?.(course.course.code)}>
					<span
						class="flex size-7 items-center justify-center rounded-md bg-transparent hover:cursor-pointer hover:bg-neutral-100"
					>
						<Trash2 class="mx-1 data-[hidden=true]:text-neutral-500" />
					</span>
				</SortableList.ItemRemove>

				{#if variant === 'detailed'}
					<SortableList.ItemHandle>
						<span
							class="flex size-7 items-center justify-center rounded-md bg-transparent hover:cursor-pointer hover:bg-neutral-100"
						>
							<Equal class="mx-1 data-[hidden=true]:text-neutral-500" />
						</span>
					</SortableList.ItemHandle>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

{#snippet changeColorModal()}
	<div
		class="fixed top-0 left-0 z-50 h-screen w-screen"
		role="button"
		tabindex="0"
		onclick={() => {
			showChangeColorModal = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
				showChangeColorModal = false;
			}
		}}
	>
		<div
			class="fixed z-60"
			style="top: {modalPosition.y}px; left: {modalPosition.x}px;"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
					showChangeColorModal = false;
				}
			}}
			role="dialog"
			tabindex="0"
		>
			<ColorPicker
				class="bg-surface"
				options={courseColorVariants}
				bind:value={currentColorVariant}
				onCancel={() => {
					currentColorVariant = initialColorVariant;
					showChangeColorModal = false;
				}}
				onConfirmSelected={() => {
					showChangeColorModal = false;
				}}
			/>
		</div>
	</div>
{/snippet}

<style>
	:global(.ssl-ghost) {
		opacity: 0;
	}
</style>
