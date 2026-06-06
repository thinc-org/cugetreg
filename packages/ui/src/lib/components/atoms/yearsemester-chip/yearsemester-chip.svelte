<script lang="ts">
    import { cn } from '@cugetreg/utils';
    import { chipVariants } from './index.js'; 
    import { Chip } from '../chip/index.js';

    export type Semester = 'FIRST' | 'SECOND' | 'SUMMER';

    interface Props {
        class?: string | undefined | null;
        year: number;
        semester: Semester;
        closable?: boolean;
        onClose?: () => void;
        [key: string]: unknown;
    }

    let {
        class: className = undefined,
        year,
        semester,
        closable = false,
        onClose = () => {},
        ...rest
    }: Props = $props();

    const semesterLabel = {
        FIRST: 'ภาคต้น',
        SECOND: 'ภาคปลาย',
        SUMMER: 'ภาคฤดูร้อน'
    };
</script>

<Chip class={cn(chipVariants({ className }))} {closable} {onClose} {...rest}>
    {#if year && semester}
        {year} / {semesterLabel[semester]}
    {/if}
</Chip>