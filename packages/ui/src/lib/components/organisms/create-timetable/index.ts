export { default as CreateTimetable } from './create-timetable.svelte';
export type TimetableMetaData = {
	name: string;
	semesterType: 'S' | 'I' | 'T';
	semester: 'FIRST' | 'SECOND' | 'SUMMER';
	isPublic: boolean;
	academicYear: number;
};
