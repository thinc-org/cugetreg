<script lang="ts">
	import { dayMessages, useTranslations } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	import { chipVariants, type Day } from './index.ts';

	import { Chip } from '../chip/index.ts';

	interface Props {
		class?: string | undefined | null;
		day: Day;
		closable?: boolean;
		onClose?: () => void;
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		day,
		closable = false,
		onClose = () => {},
		...rest
	}: Props = $props();

	const t = useTranslations(dayMessages);
</script>

<Chip class={cn(chipVariants({ day, className }))} {closable} {onClose} {...rest}>
	{#if day}
		{t(day)}
	{/if}
</Chip>
