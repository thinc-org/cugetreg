<script lang="ts">
    import type { ClassValue } from "clsx";
    import { cn } from "../../../../utils";
    import { Button } from "../../atoms/button";

    interface ColorPickerProps {
        class?: ClassValue;
        onChange?: (option: string) => void;
        onCancel?: () => void;
        onConfirmSelected?: (option: string) => void;
        options: string[];
    }

    const {
        class: className = undefined,
        onCancel = () => {},
        onConfirmSelected = () => {},
        onChange = () => {},
        options,
    }: ColorPickerProps = $props();

    const halfLength = $derived(Math.trunc(options.length / 2));

    let selected = $state(0);

    $effect(() => {
        onChange(options[selected]);
    });
</script>

<div
    class={cn(
        className,
        "border border-neutral-200 rounded-lg p-5 min-w-50 max-w-75",
    )}
>
    <div class="font-bold text-lg">เลือกสีในตาราง</div>

    <div class="flex justify-between mt-2">
        {#each options.slice(0, halfLength) as color, i}
            <Button
                variant="solid"
                color="primary"
                class={cn(
                    "aspect-square hover:ring-0 border m-2",
                    color,
                    i === selected &&
                        "outline-[1.5px]! outline-offset-4 outline-primary",
                    i === selected &&
                        "hover:outline-[1.5px]! hover:outline-solid!",
                )}
                onclick={() => (selected = i)}
            />
        {/each}
    </div>
    <div class="flex justify-between mb-5">
        {#each options.slice(halfLength, options.length) as color, i}
            <Button
                variant="solid"
                color="primary"
                class={cn(
                    "aspect-square hover:ring-0 border m-2",
                    color,
                    i + halfLength === selected &&
                        "outline-[1.5px]! outline-offset-4 outline-primary",
                    i + halfLength === selected &&
                        "hover:outline-[1.5px]! hover:outline-solid!",
                )}
                onclick={() => (selected = i + halfLength)}
            />
        {/each}
    </div>

    <div class="flex justify-between space-x-5">
        <Button class="flex-1" onclick={() => onCancel()}>ยกเลิก</Button>
        <Button
            class="flex-1"
            variant="outlined"
            onclick={() => onConfirmSelected(options[selected])}>เลืิอก</Button
        >
    </div>
</div>
