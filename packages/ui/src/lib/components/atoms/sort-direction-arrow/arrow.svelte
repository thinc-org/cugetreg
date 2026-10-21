<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	let down = $state(true);

	const t = useTranslations(
		defineMessages({
			th: { sortDescending: 'เรียงจากมากไปน้อย', sortAscending: 'เรียงจากน้อยไปมาก' },
			en: { sortDescending: 'Sort descending', sortAscending: 'Sort ascending' }
		})
	);
</script>

{#if down}
	<button type="button" onclick={() => (down = !down)} class="b" aria-label={t('sortDescending')}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-arrow-down-icon lucide-arrow-down"
			><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg
		>
	</button>
{:else}
	<button type="button" onclick={() => (down = !down)} class="b" aria-label={t('sortAscending')}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-arrow-up-icon lucide-arrow-up"
			><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg
		>
	</button>
{/if}

<style>
	.b {
		color: hsl(222 52% 53%);
	}
</style>
