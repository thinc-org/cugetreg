<script lang="ts">
    import type { ClassValue } from "clsx"
    import { Menu } from "lucide-svelte";
    import { cn } from "../../../../utils";
    import type { ScheduleList, ScheduleListItem } from "../../../../types"
    import { mockScheduleList } from "../../../../mockData"

    interface SelectTimetableProp {
        options?: ScheduleList,
        value?: ScheduleListItem,
        class?: ClassValue
    }     

    let {
        options = mockScheduleList,
        value = $bindable(),
        class: className = undefined
    }: SelectTimetableProp = $props();
</script>

<div class={cn("flex", className)}>
    <div class="ml-1 mr-5 flex justify-center items-center">
        <Menu />
    </div>
    <div class="flex-1">
        <span class="text-xs text-neutral-400">
            คุณกำลังเปลี่ยนตารางเรียน...
        </span>
        <div class="flex gap-2.5">
            <select class="flex-3 border border-primary rounded-lg p-1 focus:outline-none text-primary" bind:value={value}>
                {#each options as item}
                    <option value={item}>{item.name}</option>
                {/each}
            </select>

            <div class="right text-xs truncate">
                ทวิภาค 2566 / ภาคต้น
            </div>
        </div>
    </div>
</div>

<style>
    .right{
        border: 1px solid black;
        border-radius: 8px;
        padding: 5px;

    }
</style>
