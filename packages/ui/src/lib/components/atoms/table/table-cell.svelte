<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { HTMLTdAttributes } from 'svelte/elements';

	import { cn } from '@cugetreg/utils';

	type $$Props = HTMLTdAttributes;

	interface Props {
		class?: $$Props['class'];
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<td
	class={cn(
		'text-on-surface font-sarabun text-body1  p-4 align-middle font-normal data-[rowspan=true]:align-top [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...rest}
	onclick={bubble('click')}
	onkeydown={bubble('keydown')}
>
	{@render children?.()}
</td>
