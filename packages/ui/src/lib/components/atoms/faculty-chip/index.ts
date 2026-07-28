import { tv, type VariantProps } from 'tailwind-variants';

import type { FacultyId } from '@cugetreg/utils/faculty';

export { default as FacultyChip } from './faculty-chip.svelte';

const facultyVariants = {
	'01': 'text-on-surface bg-neutral-100',
	'02': 'text-on-surface bg-neutral-100',
	'20': 'text-on-surface bg-neutral-100',
	'21': 'text-on-engineering bg-engineering',
	'22': 'text-on-arts bg-arts',
	'23': 'text-on-science bg-science',
	'24': 'text-on-politic bg-politic',
	'25': 'text-on-architecture bg-architecture',
	'26': 'text-on-accountancy bg-accountancy',
	'27': 'text-on-education bg-education',
	'28': 'text-on-comm-art bg-comm-art',
	'29': 'text-on-economics bg-economics',
	'30': 'text-on-medicine bg-medicine',
	'31': 'text-on-veterinary bg-veterinary',
	'32': 'text-on-dentistry bg-dentistry',
	'33': 'text-on-pharmacy bg-pharmacy',
	'34': 'text-on-law bg-law',
	'35': 'text-on-fine-arts bg-fine-arts',
	'36': 'text-on-nursing bg-nursing',
	'37': 'text-on-allied-health bg-allied-health',
	'38': 'text-on-psychology bg-psychology',
	'39': 'text-on-sports bg-sports',
	'40': 'text-on-agriculture bg-agriculture',
	'49': 'text-on-surface bg-neutral-100',
	'51': 'text-on-population bg-population',
	'53': 'text-on-public-health bg-public-health',
	'55': 'text-on-surface bg-neutral-100',
	'56': 'text-on-surface bg-neutral-100',
	'58': 'text-on-sasin bg-sasin',
	'63': 'text-on-petroleum bg-petroleum',
	'92': 'text-on-surface bg-neutral-100',
	'99': 'text-on-surface bg-neutral-100'
} satisfies Record<FacultyId, string>;

export const chipVariants = tv({
	variants: {
		faculty: facultyVariants
	}
});

export type Faculty = VariantProps<typeof chipVariants>['faculty'];
