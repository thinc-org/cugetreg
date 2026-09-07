<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';

	import { getBuildingFullName } from '@cugetreg/utils/buildings';

	import type { SectionTableData } from '.';

	import { Chip } from '../../atoms/chip';
	import { SelectorButton } from '../../atoms/selector-button';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table';
	import * as Tooltip from '../tooltip';

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
		if (value === 'ปิด') return 'bg-surface-container-highest text-white';
		if (value.includes('/')) {
			const [taken, total] = value.split('/').map((n) => parseInt(n.trim()));
			if (taken < total) return 'bg-[#D1FEB6] text-[#4B991C]';
			return 'bg-[#FDDBDB] text-[#B10C0C]';
		}
		return 'bg-[#EDEDF1] text-[#6F7593]';
	};

	const isMobile = new MediaQuery('max-width: 767px', false);
	let openLocationId = $state<string | null>(null);
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
									class={`font-sarabun text-body2 grid w-full grid-cols-[32fr_98fr_60fr_38fr] gap-2 py-2 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-[#353745]'}`}
								>
									<div class="pr-0">{cls.teacher}</div>
									<div class="pr-0">{cls.schedule}</div>
									<div class="pr-0">{@render classLocation(cls.room, `boxed-${i}-${j}`)}</div>
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
			<TableRow class="text-xs font-semibold tracking-[0.15px] sm:text-base">
				<TableHead class="border-[#ECEEF4] text-[#4A70C6]">เซคชัน</TableHead>
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
								class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
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
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
						>
							{cls.teacher}
						</TableCell>

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
						>
							{cls.schedule}
						</TableCell>

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
						>
							{@render classLocation(cls.room, `table-${i}-${j}`)}
						</TableCell>

						<TableCell
							class={`text-body2 py-5 ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
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

{#snippet classLocation(location: string, locationId: string)}
	{@const locations = location.trim().split(' ')}
	{@const building = locations[0]}
	{@const roomNumber = locations[1]}

	{@const buildingInfo = getBuildingFullName(building)}
	{@const hoverTitle = `${buildingInfo.name_th} ห้อง ${roomNumber}`}

	<Tooltip.Root
		open={openLocationId === locationId}
		disableCloseOnTriggerClick={isMobile.current}
		onOpenChange={(open) => {
			if (open) openLocationId = locationId;
			else if (openLocationId === locationId) openLocationId = null;
		}}
	>
		<Tooltip.Trigger
			class={`cursor-pointer p-0 text-left ${
				buildingInfo.map_url
					? 'text-blue-500 underline'
					: isMobile.current
						? 'underline decoration-dotted underline-offset-2'
						: 'hover:underline'
			}`}
			onclick={() => {
				if (isMobile.current) {
					openLocationId = openLocationId === locationId ? null : locationId;
				}
			}}
		>
			{building}
			{roomNumber}
		</Tooltip.Trigger>
		<Tooltip.Content
			sideOffset={6}
			class="bg-surface-container-lowest text-on-surface max-w-64 shadow-lg"
			arrowClasses="bg-surface-container-lowest"
		>
			{hoverTitle}
			{#if buildingInfo.map_url}
				<a
					href={buildingInfo.map_url}
					target="_blank"
					rel="noopener noreferrer"
					class="block text-blue-500 underline"
				>
					ดูใน Google Maps
				</a>
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
{/snippet}
