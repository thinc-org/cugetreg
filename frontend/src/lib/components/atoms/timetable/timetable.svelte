<script lang="ts">
    import { hasConflict } from "./index";
    import type { Day } from "../day-chip";
    import { CourseTimeSlot, type Schedule, type Slot } from "./index";

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
        schedule: Schedule;
        periodPerDay?: number;
        [key: string]: unknown;
    }

    const placeholder: Schedule = {
        MO: Array.from({ length: 12 }),
        TU: Array.from({ length: 12 }),
        WE: Array.from({ length: 12 }),
        TH: Array.from({ length: 12 }),
        FR: Array.from({ length: 12 }),
        SA: Array.from({ length: 12 }),
        SU: Array.from({ length: 12 }),
    };

    const {
        schedule = placeholder,
        periodPerDay = 12,
        ...rest
    }: TimeTableProp = $props();
</script>

{#snippet renderCourseInSlot(slots: Slot[], time: number)}
    {#if Array.isArray(slots[time])}
        #{#each slots[time] as period}
            <CourseTimeSlot
                course={period.course}
                length={period.length}
                conflict={true}
            />
        {/each}
    {:else}
        <CourseTimeSlot
            course={slots[time].course}
            length={slots[time].length}
            conflict={hasConflict(slots, time)}
        />
    {/if}
{/snippet}

<!-- Make grid col depend on periodPerDay -->
<div
    class="grid grid-cols-13 grid-rows-[auto_repeat(5,1fr)] overflow-hidden border border-neutral-200 rounded-lg"
    style="grid-template-columns: repeat({periodPerDay + 1}, minmax(0, 1fr));"
>
    <div class="bg-indigo-50! py-3.5 cell">DAY/TIME</div>
    {#each Array.from({ length: periodPerDay }) as _, i}
        <div class="bg-indigo-50! py-3.5 cell text-[1.5cqw]!">
            {i + 1}
        </div>
    {/each}

    {#each DAYS as day}
        <div class="cell bg-indigo-50! text-[1.5cqw]!">{days[day]}</div>

        {#each Array.from({ length: periodPerDay }) as _, i}
            {#if schedule[day][i]}
                <div class="relative cell aspect-square">
                    {@render renderCourseInSlot(schedule[day], i)}
                </div>
            {:else}
                <div class="relative cell aspect-square"></div>
            {/if}
        {/each}
    {/each}
</div>

<style>
    @reference "../../../../app.css";

    .cell {
        @apply ring-[1px] ring-neutral-200 bg-white flex justify-center text-center items-center font-bold text-[1.2cqw];
    }
</style>
