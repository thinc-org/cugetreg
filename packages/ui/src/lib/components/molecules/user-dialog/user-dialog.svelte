<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { DoorOpen, Settings } from '@lucide/svelte';

	import { getShortenName } from '@cugetreg/utils';

	interface Props {
		imageUrl?: string;
		name?: string;
		id?: string;
		onSettings?: () => void;
		onSignOut?: () => void;
	}

	let {
		imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
		name = '',
		id = '',
		onSettings = () => {},
		onSignOut = () => {}
	}: Props = $props();

	let shortenedName = $derived(getShortenName(name));

	const t = useTranslations(
		defineMessages({
			th: { profile: 'รูปโปรไฟล์', settings: 'ตั้งค่า', signOut: 'ออกจากระบบ' },
			en: { profile: 'Profile picture', settings: 'Settings', signOut: 'Log out' }
		})
	);

	const items = $derived([
		{
			icon: Settings,
			name: t('settings'),
			onclick: () => onSettings()
		},
		{
			icon: DoorOpen,
			name: t('signOut'),
			onclick: () => onSignOut()
		}
	]);
</script>

<div class="bg-surface w-60 overflow-hidden rounded-xl border-2 border-[#EDEDF1]">
	<div class="flex flex-col items-center justify-center gap-4 p-4">
		<img src={imageUrl} alt={t('profile')} class="h-20 w-20 rounded-full object-cover" />
		<div class="flex flex-col items-center gap-2">
			<p class="text-on-surface text-h3 font-bold">{shortenedName}</p>
			<p class="text-on-surface text-body2 font-medium">ID: {id}</p>
		</div>
	</div>
	{#each items as { icon: Icon, name, onclick } (name)}
		<button
			class="flex w-full flex-row items-center gap-3 overflow-hidden border-t border-[#EDEDF1] p-4 hover:cursor-pointer hover:bg-blue-200"
			{onclick}
		>
			<Icon size="16" color="#353745" strokeWidth="2.5" />
			<p class="text-on-surface text-button2 font-medium">{name}</p>
		</button>
	{/each}
</div>
