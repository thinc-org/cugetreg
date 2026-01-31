<script lang="ts">
	import { Pencil, User } from '@lucide/svelte';

	import { IconButton } from '../../atoms/icon-button';
	import { GoogleMark } from '../../logo/vendor';

	interface Props {
		name?: string;
		id?: string;
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
		id = '6534344444',
		username = '6534344444',
		firstName = 'Wanrudee',
		lastName = 'Kittichaiyakorn',
		faculty = 'วิศวกรรมศาสตร์',
		department = '-',
		accountProvider = 'Google',
		accountEmail = '6534344444@student.chula.ac.th',
		onEdit
	}: Props = $props();

	const infoItems = [
		{ label: 'username', value: username },
		{ label: 'ชื่อจริง', value: firstName },
		{ label: 'นามสกุล', value: lastName },
		{ label: 'คณะ', value: faculty },
		{ label: 'ภาควิชา', value: department }
	];
</script>

<div class="bg-surface-container-lowest text-on-surface w-full max-w-md rounded-2xl p-7">
	<div class="flex flex-col gap-2 pb-6">
		<p class="text-h2 font-bold">{name}</p>
		<p class="text-body2 text-on-surface/60">ID: {id}</p>
	</div>

	<div>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<User size="18" strokeWidth="2.5" color="#1F2430" />
				<p class="text-h3 font-bold">ข้อมูลส่วนตัว</p>
			</div>
			<IconButton variant="ghost" onclick={() => onEdit?.()}>
				<Pencil size="18" strokeWidth="2.5" />
			</IconButton>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">username</p>
				<p class="text-body2 font-medium">{username}</p>
			</div>
			<div></div>
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">ชื่อจริง</p>
				<p class="text-body2 font-medium">{firstName}</p>
			</div>
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">นามสกุล</p>
				<p class="text-body2 font-medium">{lastName}</p>
			</div>
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">คณะ</p>
				<p class="text-body2 font-medium">{faculty}</p>
			</div>
			<div class="flex flex-col gap-1">
				<p class="text-caption text-on-surface/50 tracking-wide uppercase">ภาควิชา</p>
				<p class="text-body2 font-medium">{department}</p>
			</div>
		</div>
	</div>

	<div class="mt-4 pt-6">
		<div class="flex items-center gap-3">
			<User size="18" strokeWidth="2.5" color="#1F2430" />
			<p class="text-h3 font-bold">เชื่อมต่อบัญชี</p>
		</div>
		<div
			class="border-surface-container-low bg-surface-container-low mt-4 flex items-center gap-3 rounded-xl border px-4 py-3"
		>
			<div class="flex h-8 w-8 items-center justify-center">
				<GoogleMark aria-label={accountProvider} />
			</div>
			<p class="text-body2 font-medium">{accountEmail}</p>
		</div>
	</div>
</div>
