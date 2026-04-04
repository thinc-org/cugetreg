<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import type { ClassValue } from 'clsx';

	import { cn } from '@cugetreg/utils';

	interface SelectTimetableProp {
		options?: {
			name: string;
			id: string;
		}[];
		value?: string;
		class?: ClassValue;
	}

	let {
		options,
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
				{#each options as item (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>

			<!-- TODO: -->
			<div class="truncate rounded-lg border border-neutral-900 px-1 text-xs">
				<div class="text-xs">ทวิภาค 2566</div>
				<div class="text-xs">ภาคต้น</div>
			</div>
		</div>
	</div>
</div>
