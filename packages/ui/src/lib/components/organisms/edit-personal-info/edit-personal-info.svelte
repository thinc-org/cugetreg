<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { Button } from '../../atoms/button';
	import { Input } from '../../atoms/input';
	import { GoogleMark } from '../../logo/vendor';

	interface Props {
		username?: string;
		firstName?: string;
		lastName?: string;
		faculty?: string;
		department?: string;
		accountProvider?: string;
		accountEmail?: string;
		onCancel?: () => void;
		onConfirm?: () => void;
	}

	let {
		username = '6534344444',
		firstName = 'Wanrudee',
		lastName = 'Kittichaiyakorn',
		faculty = 'วิศวกรรมศาสตร์',
		department = $bindable(''),
		accountProvider = 'Google',
		accountEmail = '6534344444@student.chula.ac.th',
		onCancel,
		onConfirm
	}: Props = $props();

	const t = useTranslations(
		defineMessages({
			th: {
				heading: 'แก้ไขข้อมูลส่วนตัว',
				username: 'username',
				firstName: 'ชื่อจริง',
				lastName: 'นามสกุล',
				faculty: 'คณะ',
				department: 'ภาควิชา',
				departmentPlaceholder: 'ใส่รายชื่อภาควิชา...',
				linkedAccount: 'เชื่อมต่อบัญชี',
				cancel: 'ยกเลิก',
				confirm: 'ยืนยัน'
			},
			en: {
				heading: 'Edit personal info',
				username: 'Username',
				firstName: 'First name',
				lastName: 'Last name',
				faculty: 'Faculty',
				department: 'Department',
				departmentPlaceholder: 'Enter department...',
				linkedAccount: 'Linked account',
				cancel: 'Cancel',
				confirm: 'Confirm'
			}
		})
	);
</script>

<div
	class="border-surface-container-low bg-surface-container-lowest text-on-surface w-full max-w-md rounded-2xl border p-7"
>
	<div class="flex flex-col gap-1 pb-5 text-center">
		<p class="text-h3 font-bold">{t('heading')}</p>
	</div>

	<div class="flex flex-col gap-3">
		<div class="flex flex-col gap-1">
			<p class="text-caption text-on-surface/50 tracking-wide uppercase">{t('username')}</p>
			<p class="text-body2 font-medium">{username}</p>
		</div>
		<div class="grid grid-cols-2 gap-x-6 gap-y-4">
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">{t('firstName')}</p>
				<p class="text-body2 font-medium">{firstName}</p>
			</div>
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">{t('lastName')}</p>
				<p class="text-body2 font-medium">{lastName}</p>
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<p class="text-caption text-on-surface/50 tracking-wide uppercase">{t('faculty')}</p>
			<p class="text-body2 font-medium">{faculty}</p>
		</div>

		<div class="flex flex-col gap-2">
			<p class="text-body2 font-semibold">{t('department')}</p>
			<Input
				placeholder={t('departmentPlaceholder')}
				class="bg-surface-container-low h-12"
				value={department}
				oninput={(e: Event) => (department = (e.currentTarget as HTMLInputElement).value)}
			/>
		</div>
	</div>

	<div class="mt-4 pt-4">
		<p class="text-body2 text-on-surface/60">{t('linkedAccount')}</p>
		<div
			class="border-surface-container-low bg-surface-container-low mt-3 flex items-center gap-3 rounded-xl border px-4 py-3"
		>
			<div class="flex h-8 w-8 items-center justify-center">
				<GoogleMark aria-label={accountProvider} />
			</div>
			<p class="text-body2 font-medium">{accountEmail}</p>
		</div>
	</div>

	<div class="mt-6 flex w-full items-center justify-center gap-4">
		<Button
			color="neutral"
			class="bg-surface-container text-on-surface/70 h-10 flex-1"
			onclick={() => onCancel?.()}
		>
			{t('cancel')}
		</Button>
		<Button class="h-10 flex-1" onclick={() => onConfirm?.()}>{t('confirm')}</Button>
	</div>
</div>
