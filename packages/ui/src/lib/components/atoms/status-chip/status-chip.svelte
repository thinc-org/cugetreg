<script lang="ts">
	import { reviewStatusMessages, useTranslations } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	import { chipVariants, styles, type Variant } from './index.js';

	interface Props {
		variant: Variant;
		class?: string | undefined | null;
		[key: string]: unknown;
	}

	let { class: className = undefined, variant, ...rest }: Props = $props();

	const t = useTranslations(reviewStatusMessages);
</script>

<span class={cn(styles[variant], chipVariants({ className }))} {...rest}>
	{t(variant)}
</span>
