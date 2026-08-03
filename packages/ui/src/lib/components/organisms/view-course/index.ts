import type { ColorVariant } from '@cugetreg/utils/types';

export type ViewCourseSectionClass = {
	type: string;
	dayOfWeek: string;
	periodStart: string;
	periodEnd: string;
	building: string | null;
	room: string | null;
	professors: string[];
};

export type ViewCourseSection = {
	sectionNo: number;
	closed: boolean;
	regis: number;
	max: number;
	classes: ViewCourseSectionClass[];
};

export type ViewCourseData = {
	itemId: string;
	courseNo: string;
	abbrName: string;
	courseNameTh: string;
	courseNameEn: string;
	credit: string | number;
	genEdType?: string;
	sections: ViewCourseSection[];
	selectedSectionNo: number;
	color: ColorVariant;
	midterm?: string;
	final?: string;
	isHidden: boolean;
	studyProgram: string;
	academicYear: number;
	semester: string;
};

export { default as ViewCourse } from './view-course.svelte';
