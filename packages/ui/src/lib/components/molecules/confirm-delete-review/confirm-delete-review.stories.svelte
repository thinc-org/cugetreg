<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { ConfirmDeleteReview } from './index.js';

	const { Story } = defineMeta({
		title: 'Molecule/Confirm Delete Review',
		component: ConfirmDeleteReview,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: {
					type: 'select'
				},
				options: ['overlay', 'card'],
				defaultValue: 'card'
			},
			loading: {
				control: 'boolean'
			},
			onCancel: {
				action: 'onCancel'
			},
			onConfirm: {
				action: 'onConfirm'
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		variant: 'card'
	}}
/>

<Story
	name="Loading"
	args={{
		variant: 'card',
		loading: true
	}}
/>
