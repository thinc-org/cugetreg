import { defineMessages } from './translate';

/**
 * Domain terms shared across the app and the UI package.
 * Keys mirror the API enums so they can be looked up directly, e.g. `t(studyProgram)`.
 */

export const dayMessages = defineMessages({
	th: {
		MO: 'จันทร์',
		TU: 'อังคาร',
		WE: 'พุธ',
		TH: 'พฤหัส',
		FR: 'ศุกร์',
		SA: 'เสาร์',
		SU: 'อาทิตย์'
	},
	en: {
		MO: 'Mon',
		TU: 'Tue',
		WE: 'Wed',
		TH: 'Thu',
		FR: 'Fri',
		SA: 'Sat',
		SU: 'Sun'
	}
});

export const studyProgramMessages = defineMessages({
	th: {
		S: 'ทวิภาค',
		T: 'ตรีภาค',
		I: 'นานาชาติ'
	},
	en: {
		S: 'Semester',
		T: 'Trimester',
		I: 'International'
	}
});

export const semesterMessages = defineMessages({
	th: {
		FIRST: 'ภาคต้น',
		SECOND: 'ภาคปลาย',
		SUMMER: 'ภาคฤดูร้อน'
	},
	en: {
		FIRST: 'First semester',
		SECOND: 'Second semester',
		SUMMER: 'Summer semester'
	}
});

export const semesterShortMessages = defineMessages({
	th: {
		FIRST: '1',
		SECOND: '2',
		SUMMER: 'ฤดูร้อน'
	},
	en: {
		FIRST: '1',
		SECOND: '2',
		SUMMER: 'Summer'
	}
});

export const genEdMessages = defineMessages({
	th: {
		SC: 'หมวดวิทย์',
		SO: 'หมวดสังคม',
		HU: 'หมวดมนุษย์',
		IN: 'หมวดสหฯ',
		GENED: 'ศึกษาทั่วไป'
	},
	en: {
		SC: 'Science',
		SO: 'Social Science',
		HU: 'Humanities',
		IN: 'Interdisciplinary',
		GENED: 'General Education'
	}
});

export const reviewStatusMessages = defineMessages({
	th: {
		APPROVED: 'อนุมัติแล้ว',
		PENDING: 'กำลังรออนุมัติ',
		REJECTED: 'ถูกปฏิเสธ'
	},
	en: {
		APPROVED: 'Approved',
		PENDING: 'Pending approval',
		REJECTED: 'Rejected'
	}
});
