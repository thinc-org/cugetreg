<script lang="ts">
	import { cn } from '$lib/utils';

	import { TriangleAlert } from '@lucide/svelte';
	import { onMount } from 'svelte';

	interface Props {
		href: string;
		variant?: 'fixed' | 'sticky';
		class?: string;
	}

	let { href, variant = 'fixed', class: className = '' }: Props = $props();

	let isMobile = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(max-width: 768px)');
		isMobile = mq.matches;

		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
		};
		mq.addEventListener('change', handler);

		return () => {
			mq.removeEventListener('change', handler);
		};
	});

	const positionClass = $derived(
		variant === 'sticky'
			? 'sticky right-6 bottom-6 mt-8 mb-6 ml-auto bg-white'
			: 'fixed right-6 bottom-6'
	);
</script>

<a
	class={cn(
		'z-50 flex w-max cursor-pointer items-center gap-1 rounded-full border-2 border-black px-2 py-1 md:gap-2 md:px-4',
		positionClass,
		className
	)}
	{href}
	target="_blank"
	rel="external noopener noreferrer"
>
	<TriangleAlert size={isMobile ? 16 : 20} strokeWidth={1.5} color="black" />
	<span class="text-[10px] text-black md:text-xs">แจ้งปัญหาการใช้งาน</span>
</a>
