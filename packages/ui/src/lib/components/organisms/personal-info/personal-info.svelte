<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { Pencil, User } from '@lucide/svelte';

	import { IconButton } from '../../atoms/icon-button';
	import { GoogleMark } from '../../logo/vendor';

	interface Props {
		name?: string;
		username?: string;
		firstName?: string;
		lastName?: string;
		faculty?: string;
		department?: string;
		accountProvider?: string;
		accountEmail?: string;
		onEdit?: () => void;
	}

	let {
		name = 'Wanrudee Kittichaiyakorn',
		username = '6534344444',
		firstName = 'Wanrudee',
		lastName = 'Kittichaiyakorn',
		faculty = 'วิศวกรรมศาสตร์',
		department = '',
		accountProvider = 'Google',
		accountEmail = '6534344444@student.chula.ac.th',
		onEdit
	}: Props = $props();

	const t = useTranslations(
		defineMessages({
			th: {
				username: 'username',
				firstName: 'ชื่อจริง',
				lastName: 'นามสกุล',
				faculty: 'คณะ',
				department: 'ภาควิชา',
				personalInfo: 'ข้อมูลส่วนตัว',
				edit: 'แก้ไขข้อมูลส่วนตัว',
				linkedAccount: 'เชื่อมต่อบัญชี'
			},
			en: {
				username: 'Username',
				firstName: 'First name',
				lastName: 'Last name',
				faculty: 'Faculty',
				department: 'Department',
				personalInfo: 'Personal info',
				edit: 'Edit personal info',
				linkedAccount: 'Linked account'
			}
		})
	);

	const id = $derived(username);

	const infoItems = $derived([
		{ label: t('username'), value: username },
		{ label: t('firstName'), value: firstName },
		{ label: t('lastName'), value: lastName },
		{ label: t('faculty'), value: faculty },
		{ label: t('department'), value: department }
	]);
</script>

<div
	class="bg-surface-container-lowest text-on-surface w-full max-w-md rounded-2xl p-6 md:max-w-xl lg:max-w-lg"
>
	<div class="flex flex-col gap-2 pb-6">
		<p class="text-h2 font-bold">{name}</p>
		<p class="text-body2 text-on-surface/60">ID: {id}</p>
	</div>

	<div>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<User size="18" strokeWidth="2.5" color="#1F2430" />
				<p class="text-h3 font-bold">{t('personalInfo')}</p>
			</div>
			<IconButton variant="ghost" aria-label={t('edit')} onclick={() => onEdit?.()}>
				<Pencil size="18" strokeWidth="2.5" />
			</IconButton>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-2">
			{#each infoItems as infoItem, idx (idx)}
				<div class="flex flex-col gap-1">
					<p class="text-caption text-on-surface/50 tracking-wide uppercase">{infoItem.label}</p>
					<p class="text-body2 font-medium">{infoItem.value || '-'}</p>
				</div>
				{#if idx === 0}
					<div></div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="mt-4 pt-6">
		<div class="flex items-center gap-3">
			<User size="18" strokeWidth="2.5" color="#1F2430" />
			<p class="text-h3 font-bold">{t('linkedAccount')}</p>
		</div>
		<div
			class="border-surface-container-low bg-surface-container-low mt-4 flex w-full items-center gap-1 rounded-xl border px-4 py-3"
		>
			<div class="flex h-8 w-8 items-center justify-center">
				<GoogleMark aria-label={accountProvider} />
			</div>
			<p class="text-body2 font-medium">{accountEmail}</p>
		</div>
	</div>
</div>
