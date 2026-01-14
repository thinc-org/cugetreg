<script lang="ts">
    import { Button as ButtonPrimitive } from "bits-ui";
    import type { Snippet } from "svelte";

    import { cn } from "@cugetreg/utils";

    import { buttonVariants, type Props } from "./index.js";

    interface IconButtonProps {
        class?: Props["class"];
        variant?: Props["variant"];
        size?: Props["size"];
        color?: Props["color"];
        children?: Snippet;
        [key: string]: unknown;
    }

    let {
        class: className = undefined,
        variant = "solid",
        size = "default",
        color = "primary",
        builders = [],
        children,
        ...rest
    }: IconButtonProps = $props();
</script>

<ButtonPrimitive.Root
    class={cn(buttonVariants({ variant, size, color }), className)}
    type="button"
    {...rest}
>
    {@render children?.()}
</ButtonPrimitive.Root>
