<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { Accordion as AccordionPrimitive, type AccordionTriggerProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	import { cn } from '@cugetreg/utils';

	interface Props {
		class?: AccordionTriggerProps['class'];
		level?: AccordionPrimitive.HeaderProps['level'];
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = undefined, level = 3, children, ...rest }: Props = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-center justify-between px-2 py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...rest}
	>
		{@render children?.()}
		<ChevronDown class="h-6 w-6 transition-transform duration-200" />
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
