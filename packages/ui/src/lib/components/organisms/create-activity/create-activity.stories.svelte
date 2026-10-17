<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { CreateActivity } from './index.ts';

	const { Story } = defineMeta({
		title: 'Organism/Create Activity',
		component: CreateActivity,
		tags: ['autodocs']
	});
</script>

<Story name="Default" />
