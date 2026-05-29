<script lang="ts">
	function formatSemesterType(semesterType: string): string {
		switch (semesterType) {
			default:
				console.warn(`Invalid semesterType ${semesterType}`);
				return 'ทวิภาค';
			case 'S':
				return 'ทวิภาค';
			case 'I':
				return 'นานาชาติ';
			case 'T':
				return 'ไตรภาค';
		}
	}

	function formatSemester(semester: 'FIRST' | 'SECOND' | 'SUMMER'): string {
		switch (semester) {
			default:
			case 'FIRST':
				return 'ภาคต้น';
			case 'SECOND':
				return 'ภาคปลาย';
			case 'SUMMER':
				return 'ภาคฤดูร้อน';
		}
	}

	interface SelectTimetableProp {
		options?: {
			name: string;
			id: string;
		}[];
		value?: string;
		semesterType: 'S' | 'I' | 'T';
		academicYear: number;
		semester: string;
	}

	let {
		options,
		value = $bindable(),
		semesterType = 'S',
		semester = 'FIRST',
		academicYear = 2566
	}: SelectTimetableProp = $props();
</script>

<div class="flex">
	<div class="flex-1">
		<span class="text-xs text-neutral-400"> คุณกำลังเปลี่ยนตารางเรียน... </span>
		<div class="flex gap-2.5">
			<select
				class="border-primary text-primary flex-3 rounded-lg border p-1 focus:outline-none"
				bind:value
			>
				{#each options as item (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>

			<div class="truncate rounded-lg border border-neutral-900 px-1 text-xs">
				<div class="text-xs">{formatSemesterType(semesterType)} {academicYear}</div>
				<div class="text-xs">{formatSemester(semester)}</div>
			</div>
		</div>
	</div>
</div>
