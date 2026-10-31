<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { Button } from '../../atoms/button';

	interface LoginPopupProp {
		onCancel?: () => void;
		onLogin?: () => void;
	}

	const { onCancel, onLogin }: LoginPopupProp = $props();

	const t = useTranslations(
		defineMessages({
			th: {
				heading: 'เข้าสู่ระบบเพื่อดำเนินการต่อ',
				body: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อเพื่อรับประสบการณ์การใช้งานอย่างเต็มรูปแบบ',
				cancel: 'ยกเลิก',
				login: 'เข้าสู่ระบบ'
			},
			en: {
				heading: 'Log in to continue',
				body: 'Please log in to continue and get the full experience',
				cancel: 'Cancel',
				login: 'Log in'
			}
		})
	);
</script>

<div class="bg-surface flex w-115 flex-col gap-6 rounded-xl border border-[#d6d7e1] p-12">
	<h1 class="text-h2 leading-h2 text-primary text-center font-medium tracking-[0.15px]">
		{t('heading')}
	</h1>

	<span class="text-center">
		{t('body')}
	</span>

	<div class="flex w-full gap-6">
		<Button variant="solid" size="default" color="neutral" class="w-full" onclick={onCancel}
			>{t('cancel')}</Button
		>
		<Button variant="solid" size="default" color="primary" class="w-full" onclick={onLogin}
			>{t('login')}</Button
		>
	</div>
</div>
