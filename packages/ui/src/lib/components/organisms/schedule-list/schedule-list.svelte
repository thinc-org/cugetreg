<script lang="ts">
	import { BookOpen, BookPlus, LoaderCircle, Trash2 } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import * as Select from '../../molecules/select/index.js';

	import { Switch } from '../../atoms/switch';

	interface ScheduleItem {
		id: string;
		title: string;
		subtitle: string;
		year: number;
		semester: number;
		isPublic: boolean;
	}

	interface Props {
		heading?: string;
		items?: ScheduleItem[];
		loading?: boolean;
		onClickItem?: (item: ScheduleItem) => void;
		onClickButton?: () => void;
		onDelete?: (item: ScheduleItem) => void;
		onChangeVisibility: (item: ScheduleItem, newChecked: boolean) => void;
	}

	let {
		heading = '',
		items = [],
		loading = false,
		onClickItem,
		onClickButton,
		onDelete,
		onChangeVisibility
	}: Props = $props();

	let filters = $derived([
		...new Set(
			items
				.toSorted((item1, item2) => {
					return item1.year !== item2.year
						? item2.year - item1.year
						: item2.semester - item1.semester;
				})
				.map((item) => {
					const [yearLabel, semesterLabel] = [
						item.subtitle.split(' ')[1],
						item.subtitle.split(' ')[3]
					];
					return `${yearLabel} ${semesterLabel}`;
				})
		)
	]);

	let selected = $state(filters[0] ?? '');

	let filteredItems = $derived(
		items.filter((item) => {
			const [yearLabel, semesterLabel] = [item.subtitle.split(' ')[1], item.subtitle.split(' ')[3]];
			return `${yearLabel} ${semesterLabel}` === selected;
		})
	);

	let switchingFilter = $state(false);
	let showSpinner = $derived(loading || switchingFilter);

	let isMobile = $state(false);

	const FILTER_SWITCH_DELAY_MS = 100;

	$effect(() => {
		if (!filters.length) {
			if (selected !== '') selected = '';
			switchingFilter = false;
			return;
		}

		if (filters.includes(selected)) {
			switchingFilter = false;
			return;
		}

		// The previously selected title has no items left - briefly show a
		// loading state before falling back to the first available option.
		switchingFilter = true;
		const timeout = setTimeout(() => {
			selected = filters[0] ?? '';
			switchingFilter = false;
		}, FILTER_SWITCH_DELAY_MS);

		return () => clearTimeout(timeout);
	});

	onMount(() => {
		const isMobileQuery = window.matchMedia('(max-width: 768px)');
		isMobile = isMobileQuery.matches;

		const handleMediaQueryChange = (event: MediaQueryListEvent) => {
			isMobile = event.matches;
		};

		isMobileQuery.addEventListener('change', handleMediaQueryChange);

		return () => {
			isMobileQuery.removeEventListener('change', handleMediaQueryChange);
		};
	});
</script>

<div class="text-on-surface w-full max-w-xl">
	{#if heading}
		<div class="text-h3 flex items-center gap-3 font-bold">
			<BookOpen size="18" strokeWidth="2.5" />
			<p>{heading}</p>
		</div>
	{/if}
	{#if !loading && items.length}
		<Select.Root type="single" bind:value={selected} onValueChange={() => (switchingFilter = true)}>
			<Select.Trigger
				class="text-body1 text-on-surface relative mt-4 min-h-14 w-full appearance-none rounded-2xl border bg-transparent px-6 py-4 font-semibold underline underline-offset-4 focus:outline-none sm:min-h-16"
			>
				{selected}
			</Select.Trigger>
			<Select.Content role="listbox" sideOffset={4}>
				<Select.Group class="max-h-44">
					{#each filters as name (name)}
						<Select.Item value={name}>
							<Select.Item value={name} label={name} />
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/if}
	{#if !loading && !items.length}
		<div class="flex items-center justify-center rounded-xl p-4">
			<BookPlus size={52} strokeWidth={1.5} class="text-blue-500" />
		</div>

		<!-- Text content -->
		<div class="flex w-full flex-col items-center gap-1.5 px-24">
			<h2 class="text-center text-3xl font-bold tracking-wide text-gray-800">
				เริ่มเพิ่มตารางเรียน
			</h2>
			<p class="w-full text-center text-sm leading-relaxed text-gray-500">
				เริ่มสร้างตารางเรียนของคุณเพื่อวางแผนการลงทะเบียนเรียน
				และดูภาพรวมตารางเรียนทั้งหมดที่คุณสร้างไว้ในหน้าโปรไฟล์นี้
			</p>
		</div>
	{/if}
	<div
		class={`mt-4 flex flex-col gap-4 ${filteredItems.length > 4 ? 'max-h-144 overflow-y-auto sm:max-h-[calc(100vh-530px)] lg:max-h-[calc(100vh-100px)]' : ''}`}
	>
		{#if showSpinner}
			<div class="flex flex-col items-center justify-center gap-3 py-10">
				<LoaderCircle size={80} class="animate-spin text-blue-500" />
			</div>
		{:else}
			{#each filteredItems as item (item.id)}
				<div class="border-surface-container-low bg-surface rounded-3xl border px-6 py-6">
					<div class="hover:bg-surface-variant/50 flex items-start justify-between gap-3">
						<div class="flex flex-col gap-1">
							<p
								class="text-body1 font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4"
								onclick={() => onClickItem?.(item)}
							>
								{item.title}
							</p>
							<p class="text-body2 text-on-surface/50">
								{item.subtitle}
							</p>
						</div>
						<button
							type="button"
							class="text-error hover:text-error-hover"
							onclick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onDelete?.(item);
							}}
							aria-label="Delete schedule"
						>
							<Trash2 size={isMobile ? 18 : 24} cursor="pointer" strokeWidth="2.5" />
						</button>
					</div>
					<div class="mt-5 flex items-center gap-3">
						<Switch
							bind:checked={item.isPublic}
							onCheckedChange={(newChecked) => onChangeVisibility(item, newChecked)}
							label={null}
						/>
						<p class="text-body2 text-on-surface/70 font-medium">เป็นสาธารณะ</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<button
		type="button"
		class="mt-4 inline-flex w-full cursor-pointer justify-center rounded-2xl bg-blue-100 px-8 py-2 text-center font-medium text-blue-900 hover:bg-blue-200"
		onclick={() => onClickButton?.()}
	>
		เพิ่มตารางเรียน
	</button>
</div>
