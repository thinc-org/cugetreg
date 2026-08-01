<script lang="ts">
	import { getContext, type Snippet } from 'svelte';

	type Variant = 'left' | 'center' | 'right' | 'mobile';

	const getVariant = getContext<() => Variant>('subject-details-variant');
	const roundedStyle = {
		left: 'rounded-l-full',
		right: 'rounded-r-full',
		center: '',
		mobile: 'rounded-full'
	};
	const roundedClass = $derived(roundedStyle[getVariant()]);

	interface Props {
		className?: string; // Additional classes
		text?: string; // Optional text prop, can be overridden by slot
		children?: Snippet;
	}

	let { className = '', text = '', children }: Props = $props();
</script>

<div
	class="{`bg-surface-container-lowest text-primary text-table-header px-4 py-1.75 font-medium ${roundedClass} ${className}`} "
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</div>
