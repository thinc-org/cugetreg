<script lang="ts">
	import type { ScheduleListItem, SemesterType } from '@cugetreg/utils/types';

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
		onConfirm?: (schedule: ScheduleListItem) => void;
		shareLink?: string;
	}

	let {
		onCancel = () => {},
		onConfirm = () => {},
		shareLink = 'https://example.com/my-timetable'
	}: CreateTimetableProp = $props();

	interface SystemInterface {
		value: SemesterType;
		label: string;
	}

	let selected_system: SemesterType = $state('Semester');
	const options_system: SystemInterface[] = [
		{ value: 'Semester', label: 'ทวิภาค' },
		{ value: 'Trimester', label: 'ตรีภาค' },
		{ value: 'Inter', label: 'นานาชาติ' }
	];

	// TODO: Add formatter
	// TODO: Connect it to somewhere
	let selected_year = $state('2568');
	const options_year = [
		{ value: '2568', label: '2568' },
		{ value: '2567', label: '2567' },
		{ value: '2566', label: '2566' },
		{ value: '2565', label: '2565' },
		{ value: '2564', label: '2564' }
	];

	let selected_semester = $state('1');
	let options_semester = [
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: 'ฤดูร้อน', label: 'ฤดูร้อน' }
	];

	let tableName = $state('ตารางเรียนแสนสนุก');
	let currentLetter = $derived(tableName.length);
	let isPublic = $state(false);

	function handleConfirm() {
		const timetableMeta: ScheduleListItem = {
			name: tableName,
			scheduleId: crypto.randomUUID(),
			schedule: [],
			semesterType: selected_system,
			semester: selected_semester,
			isPublic
		};

		onConfirm(timetableMeta);
	}

	function copyLink() {
		if (!shareLink) return;

		navigator.clipboard
			.writeText(shareLink)
			.then(() => {
				alert('Link copied to clipboard!');
				return true;
			})
			.catch((err) => console.error(err));
	}

	// $effect(() => {
	//   tableName = tableName.slice(0, 30);
	// });
</script>

<div class="bg-surface flex w-104 flex-col gap-6 rounded-xl border border-[#d6d7e1] p-12">
	<!-- Title -->
	<h1 class="text-h2 leading-h2 text-center font-medium tracking-[0.15px] text-[#353745]">
		เพิ่มตารางเรียน
	</h1>

	<!-- Schedule Settings -->
	<div>
		<p class="font-orbit text-caption leading-caption text-[#898EA7]">ตั้งค่า</p>

		<Select type="single" bind:value={selected_system}>
			<SelectTrigger class="my-1 w-full" aria-label="Select system">
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
				<SelectTrigger class="my-1 flex-1" aria-label="Select year">
					{selected_year}
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{#each options_year as option (option.value)}
							<SelectItem value={option.value} label={option.label} aria-label={option.label}>
								{option.label}
							</SelectItem>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Select type="single" bind:value={selected_semester}>
				<SelectTrigger class="my-1 flex-1" aria-label="Select semester">
					{selected_semester}
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{#each options_semester as option (option.value)}
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
	{#if isPublic}
		<div
			class="relative -mt-5 flex h-8 w-[320px] items-center justify-center rounded-sm border border-[#EDEDF1] px-4"
		>
			<span
				class="absolute right-12 left-4.25 truncate text-center text-[12px] leading-3 font-normal tracking-[0.15px] text-[#898EA7]"
			>
				{shareLink}
			</span>

			<button class="absolute right-4.25" on:click={copyLink} aria-label="Copy link">
				<!-- Copy button -->
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fill-none stroke-[#898EA7] hover:stroke-[#898ea7a5]"
				>
					<g clip-path="url(#clip0_3159_50514)">
						<path
							d="M2.66634 10.6668C1.93301 10.6668 1.33301 10.0668 1.33301 9.3335V2.66683C1.33301 1.9335 1.93301 1.3335 2.66634 1.3335H9.33301C10.0663 1.3335 10.6663 1.9335 10.6663 2.66683M6.66634 5.3335H13.333C14.0694 5.3335 14.6663 5.93045 14.6663 6.66683V13.3335C14.6663 14.0699 14.0694 14.6668 13.333 14.6668H6.66634C5.92996 14.6668 5.33301 14.0699 5.33301 13.3335V6.66683C5.33301 5.93045 5.92996 5.3335 6.66634 5.3335Z"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
					<defs>
						<clipPath id="clip0_3159_50514">
							<rect width="16" height="16" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</button>
		</div>
	{/if}

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
