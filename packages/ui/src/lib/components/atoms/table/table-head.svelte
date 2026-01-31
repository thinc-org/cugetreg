<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';

	import { cn } from '@cugetreg/utils';

	type $$Props = HTMLThAttributes;

	interface Props {
		class?: $$Props['class'];
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<th
	class={cn(
		'text-primary text-table-header border-surface h-8 border-x-[1px] px-4 text-left align-middle font-medium first:rounded-tl-xl last:rounded-tr-xl [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</th>
