<script lang="ts">
    import {
        SortableList,
        removeItem,
        sortItems,
    } from "@rodrigodagostino/svelte-sortable-list";
    import { cn } from "../../../../utils";
    import { BookMarked, Eye, EyeOff, Equal, Trash2 } from "lucide-svelte";
    import { GenedChip } from "../../atoms/gened-chip";
    import { IconButton } from "../../atoms/icon-button";
    import { Button } from "../../atoms/button";
    import * as Accordion from "../../atoms/accordion";
    import * as Select from "../../molecules/select";

    import type { SelectedCourseData, Course } from ".";
    import type { ClassValue } from "clsx";

    function handleDragEnd(e: SortableList.RootEvents["ondragend"]) {
        const { draggedItemIndex, targetItemIndex, isCanceled } = e;
        if (
            !isCanceled &&
            typeof targetItemIndex === "number" &&
            draggedItemIndex !== targetItemIndex
        )
            courses = sortItems(courses, draggedItemIndex, targetItemIndex);
    }

    function handleRemoveClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const item = target.closest<HTMLLIElement>(".ssl-item");
        const itemIndex = Number(item?.dataset.itemIndex);
        if (!item || itemIndex < 0) return;
        courses = removeItem(courses, itemIndex);
    }

    type SelectedCourseProp = SelectedCourseData & {
        class?: ClassValue;
    };

    let {
        class: className = undefined,
        courses = $bindable(),
    }: SelectedCourseProp = $props();

    const totalCredit = $derived(
        courses.reduce((acc, course) => acc + course.credit, 0),
    );
</script>

<div class={cn(className)}>
    <Accordion.Root class="w-full" type="single">
        <Accordion.Item value="selected-course">
            <Accordion.Trigger class="border-b border-neutral-200">
                <div class="flex">
                    <BookMarked class="mr-2" />
                    <span class="">Selected course</span>
                    <span
                        class="text-xs font-light text-neutral-400 flex items-baseline-last ml-2"
                        >{totalCredit} Credits</span
                    >
                </div>
            </Accordion.Trigger>
            <Accordion.Content>
                <SortableList.Root
                    ondragend={handleDragEnd}
                    hasLockedAxis
                    transition={{
                        duration: 160,
                        easing: "cubic-bezier(0.2, 1, 0.1, 1)",
                    }}
                    gap={0}
                >
                    {#each courses as course, index (course.id)}
                        <SortableList.Item
                            id={course.id.toString()}
                            {index}
                            class="my-0"
                        >
                            <div class="ssl-item-content">
                                {@render selectedCourseItem(course)}
                            </div>
                        </SortableList.Item>
                    {/each}
                </SortableList.Root>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>

{#snippet selectedCourseItem(course: Course)}
    <div
        data-hidden={course.hidden}
        class="
            flex p-1 my-1
            data-[hidden=true]:grayscale-75
            data-[hidden=true]:text-neutral-500
            font-light
        "
    >
        <div class="flex justify-center items-center">
            <IconButton
                class="hover:cursor-pointer bg-transparent"
                onclick={() => (course.hidden = !course.hidden)}
            >
                {#if course.hidden}
                    <EyeOff class="stroke-neutral-500" />
                {:else}
                    <Eye />
                {/if}
            </IconButton>
        </div>
        <div class="flex flex-col flex-1 justify-center">
            <div class="text-[0.6rem]">
                {course.code}
                <GenedChip
                    type="SO"
                    class="text-[0.6rem] px-2 py-0 bg-transparent"
                />
            </div>
            <div class="text-sm">
                {course.name}
            </div>
        </div>
        <div class="flex items-center">
            <div class="flex w-15">
                <Select.Root type="single" bind:value={course.selectedSection}>
                    <Select.Trigger showArrow={false} class="rounded-sm p-0">
                        <div
                            class="w-full h-full flex items-center justify-center text-sm"
                        >
                            Sec {course.selectedSection}
                        </div>
                    </Select.Trigger>
                    <Select.Content role="listbox">
                        <Select.Group>
                            {#each course.sections as section}
                                <Select.Item
                                    value={`${section}`}
                                    label={`Sec ${section}`}
                                    aria-label={`Sec ${section}`}
                                    role="option"
                                />
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>
            <div class="flex items-center justify-center">
                <Button
                    class="aspect-square hover:ring-0 border rounded-lg m-2"
                />
            </div>
            <div class="flex">
                <SortableList.ItemRemove onclick={handleRemoveClick}>
                    <IconButton
                        class="hover:cursor-pointer size-7 bg-transparent"
                    >
                        <Trash2
                            class="data-[hidden=true]:text-neutral-500 mx-1"
                        />
                    </IconButton>
                </SortableList.ItemRemove>
                <SortableList.ItemHandle>
                    <IconButton
                        class="hover:cursor-pointer size-7 bg-transparent"
                    >
                        <Equal
                            class="data-[hidden=true]:text-neutral-500  mx-1"
                        />
                    </IconButton>
                </SortableList.ItemHandle>
            </div>
        </div>
    </div>
{/snippet}

<style>
    :global(.ssl-ghost) {
        opacity: 0;
    }
</style>
