<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import * as Select from "../../molecules/select";
    import { IconButton } from "../../atoms/icon-button";
    import { type Icon, Ellipsis, PenLine, Copy, Plus, Pin, Trash } from "@lucide/svelte";
    import { cn } from "../../../../utils";
    import type { ClassValue } from "clsx"


    interface Option {
        icon: typeof Icon;
        label: string;
        onclick: () => void;
        danger?: boolean;
    }

    interface EditScheduleProps {
        class?: ClassValue;
        currentSchedule: string;
        onRename: () => void;
        onDuplicate: () => void;
        onAddSchedule: () => void;
        onPin: () => void;
        onDelete: () => void;
    }

    let {
        class: className = undefined,
        currentSchedule = $bindable(),
        onRename = () => {},
        onDuplicate = () => {},
        onAddSchedule = () => {},
        onPin = () => {},
        onDelete = () => {},
    }: EditScheduleProps = $props();

    const options: Option[] = [
        {
            icon: PenLine,
            label: "แก้ไขชื่้อ",
            onclick: () => onRename()
        },
        {
            icon: Copy,
            label: "ทำสำเนา",
            onclick: () => onDuplicate()
        },
        {
            icon: Plus,
            label: "เพื่มตาราง",
            onclick: () => onAddSchedule()
        },
        {
            icon: Pin,
            label: "ตั้งเป็นตารางหลัก",
            onclick: () => onPin()
        },
        {
            icon: Trash,
            label: "ลบตาราง",
            onclick: () => onDelete(),
            danger: true
        },
    ]
</script>

<div class={cn("flex space-x-2", className)}>
    <Select.Root type="single" bind:value={currentSchedule}>
        <Select.Trigger class="focus:outline-none! focus:ring-0! ">
            {currentSchedule}
        </Select.Trigger>
        <Select.Content>
            <!-- TODO: -->
            <Select.Group>
                {#each [1, 2, 3, 4] as item}
                    <Select.Item
                        value={`Schedule ${item}`}
                        label={`Schedule ${item}`}
                        aria-label={`Schedule ${item}`}
                        role="option"
                    />
                {/each}
            </Select.Group>
        </Select.Content>
    </Select.Root>

    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <IconButton class="hover:cursor-pointer">
                <Ellipsis />
            </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content class="
                border border-neutral-200 m-2 p-1 w-40 rounded-lg bg-surface
            ">
                <DropdownMenu.Group class="space-y-1">
                    {#each options as option}
                        {@const OptionIcon = option.icon}
                        {@const danger = option.danger ?? false}
                        <DropdownMenu.Item aria-label="dropdown">   
                            <div class="flex p-1 rounded-sm hover:bg-neutral-200 hover:cursor-pointer">
                                <OptionIcon size={18} class={danger ? "stroke-on-error-container" : ""}/>
                                <span class={cn(
                                    "ml-2 text-sm font-extralight",
                                    option.danger && "text-on-error-container"
                                    )}
                                >
                                    {option.label}
                                </span>
                            </div>
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
</div>
