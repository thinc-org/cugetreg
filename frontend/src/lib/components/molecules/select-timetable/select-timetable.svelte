<script lang="ts">
    import { Menu } from "lucide-svelte";

    interface SelectTimetableProp {
        options: string[],
        value?: string,
    }     

    const placeholder = [
        "ปี 2 เทอม 1",
        "ปี 2 เทอม 2",
        "ปี 2 ฤดูร้อน"
    ]

    let {
        options = placeholder,
        value = $bindable(),
    }: SelectTimetableProp = $props();
</script>

<div class="flex">
    <div class="mx-1 flex justify-center items-center scale-75">
        <Menu />
    </div>
    <div class="flex-1">
        <span class="text-xs text-neutral-400">
            คุณกำลังเปลี่ยนตารางเรียน...
        </span>
        <div class="flex gap-2.5">
            <select class="flex-3 border border-primary rounded-lg p-1 focus:outline-none text-primary" bind:value={value}>
                {#each options as option}
                    <option value={option}>{option}</option>
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
