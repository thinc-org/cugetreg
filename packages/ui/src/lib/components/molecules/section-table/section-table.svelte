<script lang="ts">
	import type { SectionTableData } from '.';

	import { Chip } from '../../atoms/chip';
	import { SelectorButton } from '../../atoms/selector-button';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table';

	interface Props {
		class?: string;
		boxed?: boolean;
		tableData: Array<SectionTableData>;
		selectedSection?: string | null;
		onSelectSection?: (section: string) => void;
	}

	let {
		tableData,
		class: className = undefined,
		boxed = true,
		selectedSection = null,
		onSelectSection = () => {}
	}: Props = $props();

	const getSeatColor = (value: string) => {
		if (value === 'ปิด') return 'bg-surface-container-high text-on-surface-var';
		if (value.includes('/')) {
			const [taken, total] = value.split('/').map((n) => parseInt(n.trim()));
			if (taken < total) return 'bg-[#D1FEB6] text-[#4B991C]';
			return 'bg-[#FDDBDB] text-[#B10C0C]';
		}
		return 'bg-surface-container-high text-on-surface-var';
	};
</script>

{#if boxed}
	<div class={`flex flex-col gap-4 ${className ?? ''}`}>
		{#each tableData as row, i (i)}
			<div
				class={`rounded-xl border p-4 transition-colors ${
					selectedSection === row.section ? 'border-primary' : 'border-surface-container-low'
				} bg-surface-bright`}
			>
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<p class="text-on-surface text-lg font-semibold">
							Section {row.section}
						</p>
						<Chip closable={false} class={getSeatColor(row.seats)}>
							{row.seats}
						</Chip>
					</div>
					<SelectorButton
						selected={selectedSection === row.section}
						onClick={() => onSelectSection(row.section)}
					/>
				</div>

				<div class="w-full">
					<div class="w-full">
						<div
							class="text-on-surface-var mb-2 grid w-full grid-cols-[32fr_98fr_60fr_38fr] gap-2 text-[12px] font-semibold"
						>
							<div class="pr-0">ผู้สอน</div>
							<div class="pr-0">วันเวลาเรียน</div>
							<div class="pr-0">ห้องเรียน</div>
							<div>รูปแบบ</div>
						</div>

						<div class="flex flex-col">
							{#each row.classes as cls, j (j)}
								<div
									class={`font-sarabun text-body2 grid w-full grid-cols-[32fr_98fr_60fr_38fr] gap-2 py-2 ${row.seats === 'ปิด' ? 'text-on-surface-var' : 'text-on-surface'}`}
								>
									<div class="pr-0">{cls.teacher}</div>
									<div class="pr-0">{cls.schedule}</div>
									<div class="pr-0">{cls.room}</div>
									<div>{cls.type}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<Table class={`w-full border-separate border-spacing-0 text-left ${className ?? ''}`}>
		<TableHeader class="bg-surface-container-lowest">
			<TableRow class="text-xs font-semibold tracking-[0.15px] sm:text-base">
				<TableHead class="border-surface-container-low text-primary">เซคชัน</TableHead>
				<TableHead class="border-surface-container-low text-primary">จำนวนที่รับ</TableHead>
				<TableHead class="border-surface-container-low text-primary">ผู้สอน</TableHead>
				<TableHead class="border-surface-container-low text-primary">วันเวลาเรียน</TableHead>
				<TableHead class="border-surface-container-low text-primary">ห้องเรียน</TableHead>
				<TableHead class="border-surface-container-low text-primary border-r-0">รูปแบบ</TableHead>
				<TableHead
					class="border-surface-container-low text-primary border-r-0 border-l-0 text-right"
				></TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			{#each tableData as row, i (i)}
				{#each row.classes as cls, j (j)}
					<TableRow
						class="[&>td]:border-surface-container-low [&>td]:border-b last:[&>td]:border-b-0"
					>
						{#if j === 0}
							<TableCell
								rowspan={row.classes.length}
								class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-on-surface-var' : 'text-on-surface'}`}
							>
								{row.section}
							</TableCell>

							<TableCell rowspan={row.classes.length} class="py-5">
								<Chip closable={false} class={getSeatColor(row.seats)}>
									{row.seats}
								</Chip>
							</TableCell>
						{/if}

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-on-surface-var' : 'text-on-surface'}`}
						>
							{cls.teacher}
						</TableCell>

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-on-surface-var' : 'text-on-surface'}`}
						>
							{cls.schedule}
						</TableCell>

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-on-surface-var' : 'text-on-surface'}`}
						>
							{cls.room}
						</TableCell>

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-on-surface-var' : 'text-on-surface'}`}
						>
							{cls.type}
						</TableCell>

						{#if j === 0}
							<TableCell rowspan={row.classes.length} class="py-5 text-right">
								<SelectorButton
									selected={selectedSection === row.section}
									onClick={() => onSelectSection(row.section)}
								/>
							</TableCell>
						{/if}
					</TableRow>
				{/each}
			{/each}
		</TableBody>
	</Table>
{/if}
