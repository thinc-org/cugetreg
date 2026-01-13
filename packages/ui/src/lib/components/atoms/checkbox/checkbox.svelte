<script lang="ts">
    import {
        Checkbox as CheckboxPrimitive,
        Label,
        type CheckboxRootProps,
    } from "bits-ui";
    import { Check } from "@lucide/svelte";
    import { cn } from "@cugetreg/utils";

    interface Props {
        class?: CheckboxRootProps["class"];
        checked?: CheckboxRootProps["checked"];
        label?: string | undefined | null;
        [key: string]: unknown;
    }

    let {
        class: className = undefined,
        checked = $bindable(false),
        label = undefined,
        ...rest
    }: Props = $props();
</script>

<div class="flex items-center space-x-2 p-1">
    <CheckboxPrimitive.Root
        class={cn(
            "border-on-surface-placeholder ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-neutral-white peer box-content h-4 w-4 shrink-0 rounded-sm border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 hover:cursor-pointer",
            className,
        )}
        bind:checked
        {...rest}
    >
        {#snippet children({ checked })}
            {#if checked}
                <Check class="h-4 w-4" />
            {/if}
        {/snippet}
    </CheckboxPrimitive.Root>
    {#if label}
        <Label.Root
            id="terms-label"
            for="terms"
            class="text-button2 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {label}
        </Label.Root>
    {/if}
</div>
