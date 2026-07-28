<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Chip } from './index.js';

	const { Story } = defineMeta({
		title: 'Atom/Chip',
		component: Chip,
		tags: ['autodocs'],
		argTypes: {
			closable: {
				control: 'boolean'
			},
			onClose: {
				action: 'onClose'
			},
			class: {
				control: false
			}
		}
	});
</script>

<!-- 👇 Each story then reuses that template -->

<Story name="Default" args={{ closable: false }}>
	<Chip closable={false}>Chip</Chip>
</Story>

<Story name="Default Closable" args={{ closable: true }}>
	<Chip closable={true}>Chip</Chip>
</Story>
