export { default as SectionTable } from './section-table.svelte';

export interface SectionTableData {
	section: string;
	seats: string;
	classes: ClassInfo[];
}

export interface ClassInfo {
	teacher: string;
	schedule: string;
	room: string;
	type: string;
}
