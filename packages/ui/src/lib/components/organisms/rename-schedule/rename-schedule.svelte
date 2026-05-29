<script lang="ts">
	import { untrack } from 'svelte';

	import { Button } from '../../atoms/button';
	import { Input } from '../../atoms/input';

	interface RenameScheduleProp {
		onCancel: () => void;
		onConfirm: (name: string) => void;
		initialName: string;
	}

	let { initialName, onCancel = () => {}, onConfirm = () => {} }: RenameScheduleProp = $props();

	function handleConfirm() {
		onConfirm(nameDraft);
	}

	const LENGTH_CAP = 30;

	let nameDraft = $state(untrack(() => initialName));
</script>

<div class="bg-surface w-[300px] rounded-lg border border-neutral-200 p-5">
	<span class="text-xl font-bold">แก้ไขชื่อ</span>
	<div class="my-5">
		<Input bind:value={nameDraft} maxLength={LENGTH_CAP} />
		<span class="text-caption leading-caption text-neutral-400"
			>จำนวนตัวอักษร {length} / {LENGTH_CAP}</span
		>
	</div>
	<div class="flex justify-between gap-3">
		<Button class="flex-1" variant="outlined" onclick={onCancel}>ยกเลิก</Button>
		<Button class="flex-1" onclick={handleConfirm}>ยืนยัน</Button>
	</div>
</div>
