<script lang="ts">
	import { ChevronDown, LogOut, Menu, Moon } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';

	import { Button } from '../../atoms/button';
	import { Chip } from '../../atoms/chip';
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
		onToggleTheme = () => {}
	}: Props = $props();

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
		<!-- Top row: menu toggle, logo, theme switch -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<IconButton variant="ghost" onclick={onClose} aria-label="ปิดเมนู">
					<Menu size="20" strokeWidth="2.5" color="#353745" />
				</IconButton>
				<a href="/" onclick={onClose}>
					<CUGetRegLogo class="h-7 w-24" />
				</a>
			</div>
			<IconButton color="neutral" onclick={onToggleTheme} aria-label="สลับธีม">
				<Moon size="16" strokeWidth="2.5" />
			</IconButton>
		</div>

		<!-- Timetable selector -->
		<div class="flex flex-col gap-2">
			<span class="text-caption text-neutral-400">คุณกำลังจัดตารางเรียน...</span>
			{#if scheduleOptions.length > 0}
				<div class="relative">
					<select
						bind:value={currentScheduleId}
						class="border-primary text-primary text-subtitle w-full appearance-none truncate rounded-xl border bg-transparent py-2.5 pr-10 pl-4 font-medium focus:outline-none"
						aria-label="เลือกตารางเรียน"
					>
						{#each scheduleOptions as opt (opt.id)}
							<option value={opt.id}>{opt.name}</option>
						{/each}
					</select>
					<ChevronDown
						size="20"
						class="text-primary pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
					/>
				</div>
			{/if}
			{#if programLabel}
				<Chip class="w-fit text-nowrap">{programLabel}</Chip>
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
