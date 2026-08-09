<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/atoms/button/button.svelte';
	import { Chip } from '$lib/components/atoms/chip/index.js';
	import { GenedChip } from '$lib/components/atoms/gened-chip/index.js';
	import { IconButton } from '$lib/components/atoms/icon-button/index.js';
	import * as Table from '$lib/components/atoms/table/index.js';
	import * as Select from '$lib/components/molecules/select/index.js';

	import { ArrowRight, EyeOff, Trash, X } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import { type ColorVariant } from '@cugetreg/utils/types';

	export interface ViewCourseSectionClass {
		type: string;
		dayOfWeek: string;
		periodStart: string;
		periodEnd: string;
		building: string | null;
		room: string | null;
		professors: string[];
	}

	export interface ViewCourseSection {
		sectionNo: number;
		closed: boolean;
		regis: number;
		max: number;
		classes: ViewCourseSectionClass[];
	}

	export interface ViewCourseData {
		itemId: string;
		courseNo: string;
		abbrName: string;
		courseNameTh: string;
		courseNameEn: string;
		credit: string | number;
		genEdType?: string;
		sections: ViewCourseSection[];
		selectedSectionNo: number;
		color: ColorVariant;
		midterm?: string;
		final?: string;
		isHidden: boolean;
	}

	interface ViewCourseProps {
		data: ViewCourseData | null;
		onExit?: () => void;
		onHide?: (itemId: string, hidden: boolean) => void;
		onRemove?: (itemId: string) => void;
		onChangeColor?: (itemId: string, color: ColorVariant) => void;
		onChangeSection?: (itemId: string, sectionNo: number) => void;
	}

	let {
		data,
		onExit = () => {},
		onHide = () => {},
		onRemove = () => {},
		onChangeColor = () => {},
		onChangeSection = () => {}
	}: ViewCourseProps = $props();

	let selectedSectionNo = $state(data?.selectedSectionNo ?? 0);

	$effect(() => {
		if (data) {
			selectedSectionNo = data.selectedSectionNo;
		}
	});

	const currentSection = $derived(
		data?.sections.find((s) => s.sectionNo === selectedSectionNo) ?? data?.sections[0]
	);
</script>

{#if data}
	<div class="bg-surface w-[50vw] min-w-[500px] rounded-lg border border-neutral-200 p-5">
		<div class="">
			<div class="mb-2 flex justify-between">
				<div>
					<span class="font-bold">{data.courseNo} {data.abbrName}</span>
					<span class="text-xs font-extralight text-neutral-400">{data.credit} Credit</span>
				</div>
				<IconButton
					class="bg-transparent ring-0! outline-none! hover:cursor-pointer"
					onclick={onExit}
				>
					<X />
				</IconButton>
			</div>
			<div class="flex justify-between">
				<div>
					<div class="text-xs font-bold">{data.courseNameTh}</div>
					<div class="text-sm font-bold">{data.courseNameEn}</div>
				</div>
				<div class="flex h-[90%] items-center justify-center">
					<Button
						class=""
						variant="outlined"
						onclick={() => {
							goto(`/course-page/${data.courseNo}`);
						}}
					>
						ข้อมูลรายวิชา
						<ArrowRight />
					</Button>
				</div>
			</div>
		</div>
		<div class="my-3 flex justify-between">
			<div class="flex space-x-2">
				<Select.Root
					type="single"
					value={String(selectedSectionNo)}
					onValueChange={(v) => {
						selectedSectionNo = Number(v);
						onChangeSection(data.itemId, selectedSectionNo);
					}}
				>
					<Select.Trigger>
						เซค {selectedSectionNo}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each data.sections as section (section.sectionNo)}
								<Select.Item
									value={`${section.sectionNo}`}
									label={`เซค ${section.sectionNo}`}
									aria-label={`Sec ${section.sectionNo}`}
									role="option"
								/>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				{#if data.genEdType}
					<div class="flex items-center justify-center">
						<GenedChip type={data.genEdType as any} class="h-fit" />
					</div>
				{/if}
			</div>
			{#if currentSection}
				<div class="flex items-center justify-center">
					<Chip
						class={cn(
							'h-fit',
							currentSection.closed
								? 'bg-on-error-container text-on-error'
								: 'bg-green-300 text-green-700'
						)}
					>
						{currentSection.regis} / {currentSection.max}
					</Chip>
				</div>
			{/if}
		</div>
		<div>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>ผู้สอน</Table.Head>
						<Table.Head>วันเวลาเรียน</Table.Head>
						<Table.Head>ห้องเรียน</Table.Head>
						<Table.Head>รูปแบบ</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if currentSection}
						{#each currentSection.classes as cls, i (i)}
							<Table.Row class="border-b-0">
								<Table.Cell>{cls.professors.join(', ')}</Table.Cell>
								<Table.Cell>{cls.dayOfWeek} {cls.periodStart} - {cls.periodEnd}</Table.Cell>
								<Table.Cell>{cls.building ?? ''} {cls.room ?? ''}</Table.Cell>
								<Table.Cell>{cls.type}</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
		<div>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>สอบกางภาค</Table.Head>
						<Table.Head>สอบปลายภาค</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row class="border-b-0">
						<Table.Cell>{data.midterm ?? 'ยังไม่ประกาศ'}</Table.Cell>
						<Table.Cell>{data.final ?? 'ยังไม่ประกาศ'}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
		<div class="">
			<div class="my-3">
				<span class="font-bold">เลือกสีในตาราง</span>
			</div>
			<div class="flex justify-between">
				{#each Object.keys(courseColorVariants) as option (option)}
					<Button
						variant="solid"
						color="primary"
						class={cn(
							'm-2 aspect-square border hover:ring-0',
							courseColorVariants[option as ColorVariant],
							data.color === option && 'outline-primary outline-[1.5px]! outline-offset-4',
							data.color === option && 'hover:outline-[1.5px]! hover:outline-solid!',
							'm-0'
						)}
						onclick={() => onChangeColor(data.itemId, option as ColorVariant)}
					/>
				{/each}
			</div>
		</div>
		<div class="mt-5 flex justify-between space-x-5">
			<Button class="flex-1" variant="outlined" onclick={() => onHide(data.itemId, !data.isHidden)}>
				<EyeOff />
				{data.isHidden ? 'แสดงในตาราง' : 'ซ่อนจากตาราง'}
			</Button>
			<Button class="flex-1" variant="outlined" color="error" onclick={() => onRemove(data.itemId)}>
				<Trash />
				นำออกจากตารางที่เลือก
			</Button>
		</div>
	</div>
{/if}
