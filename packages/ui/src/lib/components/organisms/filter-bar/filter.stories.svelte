<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Filter } from './index';

	const { Story } = defineMeta({
		title: 'Organism/Filter',
		component: Filter,
		tags: ['autodocs']
	});
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
