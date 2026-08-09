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
			items: {
				control: false
			},
			loading: {
				control: 'boolean'
			},
			onClickItem: {
				action: 'onClickItem'
			},
			onClickButton: {
				action: 'onClickButton'
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
		items: [
			{
				id: '1',
				title: 'ทวิภาค 2567 ภาคต้น',
				subtitle: 'ทวิภาค 2567 / ภาคต้น',
				year: 2567,
				semester: 1,
				isPublic: true
			},
			{
				id: '2',
				title: 'ทวิภาค 2566 ภาคต้น',
				subtitle: 'ทวิภาค 2566 / ภาคต้น',
				year: 2566,
				semester: 1,
				isPublic: false
			},
			{
				id: '3',
				title: 'ทวิภาค 2566 ภาคต้น',
				subtitle: 'ทวิภาค 2566 / ภาคต้น',
				year: 2566,
				semester: 1,
				isPublic: false
			}
		],
		loading: false
	}}
/>
