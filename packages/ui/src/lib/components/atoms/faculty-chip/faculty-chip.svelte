<script lang="ts">
	import { cn } from '@cugetreg/utils';
	import { FACULTIES, type FacultyId } from '@cugetreg/utils/faculty';

	import { chipVariants } from './index.js';

	import { Chip } from '../chip/index.js';

	interface Props {
		faculty: FacultyId;
		class?: string | undefined | null;
		closable?: boolean;
		onClose?: () => void;
		[key: string]: unknown;
	}

	let {
		faculty,
		class: className = undefined,
		closable = false,
		onClose = () => {},
		...rest
	}: Props = $props();
</script>

<Chip class={cn(chipVariants({ faculty, className }))} {closable} {onClose} {...rest}>
	{FACULTIES[faculty].th_short}
</Chip>
