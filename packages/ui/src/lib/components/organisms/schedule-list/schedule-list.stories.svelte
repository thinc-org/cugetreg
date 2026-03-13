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
			onSelectTerm: {
				action: 'onSelectTerm'
			},
			onDelete: {
				action: 'onDelete'
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
				title: 'ทวิภาค 2567 ภาคต้น',
				subtitle: 'ทวิภาค 2567 / ภาคต้น',
				isPublic: true
			},
			{
				title: 'ทวิภาค 2566 ภาคต้น',
				subtitle: 'ทวิภาค 2566 / ภาคต้น',
				isPublic: false
			},
			{
				title: 'ทวิภาค 2566 ภาคต้น',
				subtitle: 'ทวิภาค 2566 / ภาคต้น',
				isPublic: false
			}
		]
	}}
/>
