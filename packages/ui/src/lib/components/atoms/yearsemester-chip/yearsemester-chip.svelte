<script lang="ts">
	import { semesterMessages, studyProgramMessages, useTranslations } from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	import { chipVariants } from './index.js';

	import { Chip } from '../chip/index.js';

	export type Semester = 'FIRST' | 'SECOND' | 'SUMMER';

	interface Props {
		class?: string | undefined | null;
		studyProgram?: 'S' | 'I' | 'T';
		year: number;
		semester: Semester;
		closable?: boolean;
		onClose?: () => void;
		[key: string]: unknown;
	}

	let {
		class: className = undefined,
		studyProgram,
		year,
		semester,
		closable = false,
		onClose = () => {},
		...rest
	}: Props = $props();

	const tStudyProgram = useTranslations(studyProgramMessages);
	const tSemester = useTranslations(semesterMessages);
</script>

<Chip class={cn(chipVariants({ className }))} {closable} {onClose} {...rest}>
	{#if year && semester}
		{studyProgram ? tStudyProgram(studyProgram) + ' ' : ''}{year} / {tSemester(semester)}
	{/if}
</Chip>
