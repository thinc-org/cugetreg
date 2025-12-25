<script lang="ts">
    import { type TimeTableContext } from "./index";
    import type { Day } from "../day-chip";
    import { setContext, type Snippet } from "svelte";

    // TODO: Add period label
    const DAYS: NonNullable<Day>[] = ["MO", "TU", "WE", "TH", "FR"];
    const days: Record<NonNullable<Day>, string> = {
        MO: "MON",
        TU: "TUE",
        WE: "WED",
        TH: "THU",
        FR: "FRI",
        SA: "SAT",
        SU: "SUN",
    };

    interface TimeTableProp {
        periodPerDay?: number;
        includeSatSun?: boolean;
        children?: Snippet;
        [key: string]: unknown;
    }

    const {
        periodPerDay = 12,
        includeSatSun = false,
        children,
        ...rest
    }: TimeTableProp = $props();

    const amountOfDays = $derived(includeSatSun ? 7 : 5);

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
    class="grid border border-neutral-200"
    style="
        grid-template-columns: repeat({periodPerDay + 1}, minmax(0, 1fr));
        grid-template-rows: auto repeat({amountOfDays + 1});
    "
>
    <div class="bg-indigo-50! py-3.5 cell border-r border-b border-neutral-200">
        DAY/TIME
    </div>
    <div
        class="grid divide-x divide-neutral-200"
        style="
            grid-column: span {periodPerDay} / span {periodPerDay};
            grid-template-columns: repeat({periodPerDay}, minmax(0, 1fr));
        "
    >
        {#each Array.from({ length: periodPerDay }) as _, i}
            <div class="bg-indigo-50! py-3.5 cell text-[1.2cqw]!">
                {i + 1}
            </div>
        {/each}
    </div>

    <div
        class="grid divide-y divide-neutral-200"
        style="grid-row: span {amountOfDays} / span {amountOfDays}"
    >
        {#each DAYS as day}
            <div class="cell bg-indigo-50! text-[1.2cqw]! aspect-square">
                {days[day]}
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
        @apply ring-[1px] ring-neutral-200 bg-white flex justify-center text-center items-center font-bold text-[1.2cqw];
    }
</style>
