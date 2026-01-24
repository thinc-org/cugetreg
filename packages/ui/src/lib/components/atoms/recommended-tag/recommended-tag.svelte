<script lang="ts">
	import { Sparkles } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';

	interface Props {
		class?: string | undefined | null;
		[key: string]: unknown;
	}

	let { class: className = undefined, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'text-neutral-white bg-tangerine-500 relative inline-flex items-center justify-center rounded-tl-xl rounded-br-xl px-6 py-[2px]',
		className
	)}
	{...rest}
>
	<Sparkles class="mr-2" size="16" />
	แนะนำสำหรับคุณ
	<div
		class="border-b-tangerine-700 border-r-surface absolute top-0 right-0 translate-x-full border-r-8 border-b-8"
	></div>
</div>
