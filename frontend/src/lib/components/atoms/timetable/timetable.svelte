<script lang="ts">
    import { type TimeTableContext } from "./index";
    import { setContext, type Snippet } from "svelte";

    import { cn } from "../../../../utils";
    import type { ClassValue } from "clsx";

    const DAYS5 = ["MON", "TUE", "WED", "THU", "FRI"];

    interface TimeTableProp {
        periodPerDay?: number;
        startTime: number;
        class?: ClassValue;
        days?: string[];
        children?: Snippet;
    }

    let prop: TimeTableProp = $props();

    let {
        startTime = 6,
        class: className = undefined,
        children,
    }: TimeTableProp = prop;

    let periodPerDay = $derived(prop.periodPerDay ?? 12);
    let days = $derived(prop.days ?? DAYS5);
    let amountOfDays = $derived(prop.days?.length ?? 5);

    setContext<TimeTableContext>("timetable-context", {
        get periodPerDay() {
            return periodPerDay;
        },
        get amountOfDays() {
            return amountOfDays;
        },
    });
</script>

<div
    class={cn("grid border border-neutral-200", className)}
    style="
        grid-template-columns: repeat({periodPerDay + 1}, minmax(0, 1fr));
        grid-template-rows: auto repeat({amountOfDays + 1});
    "
>
    <div class="bg-indigo-50! py-3.5 cell border-r border-b border-neutral-200">
        วัน/เวลา
    </div>
    <div
        class="grid divide-x divide-neutral-200"
        style="
            grid-column: span {periodPerDay} / span {periodPerDay};
            grid-template-columns: repeat({periodPerDay}, minmax(0, 1fr));
        "
    >
        {#each Array.from({ length: periodPerDay }) as _, i}
            <div
                class="
                    bg-indigo-50! px-2 py-3.5 cell text-right! items-end! justify-end!
                    @container-[size]
                "
            >
                <span class="text-[80cqh]">
                    {i + startTime}
                </span>
            </div>
        {/each}
    </div>

    <div
        class="grid divide-y divide-neutral-200"
        style="grid-row: span {amountOfDays} / span {amountOfDays}"
    >
        {#each days as day}
            <div class="cell bg-indigo-50! aspect-square @container-[size]">
                <span class="text">
                    {day}
                </span>
            </div>
        {/each}
    </div>

    <div
        class="relative"
        style="
            grid-row: span {amountOfDays} / span {amountOfDays};
            grid-column: span {periodPerDay} / span {periodPerDay};
        "
    >
        <div
            class="grid grid-cols-5"
            style="
                grid-template-columns: repeat({periodPerDay}, minmax(0, 1fr));
                grid-template-rows: repeat({amountOfDays}, minmax(0, 1fr));
            "
        >
            {#each Array.from({ length: periodPerDay * amountOfDays }) as _}
                <div class="relative cell aspect-square"></div>
            {/each}
        </div>

        <div class="absolute top-0 left-0 w-full h-full">
            <div class="relative w-full h-full">
                {@render children?.()}
            </div>
        </div>
    </div>
</div>

<style>
    @reference "../../../../app.css";

    .cell {
        @apply ring-[1px] ring-neutral-200 bg-white flex justify-center text-center items-center;
        @apply text-sm;
    }
</style>
