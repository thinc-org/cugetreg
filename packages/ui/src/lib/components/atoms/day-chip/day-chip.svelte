<script lang="ts">
    import { cn } from "@cugetreg/utils";

    import { Chip } from "../chip/index.ts";
    import { chipVariants, type Day } from "./index.ts";

    interface Props {
        class?: string | undefined | null;
        day: Day;
        closable?: boolean;
        onClose?: () => void;
        [key: string]: unknown;
    }

    let {
        class: className = undefined,
        day,
        closable = false,
        onClose = () => {},
        ...rest
    }: Props = $props();

    const label = {
        MO: "จันทร์",
        TU: "อังคาร",
        WE: "พุธ",
        TH: "พฤหัส",
        FR: "ศุกร์",
        SA: "เสาร์",
        SU: "อาทิตย์",
    };
</script>

<Chip
    class={cn(chipVariants({ day, className }))}
    {closable}
    {onClose}
    {...rest}
>
    {#if day}
        {label[day]}
    {/if}
</Chip>
