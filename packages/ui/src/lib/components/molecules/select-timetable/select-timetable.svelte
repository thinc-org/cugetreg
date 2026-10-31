<script lang="ts">
	import {
		defineMessages,
		semesterMessages,
		studyProgramMessages,
		useTranslations
	} from '$lib/i18n';

	import { cn } from '@cugetreg/utils';

	const t = useTranslations(
		defineMessages({
			th: { scheduling: 'คุณกำลังจัดตารางเรียน...' },
			en: { scheduling: 'You are planning...' }
		})
	);
	const tStudyProgram = useTranslations(studyProgramMessages);
	const tSemester = useTranslations(semesterMessages);

	function formatSemesterType(semesterType: string): string {
		switch (semesterType) {
			default:
				console.warn(`Invalid semesterType ${semesterType}`);
				return tStudyProgram('S');
			case 'S':
			case 'I':
			case 'T':
				return tStudyProgram(semesterType);
		}
	}

	function formatSemester(semester: 'FIRST' | 'SECOND' | 'SUMMER'): string {
		switch (semester) {
			default:
			case 'FIRST':
				return tSemester('FIRST');
			case 'SECOND':
			case 'SUMMER':
				return tSemester(semester);
		}
	}

	interface SelectTimetableProp {
		class?: string;
		options?: {
			name: string;
			id: string;
		}[];
		value?: string;
		semesterType: 'S' | 'I' | 'T';
		academicYear: number;
		semester: 'FIRST' | 'SECOND' | 'SUMMER';
	}

	let {
		class: className = undefined,
		options,
		value = $bindable(),
		semesterType = 'S',
		semester = 'FIRST',
		academicYear = 2566
	}: SelectTimetableProp = $props();
</script>

<div class={cn('flex', className)}>
	<div class="flex-1">
		<span class="text-xs text-neutral-400"> {t('scheduling')} </span>
		<div class="flex gap-2.5">
			<select
				class="border-primary text-primary flex-3 rounded-lg border p-1 focus:outline-none"
				bind:value
			>
				{#each options as item (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>

			<!-- TODO: -->
			<div class="truncate rounded-lg border border-neutral-900 px-1 text-xs">
				<div class="text-xs">{formatSemesterType(semesterType)} {academicYear}</div>
				<div class="text-xs">{formatSemester(semester)}</div>
			</div>
		</div>
	</div>
</div>
