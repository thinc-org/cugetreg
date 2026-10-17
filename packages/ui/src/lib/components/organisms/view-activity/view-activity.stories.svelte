<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { ViewActivity } from './index.ts';

	const { Story } = defineMeta({
		title: 'Organism/View Activity',
		component: ViewActivity,
		tags: ['autodocs']
	});
</script>

<Story
	name="Default"
	args={{
		data: {
			id: 'activity-1',
			title: 'วิ่งๆๆๆๆ',
			description: 'วิ่งๆๆๆๆที่สักสวน ตามหาความหวานใจ',
			dayOfWeek: 'TH',
			periodStart: '18:00',
			periodEnd: '19:00',
			color: 'tangerine',
			hidden: false
		}
	}}
/>
