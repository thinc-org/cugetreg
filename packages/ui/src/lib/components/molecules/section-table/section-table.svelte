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
		if (value === 'ปิด') return 'bg-[#EDEDF1] text-[#6F7593]';
		if (value.includes('/')) {
			const [taken, total] = value.split('/').map((n) => parseInt(n.trim()));
			if (taken < total) return 'bg-[#D1FEB6] text-[#4B991C]';
			return 'bg-[#FDDBDB] text-[#B10C0C]';
		}
		return 'bg-[#EDEDF1] text-[#6F7593]';
	};
</script>

{#if boxed}
	<div class={`flex flex-col gap-4 ${className ?? ''}`}>
		{#each tableData as row, i (i)}
			<div
				class={`rounded-xl border p-4 transition-colors ${
					selectedSection === row.section ? 'border-[#4A70C6]' : 'border-[#E6E8F0]'
				} bg-white`}
			>
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<p class="text-lg font-semibold text-[#353745]">
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
							class="mb-2 grid w-full grid-cols-[32fr_98fr_60fr_38fr] gap-2 text-[12px] font-semibold text-[#6F7593]"
						>
							<div class="pr-0">ผู้สอน</div>
							<div class="pr-0">วันเวลาเรียน</div>
							<div class="pr-0">ห้องเรียน</div>
							<div>รูปแบบ</div>
						</div>

						<div class="flex flex-col">
							{#each row.classes as cls, j (j)}
								<div
									class={`font-sarabun grid w-full grid-cols-[32fr_98fr_60fr_38fr] gap-2 py-2 text-[12px] ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-[#353745]'}`}
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
		<TableHeader class="bg-[#F6F6F9]">
			<TableRow class="text-sm font-semibold tracking-[0.15px]">
				<TableHead class="border-[#ECEEF4] text-[#4A70C6]">เซคชั่น</TableHead>
				<TableHead class="border-[#ECEEF4] text-[#4A70C6]">จำนวนที่รับ</TableHead>
				<TableHead class="border-[#ECEEF4] text-[#4A70C6]">ผู้สอน</TableHead>
				<TableHead class="border-[#ECEEF4] text-[#4A70C6]">วันเวลาเรียน</TableHead>
				<TableHead class="border-[#ECEEF4] text-[#4A70C6]">ห้องเรียน</TableHead>
				<TableHead class="border-r-0 border-[#ECEEF4] text-[#4A70C6]">รูปแบบ</TableHead>
				<TableHead class="border-r-0 border-l-0 border-[#ECEEF4] text-right text-[#4A70C6]"
				></TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			{#each tableData as row, i (i)}
				{#each row.classes as cls, j (j)}
					<TableRow class="[&>td]:border-b [&>td]:border-[#E6E8F0] last:[&>td]:border-b-0">
						{#if j === 0}
							<TableCell
								rowspan={row.classes.length}
								class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
							>
								{row.section}
							</TableCell>

							<TableCell rowspan={row.classes.length} class="py-5">
								<Chip closable={false} class={getSeatColor(row.seats)}>
									{row.seats}
								</Chip>
							</TableCell>
						{/if}

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{cls.teacher}
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{cls.schedule}
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{cls.room}
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
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
