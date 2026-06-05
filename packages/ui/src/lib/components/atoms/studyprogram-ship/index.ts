import { tv, type VariantProps } from 'tailwind-variants';
export { default as StudyProgramChip } from './studyprogram-chip.svelte';

export const chipVariants = tv({
    base: 'border border-[#4A4B57] text-[#4A4B57] bg-transparent rounded-full px-3 py-1', 
    variants: {
        type: {
            S: '',
            I: '', 
            T: ''
        }
    }
});

export type Type = VariantProps<typeof chipVariants>['type'];