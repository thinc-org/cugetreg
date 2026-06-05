<script lang="ts">
    import { cn } from '@cugetreg/utils';
    import { chipVariants, type Type } from './index.js'; 
    import { Chip } from '../chip/index.js';

    interface Props {
        class?: string | undefined | null;
        type: Type;
        closable?: boolean;
        onClose?: () => void;
        [key: string]: unknown;
    }

    let {
        class: className = undefined,
        type,
        closable = false,
        onClose = () => {},
        ...rest
    }: Props = $props();

    const label = {
        S: 'ทวิภาค',
        I: 'นานาชาติ',
        T: 'ตรีภาค'
    };
</script>

<Chip class={cn(chipVariants({ type, className }))} {closable} {onClose} {...rest}>
    {#if type}
        {label[type]}
    {/if}
</Chip>