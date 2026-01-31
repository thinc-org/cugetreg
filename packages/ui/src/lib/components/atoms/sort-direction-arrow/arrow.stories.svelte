<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Arrow } from './index.ts';

	const { Story } = defineMeta({
		title: 'Atom/Sort Direction Arrow',
		component: Arrow,
		tags: ['autodocs'],
		argTypes: {}
	});
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
