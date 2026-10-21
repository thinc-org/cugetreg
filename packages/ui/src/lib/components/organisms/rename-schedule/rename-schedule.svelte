<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

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

	const t = useTranslations(
		defineMessages({
			th: {
				heading: 'แก้ไขชื่อ',
				charCount: 'จำนวนตัวอักษร {count} / {max}',
				cancel: 'ยกเลิก',
				confirm: 'ยืนยัน'
			},
			en: {
				heading: 'Rename',
				charCount: 'Characters {count} / {max}',
				cancel: 'Cancel',
				confirm: 'Confirm'
			}
		})
	);

	let nameDraft = $state(untrack(() => initialName));
</script>

<div class="bg-surface w-[300px] rounded-lg border border-neutral-200 p-5">
	<span class="text-xl font-bold">{t('heading')}</span>
	<div class="my-5">
		<Input bind:value={nameDraft} maxLength={LENGTH_CAP} />
		<span class="text-caption leading-caption text-neutral-400"
			>{t('charCount', { count: nameDraft.length, max: LENGTH_CAP })}</span
		>
	</div>
	<div class="flex justify-between gap-3">
		<Button class="flex-1" variant="outlined" onclick={onCancel}>{t('cancel')}</Button>
		<Button class="flex-1" onclick={handleConfirm}>{t('confirm')}</Button>
	</div>
</div>
