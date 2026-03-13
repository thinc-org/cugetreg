<script lang="ts">
	import { BookOpen, ChevronDown, Trash2 } from '@lucide/svelte';

	import { Switch } from '../../atoms/switch';

	interface ScheduleItem {
		title: string;
		subtitle: string;
		isPublic: boolean;
	}

	interface Props {
		heading?: string;
		selectedTerm?: string;
		terms?: string[];
		items?: ScheduleItem[];
		onSelectTerm?: (term: string) => void;
		onDelete?: (index: number) => void;
	}

	const defaultItems: ScheduleItem[] = [
		{
			title: 'ทวิภาค 2567 ภาคต้น',
			subtitle: 'ทวิภาค 2567 / ภาคต้น',
			isPublic: true
		},
		{
			title: 'ทวิภาค 2566 ภาคต้น',
			subtitle: 'ทวิภาค 2566 / ภาคต้น',
			isPublic: false
		},
		{
			title: 'ทวิภาค 2566 ภาคต้น',
			subtitle: 'ทวิภาค 2566 / ภาคต้น',
			isPublic: false
		}
	];

	let {
		heading = '',
		selectedTerm = $bindable('ทวิภาค 2567 ภาคต้น'),
		terms = ['ทวิภาค 2567 ภาคต้น', 'ทวิภาค 2566 ภาคต้น'],
		items = defaultItems,
		onSelectTerm,
		onDelete
	}: Props = $props();

	const getYear = (value: string) => {
		const match = value.match(/\d{4}/);
		return match?.[0] ?? '';
	};

	let visibleItems = $derived(items.filter((item) => item.title.includes(getYear(selectedTerm))));
</script>

<div class="text-on-surface w-full max-w-md">
	{#if heading}
		<div class="text-h3 flex items-center gap-3 font-bold">
			<BookOpen size="18" strokeWidth="2.5" />
			<p>{heading}</p>
		</div>
	{/if}

	<div class="border-surface-container-low bg-surface relative mt-4 rounded-2xl border px-4 py-4">
		<select
			class="text-body2 text-on-surface w-full appearance-none bg-transparent font-semibold underline underline-offset-4 focus:outline-none"
			bind:value={selectedTerm}
			onchange={() => onSelectTerm?.(selectedTerm)}
		>
			{#each terms as term (term)}
				<option value={term}>{term}</option>
			{/each}
		</select>
		<ChevronDown
			size="18"
			strokeWidth="2.5"
			class="text-on-surface/70 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
		/>
	</div>

	<div class="mt-4 flex flex-col gap-4">
		{#each visibleItems as item, index (item.title)}
			<div class="border-surface-container-low bg-surface rounded-3xl border px-6 py-6">
				<div class="flex items-start justify-between gap-3">
					<div class="flex flex-col gap-1">
						<p class="text-body2 font-semibold underline underline-offset-4">
							{item.title}
						</p>
						<p class="text-body2 text-on-surface/50">
							{item.subtitle}
						</p>
					</div>
					<button
						type="button"
						class="text-error hover:text-error-hover"
						onclick={() => onDelete?.(index)}
						aria-label="Delete schedule"
					>
						<Trash2 size="18" strokeWidth="2.5" />
					</button>
				</div>
				<div class="mt-5 flex items-center gap-3">
					<Switch checked={item.isPublic} label={null} />
					<p class="text-body2 text-on-surface/70 font-medium">เป็นสาธารณะ</p>
				</div>
			</div>
		{/each}
	</div>
</div>
