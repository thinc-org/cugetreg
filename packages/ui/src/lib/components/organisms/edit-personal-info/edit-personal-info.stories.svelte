<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { EditPersonalInfo } from './index.js';

	const { Story } = defineMeta({
		title: 'Organism/Edit Personal Info',
		component: EditPersonalInfo,
		tags: ['autodocs'],
		argTypes: {
			username: {
				control: 'text'
			},
			firstName: {
				control: 'text'
			},
			lastName: {
				control: 'text'
			},
			faculty: {
				control: 'text'
			},
			department: {
				control: 'text'
			},
			accountProvider: {
				control: 'text'
			},
			accountEmail: {
				control: 'text'
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
		username: '6534344444',
		firstName: 'Wanrudee',
		lastName: 'Kittichaiyakorn',
		faculty: 'วิศวกรรมศาสตร์',
		department: '',
		accountProvider: 'Google',
		accountEmail: '6534344444@student.chula.ac.th'
	}}
/>
