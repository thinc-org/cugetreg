<script lang="ts">
	import { Button } from '../../atoms/button';

	interface Props {
		onCancel?: () => void;
		onConfirm?: () => void;
		variant?: 'overlay' | 'card';
		loading?: boolean;
	}

	let { onCancel, onConfirm, variant = 'overlay', loading = false }: Props = $props();

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
		aria-labelledby="delete-review-title"
		aria-describedby="delete-review-description"
	>
		<h2 id="delete-review-title" class="text-h2 text-on-surface font-bold">ลบรีวิวนี้</h2>
		<p id="delete-review-description" class="text-body2 text-on-surface/70 mt-4 font-medium">
			คุณต้องการลบรีวิวนี้<br />
			ใช่หรือไม่
		</p>
		<div class="mt-8 flex items-center justify-center gap-4">
			<Button color="neutral" class="h-9 w-32" onclick={handleCancel} disabled={loading}>
				ยกเลิก
			</Button>
			<Button color="error" class="h-9 w-32" onclick={handleConfirm} disabled={loading}>
				{loading ? 'กำลังลบ...' : 'ลบรีวิว'}
			</Button>
		</div>
	</div>
</div>
