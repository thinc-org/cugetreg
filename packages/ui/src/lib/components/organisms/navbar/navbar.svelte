<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/atoms/button';
	import { Collapsible } from '$lib/components/atoms/collapsible';
	import { IconButton } from '$lib/components/atoms/icon-button';
	import { Input } from '$lib/components/atoms/input';

	import { Bell, Menu, Search } from '@lucide/svelte';

	import { cn, getShortenName } from '@cugetreg/utils';

	import { CUGetRegDarkFull as CUGetRegLogo } from '../../logo/cugetreg';
	import { UserDialog } from '../../molecules/user-dialog';
	import { MobileSidebar } from '../mobile-sidebar';

	interface ScheduleOption {
		name: string;
		id: string;
	}

	interface Props {
		isLoggedIn?: boolean;
		name?: string;
		imageUrl?: string;
		id?: string;
		onSearchEnter?: (val: string) => void;
		onLogin?: () => void;
		onSignOut?: () => void;
		/** Schedules for the mobile drawer's timetable selector. */
		scheduleOptions?: ScheduleOption[];
		/** Selected schedule id for the mobile drawer. Bindable. */
		currentScheduleId?: string;
		/** Study-program chip label for the mobile drawer. */
		programLabel?: string;
		onToggleTheme?: () => void;
		/** Called when the user taps "เพิ่มตาราง" in the mobile drawer. */
		onAddSchedule?: () => void;
	}

	let {
		isLoggedIn = false,
		name = '',
		imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
		id = '',
		onSearchEnter = () => {},
		onLogin = () => {},
		onSignOut = () => {},
		scheduleOptions = [],
		currentScheduleId = $bindable(''),
		programLabel = '',
		onToggleTheme = () => {},
		onAddSchedule = () => {}
	}: Props = $props();

	let localSearch = $state('');

	let shortenedName = $derived(getShortenName(name));

	const navItems = [
		{
			name: 'ค้นหาวิชา',
			route: '/'
		},
		{
			name: 'จัดตารางเรียน',
			route: '/schedule'
		},
		{
			name: 'เกี่ยวกับเรา',
			route: '/about-us'
		}
	];

	let openSideBar = $state(false);

	const toggleSideBar = () => {
		openSideBar = !openSideBar;
	};
</script>

<div
	class="border-surface-container-low bg-surface sticky top-0 z-[60] flex h-16 w-full items-center justify-between gap-2 border-b-2 px-3 py-1 md:h-20 md:py-3 lg:px-10"
>
	<div class="flex flex-1 flex-row items-center gap-3 lg:gap-6">
		<IconButton variant="ghost" class="min-[900px]:hidden" onclick={toggleSideBar}>
			<Menu size="16" strokeWidth="3" color="#353745" />
		</IconButton>
		<a href="/">
			<CUGetRegLogo class="h-8 w-24 lg:h-10 lg:w-32" />
		</a>
		<div class="relative hidden items-center md:flex">
			<Search
				class="absolute right-[15%] my-auto lg:right-8"
				size="16"
				color="#898EA7"
				strokeWidth="3"
			/>
			<Input
				bind:value={localSearch}
				onkeydown={(e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						onSearchEnter(localSearch);
					}
				}}
				placeholder="ค้นหาวิชา"
				class="bg-surface-container-lowest h-8 w-full placeholder:text-neutral-400"
			/>
		</div>
	</div>
	<div class="hidden flex-1 flex-row items-center justify-center gap-3 min-[900px]:flex lg:gap-4">
		<!-- To be implemented: add page from navItems-->
		{#each navItems as { name, route }, i (i)}
			<a
				class={cn(
					'text-button1 cursor-pointer text-center font-medium text-nowrap text-neutral-500 hover:text-neutral-800 xl:w-32',
					$page.url.pathname === resolve(route as any) && 'text-primary'
				)}
				href={resolve(route as any)}
			>
				{name}
			</a>
		{/each}
	</div>
	<div class="flex flex-1 flex-row items-center justify-end gap-2 md:gap-3 lg:gap-4">
		<!-- <a -->
		<!-- 	href="https://github.com/thinc-org/cugetreg" -->
		<!-- 	target="_blank" -->
		<!-- 	rel="noreferrer" -->
		<!-- 	class="hidden md:flex" -->
		<!-- > -->
		<!-- 	<GitHubMark class="h-8 w-8 text-neutral-500 " /> -->
		<!-- </a> -->
		<button
			type="button"
			class="rounded-button hover:text-primary-container hidden size-10 items-center justify-center text-black md:flex"
			onclick={() => goto('/announcement')}
			aria-label="ประกาศ"
		>
			<Bell strokeWidth="2.5" size="16" />
		</button>
		{#if isLoggedIn}
			<Collapsible name={shortenedName}>
				<UserDialog {name} {id} {imageUrl} {onSignOut} onSettings={() => goto('/profile')} />
			</Collapsible>
		{:else}
			<!-- To be implemented: add real href in Button -->
			<Button class="w-24 md:w-28" onclick={onLogin}>
				<p class="text-button2 font-medium">เข้าสู่ระบบ</p>
			</Button>
		{/if}
	</div>
	<MobileSidebar
		bind:open={openSideBar}
		bind:currentScheduleId
		{isLoggedIn}
		{name}
		{id}
		{navItems}
		{scheduleOptions}
		{programLabel}
		{onLogin}
		{onSignOut}
		{onToggleTheme}
		{onAddSchedule}
		onClose={toggleSideBar}
	/>
</div>
