<script lang="ts">
	import { Chip } from '../../atoms/chip';
	import { SelectorButton } from '../../atoms/selector-button';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table';

	interface Props {
		class?: string;
		boxed?: boolean;
		tableData: Array<{
			section: string;
			seats: string;
			teacher: string;
			schedule: string;
			room: string;
			type: string;
		}>;
	}

	let { tableData, class: className = undefined, boxed = true }: Props = $props();

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
	<div class={`rounded-2xl border border-[#D6D7E1] bg-white p-3 ${className ?? ''}`}>
		<Table class="w-full border-separate border-spacing-0 text-left">
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
					<TableRow class="[&>td]:border-b [&>td]:border-[#E6E8F0] last:[&>td]:border-b-0">
						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{row.section}
						</TableCell>

						<TableCell class="py-5">
							<Chip closable={false} class={getSeatColor(row.seats)}>
								{row.seats}
							</Chip>
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{row.teacher}
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{row.schedule}
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{row.room}
						</TableCell>

						<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
							{row.type}
						</TableCell>

						<TableCell class="py-5 text-right">
							<SelectorButton selected={row} />
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
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
				<TableRow class="[&>td]:border-b [&>td]:border-[#E6E8F0] last:[&>td]:border-b-0">
					<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
						{row.section}
					</TableCell>

					<TableCell class="py-5">
						<Chip closable={false} class={getSeatColor(row.seats)}>
							{row.seats}
						</Chip>
					</TableCell>

					<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
						{row.teacher}
					</TableCell>

					<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
						{row.schedule}
					</TableCell>

					<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
						{row.room}
					</TableCell>

					<TableCell class={`py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}>
						{row.type}
					</TableCell>

					<TableCell class="py-5 text-right">
						<SelectorButton selected={row} />
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
{/if}
