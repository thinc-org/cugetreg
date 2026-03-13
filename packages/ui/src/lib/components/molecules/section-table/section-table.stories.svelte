<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import SectionTable from './section-table.svelte';

	const { Story } = defineMeta({
		title: 'Molecule/Section Table',
		component: SectionTable,
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	const defaultData = [
		{
			section: '1',
			seats: '28 / 28',
			teacher: 'Dr. Smith',
			schedule: 'THU 16:00 - 17:00',
			room: 'MAHIT 202',
			type: 'LECT'
		},
		{
			section: '2',
			seats: '12 / 28',
			teacher: 'Dr. Johnson',
			schedule: 'THU 16:00 - 17:00',
			room: 'MAHIT 202',
			type: 'LECT'
		},
		{
			section: '3',
			seats: 'ปิด',
			teacher: 'Prof. Williams',
			schedule: 'THU 16:00 - 17:00',
			room: 'MAHIT 202',
			type: 'LECT'
		}
	];

	const fullSectionsData = [
		{
			section: '1',
			seats: '28 / 28',
			teacher: 'Dr. Smith',
			schedule: 'MON 09:00 - 10:30',
			room: 'ENGR 101',
			type: 'LECT'
		},
		{
			section: '2',
			seats: '30 / 30',
			teacher: 'Dr. Johnson',
			schedule: 'WED 14:00 - 15:30',
			room: 'ENGR 102',
			type: 'LECT'
		}
	];

	const availableSectionsData = [
		{
			section: '1',
			seats: '10 / 30',
			teacher: 'Prof. Williams',
			schedule: 'TUE 10:00 - 11:30',
			room: 'SCI 201',
			type: 'LECT'
		},
		{
			section: '2',
			seats: '5 / 25',
			teacher: 'Prof. Brown',
			schedule: 'FRI 13:00 - 14:30',
			room: 'SCI 202',
			type: 'LAB'
		}
	];

	const closedSectionsData = [
		{
			section: '1',
			seats: 'ปิด',
			teacher: 'Dr. Davis',
			schedule: 'MON 14:00 - 15:30',
			room: 'ARTS 301',
			type: 'LECT'
		},
		{
			section: '2',
			seats: 'ปิด',
			teacher: 'Dr. Wilson',
			schedule: 'WED 10:00 - 11:30',
			room: 'ARTS 302',
			type: 'LECT'
		}
	];

	const mixedStatusData = [
		{
			section: '1',
			seats: '15 / 30',
			teacher: 'Prof. Martinez',
			schedule: 'MON 09:00 - 10:30',
			room: 'BUS 101',
			type: 'LECT'
		},
		{
			section: '2',
			seats: '28 / 28',
			teacher: 'Prof. Garcia',
			schedule: 'WED 11:00 - 12:30',
			room: 'BUS 102',
			type: 'LECT'
		},
		{
			section: '3',
			seats: 'ปิด',
			teacher: 'Prof. Lopez',
			schedule: 'FRI 14:00 - 15:30',
			room: 'BUS 103',
			type: 'LAB'
		},
		{
			section: '4',
			seats: '8 / 20',
			teacher: 'Prof. Lee',
			schedule: 'TUE 16:00 - 17:30',
			room: 'BUS 104',
			type: 'LECT'
		}
	];

	const singleSectionData = [
		{
			section: '1',
			seats: '20 / 35',
			teacher: 'Dr. Anderson',
			schedule: 'THU 13:00 - 14:30',
			room: 'PHYS 401',
			type: 'LECT'
		}
	];
</script>

<Story name="Default" args={{ tableData: defaultData }} />

<Story name="Available Sections" args={{ tableData: availableSectionsData }} />

<Story name="Full Sections" args={{ tableData: fullSectionsData }} />

<Story name="Closed Sections" args={{ tableData: closedSectionsData }} />

<Story name="Empty Table" args={{ tableData: [] }} />
