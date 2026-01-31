<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { PersonalInfo } from './index.js';

	const { Story } = defineMeta({
		title: 'Organism/Personal Info',
		component: PersonalInfo,
		tags: ['autodocs'],
		argTypes: {
			name: {
				control: 'text'
			},
			id: {
				control: 'text'
			},
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
			onEdit: {
				action: 'onEdit'
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		name: 'Wanrudee Kittichaiyakorn',
		id: '6534344444',
		username: '6534344444',
		firstName: 'Wanrudee',
		lastName: 'Kittichaiyakorn',
		faculty: 'วิศวกรรมศาสตร์',
		department: '-',
		accountProvider: 'Google',
		accountEmail: '6534344444@student.chula.ac.th'
	}}
/>
