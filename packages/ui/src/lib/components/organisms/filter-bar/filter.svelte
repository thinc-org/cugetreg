<script lang="ts">
	import { Chip } from '$lib/components/atoms/chip';
	import { FacultyChip } from '$lib/components/atoms/faculty-chip';
	import * as Select from '$lib/components/molecules/select';
	import { dayMessages, defineMessages, useLocale, useTranslations } from '$lib/i18n';

	import { FACULTIES, type FacultyId } from '@cugetreg/utils/faculty';

	import { InfoCircle } from '../../atoms/info-circle';
	import { Modal } from '../../atoms/modal';

	// --- 1. CONFIGURATION DATA ---
	const locale = useLocale();
	const tDay = useTranslations(dayMessages);
	const t = useTranslations(
		defineMessages({
			th: {
				genEdSC: 'วิทย์',
				genEdHU: 'มนุษย์',
				genEdSO: 'สังคม',
				genEdIN: 'สหฯ',
				genEdGENED: 'ศึกษาทั่วไป',
				genEdNO: 'ไม่ใช่ GenEd',
				evalSU: 'S/U',
				evalLetter: 'Letter Grade',
				remove: 'ลบ {label}',
				genEdType: 'ประเภท GenEd',
				selectGenEd: 'เลือก GenEd...',
				faculty: 'คณะ',
				selectFaculty: 'เลือกคณะ...',
				dayOfWeek: 'วันในสัปดาห์',
				selectDay: 'เลือกวัน...',
				startTime: 'เวลาเริ่ม',
				endTime: 'เวลาจบ',
				noConditions: 'ไม่กำหนดเงื่อนไขรายวิชา',
				noConditionsTooltip: 'แสดงเฉพาะรายวิชาที่ไม่กำหนดเงื่อนไขในการลงทะเบียน',
				favoriteOnly: 'วิชาที่ถูกใจ',
				favoriteOnlyTooltip: 'แสดงเฉพาะรายวิชาที่คุณกดถูกใจไว้',
				fitSchedule: 'Fit my schedule',
				fitScheduleLabel: 'วิชาที่ไม่ชนตาราง',
				fitScheduleTooltip: 'แสดงเฉพาะรายวิชาที่ไม่ชนกับตารางเรียนของคุณ',
				evaluation: 'วิธีการวัดผล',
				select: 'เลือก...',
				credits: 'หน่วยกิต',
				all: 'ทั้งหมด',
				search: 'ค้นหา',
				noConditionsLine1: 'เมื่อเปิด ไม่กำหนดเงื่อนไขรายวิชา',
				noConditionsLine2: 'หน้าแสดงผลวิชาเรียน',
				noConditionsLine3: 'จะแสดงเฉพาะรายวิชาที่ไม่กำหนดเงื่อนไข',
				noConditionsLine4: 'ที่ต้องผ่านก่อนการลงทะเบียน',
				fitLine1: 'เมื่อเปิด Fit my schedule',
				fitLine2: 'หน้าแสดงผลวิชาเรียน',
				fitLine3: 'จะแสดงเฉพาะรายวิชาที่ไม่ซ้ำวัน เวลา',
				fitLine4: 'กับตารางเรียนของคุณที่ได้เลือกและจัดไว้',
				ok: 'ตกลง'
			},
			en: {
				genEdSC: 'Science',
				genEdHU: 'Humanities',
				genEdSO: 'Social Science',
				genEdIN: 'Interdisciplinary',
				genEdGENED: 'General Education',
				genEdNO: 'Not GenEd',
				evalSU: 'S/U',
				evalLetter: 'Letter Grade',
				remove: 'Remove {label}',
				genEdType: 'GenEd type',
				selectGenEd: 'Select GenEd...',
				faculty: 'Faculty',
				selectFaculty: 'Select faculty...',
				dayOfWeek: 'Day of week',
				selectDay: 'Select day...',
				startTime: 'Start time',
				endTime: 'End time',
				noConditions: 'No prerequisites',
				noConditionsTooltip: 'Show only courses with no registration prerequisites',
				favoriteOnly: 'Liked courses',
				favoriteOnlyTooltip: 'Show only courses you have liked',
				fitSchedule: 'Fit my schedule',
				fitScheduleLabel: 'No schedule conflicts',
				fitScheduleTooltip: 'Show only courses that do not conflict with your timetable',
				evaluation: 'Grading method',
				select: 'Select...',
				credits: 'Credits',
				all: 'All',
				search: 'Search',
				noConditionsLine1: 'When No prerequisites is on,',
				noConditionsLine2: 'the course results',
				noConditionsLine3: 'will only show courses without',
				noConditionsLine4: 'prerequisites required before registration',
				fitLine1: 'When Fit my schedule is on,',
				fitLine2: 'the course results',
				fitLine3: 'will only show courses that do not overlap',
				fitLine4: 'with the timetable you have planned',
				ok: 'OK'
			}
		})
	);

	// Colours come from the Figma semantic tokens (Semantic/gened/*).
	const genEdOptions = $derived([
		{ id: 'SC', label: t('genEdSC'), color: '#E39600', bg: '#FFFFFF' },
		{ id: 'HU', label: t('genEdHU'), color: '#C7117F', bg: '#FFFFFF' },
		{ id: 'SO', label: t('genEdSO'), color: '#4B991C', bg: '#FFFFFF' },
		{ id: 'IN', label: t('genEdIN'), color: '#681A83', bg: '#FFFFFF' },
		{ id: 'GENED', label: t('genEdGENED'), color: '#45485F', bg: '#FFFFFF' },
		{ id: 'NO', label: t('genEdNO'), color: '#000000', bg: '#FFFFFF' }
	]);

	const facultyOptions = $derived(
		Object.keys(FACULTIES).map((faculty) => {
			const facultyData = FACULTIES[faculty as FacultyId];
			const name = locale.current === 'en' ? facultyData.en_short : facultyData.th_short;

			return {
				id: faculty,
				label: name
			};
		})
	);

	// Mon–Fri come from the Figma semantic tokens (Semantic/dow/*).
	// Sat/Sun are not defined in Figma, so they keep their existing colours.
	const dayOptions = $derived([
		{ id: 'MO', label: tDay('MO'), color: '#E39600', bg: '#FFF3D2' },
		{ id: 'TU', label: tDay('TU'), color: '#C7117F', bg: '#FDD8EE' },
		{ id: 'WE', label: tDay('WE'), color: '#4B991C', bg: '#D1FEB6' },
		{ id: 'TH', label: tDay('TH'), color: '#E87D00', bg: '#FFE2BF' },
		{ id: 'FR', label: tDay('FR'), color: '#0C5A93', bg: '#DAEFFE' },
		{ id: 'SA', label: tDay('SA'), color: '#7C3AED', bg: '#F3E8FF' },
		{ id: 'SU', label: tDay('SU'), color: '#DC2626', bg: '#FEF2F2' }
	]);

	const evalOptions = $derived([
		{ id: 'SU', label: t('evalSU') },
		{ id: 'LETTER', label: t('evalLetter') }
	]);

	// --- 2. PROPS (Svelte 5) ---
	interface Props {
		selectedGenEds?: string[];
		selectedFaculties?: string[];
		selectedDays?: string[];
		selectedEval?: string[];
		credit?: string;
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
		credit = $bindable(''),
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
			<label for="gened-select" class="mb-1.5 block text-xs text-neutral-400"
				>{t('genEdType')}</label
			>
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
									aria-label={t('remove', { label: item.label })}
								>
									{item.label}
								</Chip>
							{/each}
						</div>
					{/if}
					<Select.Trigger
						id="gened-select"
						aria-label={t('genEdType')}
						class="bg-surface-container-lowest hover:bg-surface-container-low absolute inset-0 h-full min-h-10 cursor-pointer rounded-xl border-transparent p-2 text-sm text-neutral-400 focus:ring-0 focus:ring-offset-0"
					>
						{#if !activeGenEds.length}
							{t('selectGenEd')}
						{/if}
					</Select.Trigger>
				</div>
				<Select.Content
					class="border-surface-container bg-surface z-[110] max-h-[200px] rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
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
			<label for="faculty-select" class="mb-1.5 block text-xs text-neutral-400"
				>{t('faculty')}</label
			>
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
									aria-label={t('remove', { label: item.label })}
								>
									{item.label}
								</FacultyChip>
							{/each}
						</div>
					{/if}
					<Select.Trigger
						id="faculty-select"
						aria-label={t('faculty')}
						class="bg-surface-container-lowest hover:bg-surface-container-low absolute inset-0 h-full min-h-10 cursor-pointer rounded-xl border-transparent p-2 text-sm text-neutral-400 focus:ring-0 focus:ring-offset-0"
					>
						{#if !activeFaculties.length}
							{t('selectFaculty')}
						{/if}
					</Select.Trigger>
				</div>
				<Select.Content
					class="border-surface-container bg-surface z-[110] max-h-[200px] rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
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
			<label for="day-select" class="mb-1.5 block text-xs text-neutral-400">{t('dayOfWeek')}</label>
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
									aria-label={t('remove', { label: item.label })}
								>
									{item.label}
								</Chip>
							{/each}
						</div>
					{/if}
					<Select.Trigger
						id="day-select"
						aria-label={t('dayOfWeek')}
						class="bg-surface-container-lowest hover:bg-surface-container-low absolute inset-0 h-full min-h-10 cursor-pointer rounded-xl border-transparent p-2 text-sm text-neutral-400 focus:ring-0 focus:ring-offset-0"
					>
						{#if !activeDays.length}
							{t('selectDay')}
						{/if}
					</Select.Trigger>
				</div>
				<Select.Content
					class="border-surface-container bg-surface z-[110] max-h-[200px] rounded-lg border shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
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
				<label class="mb-1.5 block text-xs text-neutral-400">{t('startTime')}</label>
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
				<label class="mb-1.5 block text-xs text-neutral-400">{t('endTime')}</label>
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
				<span>{t('noConditions')}</span>
			</label>
			<span class="inline-flex items-center">
				<InfoCircle tooltipText={t('noConditionsTooltip')} />
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
				<span>{t('favoriteOnly')}</span>
			</label>
			<span class="inline-flex items-center">
				<InfoCircle tooltipText={t('favoriteOnlyTooltip')} />
			</span>
		</div>
		<div class="mb-4">
			<label class="mb-2 block text-xs text-neutral-400">{t('fitSchedule')}</label>
			<div class="flex items-center gap-2.5">
				<label
					class="flex cursor-pointer items-center text-base font-normal text-neutral-700 select-none"
				>
					<input
						type="checkbox"
						bind:checked={fitSchedule}
						class="peer absolute size-0 cursor-pointer opacity-0"
					/>
					<span
						class="relative mr-2.5 h-[18px] w-[18px] rounded bg-neutral-200 transition-colors duration-200 peer-checked:bg-[#4f46e5] peer-hover:bg-neutral-300 after:absolute after:top-[2px] after:left-[6px] after:hidden after:h-[9px] after:w-[4px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-solid after:border-white after:content-[''] peer-checked:after:block"
					></span>
					<span>{t('fitScheduleLabel')}</span>
				</label>
				<span class="flex items-center gap-1.5 text-base font-normal text-neutral-700">
					<span class="inline-flex items-center">
						<InfoCircle tooltipText={t('fitScheduleTooltip')} />
					</span>
				</span>
			</div>
		</div>

		<div class="mb-4">
			<label class="mb-1.5 block text-xs text-neutral-400">{t('evaluation')}</label>
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
					<span class="self-center text-sm text-neutral-400">{t('select')}</span>
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

		<div class="mb-4">
			<label for="credit-filter" class="mb-1.5 block text-xs text-neutral-400">{t('credits')}</label
			>
			<div class="flex items-center gap-3">
				<input
					id="credit-filter"
					type="text"
					inputmode="decimal"
					bind:value={credit}
					placeholder={t('all')}
					class="bg-surface-container-lowest text-on-surface box-border h-10 w-20 rounded-xl border-none p-2.5 text-base text-[14px] placeholder:text-neutral-400"
				/>
				<span class="text-base font-normal text-neutral-700">{t('credits')}</span>
			</div>
		</div>
	</div>
	<div>
		<button
			class="bg-primary-low text-on-primary-low hover:bg-primary-low w-full cursor-pointer rounded-xl border-none p-3 text-base font-medium"
			onclick={onsearch}
		>
			{t('search')}
		</button>
	</div>
</div>

<Modal bind:show={showNoPrereqModal} dim centered exitOnBackgroundClick exitOnEsc>
	<div
		class="bg-surface w-[420px] max-w-[90vw] rounded-3xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
	>
		<h3 class="m-0 mb-4 text-2xl font-bold text-blue-700">{t('noConditions')}</h3>
		<p class="m-0 mb-6 text-[15px] leading-relaxed text-neutral-500">
			{t('noConditionsLine1')}<br />
			{t('noConditionsLine2')}<br />
			{t('noConditionsLine3')}<br />
			{t('noConditionsLine4')}
		</p>
		<button
			class="bg-primary-low hover:bg-primary-low w-full cursor-pointer rounded-xl border-none p-3 text-base font-bold text-blue-700 transition-colors"
			onclick={() => (showNoPrereqModal = false)}
		>
			{t('ok')}
		</button>
	</div>
</Modal>

<Modal bind:show={showFitModal} dim centered exitOnBackgroundClick exitOnEsc>
	<div
		class="bg-surface w-[420px] max-w-[90vw] rounded-3xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
	>
		<h3 class="m-0 mb-4 text-2xl font-bold text-blue-700">{t('fitSchedule')}</h3>
		<p class="m-0 mb-6 text-[15px] leading-relaxed text-neutral-500">
			{t('fitLine1')}<br />
			{t('fitLine2')}<br />
			{t('fitLine3')}<br />
			{t('fitLine4')}
		</p>
		<button
			class="bg-primary-low hover:bg-primary-low w-full cursor-pointer rounded-xl border-none p-3 text-base font-bold text-blue-700 transition-colors"
			onclick={() => (showFitModal = false)}
		>
			{t('ok')}
		</button>
	</div>
</Modal>
