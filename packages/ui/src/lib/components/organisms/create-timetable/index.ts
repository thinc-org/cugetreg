export { default as CreateTimetable } from './create-timetable.svelte';
export type TimetableMetaData = {
	name: string;
	semesterType: 'S' | 'I' | 'T';
	semester: '1' | '2' | '3';
	isPublic: boolean;
	academicYear: number;
};
