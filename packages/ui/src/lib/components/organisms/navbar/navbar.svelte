<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/atoms/button';
	import { IconButton } from '$lib/components/atoms/icon-button';
	import { Input } from '$lib/components/atoms/input';
	import { LanguageToggle } from '$lib/components/atoms/language-toggle';
	import Popover from '$lib/components/atoms/popover/popover.svelte';
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { Bell, CircleQuestionMark, Menu, Search } from '@lucide/svelte';

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
		/** Called when the user taps "add timetable" in the mobile drawer. */
		onAddSchedule?: () => void;
		onShowOnboarding?: () => void;
		reportURL?: string;
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
		onAddSchedule = () => {},
		onShowOnboarding = () => {},
		reportURL = ''
	}: Props = $props();

	let localSearch = $state('');

	let shortenedName = $derived(getShortenName(name));

	const t = useTranslations(
		defineMessages({
			th: {
				searchCourses: 'ค้นหาวิชา',
				schedule: 'จัดตารางเรียน',
				aboutUs: 'เกี่ยวกับเรา',
				announcements: 'ประกาศ',
				login: 'เข้าสู่ระบบ'
			},
			en: {
				searchCourses: 'Search courses',
				schedule: 'Schedule',
				aboutUs: 'About us',
				announcements: 'Announcements',
				login: 'Log in'
			}
		})
	);

	const navItems = $derived([
		{
			name: t('searchCourses'),
			route: '/'
		},
		{
			name: t('schedule'),
			route: '/schedule'
		},
		{
			name: t('aboutUs'),
			route: '/about-us'
		}
	]);

	let openSideBar = $state(false);

	const toggleSideBar = () => {
		openSideBar = !openSideBar;
	};

	let openPopover = $state(false);

	function getOpen() {
		return openPopover;
	}

	function setOpen(newOpen: boolean) {
		openPopover = newOpen;
	}
</script>

<div
	class="border-surface-container-low bg-surface sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-2 border-b-2 px-3 py-1 md:h-20 md:py-3 lg:px-10"
>
	<div class="flex flex-1 flex-row items-center gap-3 lg:gap-6">
		<IconButton variant="ghost" class="min-[900px]:hidden" onclick={toggleSideBar}>
			<Menu size="16" strokeWidth="3" color="#353745" />
		</IconButton>
		<a href="/">
			<CUGetRegLogo class="h-8 w-24 lg:h-10 lg:w-32" />
		</a>
		<div class="hidden items-center gap-3 md:flex">
			<div class="relative min-w-0 flex-1">
				<Search
					class="absolute top-1/2 right-3 -translate-y-1/2"
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
					placeholder={t('searchCourses')}
					class="bg-surface-container-lowest h-8 w-full pr-9 placeholder:text-neutral-400"
				/>
			</div>
			<button class="shrink-0 hover:cursor-pointer" onclick={onShowOnboarding}>
				<CircleQuestionMark class="stroke-neutral-400 hover:stroke-neutral-500" />
			</button>
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
		<LanguageToggle />
		<button
			type="button"
			class="rounded-button hover:text-primary-container hidden size-10 items-center justify-center text-black md:flex"
			onclick={() => goto('/announcement')}
			aria-label={t('announcements')}
		>
			<Bell strokeWidth="2.5" size="16" />
		</button>
		{#if isLoggedIn}
			<Popover name={shortenedName} bind:open={openPopover}>
				<UserDialog
					{name}
					{id}
					{imageUrl}
					{onSignOut}
					onSettings={() => {
						openPopover = false;
						goto('/profile');
					}}
				/>
			</Popover>
		{:else}
			<!-- To be implemented: add real href in Button -->
			<Button class="w-24 md:w-28" onclick={onLogin}>
				<p class="text-button2 font-medium">{t('login')}</p>
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
		{onShowOnboarding}
		onClose={toggleSideBar}
		{reportURL}
	/>
</div>
