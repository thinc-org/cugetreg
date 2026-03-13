<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '@cugetreg/utils';

	type $$Props = HTMLAttributes<HTMLTableSectionElement>;

	interface Props {
		class?: $$Props['class'];
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<thead class={cn('bg-surface-container-lowest  [&_tr]:border-b-0 ', className)} {...rest}>
	{@render children?.()}
</thead>
