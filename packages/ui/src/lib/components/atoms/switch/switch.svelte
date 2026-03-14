<script lang="ts">
	import { Label, Switch as SwitchPrimitive, type SwitchRootProps } from 'bits-ui';

	import { cn } from '@cugetreg/utils';

	interface Props {
		class?: SwitchRootProps['class'];
		checked?: SwitchRootProps['checked'];
		id?: SwitchRootProps['id'];
		label?: string | undefined | null;
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		checked = $bindable(undefined),
		id = undefined,
		label = 'label',
		...rest
	}: Props = $props();
</script>

<div class="flex items-center space-x-2">
	<SwitchPrimitive.Root
		bind:checked
		class={cn(
			'focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:border-primary data-[state=checked]:bg-primary-low data-[state=unchecked]:bg-surface-container-lowest peer border-surface-container-high inline-flex h-4.5 w-8 shrink-0 cursor-pointer items-center rounded-full border  transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{...rest}
		{id}
	>
		<div class="relative h-full w-full">
			<SwitchPrimitive.Thumb
				class={cn(
					// "p-1 bg-surface-container-high data-[state=checked]:bg-primary pointer-events-none block h-3.5 w-3.5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-px",
					'bg-surface-container-high data-[state=checked]:bg-primary pointer-events-none absolute top-1/2 block h-3.5 w-3.5 -translate-y-1/2 rounded-full p-1 shadow-lg ring-0 transition-transform data-[state=checked]:right-0.5 data-[state=unchecked]:left-0.5'
				)}
			/>
		</div>
	</SwitchPrimitive.Root>
	{#if label}
		<Label.Root
			for={id}
			class="text-button2 leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{label}
		</Label.Root>
	{/if}
</div>
