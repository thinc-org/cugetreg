<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { FACULTIES, type FacultyId } from '@cugetreg/utils/faculty';

	import { FacultyChip } from './index.js';

	const facultyIds = Object.keys(FACULTIES) as FacultyId[];

	const { Story } = defineMeta({
		title: 'Atom/Faculty Chip',
		component: FacultyChip,
		tags: ['autodocs'],
		argTypes: {
			faculty: {
				control: {
					type: 'select'
				},
				options: facultyIds,
				defaultValue: '21'
			},
			closable: {
				control: 'boolean'
			},
			onClose: {
				action: 'onClose'
			},
			class: {
				control: false
			}
		}
	});
</script>

<Story name="Engineering" args={{ faculty: '21', closable: false }} />

<Story name="Neutral" args={{ faculty: '01', closable: false }} />

<Story name="Closable" args={{ faculty: '30', closable: true }} />

<Story name="All Faculties">
	<div class="flex flex-wrap gap-2">
		{#each facultyIds as faculty (faculty)}
			<FacultyChip {faculty} />
		{/each}
	</div>
</Story>
