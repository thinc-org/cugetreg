<script lang="ts">
	import { Accordion as AccordionPrimitive, type AccordionItemProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	import { cn } from '@cugetreg/utils';

	interface Props {
		class?: AccordionItemProps['class'];
		value: AccordionItemProps['value'];
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = undefined, value, children, ...rest }: Props = $props();
</script>

<AccordionPrimitive.Item {value} class={cn('', className)} {...rest}>
	{@render children?.()}
</AccordionPrimitive.Item>
