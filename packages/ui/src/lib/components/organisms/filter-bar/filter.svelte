<script lang="ts">
	import { Chip } from '$lib/components/atoms/chip';
	import { FacultyChip } from '$lib/components/atoms/faculty-chip';
	import * as Select from '$lib/components/molecules/select';

	import { FACULTIES, type FacultyId } from '@cugetreg/utils/faculty';

	import { InfoCircle } from '../../atoms/info-circle';
	import { Modal } from '../../atoms/modal';

	// --- 1. CONFIGURATION DATA ---
	// Colours come from the Figma semantic tokens (Semantic/gened/*).
	const genEdOptions = [
		{ id: 'SC', label: 'วิทย์', color: '#E39600', bg: '#FFFFFF' },
		{ id: 'HU', label: 'มนุษย์', color: '#C7117F', bg: '#FFFFFF' },
		{ id: 'SO', label: 'สังคม', color: '#4B991C', bg: '#FFFFFF' },
		{ id: 'IN', label: 'สหฯ', color: '#681A83', bg: '#FFFFFF' }
	];

	const facultyOptions = Object.keys(FACULTIES).map((faculty) => {
		const facultyData = FACULTIES[faculty as FacultyId];
		const name = facultyData.th_short;

		return {
			id: faculty,
			label: name
		};
	});

	// Mon–Fri come from the Figma semantic tokens (Semantic/dow/*).
	// Sat/Sun are not defined in Figma, so they keep their existing colours.
	const dayOptions = [
		{ id: 'MO', label: 'จันทร์', color: '#E39600', bg: '#FFF3D2' },
		{ id: 'TU', label: 'อังคาร', color: '#C7117F', bg: '#FDD8EE' },
		{ id: 'WE', label: 'พุธ', color: '#4B991C', bg: '#D1FEB6' },
		{ id: 'TH', label: 'พฤหัส', color: '#E87D00', bg: '#FFE2BF' },
		{ id: 'FR', label: 'ศุกร์', color: '#0C5A93', bg: '#DAEFFE' },
		{ id: 'SA', label: 'เสาร์', color: '#7C3AED', bg: '#F3E8FF' },
		{ id: 'SU', label: 'อาทิตย์', color: '#DC2626', bg: '#FEF2F2' }
	];

	const evalOptions = [
		{ id: 'SU', label: 'S/U' },
		{ id: 'LETTER', label: 'Letter Grade' }
	];

	// --- 2. PROPS (Svelte 5) ---
	interface Props {
		selectedGenEds?: string[];
		selectedFaculties?: string[];
		selectedDays?: string[];
		selectedEval?: string[];
		startTime?: string;
		endTime?: string;
		fitSchedule?: boolean;
		favoriteOnly?: boolean;
		noConditions?: boolean;
		onsearch?: (event: MouseEvent) => void;
	}

	let {
		selectedGenEds = $bindable([]),
		selectedFaculties = $bindable([]),
		selectedDays = $bindable([]),
		selectedEval = $bindable([]),
		startTime = $bindable(''),
		endTime = $bindable(''),
		fitSchedule = $bindable(false),
		noConditions = $bindable(true),
		favoriteOnly = $bindable(false),
		onsearch = () => {} // Callback function
	}: Props = $props();

	// --- STATE ---
	let openDropdown = $state<string | null>(null);
	let showNoPrereqModal = $state(false);
	let showFitModal = $state(false);

	function onNoConditionsChange() {
		if (noConditions) showNoPrereqModal = true;
	}
	function onFitScheduleChange() {
		if (fitSchedule) showFitModal = true;
	}

	// --- 3. HELPER LOGIC ($derived) ---
	let activeGenEds = $derived(genEdOptions.filter((o) => selectedGenEds.includes(o.id)));

	let activeFaculties = $derived(facultyOptions.filter((o) => selectedFaculties.includes(o.id)));

	let activeDays = $derived(dayOptions.filter((o) => selectedDays.includes(o.id)));

	let activeEval = $derived(evalOptions.filter((o) => selectedEval.includes(o.id)));
	let availableEval = $derived(evalOptions.filter((o) => !selectedEval.includes(o.id)));

	// --- ACTIONS ---
	function toggleDropdown(name: string, event?: Event) {
		if (event) event.stopPropagation();
		openDropdown = openDropdown === name ? null : name;
	}

	function addOption(listName: string, id: string) {
		if (noConditions) noConditions = false;

		// Svelte 5: Reassign array to trigger update
		if (listName === 'gened') selectedGenEds = [...selectedGenEds, id];
		if (listName === 'faculty') selectedFaculties = [...selectedFaculties, id];
		if (listName === 'day') selectedDays = [...selectedDays, id];
		if (listName === 'eval') selectedEval = [...selectedEval, id];
		openDropdown = null;
	}

	function removeOption(listName: string, id: string) {
		if (listName === 'gened') selectedGenEds = selectedGenEds.filter((i: string) => i !== id);
		if (listName === 'faculty')
			selectedFaculties = selectedFaculties.filter((i: string) => i !== id);
		if (listName === 'day') selectedDays = selectedDays.filter((i: string) => i !== id);
		if (listName === 'eval') selectedEval = selectedEval.filter((i: string) => i !== id);
	}

	function handleWindowClick() {
		openDropdown = null;
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div class="bg-surface flex h-full w-full flex-col">
	<div
		class="flex-1 overflow-x-hidden overflow-y-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
	>
		<div class="mb-4">
			<label for="gened-select" class="mb-1.5 block text-xs text-neutral-400">ประเภท GenEd</label>
			<Select.Root type="multiple" bind:value={selectedGenEds}>
				<div class="relative min-h-10">
					{#if activeGenEds.length}
						<div
							class="pointer-events-none relative z-10 flex min-h-10 w-full flex-wrap items-center gap-2 py-2 pr-10 pl-2"
						>
							{#each activeGenEds as item (item.id)}
								<Chip
									class="bg-surface max-w-full border px-2.5 py-1 text-xs font-normal [&>button]:pointer-events-auto"
									style="color: {item.color}; border-color: {item.color};"
									closable
									onClose={(event: MouseEvent) => {
										event.stopPropagation();
										removeOption('gened', item.id);
									}}
									aria-label={`Remove ${item.label}`}
								>
									{item.label}
								</Chip>
							{/each}
						</div>
					{/if}
					<Select.Trigger
						id="gened-select"
						aria-label="ประเภท GenEd"
						class="bg-surface-container-lowest hover:bg-surface-container-low absolute inset-0 h-full min-h-10 cursor-pointer rounded-xl border-transparent p-2 text-sm text-neutral-400 focus:ring-0 focus:ring-offset-0"
					>
						{#if !activeGenEds.length}
							Select GenEd...
						{/if}
					</Select.Trigger>
				</div>
				<Select.Content
					class="border-surface-container bg-surface max-h-[200px] rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
					role="listbox"
				>
					<Select.Group>
						{#each genEdOptions as genEd (genEd.id)}
							<Select.Item
								value={genEd.id}
								label={genEd.label}
								aria-label={genEd.label}
								class="hover:bg-surface-container-low cursor-pointer px-3.5 py-2.5 text-sm"
								style="color: {genEd.color}"
								role="option"
								check={true}
							>
								{genEd.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="mb-4">
			<label for="gened-select" class="mb-1.5 block text-xs text-neutral-400">คณะ</label>
			<Select.Root type="multiple" bind:value={selectedFaculties}>
				<div class="relative min-h-10">
					{#if activeFaculties.length}
						<div
							class="pointer-events-none relative z-10 flex min-h-10 w-full flex-wrap items-center gap-2 py-2 pr-10 pl-2"
						>
							{#each activeFaculties as item (item.id)}
								<FacultyChip
									faculty={item.id as FacultyId}
									class="max-w-full px-2.5 py-1 text-xs font-normal [&>button]:pointer-events-auto"
									closable
									onClose={() => {
										removeOption('faculty', item.id);
									}}
									aria-label={`Remove ${item.label}`}
								>
									{item.label}
								</FacultyChip>
							{/each}
						</div>
					{/if}
					<Select.Trigger
						id="gened-select"
						aria-label="ประเภท GenEd"
						class="bg-surface-container-lowest hover:bg-surface-container-low absolute inset-0 h-full min-h-10 cursor-pointer rounded-xl border-transparent p-2 text-sm text-neutral-400 focus:ring-0 focus:ring-offset-0"
					>
						{#if !activeFaculties.length}
							Select faculty...
						{/if}
					</Select.Trigger>
				</div>
				<Select.Content
					class="border-surface-container bg-surface max-h-[200px] rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
					role="listbox"
				>
					<Select.Group>
						{#each facultyOptions as faculty (faculty.id)}
							<Select.Item
								value={faculty.id}
								label={faculty.label}
								aria-label={faculty.label}
								class="hover:bg-surface-container-low cursor-pointer px-3.5 py-2.5 text-sm"
								style="color: black"
								role="option"
								check={true}
							>
								{faculty.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="mb-4">
			<label for="gened-select" class="mb-1.5 block text-xs text-neutral-400">วันในสัปดาห์ะ</label>
			<Select.Root type="multiple" bind:value={selectedDays}>
				<div class="relative min-h-10">
					{#if activeDays.length}
						<div
							class="pointer-events-none relative z-10 flex min-h-10 w-full flex-wrap items-center gap-2 py-2 pr-10 pl-2"
						>
							{#each activeDays as item (item.id)}
								<Chip
									class="bg-surface max-w-full px-2.5 py-1 text-xs font-normal [&>button]:pointer-events-auto"
									closable
									onClose={(event: MouseEvent) => {
										event.stopPropagation();
										removeOption('day', item.id);
									}}
									style="background-color: {item.bg}; color: {item.color};"
									aria-label={`Remove ${item.label}`}
								>
									{item.label}
								</Chip>
							{/each}
						</div>
					{/if}
					<Select.Trigger
						id="gened-select"
						aria-label="ประเภท GenEd"
						class="bg-surface-container-lowest hover:bg-surface-container-low absolute inset-0 h-full min-h-10 cursor-pointer rounded-xl border-transparent p-2 text-sm text-neutral-400 focus:ring-0 focus:ring-offset-0"
					>
						{#if !activeDays.length}
							Select day...
						{/if}
					</Select.Trigger>
				</div>
				<Select.Content
					class="border-surface-container bg-surface max-h-[200px] rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
					role="listbox"
				>
					<Select.Group>
						{#each dayOptions as day (day.id)}
							<Select.Item
								value={day.id}
								label={day.label}
								aria-label={day.label}
								class="hover:bg-surface-container-low cursor-pointer px-3.5 py-2.5 text-sm"
								style="color: {day.color}"
								role="option"
								check={true}
							>
								{day.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="mb-4 flex gap-3">
			<div class="flex-1">
				<label class="mb-1.5 block text-xs text-neutral-400">เวลาเริ่ม</label>
				<div class="relative">
					<input
						type="time"
						bind:value={startTime}
						placeholder="08:00"
						class="bg-surface-container-lowest text-on-surface box-border w-full rounded-xl border-none p-2.5 text-base [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
					/>
					<svg
						class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#999"
						stroke-width="2"
						><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
					>
				</div>
			</div>
			<div class="flex-1">
				<label class="mb-1.5 block text-xs text-neutral-400">เวลาจบ</label>
				<div class="relative">
					<input
						type="time"
						bind:value={endTime}
						placeholder="16:00"
						class="bg-surface-container-lowest text-on-surface box-border w-full rounded-xl border-none p-2.5 text-base [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
					/>
					<svg
						class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#999"
						stroke-width="2"
						><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
					>
				</div>
			</div>
		</div>

		<div class="-mt-1.5 mb-4 flex items-center gap-1.5">
			<label
				class="flex cursor-pointer items-center text-base font-normal text-neutral-700 select-none"
			>
				<input
					type="checkbox"
					bind:checked={noConditions}
					onchange={onNoConditionsChange}
					class="peer absolute size-0 cursor-pointer opacity-0"
				/>
				<span
					class="relative mr-2.5 h-[18px] w-[18px] rounded bg-neutral-200 transition-colors duration-200 peer-checked:bg-[#4f46e5] peer-hover:bg-neutral-300 after:absolute after:top-[2px] after:left-[6px] after:hidden after:h-[9px] after:w-[4px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-solid after:border-white after:content-[''] peer-checked:after:block"
				></span>
				<span>ไม่กำหนดเงื่อนไขรายวิชา</span>
			</label>
			<span class="inline-flex items-center">
				<InfoCircle tooltipText="แสดงเฉพาะรายวิชาที่ไม่กำหนดเงื่อนไขในการลงทะเบียน" />
			</span>
		</div>
		<div class="-mt-1.5 mb-4 flex items-center gap-1.5">
			<label
				class="flex cursor-pointer items-center text-base font-normal text-neutral-700 select-none"
			>
				<input
					type="checkbox"
					bind:checked={favoriteOnly}
					class="peer absolute size-0 cursor-pointer opacity-0"
				/>
				<span
					class="relative mr-2.5 h-[18px] w-[18px] rounded bg-neutral-200 transition-colors duration-200 peer-checked:bg-[#4f46e5] peer-hover:bg-neutral-300 after:absolute after:top-[2px] after:left-[6px] after:hidden after:h-[9px] after:w-[4px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-solid after:border-white after:content-[''] peer-checked:after:block"
				></span>
				<span>วิชาที่ถูกใจ</span>
			</label>
			<span class="inline-flex items-center">
				<InfoCircle tooltipText="แสดงเฉพาะรายวิชาที่คุณกดถูกใจไว้" />
			</span>
		</div>
		<div class="mb-4">
			<label class="mb-2 block text-xs text-neutral-400">Fit my schedule</label>
			<div class="flex items-center gap-2.5">
				<label class="relative inline-block h-6 w-11">
					<input
						type="checkbox"
						bind:checked={fitSchedule}
						onchange={onFitScheduleChange}
						class="peer size-0 opacity-0"
					/>
					<span
						class="absolute inset-0 cursor-pointer rounded-[34px] bg-neutral-300 transition-colors duration-[0.4s] peer-checked:bg-neutral-400 before:absolute before:bottom-[3px] before:left-[3px] before:h-[18px] before:w-[18px] before:rounded-[50%] before:bg-white before:transition-transform before:duration-[0.4s] before:content-[''] peer-checked:before:translate-x-5"
					></span>
				</label>
				<span class="flex items-center gap-1.5 text-base font-normal text-neutral-700">
					Fit my schedule
					<span class="inline-flex items-center">
						<InfoCircle tooltipText="แสดงเฉพาะรายวิชาที่ไม่ชนกับตารางเรียนของคุณ" />
					</span>
				</span>
			</div>
		</div>

		<div class="mb-4">
			<label class="mb-1.5 block text-xs text-neutral-400">วิธีการวัดผล</label>
			<div
				class="bg-surface-container-lowest hover:bg-surface-container-low relative flex min-h-10 cursor-pointer flex-wrap gap-2 rounded-xl border border-transparent p-2 pr-[30px]"
				onclick={(e) => toggleDropdown('eval', e)}
				role="button"
				tabindex="0"
				onkeypress={() => {}}
			>
				{#each activeEval as item (item.label)}
					<div
						class="bg-surface-container text-on-surface inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-normal"
					>
						{item.label}
						<span
							class="cursor-pointer leading-none opacity-60 hover:opacity-100"
							onclick={(e) => {
								e.stopPropagation();
								removeOption('eval', item.id);
							}}
							role="button"
							tabindex="0"
							onkeypress={() => {}}>×</span
						>
					</div>
				{/each}
				{#if activeEval.length === 0}
					<span class="self-center text-sm text-neutral-400">Select...</span>
				{/if}
				<div class="absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] text-neutral-400">
					▼
				</div>
				{#if openDropdown === 'eval'}
					<div
						class="border-surface-container bg-surface absolute right-0 bottom-[105%] left-0 z-50 max-h-[200px] overflow-y-auto rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
						onclick={(e) => e.stopPropagation()}
						role="listbox"
						tabindex="0"
						onkeypress={() => {}}
					>
						{#each availableEval as option (option.label)}
							<div
								class="hover:bg-surface-container-low cursor-pointer px-3.5 py-2.5 text-sm"
								onclick={() => addOption('eval', option.id)}
								role="option"
								tabindex="0"
								onkeypress={() => {}}
							>
								{option.label}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div>
		<button
			class="bg-primary-low text-on-primary-low hover:bg-primary-low w-full cursor-pointer rounded-xl border-none p-3 text-base font-medium"
			onclick={onsearch}
		>
			ค้นหา
		</button>
	</div>
</div>

<Modal bind:show={showNoPrereqModal} dim centered exitOnBackgroundClick exitOnEsc>
	<div
		class="bg-surface w-[420px] max-w-[90vw] rounded-3xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
	>
		<h3 class="m-0 mb-4 text-2xl font-bold text-blue-700">ไม่กำหนดเงื่อนไขรายวิชา</h3>
		<p class="m-0 mb-6 text-[15px] leading-relaxed text-neutral-500">
			เมื่อเปิด ไม่กำหนดเงื่อนไขรายวิชา<br />
			หน้าแสดงผลวิชาเรียน<br />
			จะแสดงเฉพาะรายวิชาที่ไม่กำหนดเงื่อนไข<br />
			ที่ต้องผ่านก่อนการลงทะเบียน
		</p>
		<button
			class="bg-primary-low hover:bg-primary-low w-full cursor-pointer rounded-xl border-none p-3 text-base font-bold text-blue-700 transition-colors"
			onclick={() => (showNoPrereqModal = false)}
		>
			ตกลง
		</button>
	</div>
</Modal>

<Modal bind:show={showFitModal} dim centered exitOnBackgroundClick exitOnEsc>
	<div
		class="bg-surface w-[420px] max-w-[90vw] rounded-3xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
	>
		<h3 class="m-0 mb-4 text-2xl font-bold text-blue-700">Fit my schedule</h3>
		<p class="m-0 mb-6 text-[15px] leading-relaxed text-neutral-500">
			เมื่อเปิด Fit my schedule<br />
			หน้าแสดงผลวิชาเรียน<br />
			จะแสดงเฉพาะรายวิชาที่ไม่ซ้ำวัน เวลา<br />
			กับตารางเรียนของคุณที่ได้เลือกและจัดไว้
		</p>
		<button
			class="bg-primary-low hover:bg-primary-low w-full cursor-pointer rounded-xl border-none p-3 text-base font-bold text-blue-700 transition-colors"
			onclick={() => (showFitModal = false)}
		>
			ตกลง
		</button>
	</div>
</Modal>
