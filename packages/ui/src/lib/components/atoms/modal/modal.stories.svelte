<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import Modal from './modal.svelte';

	const { Story } = defineMeta({
		title: 'Atom/Modal',
		component: Modal,
		tags: ['autodocs']
	});
</script>

<Story name="Default Modal">
	<div
		class="bg-surface flex h-25 w-50 items-center justify-center rounded-lg border border-neutral-200"
	>
		Hello world
	</div>
</Story>
