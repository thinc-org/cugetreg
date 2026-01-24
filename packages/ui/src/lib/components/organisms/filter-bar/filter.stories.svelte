<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Filter } from './index';

	const { Story } = defineMeta<typeof Filter>({
		title: 'Organism/Filter',
		component: Filter,
		tags: ['autodocs'],
		argTypes: {
			class: {
				control: false
			}
		}
	});
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
