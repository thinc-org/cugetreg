<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Snippet } from 'svelte';

	import { cn } from '@cugetreg/utils'; //TODO: Alias

	import { buttonVariants, type Props } from './index.ts';

	interface ButtonProps {
		children?: Snippet;
		class?: Props['class'];
		variant?: Props['variant'];
		size?: Props['size'];
		color?: Props['color'];
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		variant = 'solid',
		size = 'default',
		color = 'primary',
		children,
		...rest
	}: ButtonProps = $props();
</script>

<ButtonPrimitive.Root
	class={cn(buttonVariants({ variant, size, color }), className)}
	type="button"
	{...rest}
>
	{@render children?.()}
</ButtonPrimitive.Root>
