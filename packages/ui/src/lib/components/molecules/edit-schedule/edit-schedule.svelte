<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

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

	const t = useTranslations(
		defineMessages({
			th: {
				rename: 'แก้ไขชื่อ',
				duplicate: 'ทำสำเนา',
				addSchedule: 'เพิ่มตาราง',
				setAsMain: 'ตั้งเป็นตารางหลัก',
				delete: 'ลบตาราง',
				moreOptions: 'ตัวเลือก'
			},
			en: {
				rename: 'Rename',
				duplicate: 'Duplicate',
				addSchedule: 'Add schedule',
				setAsMain: 'Set as main schedule',
				delete: 'Delete schedule',
				moreOptions: 'Option'
			}
		})
	);

	const options: Option[] = $derived([
		{
			icon: PenLine,
			label: t('rename'),
			onclick: () => onRename()
		},
		{
			icon: Copy,
			label: t('duplicate'),
			onclick: () => onDuplicate()
		},
		{
			icon: Plus,
			label: t('addSchedule'),
			onclick: () => onAddSchedule()
		},
		{
			icon: Pin,
			label: t('setAsMain'),
			onclick: () => onPin()
		},
		{
			icon: Trash,
			label: t('delete'),
			onclick: () => onDelete(),
			danger: true
		}
	]);
</script>

<div class={cn('flex space-x-2', className)}>
	<select class="rounded-xl border border-neutral-200 p-2 lg:mx-1" bind:value={currentScheduleId}>
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
						<DropdownMenu.Item aria-label={t('moreOptions')}>
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
