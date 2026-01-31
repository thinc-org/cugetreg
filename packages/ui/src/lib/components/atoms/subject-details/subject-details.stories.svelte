<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { SubjectDetails, SubjectDetailsDescription, SubjectDetailsLabel } from './index.ts';

	const { Story } = defineMeta({
		title: 'Atom/Subject Detail'
	});

	//NOTE: This component appear to be unfinished
</script>

<Story name="Default">
	<SubjectDetails>
		<SubjectDetailsLabel>COM PORG</SubjectDetailsLabel>
		<SubjectDetailsDescription>Something</SubjectDetailsDescription>
	</SubjectDetails>
</Story>
