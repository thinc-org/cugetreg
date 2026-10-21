<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { Button } from '../../atoms/button';

	interface Props {
		scheduleName?: string;
		onCancel?: () => void;
		onConfirm?: () => void;
		variant?: 'overlay' | 'card';
	}

	let { scheduleName, onCancel, onConfirm, variant = 'overlay' }: Props = $props();

	const t = useTranslations(
		defineMessages({
			th: {
				defaultScheduleName: 'ตารางเรียนแสนสนุก',
				title: 'ลบตารางเรียน',
				question: 'คุณต้องการลบ',
				confirmSuffix: 'ใช่หรือไม่',
				cancel: 'ยกเลิก',
				delete: 'ลบตาราง'
			},
			en: {
				defaultScheduleName: 'My fun schedule',
				title: 'Delete schedule',
				question: 'Do you want to delete',
				confirmSuffix: 'this schedule?',
				cancel: 'Cancel',
				delete: 'Delete'
			}
		})
	);

	const displayName = $derived(scheduleName ?? t('defaultScheduleName'));

	const handleCancel = () => {
		onCancel?.();
	};

	const handleConfirm = () => {
		onConfirm?.();
	};

	const wrapperClass = $derived(
		variant === 'overlay'
			? 'fixed inset-0 flex items-center justify-center bg-surface-container-highest/60 p-4'
			: 'w-full flex items-center justify-center p-4'
	);
</script>

<div class={wrapperClass} role="presentation">
	<div
		class="border-surface-container-low bg-surface w-full max-w-md rounded-2xl border-2 px-8 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-title"
		aria-describedby="delete-description"
	>
		<h2 id="delete-title" class="text-h2 text-on-surface font-bold">{t('title')}</h2>
		<p id="delete-description" class="text-body2 text-on-surface/70 mt-4 font-medium">
			{t('question')}<br />
			'{displayName}'<br />
			{t('confirmSuffix')}
		</p>
		<div class="mt-8 flex items-center justify-center gap-4">
			<Button color="neutral" class="h-9 w-32" onclick={handleCancel}>{t('cancel')}</Button>
			<Button color="error" class="h-9 w-32" onclick={handleConfirm}>{t('delete')}</Button>
		</div>
	</div>
</div>
