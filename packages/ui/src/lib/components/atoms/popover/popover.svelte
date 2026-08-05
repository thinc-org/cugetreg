<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		open: boolean;
		name: string;
		children?: Snippet;
	}

	let { name = '', children, open = $bindable() }: Props = $props();
</script>

<Popover.Root bind:open>
	<div class="flex flex-row md:gap-1">
		<p class="text-primary text-button1 font-medium">{name}</p>
		<Popover.Trigger>
			<ChevronDown color="#4A70C6" class="hidden min-[900px]:block" />
		</Popover.Trigger>
	</div>
	<Popover.Portal>
		<Popover.Content forceMount side="bottom" align="end" sideOffset={24} class="z-100">
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:slide>
							{@render children?.()}
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
