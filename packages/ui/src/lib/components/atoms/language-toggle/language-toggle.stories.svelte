<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { LanguageToggle } from './index.js';

	const { Story } = defineMeta({
		title: 'Atom/Language Toggle',
		component: LanguageToggle,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		}
	});
</script>

<Story name="Default">
	<LanguageToggle />
</Story>
