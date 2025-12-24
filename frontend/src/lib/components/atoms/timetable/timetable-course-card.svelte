<script lang="ts">
    import { type Length } from "./index";
    import { cn } from "../../../../utils";
    import { timeCourseCardVariant } from "./index";
    import type { Course } from "../../molecules/course-card";

    interface CourseTimeSlotProp {
        course: Course;
        length?: Length;
        conflict?: boolean;
    }

    // TODO: Add Location and Section Prop
    // TODO: Add half time
    // TODO: Add customizable color
    // TODO: Add hover + onclick
    const {
        length = 1,
        conflict = false,
        course,
    }: CourseTimeSlotProp = $props();

    const backgroundClassName = $derived(
        conflict ? "bg-red-400/50 border-red-900!" : "",
    );
</script>

<div class={cn(timeCourseCardVariant({ length }), backgroundClassName)}>
    <div class="relative w-full h-full">
        <div
            class="flex flex-col w-full h-full items-center justify-center p-1"
        >
            <span class="flex-1">{course.code}</span>
            <span class="flex-1">{course.name}</span>
            {#if length === 1}
                <span class="flex-1">AR AR</span>
                <span class="flex-1">Sec 10</span>
            {:else}
                <span class="flex-1">AR AR | Sec 10</span>
            {/if}
        </div>
    </div>
</div>
