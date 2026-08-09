<script lang="ts" generics="Key extends string">
	import type { ClassValue } from 'clsx';

	import { cn } from '@cugetreg/utils';

	import { Button } from '../../atoms/button';

	interface ColorPickerProps {
		class?: ClassValue;
		onChange?: (option: string) => void;
		onCancel?: () => void;
		onConfirmSelected?: (option: string) => void;
		options: Record<Key, string>;
		value: Key;
	}

	let {
		class: className = undefined,
		onCancel = () => {},
		onConfirmSelected = () => {},
		onChange = () => {},
		options,
		value = $bindable()
	}: ColorPickerProps = $props();

	function handleCancel() {
		onCancel();
	}
</script>

<div class={cn(className, 'rounded-lg border border-neutral-200 p-5')}>
	<div class="text-lg font-bold">เลือกสีในตาราง</div>

	<div class="my-5 grid grid-cols-5">
		{#each Object.keys(options) as Key[] as option (option)}
			<Button
				variant="solid"
				color="primary"
				class={cn(
					'm-2 aspect-square border hover:ring-0',
					options[option],
					value === option && 'outline-primary outline-[1.5px]! outline-offset-4',
					value === option && 'hover:outline-[1.5px]! hover:outline-solid!'
				)}
				onclick={() => {
					value = option;
					onChange(option);
				}}
			/>
		{/each}
	</div>

	<div class="flex justify-between space-x-5">
		<Button class="flex-1" onclick={handleCancel}>ยกเลิก</Button>
		<Button
			class="flex-1"
			variant="outlined"
			onclick={() => {
				onConfirmSelected(options[value]);
			}}
		>
			เลืิอก
		</Button>
	</div>
</div>
