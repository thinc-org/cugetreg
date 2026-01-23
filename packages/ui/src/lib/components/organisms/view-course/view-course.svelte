<script lang="ts">
	import { ArrowRight, Trash, EyeOff, X } from '@lucide/svelte';
	import Button from '$lib/components/atoms/button/button.svelte';
	import * as Select from '$lib/components/molecules/select/index.js';
	import { GenedChip } from '$lib/components/atoms/gened-chip/index.js';
	import { Chip } from '$lib/components/atoms/chip/index.js';
	import * as Table from '$lib/components/atoms/table/index.js';
	import { cn } from '@cugetreg/utils';
	import { courseColorVariants } from '@cugetreg/utils/constants';
	import { type ColorVariant } from '@cugetreg/utils/types';
	import { IconButton } from '$lib/components/atoms/icon-button/index.js';

	interface ViewCourseProps {
		onExit: () => void;
	}

	let { onExit = () => {} }: ViewCourseProps = $props();

	const full = false;
	let section = $state(1);
	let value = $state<ColorVariant>('pink');
</script>

<div class="bg-surface w-[50vw] min-w-[500px] rounded-lg border border-neutral-200 p-5">
	<div class="">
		<div class="mb-2 flex justify-between">
			<div>
				<span class="font-bold">2110316 PROG LANG PRIN</span>
				<span class="text-xs font-extralight text-neutral-400">3 Credit</span>
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
				<div class="text-xs font-bold">หลักการภาษาการทำโปรแกรม</div>
				<div class="text-sm font-bold">PROGRAMMING LANGUAGE PRINCIPLES</div>
			</div>
			<div class="flex h-[90%] items-center justify-center">
				<Button class="" variant="outlined">
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
				bind:value={() => String(section), (v) => (section = Number(v))}
			>
				<Select.Trigger>
					เซค {section}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each [1, 2, 3, 4] as section (section)}
							<Select.Item
								value={`${section}`}
								label={`เซค ${section}`}
								aria-label={`Sec ${section}`}
								role="option"
							/>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<div class="flex items-center justify-center">
				<GenedChip type="SO" class="h-fit" />
			</div>
		</div>
		<div class="flex items-center justify-center">
			<Chip
				class={cn(
					'h-fit',
					full ? 'bg-on-error-container text-on-error' : 'bg-green-300 text-green-700'
				)}
			>
				20 / 21
			</Chip>
		</div>
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
				<Table.Row class="border-b-0">
					<Table.Cell>STAFF</Table.Cell>
					<Table.Cell>THU 16:00 - 17:00</Table.Cell>
					<Table.Cell>MAHIT 202</Table.Cell>
					<Table.Cell>LECT</Table.Cell>
				</Table.Row>
				<Table.Row class="border-b-0">
					<Table.Cell>STAFF</Table.Cell>
					<Table.Cell>FRI 13:00 - 16:00</Table.Cell>
					<Table.Cell>MAHIT 202</Table.Cell>
					<Table.Cell>LAB</Table.Cell>
				</Table.Row>
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
					<Table.Cell>06 มี.ค. 2567 16:00 - 19:00</Table.Cell>
					<Table.Cell>01 พ.ค. 2567 16:00 - 19:00</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</div>
	<div class="">
		<div class="my-3">
			<span class="font-bold">เลือกสีในตาราง</span>
		</div>
		<div class="flex justify-between">
			{#each Object.keys(courseColorVariants) as ColorVariant[] as option (option)}
				<Button
					variant="solid"
					color="primary"
					class={cn(
						'm-2 aspect-square border hover:ring-0',
						courseColorVariants[option],
						value === option && 'outline-primary outline-[1.5px]! outline-offset-4',
						value === option && 'hover:outline-[1.5px]! hover:outline-solid!',
						'm-0'
					)}
					onclick={() => (value = option)}
				/>
			{/each}
		</div>
	</div>
	<div class="mt-5 flex justify-between space-x-5">
		<Button class="flex-1" variant="outlined">
			<EyeOff />
			ซ่อนจากตาราง
		</Button>
		<Button class="flex-1" variant="outlined" color="error">
			<Trash />
			นำออกจากตารางที่เลือก
		</Button>
	</div>
</div>
