<script lang="ts">
	import type { ClassValue } from 'clsx';
	import type { Snippet } from 'svelte';

	import { cn } from '@cugetreg/utils';

	interface QuestionAnswerProp {
		question: string;
		children?: Snippet;
		class?: ClassValue;
	}

	const { question, children, class: className = undefined }: QuestionAnswerProp = $props();
</script>

<div class={cn('my-5 flex flex-1', className)}>
	<div class="flex-1 text-lg font-bold">{question}</div>
	<div class="font-sarabun flex-1 wrap-break-word">
		{@render children?.()}
	</div>
</div>
