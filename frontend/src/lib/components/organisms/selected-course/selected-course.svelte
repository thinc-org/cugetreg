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
    import { ColorPicker } from "../../molecules/colorpicker";
    import * as Accordion from "../../atoms/accordion";
    import * as Select from "../../molecules/select";

    import type { ClassValue } from "clsx";
    import type {
        ColorVariant,
        CourseSchedule,
        ScheduleData,
    } from "../../../../types";
    import { courseColorVariants } from "../../../../constants";

    function handleDragEnd(e: SortableList.RootEvents["ondragend"]) {
        const { draggedItemIndex, targetItemIndex, isCanceled } = e;
        if (
            !isCanceled &&
            typeof targetItemIndex === "number" &&
            draggedItemIndex !== targetItemIndex
        )
            schedule = sortItems(schedule, draggedItemIndex, targetItemIndex);
    }

    function handleRemoveClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const item = target.closest<HTMLLIElement>(".ssl-item");
        const itemIndex = Number(item?.dataset.itemIndex);
        if (!item || itemIndex < 0) return;
        schedule = removeItem(schedule, itemIndex);
    }

    interface SelectedCourseProp {
        class?: ClassValue;
        schedule: ScheduleData;
    }

    let {
        class: className = undefined,
        schedule = $bindable(),
    }: SelectedCourseProp = $props();

    const totalCredit = $derived(
        schedule.reduce(
            (acc, course) => acc + (course.hidden ? 0 : course.course.credit),
            0,
        ),
    );

    let showChangeColorModal = $state(false);
    let currentColorVariant = $state<ColorVariant>("neutral");
    let initialColorVariant = $state<ColorVariant>("neutral");
    let changeColorFor = $state<number | undefined>();
    let modalPosition = $state({
        x: 0,
        y: 0,
    });

    $effect(() => {
        if (changeColorFor) {
            const index = schedule.findIndex((x) => x.id === changeColorFor);
            schedule[index].colorVariant = currentColorVariant;
        }
    });
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape" && showChangeColorModal) {
            showChangeColorModal = false;
        }
    }}
/>

<div class={cn(className)}>
    <Accordion.Root class="w-full" type="single" value={"selected-course"}>
        <Accordion.Item value="selected-course">
            <Accordion.Trigger class="border-b border-neutral-200">
                <div class="flex">
                    <BookMarked class="mr-2" />
                    <span class="">วิชาที่เลือก</span>
                    <span
                        class="text-xs font-light text-neutral-400 flex items-baseline-last ml-2"
                        >{totalCredit} หน่วยกิต</span
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
                    class="grow overflow-y-scroll max-h-[40vh]"
                >
                    {#each schedule as course, index (course.id)}
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
                <div class="px-2">
                    <Button class="w-full" color="neutral">
                        ค้นหาวิชาเรียน
                    </Button>
                </div>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
    {#if showChangeColorModal}
        {@render changeColorModal()}
    {/if}
</div>

{#snippet selectedCourseItem(course: CourseSchedule)}
    <div
        data-hidden={course.hidden}
        class="
            flex p-1 my-1
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
        <div class="flex flex-col flex-1 overflow-hidden justify-center">
            <div class="flex text-[0.6rem] flex-nowrap">
                {course.course.code}
                {#each course.course.gened as gened}
                    <GenedChip
                        type={gened}
                        class="text-[0.6rem] mx-1 px-2 py-0 bg-transparent"
                    />
                {/each}
            </div>
            <div class="text-sm truncate">
                {course.course.name}
            </div>
        </div>
        <div class="flex items-center">
            <div class="flex text-sm w-12">
                <Select.Root
                    type="single"
                    bind:value={
                        () => String(course.selectedSection),
                        (v) => (course.selectedSection = Number(v))
                    }
                >
                    <Select.Trigger
                        showArrow={false}
                        class={cn(
                            "rounded-sm p-0",
                            course.conflicted &&
                                "bg-red-300 border-red-800 text-red-800",
                        )}
                    >
                        <div
                            class="w-full h-full flex items-center justify-center text-xs"
                        >
                            เซค {course.selectedSection}
                        </div>
                    </Select.Trigger>
                    <Select.Content role="listbox">
                        <Select.Group>
                            {#each Object.keys(course.course.sections) as section}
                                <Select.Item
                                    value={`${section}`}
                                    label={`เซค ${section}`}
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
                    class={cn(
                        "aspect-square hover:ring-0 border rounded-lg m-2",
                        courseColorVariants[course.colorVariant ?? "neutral"],
                    )}
                    onclick={(e: MouseEvent) => {
                        modalPosition.x = e.clientX;
                        modalPosition.y = e.clientY;
                        changeColorFor = course.id;
                        showChangeColorModal = true;
                        initialColorVariant = course.colorVariant ?? "neutral";
                        currentColorVariant = course.colorVariant ?? "neutral";
                    }}
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

{#snippet changeColorModal()}
    <div
        class="fixed z-50 h-screen w-screen top-0 left-0"
        role="button"
        tabindex="0"
        onclick={() => {
            showChangeColorModal = false;
        }}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                showChangeColorModal = false;
            }
        }}
    >
        <div
            class="fixed z-60"
            style="top: {modalPosition.y}px; left: {modalPosition.x}px;"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                    showChangeColorModal = false;
                }
            }}
            role="dialog"
            tabindex="0"
        >
            <ColorPicker
                class="bg-surface"
                options={courseColorVariants}
                bind:value={currentColorVariant}
                onCancel={() => {
                    currentColorVariant = initialColorVariant;
                    showChangeColorModal = false;
                }}
                onConfirmSelected={() => {
                    showChangeColorModal = false;
                }}
            />
        </div>
    </div>
{/snippet}

<style>
    :global(.ssl-ghost) {
        opacity: 0;
    }
</style>
