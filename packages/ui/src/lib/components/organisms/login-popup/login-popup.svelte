<script lang="ts">
	import { Button } from '../../atoms/button';

	interface LoginPopupProp {
		onCancel?: () => void;
		onLogin?: () => void;
	}

	const { onCancel, onLogin }: LoginPopupProp = $props();
</script>

<div class="bg-surface flex w-115 flex-col gap-6 rounded-xl border border-[#d6d7e1] p-12">
	<h1 class="text-h2 leading-h2 text-primary text-center font-medium tracking-[0.15px]">
		เข้าสู่ระบบเพื่อดำเนินการต่อ
	</h1>

	<div class="flex w-full gap-6">
		<Button variant="solid" size="default" color="neutral" class="w-full" onclick={onCancel}
			>ยกเลิก</Button
		>
		<Button variant="solid" size="default" color="primary" class="w-full" onclick={onLogin}
			>เข้าสู่ระบบ</Button
		>
	</div>
</div>
