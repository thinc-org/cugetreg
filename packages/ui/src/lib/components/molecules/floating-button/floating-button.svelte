<script lang="ts">
	import { X, NotepadText } from '@lucide/svelte';
    import { fly, fade } from 'svelte/transition';
	import { cn } from '$lib/utils';

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
        onclick={() => (isExpanded = false)}
	></div>
{/if}

<div class={cn('fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4', className)}>
	{#if isExpanded}
		<div class="flex flex-col items-end gap-4 pb-2">
			{#each options as option, i}
				<button
                    class="group flex items-center gap-4"
                    onclick={() => {
                        option.onClick();
                        isExpanded = false;
                    }}
                    in:fly={{ y: 20, duration: 200, delay: (options.length - 1 - i) * 40 }}
                    out:fly={{ y: 20, duration: 150, delay: i * 30 }}
                >
					<span class="text-lg font-medium text-white drop-shadow-md">
                        {option.label}
                    </span>
                    
                    <div class="flex h-[32px] w-[32px] items-center justify-center rounded-2xl bg-white text-[#353745] shadow-sm transition-transform group-hover:scale-105">
                        <option.icon size={26} strokeWidth={2.5} />
                    </div>
				</button>
			{/each}
		</div>
	{/if}

	<button
		class="relative flex h-[64px] w-[64px] items-center justify-center rounded-full shadow-sm transition-all duration-300 hover:scale-105 
		{isExpanded ? 'bg-[#F96666]' : 'bg-[#4A70C6]'}"
		onclick={() => {isExpanded = !isExpanded}}
	>
		<span
			class="absolute transition-all duration-300"
			style="opacity: {isExpanded ? 0 : 1}; transform: {isExpanded ? 'scale(0.5) rotate(-90deg)' : 'scale(1) rotate(0)'}"
		>
			<NotepadText size={28} strokeWidth={2} />
		</span>
		
		<span
			class="absolute transition-all duration-300"
			style="opacity: {isExpanded ? 1 : 0}; transform: {isExpanded ? 'scale(1) rotate(0)' : 'scale(0.5) rotate(90deg)'}"
		>
			<X size={32} strokeWidth={2.5} />
		</span>
	</button>
</div>