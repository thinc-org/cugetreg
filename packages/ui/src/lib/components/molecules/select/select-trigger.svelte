<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui';

	import { cn } from '@cugetreg/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		arrow = false,
		showArrow = true,
		...restProps
	}: WithoutChild<
		SelectPrimitive.TriggerProps & { arrow?: boolean; showArrow?: boolean }
	> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		'bg-surface ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between gap-2.5 rounded-[11px] border-[1px] border-neutral-200 p-2  text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...restProps}
>
	<div class="flex h-full w-full items-center truncate overflow-hidden text-left">
		{@render children?.()}
	</div>
	{#if showArrow}
		{#if arrow}
			<ChevronDown class="size-4 stroke-[4px] text-neutral-400" />
		{/if}
		<ChevronDown class="size-4 stroke-[4px] text-neutral-400" />
	{/if}
</SelectPrimitive.Trigger>
