<script lang="ts">
	import ExamRow from './exam-row.svelte';
	import type { Exam } from './types';

	export let date: string;
	export let data: Exam[];
</script>

<div
	class="min-h-51 w-103 gap-5 rounded-xl border border-[#D6D7E1] p-6 font-[FC_Orbit] opacity-100"
>
	<h1 class="mb-5 align-middle text-xl leading-[1.4] font-medium tracking-[0.15px]">
		{date}
	</h1>
	<div>
		{#each data as exam (exam.id)}
			<ExamRow {...exam} />
		{/each}
	</div>
</div>
