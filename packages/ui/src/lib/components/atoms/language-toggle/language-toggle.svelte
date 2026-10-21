<script lang="ts">
	import { LOCALES, useLocale } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	const locale = useLocale();
</script>

<div
	role="group"
	aria-label="Language / ภาษา"
	class={cn(
		'rounded-button border-surface-container-low flex h-8 items-center border-2 p-0.5',
		className
	)}
>
	{#each LOCALES as option (option)}
		<button
			type="button"
			aria-pressed={locale.current === option}
			onclick={() => locale.set(option)}
			class={cn(
				'rounded-button text-button2 h-full cursor-pointer px-2 font-medium text-neutral-500 transition-colors hover:text-neutral-800',
				locale.current === option && 'bg-primary text-white hover:text-white'
			)}
		>
			{option.toUpperCase()}
		</button>
	{/each}
</div>
