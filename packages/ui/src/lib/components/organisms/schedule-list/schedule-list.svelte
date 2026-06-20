<script lang="ts">
	import { BookOpen, BookPlus, ChevronDown, LoaderCircle, Trash2 } from '@lucide/svelte';

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
		loading?: boolean;
		onSelectTerm?: (term: string) => void;
		onDelete?: (item: ScheduleItem) => void;
		onChangeVisibility: (item: ScheduleItem) => void;
	}

	let {
		heading = '',
		selectedTerm = $bindable('2567 ภาคต้น'),
		terms = [],
		items = [],
		loading = false,
		onSelectTerm,
		onDelete,
		onChangeVisibility
	}: Props = $props();

	const resolve = (href: string) => href;

	const onChangeTerm = (event: Event) => {
		const selectElement = event.target as HTMLSelectElement;
		selectedTerm = selectElement.value;
		onSelectTerm?.(selectedTerm);
	};
</script>

<div class="text-on-surface w-full max-w-xl">
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
	<div class="mt-4 flex flex-col gap-4">
		{#if loading}
			<div class="flex flex-col items-center justify-center gap-3 py-10">
				<LoaderCircle size={80} class="animate-spin text-blue-500" />
			</div>
		{:else}
			{#each items as item (item.id)}
				<div class="border-surface-container-low bg-surface rounded-3xl border px-6 py-6">
					<a href={resolve(`/schedule/${item.id}`)} class="flex items-start justify-between gap-3">
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
							onclick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onDelete?.(item);
							}}
							aria-label="Delete schedule"
						>
							<Trash2 size="18" strokeWidth="2.5" />
						</button>
					</a>
					<div class="mt-5 flex items-center gap-3">
						<Switch
							bind:checked={item.isPublic}
							onCheckedChange={() => onChangeVisibility(item)}
							label={null}
						/>
						<p class="text-body2 text-on-surface/70 font-medium">เป็นสาธารณะ</p>
					</div>
				</div>
			{/each}
		{/if}
		<a
			href={resolve('/schedule')}
			class="text-md inline-flex w-full justify-center rounded-2xl bg-blue-100 px-8 py-2 text-center font-medium text-blue-900"
		>
			เพิ่มตารางเรียน
		</a>
	</div>
</div>
