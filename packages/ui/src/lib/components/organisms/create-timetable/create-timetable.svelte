<script lang="ts">
	import {
		defineMessages,
		semesterShortMessages,
		studyProgramMessages,
		useTranslations
	} from '$lib/i18n';

	import { untrack } from 'svelte';

	import type { TimetableMetaData } from '.';

	import { Button } from '../../atoms/button';
	import { Checkbox } from '../../atoms/checkbox';
	import { InfoCircle } from '../../atoms/info-circle';
	import { Input } from '../../atoms/input';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '../../molecules/select';

	interface CreateTimetableProp {
		onCancel?: () => void;
		onConfirm?: (schedule: TimetableMetaData) => void;
		yearOptions?: { value: string; label: string }[];
		semesterOptions?: { value: string; label: string }[];
		/** ล็อกระบบ/ปี/ภาคไว้ตามที่กำหนด แก้ไม่ได้ */
		fixedTerm?: {
			academicYear: number | string;
			semester: 'FIRST' | 'SECOND' | 'SUMMER';
			studyProgram: 'S' | 'I' | 'T';
		};
	}

	let {
		onCancel = () => {},
		onConfirm = () => {},
		yearOptions = [
			{ value: '2568', label: '2568' },
			{ value: '2567', label: '2567' },
			{ value: '2566', label: '2566' },
			{ value: '2565', label: '2565' },
			{ value: '2564', label: '2564' }
		],
		semesterOptions: semesterOptionsProp,
		fixedTerm
	}: CreateTimetableProp = $props();

	const t = useTranslations(
		defineMessages({
			th: {
				heading: 'เพิ่มตารางเรียน',
				settings: 'ตั้งค่า',
				selectSystem: 'เลือกระบบ',
				selectYear: 'เลือกปีการศึกษา',
				selectSemester: 'เลือกภาคการศึกษา',
				name: 'ชื่อตารางเรียน',
				defaultName: 'ตารางเรียนแสนสนุก',
				charCount: 'จำนวนตัวอักษร {count}/{max}',
				public: 'เปิดเป็นสาธารณะ',
				publicTooltip: 'เมื่อเปิดสาธารณะ จะสามารถแชร์ตารางเรียนนี้ได้ด้วยลิงก์',
				cancel: 'ยกเลิก',
				create: 'สร้าง'
			},
			en: {
				heading: 'Add timetable',
				settings: 'Settings',
				selectSystem: 'Select program',
				selectYear: 'Select academic year',
				selectSemester: 'Select semester',
				name: 'Timetable name',
				defaultName: 'My fun timetable',
				charCount: 'Characters {count}/{max}',
				public: 'Make public',
				publicTooltip: 'When public, this timetable can be shared via a link',
				cancel: 'Cancel',
				create: 'Create'
			}
		})
	);
	const tStudyProgram = useTranslations(studyProgramMessages);
	const tSemester = useTranslations(semesterShortMessages);

	const semesterOptions = $derived(
		semesterOptionsProp ?? [
			{ value: 'FIRST', label: tSemester('FIRST') },
			{ value: 'SECOND', label: tSemester('SECOND') },
			{ value: 'SUMMER', label: tSemester('SUMMER') }
		]
	);

	interface SystemInterface {
		value: 'S' | 'I' | 'T';
		label: string;
	}

	let selected_system: 'S' | 'I' | 'T' = $state(untrack(() => fixedTerm?.studyProgram ?? 'S'));
	const options_system: SystemInterface[] = $derived([
		{ value: 'S', label: tStudyProgram('S') },
		{ value: 'T', label: tStudyProgram('T') },
		{ value: 'I', label: tStudyProgram('I') }
	]);

	let selected_year = $state(
		untrack(() => (fixedTerm ? String(fixedTerm.academicYear) : (yearOptions[0]?.value ?? '2568')))
	);
	let selected_semester: 'FIRST' | 'SECOND' | 'SUMMER' = $state(
		untrack(
			() =>
				fixedTerm?.semester ??
				(semesterOptionsProp?.[0]?.value as 'FIRST' | 'SECOND' | 'SUMMER') ??
				'FIRST'
		)
	);

	let tableName = $state(untrack(() => t('defaultName')));
	let currentLetter = $derived(tableName.length);
	let isPublic = $state(false);

	function handleConfirm() {
		const timetableMeta: TimetableMetaData = {
			name: tableName,
			semesterType: selected_system,
			semester: selected_semester,
			academicYear: Number(selected_year),
			isPublic
		};

		onConfirm(timetableMeta);
	}

	// $effect(() => {
	//   tableName = tableName.slice(0, 30);
	// });
</script>

<div class="bg-surface flex flex-col gap-6 rounded-xl border border-[#d6d7e1] p-12 sm:w-104">
	<!-- Title -->
	<h1 class="text-h2 leading-h2 text-center font-medium tracking-[0.15px] text-[#353745]">
		{t('heading')}
	</h1>

	<!-- Schedule Settings -->
	<div>
		<p class="font-orbit text-caption leading-caption text-[#898EA7]">{t('settings')}</p>

		<Select type="single" bind:value={selected_system}>
			<SelectTrigger class="my-1 w-full" aria-label={t('selectSystem')} disabled={!!fixedTerm}>
				{options_system.find((x) => x.value == selected_system)?.label}
			</SelectTrigger>

			<SelectContent>
				<SelectGroup>
					{#each options_system as option (option.value)}
						<SelectItem value={option.value} label={option.label} aria-label={option.label}>
							{option.label}
						</SelectItem>
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>

		<div class="flex gap-2">
			<Select type="single" bind:value={selected_year}>
				<SelectTrigger class="my-1 flex-1" aria-label={t('selectYear')} disabled={!!fixedTerm}>
					{selected_year}
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{#each yearOptions as option (option.value)}
							<SelectItem value={option.value} label={option.label} aria-label={option.label}>
								{option.label}
							</SelectItem>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Select type="single" bind:value={selected_semester}>
				<SelectTrigger class="my-1 flex-1" aria-label={t('selectSemester')} disabled={!!fixedTerm}>
					{semesterOptions.find((x) => x.value === selected_semester)?.label}
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{#each semesterOptions as option (option.value)}
							<SelectItem value={option.value} label={option.label} aria-label={option.label}>
								{option.label}
							</SelectItem>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	</div>

	<!-- Schedule Name -->
	<div class="space-y-1">
		<p class="font-orbit text-caption leading-caption text-[#898EA7]">{t('name')}</p>

		<Input bind:value={tableName} state="default" placeholder="" class="my-1" maxLength={30} />

		<p class="font-orbit text-caption leading-caption text-[#898EA7]">
			{t('charCount', { count: currentLetter, max: 30 })}
		</p>
	</div>

	<!-- Public Checkbox -->
	<div class="flex items-center gap-2.5">
		<Checkbox bind:checked={isPublic} label={t('public')} />
		<InfoCircle tooltipText={t('publicTooltip')} />
	</div>

	<!-- Cancel/Confirm Buttons -->
	<div class="flex w-full gap-6">
		<Button
			variant="solid"
			size="default"
			color="neutral"
			class="w-full"
			onclick={() => onCancel()}
		>
			{t('cancel')}
		</Button>

		<Button variant="solid" size="default" color="primary" class="w-full" onclick={handleConfirm}>
			{t('create')}
		</Button>
	</div>
</div>
