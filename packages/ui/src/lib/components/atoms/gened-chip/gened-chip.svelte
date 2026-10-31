<script lang="ts">
	import { genEdMessages, useTranslations } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	import { chipVariants, type Type } from './index.js';

	import { Chip } from '../chip/index.js';

	interface Props {
		class?: string | undefined | null;
		type: Type;
		closable?: boolean;
		onClose?: () => void;
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		type,
		closable = false,
		onClose = () => {},
		...rest
	}: Props = $props();

	const t = useTranslations(genEdMessages);
</script>

<Chip class={cn(chipVariants({ type, className }))} {closable} {onClose} {...rest}>
	{#if type}
		{t(type)}
	{/if}
</Chip>
