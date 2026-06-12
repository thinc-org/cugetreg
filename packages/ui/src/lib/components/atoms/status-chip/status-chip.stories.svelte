<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StatusChip } from './index.js';

	const { Story } = defineMeta({
		title: 'Atom/Status Chip',
		component: StatusChip,
		tags: ['autodocs'],
		argTypes: {
			class: {
				control: false
			}
		}
	});
</script>

<!-- 👇 Each story then reuses that template -->

<Story name="Approved" args={{ variant: 'APPROVED' }}></Story>

<Story name="Pending" args={{ variant: 'PENDING' }}></Story>

<Story name="Rejected" args={{ variant: 'REJECTED' }}></Story>
