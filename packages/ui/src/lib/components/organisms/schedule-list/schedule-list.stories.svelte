<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { ScheduleList } from './index.js';

	const { Story } = defineMeta({
		title: 'Organism/Schedule List',
		component: ScheduleList,
		tags: ['autodocs'],
		argTypes: {
			heading: {
				control: 'text'
			},
			selectedTerm: {
				control: 'text'
			},
			terms: {
				control: false
			},
			items: {
				control: false
			},
			loading: {
				control: 'boolean'
			},
			onSelectTerm: {
				action: 'onSelectTerm'
			},
			onDelete: {
				action: 'onDelete'
			},
			onChangeVisibility: {
				action: 'onChangeVisibility'
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		heading: 'ตารางเรียน',
		selectedTerm: 'ทวิภาค 2567 ภาคต้น',
		terms: ['ทวิภาค 2567 ภาคต้น', 'ทวิภาค 2566 ภาคต้น'],
		items: [
			{
				id: '1',
				title: 'ทวิภาค 2567 ภาคต้น',
				subtitle: 'ทวิภาค 2567 / ภาคต้น',
				isPublic: true
			},
			{
				id: '2',
				title: 'ทวิภาค 2566 ภาคต้น',
				subtitle: 'ทวิภาค 2566 / ภาคต้น',
				isPublic: false
			},
			{
				id: '3',
				title: 'ทวิภาค 2566 ภาคต้น',
				subtitle: 'ทวิภาค 2566 / ภาคต้น',
				isPublic: false
			}
		],
		loading: false
	}}
/>
