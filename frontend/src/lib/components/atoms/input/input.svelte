<script lang="ts">
    import { cn } from "../../../../utils.js";

    import { inputVariants, type Props } from "./index";

    interface InputProps {
        class?: Props["class"];
        value?: Props["value"];
        state?: Props["state"];
        readonly?: Props["readonly"];
        [key: string]: unknown;
    }

    let {
        class: className = undefined,
        value = $bindable(undefined),
        state = "default",
        readonly = undefined,
        ...rest
    }: InputProps = $props();
</script>

<input
    class={cn(inputVariants({ state }), className)}
    bind:value
    {readonly}
    {...rest}
/>
