<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { mockSchedule as schedule } from '@cugetreg/utils/mock';

	import { SelectedCourse } from './index';

	const { Story } = defineMeta({
		title: 'Organism/Selected Course',
		component: SelectedCourse,
		tags: ['autodocs'],
		argTypes: {
			schedule: {
				control: false
			},
			variant: {
				control: 'select',
				defaultValue: 'detailed'
			}
		},
		args: {
			schedule
		}
	});
</script>

<Story name="Detailed" args={{ variant: 'detailed' }} />
<Story name="Simple" args={{ variant: 'simple' }} />
