<script lang="ts">
	import { cn } from '@cugetreg/utils';

	import { chipVariants, type Variant, styles, text } from './index.js';

	interface Props {
		variant: Variant;
		class?: string | undefined | null;
		[key: string]: unknown;
	}

	let { class: className = undefined, variant, ...rest }: Props = $props();
</script>

<span class={cn(styles[variant], chipVariants({ className }))} {...rest}>
	{text[variant]}
</span>
