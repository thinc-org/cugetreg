<script lang="ts">
	import { studyProgramMessages, useTranslations } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	import { chipVariants } from './index.js';

	import { Chip } from '../chip/index.js';

	type Type = 'S' | 'I' | 'T';

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

	const t = useTranslations(studyProgramMessages);
</script>

<Chip class={cn(chipVariants({ className }))} {closable} {onClose} {...rest}>
	{#if type}
		{t(type)}
	{/if}
</Chip>
