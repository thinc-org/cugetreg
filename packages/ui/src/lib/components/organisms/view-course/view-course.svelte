<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/atoms/button/button.svelte';
	import { Chip } from '$lib/components/atoms/chip/index.js';
	import { GenedChip } from '$lib/components/atoms/gened-chip/index.js';
	import { IconButton } from '$lib/components/atoms/icon-button/index.js';
	import * as Table from '$lib/components/atoms/table/index.js';
	import * as Select from '$lib/components/molecules/select/index.js';

	import { ArrowRight, EyeOff, Trash, X } from '@lucide/svelte';
	import { untrack } from 'svelte';

	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import { type ColorVariant } from '@cugetreg/utils/types';

	import type { ViewCourseData } from '.';

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

	let selectedSectionNo = $state(untrack(() => data?.selectedSectionNo ?? 0));

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
	<div
		class="bg-surface max-h-[90vh] w-[90vw] overflow-y-auto rounded-lg border border-neutral-200 p-4 md:w-[50vw] md:min-w-[500px] md:p-5"
	>
		<div class="">
			<div class="flex items-start justify-between gap-2">
				<div class="flex min-w-0 items-baseline gap-2">
					<span class="min-w-0 truncate text-[16px] font-bold md:text-xl"
						>{data.courseNo} {data.abbrName}</span
					>
					<span class="shrink-0 text-sm font-extralight text-neutral-400">{data.credit} Credit</span
					>
				</div>
				<IconButton
					class="shrink-0 bg-transparent ring-0! outline-none! hover:cursor-pointer"
					onclick={onExit}
				>
					<X />
				</IconButton>
			</div>
			<div class="flex flex-col justify-between gap-2 md:flex-row md:items-start md:gap-3">
				<div class="min-w-0">
					<div class="text-[12px] font-bold md:text-lg">{data.courseNameTh}</div>
					<div class="text-[12px] font-bold md:text-lg">{data.courseNameEn}</div>
				</div>
				<div class="flex h-[90%] w-full shrink-0 items-center justify-center md:w-auto">
					<Button
						class="w-full md:w-auto"
						variant="outlined"
						onclick={() => {
							const params = new URLSearchParams({
								studyProgram: data.studyProgram,
								academicYear: String(data.academicYear),
								semester: data.semester
							});
							goto(`/course-page/${data.courseNo}?${params.toString()}`);
						}}
					>
						ข้อมูลรายวิชา
						<ArrowRight />
					</Button>
				</div>
			</div>
		</div>
		<div class="my-2 flex justify-between md:my-3">
			<div class="flex items-center gap-2">
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
			<Table.Root class="hidden md:table">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-body1">ผู้สอน</Table.Head>
						<Table.Head class="text-body1">วันเวลาเรียน</Table.Head>
						<Table.Head class="text-body1">ห้องเรียน</Table.Head>
						<Table.Head class="text-body1">รูปแบบ</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if currentSection}
						{#each currentSection.classes as cls, i (i)}
							<Table.Row class="border-b-0">
								<Table.Cell class="text-body1 py-2">{cls.professors.join(', ')}</Table.Cell>
								<Table.Cell class="text-body1 py-2"
									>{cls.dayOfWeek} {cls.periodStart} - {cls.periodEnd}</Table.Cell
								>
								<Table.Cell class="text-body1 py-2"
									>{cls.building ?? ''} {cls.room ?? ''}</Table.Cell
								>
								<Table.Cell class="text-body1 py-2">{cls.type}</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
			<Table.Root class="table-fixed md:hidden">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-body1 w-5/12 px-3">ผู้สอน</Table.Head>
						<Table.Head class="text-body1 w-7/12 px-3">วันเวลาเรียน</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if currentSection}
						{#each currentSection.classes as cls, i (i)}
							<Table.Row class="border-b-0">
								<Table.Cell class="text-body1 px-3 py-1.5">{cls.professors.join(', ')}</Table.Cell>
								<Table.Cell class="text-body1 px-3 py-1.5"
									>{cls.dayOfWeek} {cls.periodStart} - {cls.periodEnd}</Table.Cell
								>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
			<Table.Root class="table-fixed md:hidden">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-body1 w-5/12 px-3">ห้องเรียน</Table.Head>
						<Table.Head class="text-body1 w-7/12 px-3">รูปแบบ</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if currentSection}
						{#each currentSection.classes as cls, i (i)}
							<Table.Row class="border-b-0">
								<Table.Cell class="text-body1 px-3 py-1.5"
									>{cls.building ?? ''} {cls.room ?? ''}</Table.Cell
								>
								<Table.Cell class="text-body1 px-3 py-1.5">{cls.type}</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
		<div>
			<Table.Root class="table-fixed md:hidden">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-body1 px-3">สอบกลางภาค</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="text-body1 px-3 py-1.5">{data.midterm ?? 'ยังไม่ประกาศ'}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
			<Table.Root class="table-fixed md:hidden">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-body1 px-3">สอบปลายภาค</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row class="border-b-0">
						<Table.Cell class="text-body1 px-3 py-1.5">{data.final ?? 'ยังไม่ประกาศ'}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
			<Table.Root class="hidden table-fixed md:table">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-body1 w-1/2">สอบกลางภาค</Table.Head>
						<Table.Head class="text-body1 w-1/2">สอบปลายภาค</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row class="border-b-0">
						<Table.Cell class="text-body1">{data.midterm ?? 'ยังไม่ประกาศ'}</Table.Cell>
						<Table.Cell class="text-body1">{data.final ?? 'ยังไม่ประกาศ'}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
		<div class="">
			<div class="my-2 md:my-3">
				<span class="font-bold">เลือกสีในตาราง</span>
			</div>
			<div class="flex flex-wrap justify-center gap-2 md:flex-nowrap md:justify-between md:gap-3">
				{#each Object.keys(courseColorVariants) as option (option)}
					<Button
						variant="solid"
						color="primary"
						class={cn(
							'aspect-square border hover:ring-0',
							courseColorVariants[option as ColorVariant],
							data.color === option && 'outline-primary outline-[1.5px]! outline-offset-4',
							data.color === option && 'hover:outline-[1.5px]! hover:outline-solid!'
						)}
						onclick={() => onChangeColor(data.itemId, option as ColorVariant)}
					/>
				{/each}
			</div>
		</div>
		<div class="mt-3 flex flex-col gap-2 md:mt-5 md:flex-row md:justify-between md:gap-3">
			<Button
				class="w-full md:flex-1"
				variant="outlined"
				onclick={() => onHide(data.itemId, !data.isHidden)}
			>
				<EyeOff />
				{data.isHidden ? 'แสดงในตาราง' : 'ซ่อนจากตาราง'}
			</Button>
			<Button
				class="w-full md:flex-1"
				variant="outlined"
				color="error"
				onclick={() => onRemove(data.itemId)}
			>
				<Trash />
				นำออกจากตารางที่เลือก
			</Button>
		</div>
	</div>
{/if}
