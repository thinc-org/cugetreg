<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { TimeTable, type TimeTableCourse } from '.';
	import TimetableCourseCard from './timetable-course-card.svelte';

	const { Story } = defineMeta({
		title: 'Atom/Time Table',
		component: TimeTable,
		tags: ['autodocs'],
		argTypes: {
			periodPerDay: {
				defaultValue: 12
			},
			days: {
				controls: false,
				defaultValue: ['MON', 'TUE', 'WED', 'THU', 'FRI']
			}
		}
	});

	const course1: TimeTableCourse = {
		name: 'COM PROG',
		code: '2190101',
		bldg: 'ENG2',
		room: '303/1',
		section: 1
	};

	const course2: TimeTableCourse = {
		name: 'ADV MATH METH',
		code: '2190101',
		bldg: 'ENG2',
		room: '303/1',
		section: 32
	};

	const course3: TimeTableCourse = {
		name: 'Calculus II',
		code: '2190101',
		bldg: 'ENG100',
		room: 'M07/1',
		section: 123
	};
</script>

<Story name="Default" />

<Story name="Custom Days" args={{ days: ['3 ธ.ค 67', '4 ธ.ค 67', '5 ธ.ค 67', '7 ธ.ค 67'] }} />

<Story name="Populated">
	<TimetableCourseCard course={course1} length={1} row={2} col={1} color="orange" />
	<TimetableCourseCard course={course2} length={2} row={2} col={2} color="tangerine" />
	<TimetableCourseCard course={course3} length={3} row={3} col={3} color="purple" />
	<TimetableCourseCard course={course1} length={1} row={1} col={1} color="teal" />
	<TimetableCourseCard course={course2} length={2} row={1} col={4} color="conflict" />
	<TimetableCourseCard course={course3} length={5} row={4} col={0} color="yellow" />
	<TimetableCourseCard course={course3} length={3} row={2} col={6} color="conflict" />
	<TimetableCourseCard course={course2} length={3} row={2} col={8} color="conflict" />
</Story>
