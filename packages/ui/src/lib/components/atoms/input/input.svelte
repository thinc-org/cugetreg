<script lang="ts">
	import { cn } from '@cugetreg/utils';

	import { inputVariants, type Props } from './index.ts';

	interface InputProps {
		ref?: HTMLInputElement | null;
		class?: Props['class'];
		value?: Props['value'];
		state?: Props['state'];
		readonly?: Props['readonly'];
		[key: string]: unknown;
	}

	let {
		ref = $bindable(null),
		class: className = undefined,
		value = $bindable(undefined),
		state = 'default',
		readonly = undefined,
		...rest
	}: InputProps = $props();
</script>

<input
	bind:this={ref}
	class={cn(inputVariants({ state }), className)}
	bind:value
	{readonly}
	{...rest}
/>
