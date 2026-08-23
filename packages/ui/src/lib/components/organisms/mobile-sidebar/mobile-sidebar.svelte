<script lang="ts">
	import { goto } from '$app/navigation';

	import { Bell, ChevronDown, LogOut, Menu, Plus } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';

	import { Button } from '../../atoms/button';
	import { IconButton } from '../../atoms/icon-button';
	import { CUGetRegDarkFull as CUGetRegLogo } from '../../logo/cugetreg';

	interface NavItem {
		name: string;
		route: string;
	}

	interface ScheduleOption {
		name: string;
		id: string;
	}

	interface Props {
		/** Whether the drawer is open. Bindable. */
		open?: boolean;
		isLoggedIn?: boolean;
		name?: string;
		id?: string;
		/** Navigation links shown in the drawer. */
		navItems?: NavItem[];
		/** Currently active nav item name. Bindable. */
		selected?: string;
		/** Schedules available in the timetable selector. */
		scheduleOptions?: ScheduleOption[];
		/** Selected schedule id. Bindable. */
		currentScheduleId?: string;
		/** Label for the study-program chip, e.g. "ทวิภาค 2566 / ภาคต้น". */
		programLabel?: string;
		onClose?: () => void;
		onSelect?: (name: string) => void;
		onLogin?: () => void;
		onSignOut?: () => void;
		onToggleTheme?: () => void;
		/** Called when the user taps "เพิ่มตาราง" to create a new timetable. */
		onAddSchedule?: () => void;
	}

	let {
		open = $bindable(false),
		isLoggedIn = false,
		name = '',
		id = '',
		navItems = [],
		selected = $bindable(''),
		scheduleOptions = [],
		currentScheduleId = $bindable(''),
		programLabel = '',
		onClose = () => {},
		onSelect = () => {},
		onLogin = () => {},
		onSignOut = () => {},
		onToggleTheme = () => {},
		onAddSchedule = () => {}
	}: Props = $props();

	let scheduleDropdownOpen = $state(false);
	let scheduleSelectorEl = $state<HTMLDivElement>();
	const currentScheduleName = $derived(
		scheduleOptions.find((o) => o.id === currentScheduleId)?.name ?? 'เลือกตาราง'
	);

	$effect(() => {
		if (!scheduleDropdownOpen) return;
		const onDocClick = (e: MouseEvent) => {
			if (scheduleSelectorEl && !scheduleSelectorEl.contains(e.target as Node)) {
				scheduleDropdownOpen = false;
			}
		};
		document.addEventListener('click', onDocClick, true);
		return () => document.removeEventListener('click', onDocClick, true);
	});

	function handleNavigate(itemName: string) {
		selected = itemName;
		onSelect(itemName);
		onClose();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-[70] bg-[#353745]/80 backdrop-blur-[3px]"
		role="button"
		tabindex="0"
		aria-label="ปิดเมนู"
		onclick={onClose}
		onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && onClose()}
	></div>
{/if}

<div
	class={cn(
		'bg-surface fixed top-0 left-0 z-[80] flex h-dvh w-[78%] max-w-sm transform flex-col justify-between transition-transform duration-300 ease-in-out',
		open ? 'translate-x-0' : '-translate-x-full'
	)}
	hidden={!open}
	aria-hidden={!open}
>
	<div class="flex flex-col gap-5 p-4">
		<!-- Top row: menu toggle, logo, announcements -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<IconButton variant="ghost" onclick={onClose} aria-label="ปิดเมนู">
					<Menu size="20" strokeWidth="2.5" color="#353745" />
				</IconButton>
				<a href="/" onclick={onClose}>
					<CUGetRegLogo class="h-7 w-24" />
				</a>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="rounded-button hover:text-primary-container flex size-8 items-center justify-center text-black"
					onclick={() => {
						onClose();
						goto('/announcement');
					}}
					aria-label="ประกาศ"
				>
					<Bell size="16" strokeWidth="2" />
				</button>
			</div>
		</div>

		<!-- Timetable selector -->
		<div class="flex flex-col gap-2">
			<span class="text-caption text-neutral-400">คุณกำลังจัดตารางเรียน...</span>
			{#if scheduleOptions.length > 0}
				<div class="relative" bind:this={scheduleSelectorEl}>
					<button
						type="button"
						onclick={() => (scheduleDropdownOpen = !scheduleDropdownOpen)}
						class="border-primary text-primary text-subtitle flex w-full items-center justify-between gap-2 rounded-xl border bg-transparent py-2.5 pr-3 pl-4 font-medium focus:outline-none"
						aria-label="เลือกตารางเรียน"
						aria-expanded={scheduleDropdownOpen}
					>
						<span class="truncate">{currentScheduleName}</span>
						<ChevronDown
							size="20"
							class={cn(
								'text-primary shrink-0 transition-transform',
								scheduleDropdownOpen && 'rotate-180'
							)}
						/>
					</button>

					{#if scheduleDropdownOpen}
						<div
							class="border-surface-container-low bg-surface absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-xl border shadow-lg"
						>
							{#each scheduleOptions as opt (opt.id)}
								<button
									type="button"
									onclick={() => {
										currentScheduleId = opt.id;
										scheduleDropdownOpen = false;
									}}
									class={cn(
										'text-body2 block w-full truncate px-4 py-2.5 text-left text-neutral-700 hover:bg-neutral-100',
										opt.id === currentScheduleId && 'bg-neutral-100 font-medium'
									)}
								>
									{opt.name}
								</button>
							{/each}
							{#if programLabel}
								<div class="text-caption border-t border-neutral-100 px-4 py-2 text-neutral-400">
									{programLabel}
								</div>
							{/if}
							<button
								type="button"
								onclick={() => {
									scheduleDropdownOpen = false;
									onClose();
									onAddSchedule();
								}}
								class="text-primary text-body2 flex w-full items-center justify-center gap-2 border-t border-neutral-100 px-4 py-2.5 font-medium hover:bg-neutral-100"
							>
								<Plus size="18" strokeWidth="2.5" />
								เพิ่มตาราง
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Navigation links -->
		<nav class="flex flex-col">
			{#each navItems as { name: itemName, route } (route)}
				<a
					href={route}
					class={cn(
						'text-button1 border-surface-container-low cursor-pointer border-b py-3 font-medium text-neutral-500 transition-colors hover:text-neutral-800',
						selected === itemName && 'text-primary'
					)}
					onclick={() => handleNavigate(itemName)}
				>
					{itemName}
				</a>
			{/each}
		</nav>
	</div>

	<!-- Bottom: profile / login -->
	<div class="border-surface-container-low border-t p-4">
		{#if isLoggedIn}
			<div class="flex items-center justify-between">
				<div class="flex min-w-0 flex-col">
					<span class="text-primary text-subtitle truncate font-medium underline">{name}</span>
					{#if id}
						<span class="text-body2 text-neutral-400">ID: {id}</span>
					{/if}
				</div>
				<IconButton variant="ghost" onclick={onSignOut} aria-label="ออกจากระบบ">
					<LogOut size="20" strokeWidth="2.5" class="text-primary" />
				</IconButton>
			</div>
		{:else}
			<Button class="w-full" color="primary" onclick={onLogin}>
				<span class="text-button2 font-medium">เข้าสู่ระบบ</span>
			</Button>
		{/if}
	</div>
</div>
