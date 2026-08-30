<script lang="ts">
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
		semesterOptions = [
			{ value: 'FIRST', label: '1' },
			{ value: 'SECOND', label: '2' },
			{ value: 'SUMMER', label: 'ฤดูร้อน' }
		],
		fixedTerm
	}: CreateTimetableProp = $props();

	interface SystemInterface {
		value: 'S' | 'I' | 'T';
		label: string;
	}

	let selected_system: 'S' | 'I' | 'T' = $state(untrack(() => fixedTerm?.studyProgram ?? 'S'));
	const options_system: SystemInterface[] = [
		{ value: 'S', label: 'ทวิภาค' },
		{ value: 'T', label: 'ตรีภาค' },
		{ value: 'I', label: 'นานาชาติ' }
	];

	let selected_year = $state(
		untrack(() => (fixedTerm ? String(fixedTerm.academicYear) : (yearOptions[0]?.value ?? '2568')))
	);
	let selected_semester: 'FIRST' | 'SECOND' | 'SUMMER' = $state(
		untrack(
			() =>
				fixedTerm?.semester ??
				(semesterOptions[0]?.value as 'FIRST' | 'SECOND' | 'SUMMER') ??
				'FIRST'
		)
	);

	let tableName = $state('ตารางเรียนแสนสนุก');
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
		เพิ่มตารางเรียน
	</h1>

	<!-- Schedule Settings -->
	<div>
		<p class="font-orbit text-caption leading-caption text-[#898EA7]">ตั้งค่า</p>

		<Select type="single" bind:value={selected_system}>
			<SelectTrigger class="my-1 w-full" aria-label="Select system" disabled={!!fixedTerm}>
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
				<SelectTrigger class="my-1 flex-1" aria-label="Select year" disabled={!!fixedTerm}>
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
				<SelectTrigger class="my-1 flex-1" aria-label="Select semester" disabled={!!fixedTerm}>
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
		<p class="font-orbit text-caption leading-caption text-[#898EA7]">ชื่อตารางเรียน</p>

		<Input bind:value={tableName} state="default" placeholder="" class="my-1" maxLength={30} />

		<p class="font-orbit text-caption leading-caption text-[#898EA7]">
			จำนวนตัวอักษร {currentLetter}/30
		</p>
	</div>

	<!-- Public Checkbox -->
	<div class="flex items-center gap-2.5">
		<Checkbox bind:checked={isPublic} label="เปิดเป็นสาธารณะ" />
		<InfoCircle tooltipText="เมื่อเปิดสาธารณะ จะสามารถแชร์ตารางเรียนนี้ได้ด้วยลิงก์" />
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
			ยกเลิก
		</Button>

		<Button variant="solid" size="default" color="primary" class="w-full" onclick={handleConfirm}>
			สร้าง
		</Button>
	</div>
</div>
