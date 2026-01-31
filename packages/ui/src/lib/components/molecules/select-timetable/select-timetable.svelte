<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import type { ClassValue } from 'clsx';

	import { cn } from '@cugetreg/utils';
	import { mockScheduleList } from '@cugetreg/utils/mock';
	import type { ScheduleList, ScheduleListItem } from '@cugetreg/utils/types';

	interface SelectTimetableProp {
		options?: ScheduleList;
		value?: ScheduleListItem;
		class?: ClassValue;
	}

	let {
		options = mockScheduleList,
		value = $bindable(),
		class: className = undefined
	}: SelectTimetableProp = $props();
</script>

<div class={cn('flex', className)}>
	<div class="mr-5 ml-1 flex items-center justify-center">
		<Menu />
	</div>
	<div class="flex-1">
		<span class="text-xs text-neutral-400"> คุณกำลังเปลี่ยนตารางเรียน... </span>
		<div class="flex gap-2.5">
			<select
				class="border-primary text-primary flex-3 rounded-lg border p-1 focus:outline-none"
				bind:value
			>
				{#each options as item (item.scheduleId)}
					<option value={item}>{item.name}</option>
				{/each}
			</select>

			<div class="truncate rounded-lg border border-neutral-900 px-1 text-xs">
				<div class="text-xs">ทวิภาค 2566</div>
				<div class="text-xs">ภาคต้น</div>
			</div>
		</div>
	</div>
</div>
