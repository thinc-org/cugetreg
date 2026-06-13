<script lang="ts">
	import { Copy, Ellipsis, type Icon, PenLine, Pin, Plus, Trash } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';
	import type { ClassValue } from 'clsx';

	import { cn } from '@cugetreg/utils';

	import { IconButton } from '../../atoms/icon-button';

	interface Option {
		icon: typeof Icon;
		label: string;
		onclick: () => void;
		danger?: boolean;
	}

	interface EditScheduleProps {
		class?: ClassValue;
		currentScheduleId: string;
		schedules?: {
			name: string;
			id: string;
		}[];
		onRename?: () => void;
		onDuplicate?: () => void;
		onAddSchedule?: () => void;
		onPin?: () => void;
		onDelete?: () => void;
	}

	let {
		schedules = [],
		currentScheduleId = $bindable(),
		class: className = undefined,
		onRename = () => {},
		onDuplicate = () => {},
		onAddSchedule = () => {},
		onPin = () => {},
		onDelete = () => {}
	}: EditScheduleProps = $props();

	const options: Option[] = [
		{
			icon: PenLine,
			label: 'แก้ไขชื่้อ',
			onclick: () => onRename()
		},
		{
			icon: Copy,
			label: 'ทำสำเนา',
			onclick: () => onDuplicate()
		},
		{
			icon: Plus,
			label: 'เพิ่มตาราง',
			onclick: () => onAddSchedule()
		},
		{
			icon: Pin,
			label: 'ตั้งเป็นตารางหลัก',
			onclick: () => onPin()
		},
		{
			icon: Trash,
			label: 'ลบตาราง',
			onclick: () => onDelete(),
			danger: true
		}
	];
</script>

<div class={cn('flex space-x-2', className)}>
	<select class="mx-1 rounded-xl border border-neutral-200 p-2" bind:value={currentScheduleId}>
		{#each schedules as schedule (schedule.id)}
			<option value={schedule.id}>{schedule.name}</option>
		{/each}
	</select>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<IconButton class="hover:cursor-pointer" variant="outlined">
				<Ellipsis />
			</IconButton>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				class="
                m-2 w-40 rounded-lg border border-neutral-200 bg-neutral-50 p-1
            "
			>
				<DropdownMenu.Group class="space-y-1">
					{#each options as option (option.label)}
						{@const OptionIcon = option.icon}
						{@const danger = option.danger ?? false}
						<DropdownMenu.Item aria-label="dropdown">
							<div
								class="flex rounded-sm p-1 hover:cursor-pointer hover:bg-neutral-200"
								onclick={option.onclick}
								onkeydown={() => {}}
								role="dialog"
								tabindex="0"
							>
								<OptionIcon size={18} class={danger ? 'stroke-on-error-container' : ''} />
								<span
									class={cn(
										'ml-2 text-sm font-extralight',
										option.danger && 'text-on-error-container'
									)}
								>
									{option.label}
								</span>
							</div>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
