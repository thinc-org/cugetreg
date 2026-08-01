<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	type Variant = 'left' | 'center' | 'right' | 'mobile';

	interface Props {
		variant?: Variant;
		className?: string; // Additional classes can be passed
		children?: Snippet;
	}

	let { variant = 'center', className = '', children }: Props = $props();
	setContext<() => Variant>('subject-details-variant', () => variant);
</script>

<div class="subject-details {className}">
	{@render children?.()}
	<!-- This will allow nesting of Label and Description -->
</div>

<style lang="postcss">
	/* Base styles for the component */
	.subject-details {
		@layer p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800;
	}
</style>
