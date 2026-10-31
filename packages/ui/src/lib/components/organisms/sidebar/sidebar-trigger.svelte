<script lang="ts">
	import { IconButton } from '$lib/components/atoms/icon-button';
	import { defineMessages, useTranslations } from '$lib/i18n';
	import { cn } from '$lib/utils.js';

	import { PanelLeftIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	import { useSidebar } from './context.svelte.js';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: ComponentProps<typeof IconButton> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();

	const t = useTranslations(
		defineMessages({
			th: { toggle: 'เปิด/ปิดแถบด้านข้าง' },
			en: { toggle: 'Toggle sidebar' }
		})
	);
</script>

<IconButton
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	class={cn('size-7 hover:cursor-pointer', className)}
	type="button"
	onclick={(e: any) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	<PanelLeftIcon />
	<span class="sr-only">{t('toggle')}</span>
</IconButton>
