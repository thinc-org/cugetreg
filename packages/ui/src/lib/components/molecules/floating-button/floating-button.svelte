<script lang="ts">
	import { cn } from '$lib/utils';

	import { NotepadText, X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	interface Option {
		label: string;
		icon: any;
		onClick: () => void;
	}

	interface Props {
		options: Option[];
		class?: string;
	}

	let { options, class: className = '' }: Props = $props();

	let isExpanded = $state(false);
</script>

{#if isExpanded}
	<div
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all"
		transition:fade={{ duration: 200 }}
	></div>
{/if}

<div class={cn('fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4', className)}>
	{#if isExpanded}
		<div class="mr-2 flex flex-col items-end gap-4 pb-2">
			{#each options as option, _i (option.label)}
				<button
					class="group flex items-center gap-4"
					onclick={() => {
						option.onClick();
						isExpanded = false;
					}}
				>
					<span class="font-regular text-[14px] text-white drop-shadow-md">
						{option.label}
					</span>

					<div
						class="flex h-[34px] w-[37px] items-center justify-center rounded-lg bg-white text-[#353745] shadow-sm transition-transform"
					>
						<option.icon size={24} strokeWidth={3} />
					</div>
				</button>
			{/each}
		</div>
	{/if}

	<button
		class="relative flex h-[64px] w-[64px] items-center justify-center rounded-full shadow-sm transition-all duration-150
		{isExpanded ? 'bg-[#F96666]' : 'bg-[#4A70C6]'}"
		onclick={() => {
			isExpanded = !isExpanded;
		}}
	>
		<span
			class="absolute text-white transition-all duration-200"
			style="opacity: {isExpanded ? 0 : 1}; transform: {isExpanded
				? 'scale(0) rotate(-90deg)'
				: 'scale(1) rotate(0)'}"
		>
			<NotepadText size={28} strokeWidth={2} />
		</span>

		<span
			class="absolute text-white transition-all duration-200"
			style="opacity: {isExpanded ? 1 : 0}; transform: {isExpanded
				? 'scale(1) rotate(0)'
				: 'scale(0) rotate(90deg)'}"
		>
			<X size={32} strokeWidth={2.5} />
		</span>
	</button>
</div>
