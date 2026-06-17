<script lang="ts">
	import { BookOpen, BookPlus, ChevronDown, Trash2 } from '@lucide/svelte';

	import { Switch } from '../../atoms/switch';

	interface ScheduleItem {
		id: string;
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
		onDelete?: (id: string) => void;
		onInsert: () => void;
	}

	let {
		heading = '',
		selectedTerm = $bindable('ทวิภาค 2567 ภาคต้น'),
		terms = ['ทวิภาค 2567 ภาคต้น', 'ทวิภาค 2566 ภาคต้น'],
		items = [],
		onSelectTerm,
		onDelete,
		onInsert
	}: Props = $props();

	const getYear = (value: string) => {
		const match = value.match(/\d{4}/);
		return match?.[0] ?? '';
	};

	const onChangeTerm = (event: Event) => {
		const selectElement = event.target as HTMLSelectElement;
		selectedTerm = selectElement.value;
		onSelectTerm?.(selectedTerm);
	};

	let visibleItems = $derived(items.filter((item) => item.title.includes(getYear(selectedTerm))));
</script>

<div class="text-on-surface w-full max-w-xl">
	{#if heading}
		<div class="text-h3 flex items-center gap-3 font-bold">
			<BookOpen size="18" strokeWidth="2.5" />
			<p>{heading}</p>
		</div>
	{/if}
	{#if !items.length}
		<div class="flex items-center justify-center rounded-xl p-3">
			<BookPlus size={52} strokeWidth={1.5} class="text-blue-500" />
		</div>

		<!-- Text content -->
		<div class="flex w-full flex-col items-center gap-1.5 px-22">
			<h2 class="text-center text-3xl font-bold tracking-wide text-gray-800">
				เริ่มเพิ่มตารางเรียน
			</h2>
			<p class="w-full text-center text-sm leading-relaxed text-gray-500">
				เริ่มสร้างตารางเรียนแรกของคุณเพื่อวางแผนการลงทะเบียนเรียน
				และดูภาพรวมตารางเรียนทั้งหมดที่คุณสร้างไว้ในหน้าโปรไฟล์นี้
			</p>
		</div>
	{:else}
		<div class="border-surface-container-low bg-surface relative mt-4 rounded-2xl border px-4 py-4">
			<select
				class="text-body2 text-on-surface w-full appearance-none bg-transparent font-semibold underline underline-offset-4 focus:outline-none"
				bind:value={selectedTerm}
				onchange={onChangeTerm}
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
			{#each visibleItems as item, index (index)}
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
							onclick={() => onDelete?.(item.id)}
							aria-label="Delete schedule"
						>
							<Trash2 size="18" strokeWidth="2.5" />
						</button>
					</div>
					<div class="mt-5 flex items-center gap-3">
						<Switch bind:checked={item.isPublic} label={null} />
						<p class="text-body2 text-on-surface/70 font-medium">เป็นสาธารณะ</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<button
		type="button"
		class="text-md mt-4 w-full rounded-2xl bg-blue-100 px-8 py-2 font-medium text-blue-900"
		onclick={onInsert}
	>
		เพิ่มตารางเรียน
	</button>
</div>
