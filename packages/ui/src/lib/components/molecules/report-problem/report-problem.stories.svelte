<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { ReportProblem } from './index';

	const { Story } = defineMeta({
		title: 'Molecule/ReportProblem',
		component: ReportProblem,
		tags: ['autodocs'],
		argTypes: {}
	});
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" args={{ href: 'https://example.com' }} />
<Story name="Sticky" args={{ href: 'https://example.com', variant: 'sticky' }} />
