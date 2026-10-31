export { default as SectionTable } from './section-table.svelte';

export interface SectionTableData {
	section: string;
	seats: string;
	/** Marks the section as closed. Falls back to `seats === 'ปิด'` when omitted. */
	closed?: boolean;
	classes: ClassInfo[];
}

export interface ClassInfo {
	teacher: string;
	schedule: string;
	room: string;
	type: string;
}
