<script lang="ts">
	import { DoorOpen, Settings } from '@lucide/svelte';

	import { getShortenName } from '@cugetreg/utils';

	interface Props {
		imageUrl?: string;
		name?: string;
		id?: string;
	}

	let {
		imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
		name = '',
		id = ''
	}: Props = $props();

	let shortenedName = $derived(getShortenName(name));

	const items = [
		{
			icon: Settings,
			name: 'ตั้งค่า'
		},
		{
			icon: DoorOpen,
			name: 'ออกจากระบบ'
		}
	];
</script>

<div class="bg-surface w-60 rounded-xl border-2 border-[#EDEDF1]">
	<div class="flex flex-col items-center justify-center gap-4 p-4">
		<img src={imageUrl} alt="Profile" class="h-20 w-20 rounded-full object-cover" />
		<div class="flex flex-col items-center gap-2">
			<p class="text-on-surface text-h3 font-bold">{shortenedName}</p>
			<p class="text-on-surface text-body2 font-medium">ID: {id}</p>
		</div>
	</div>
	{#each items as { icon: Icon, name } (name)}
		<div class="flex flex-row items-center gap-3 border-t border-[#EDEDF1] p-4">
			<Icon size="16" color="#353745" strokeWidth="2.5" />
			<p class="text-on-surface text-button2 font-medium">{name}</p>
		</div>
	{/each}
</div>
