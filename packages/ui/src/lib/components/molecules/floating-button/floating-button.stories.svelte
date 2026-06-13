<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { FloatingButton } from './index';

	const { Story } = defineMeta({
		title: 'Molecule/FloatingButton',
		component: FloatingButton,
		tags: ['autodocs'],
		argTypes: {}
	});
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
