<script lang="ts" generics="Key extends string">
    import type { ClassValue } from "clsx";
    import { cn } from "../../../../utils";
    import { Button } from "../../atoms/button";

    interface ColorPickerProps {
        class?: ClassValue;
        onChange?: (option: string) => void;
        onCancel?: () => void;
        onConfirmSelected?: (option: string) => void;
        options: Record<Key, string>;
        value: Key;
    }

    let {
        class: className = undefined,
        onCancel = () => {},
        onConfirmSelected = () => {},
        onChange = () => {},
        options,
        value = $bindable(),
    }: ColorPickerProps = $props();

    function handleCancel() {
        onCancel();
    }
</script>

<div class={cn(className, "border border-neutral-200 rounded-lg p-5")}>
    <div class="font-bold text-lg">เลือกสีในตาราง</div>

    <div class="grid grid-cols-5 my-5">
        {#each Object.keys(options) as Key[] as option}
            <Button
                variant="solid"
                color="primary"
                class={cn(
                    "aspect-square hover:ring-0 border m-2",
                    options[option],
                    value === option &&
                        "outline-[1.5px]! outline-offset-4 outline-primary",
                    value === option &&
                        "hover:outline-[1.5px]! hover:outline-solid!",
                )}
                onclick={() => (value = option)}
            />
        {/each}
    </div>

    <div class="flex justify-between space-x-5">
        <Button class="flex-1" onclick={handleCancel}>ยกเลิก</Button>
        <Button
            class="flex-1"
            variant="outlined"
            onclick={() => {
                onConfirmSelected(options[value]);
            }}
        >
            เลืิอก
        </Button>
    </div>
</div>
