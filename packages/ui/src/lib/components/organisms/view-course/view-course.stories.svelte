<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { ViewCourse } from './index.ts';

	const { Story } = defineMeta({
		title: 'Organism/View Course',
		component: ViewCourse
	});
</script>

<Story name="Default" />
