<script lang="ts">
  import { resolve } from '$app/paths';
  import { getUserCartStore, useCartActions } from '$lib/stores/user-cart';

  import { ChevronDown, Equal, Eye, EyeOff, Trash2 } from '@lucide/svelte';
  import {
    SortableList,
    sortItems,
  } from '@rodrigodagostino/svelte-sortable-list';
  import type { ClassValue } from 'clsx';
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
  import { IconButton } from '@cugetreg/ui/atoms/icon-button';
  import { ColorPicker } from '@cugetreg/ui/molecules/colorpicker';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { cn } from '@cugetreg/utils';
  import { courseColorVariants } from '@cugetreg/utils/constants';
  import type { ColorVariant } from '@cugetreg/utils/types';
  import type { CartItemDetail } from '@cugetreg/zod-schemas/carts-response';

  const userCart = getUserCartStore();
  const { removeCourse, updateCourse } = useCartActions();

  const schedule = $derived($userCart.currentCart?.items ?? []);

  function handleDragEnd(e: SortableList.RootEvents['ondragend']) {
    const { draggedItemIndex, targetItemIndex, isCanceled } = e;
    if (
      !isCanceled &&
      typeof targetItemIndex === 'number' &&
      draggedItemIndex !== targetItemIndex
    ) {
      const newItems = sortItems(schedule, draggedItemIndex, targetItemIndex);
      const movedItem = newItems[targetItemIndex];
      const prevId = newItems[targetItemIndex - 1]?.id;
      const nextId = newItems[targetItemIndex + 1]?.id;

      updateCourse(movedItem.id, { prevId, nextId });
    }
  }

  function handleRemoveClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const item = target.closest<HTMLLIElement>('.ssl-item');
    const itemIndex = Number(item?.dataset.itemIndex);
    if (!item || itemIndex < 0) return;

    removeCourse(schedule[itemIndex].id);
  }

  interface SelectedCourseProp {
    class?: ClassValue;
    variant?: 'simple' | 'detailed' | 'grouped';
    onArrange?: () => void;
    open?: boolean;
    /** Show a divider between the header and the body while expanded. */
    headerDivider?: boolean;
    /** When false, the section can't collapse (no chevron) and stays open. */
    collapsible?: boolean;
  }

  let {
    class: className = undefined,
    variant = 'detailed',
    onArrange,
    open = $bindable(true),
    headerDivider = false,
    collapsible = true,
  }: SelectedCourseProp = $props();

  const totalCredit = $derived(
    (schedule ?? []).reduce(
      (acc, course) => acc + (course.hidden ? 0 : Number(course.course.credit)),
      0,
    ),
  );

  const bodyOpen = $derived(collapsible ? open : true);

  let showChangeColorModal = $state(false);
  let currentColorVariant = $state<ColorVariant>('primary');
  let initialColorVariant = $state<ColorVariant>('primary');
  let changeColorFor = $state<string | undefined>();
  let modalPosition = $state({
    x: 0,
    y: 0,
  });

  const genedCourses = $derived(schedule.filter((c) => c.genEdType !== 'NO'));
  const otherCourses = $derived(schedule.filter((c) => c.genEdType === 'NO'));
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape' && showChangeColorModal) {
      showChangeColorModal = false;
    }
  }}
/>

<div class={cn(className)}>
  {#if variant === 'grouped'}
    <div class="flex flex-col">
      {@render sectionHeader()}

      {#if bodyOpen}
        <div transition:slide={{ duration: 250, easing: cubicOut }}>
          {#if headerDivider}
            <hr class="mb-4 border-t border-neutral-100" />
          {/if}
          {#if genedCourses.length > 0}
            <p class="mb-1 text-sm font-medium text-[#6F7593]">วิชา GenEd</p>
            {#each genedCourses as course (course.id)}
              {@render groupedRow(course)}
            {/each}
          {/if}

          {#if otherCourses.length > 0}
            <p class="mt-4 mb-1 text-sm font-medium text-[#6F7593]">
              วิชาอื่นๆ
            </p>
            {#each otherCourses as course (course.id)}
              {@render groupedRow(course)}
            {/each}
          {/if}

          <Button class="mt-6 w-full" color="neutral" onclick={onArrange}
            >จัดตารางเรียน</Button
          >
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex flex-col">
      {@render sectionHeader()}

      {#if bodyOpen}
        <div transition:slide={{ duration: 250, easing: cubicOut }}>
          {#if headerDivider}
            <hr class="mb-4 border-t border-neutral-100" />
          {/if}
          <SortableList.Root
            ondragend={handleDragEnd}
            hasLockedAxis
            transition={{
              duration: 160,
              easing: 'cubic-bezier(0.2, 1, 0.1, 1)',
            }}
            gap={0}
            class="max-h-[40vh] grow overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {#each schedule as course, index (course.id)}
              <SortableList.Item id={course.id.toString()} {index} class="my-0">
                <div class="ssl-item-content">
                  {@render selectedCourseItem(course)}
                </div>
              </SortableList.Item>
            {/each}
          </SortableList.Root>
          <div class="px-2">
            <Button class="w-full" color="neutral" href={resolve('/' as any)}
              >ค้นหาวิชาเรียน</Button
            >
          </div>
        </div>
      {/if}
    </div>
  {/if}
  {#if showChangeColorModal}
    {@render changeColorModal()}
  {/if}
</div>

{#snippet sectionHeader()}
  {#if collapsible}
    <button
      type="button"
      onclick={() => (open = !open)}
      aria-expanded={open}
      class="mb-4 flex w-full items-center justify-between"
    >
      <span class="flex items-baseline gap-2">
        <h2 class="text-on-surface text-lg/[20px] font-medium">วิชาที่เลือก</h2>
        <span class="text-xs font-normal text-neutral-400"
          >{totalCredit} หน่วยกิต</span
        >
      </span>
      <ChevronDown
        size={20}
        class="text-gray-400 transition-transform duration-200 {open
          ? 'rotate-180'
          : ''}"
      />
    </button>
  {:else}
    <div class="mb-4 flex w-full items-center justify-between">
      <span class="flex items-baseline gap-2">
        <h2 class="text-on-surface text-lg/[20px] font-medium">วิชาที่เลือก</h2>
        <span class="text-xs font-normal text-neutral-400"
          >{totalCredit} หน่วยกิต</span
        >
      </span>
    </div>
  {/if}
{/snippet}

{#snippet groupedRow(course: CartItemDetail)}
  <div class="flex items-center gap-3 py-3">
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="text-[10px]/[15px] text-neutral-400">{course.courseNo}</span>
      <span class="text-on-surface truncate text-xs"
        >{course.course.courseNameEn}</span
      >
    </div>

    {#if course.genEdType !== 'NO'}
      <div class="flex w-20 justify-center">
        <GenedChip type={course.genEdType} />
      </div>
    {/if}
    <span class="text-on-surface w-12 shrink-0 text-right text-xs"
      >{course.course.credit} นก.</span
    >

    <button
      class="shrink-0 rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100"
      aria-label="ลบวิชา"
      onclick={() => removeCourse(course.id)}
    >
      <Trash2 size={18} />
    </button>
  </div>
{/snippet}

{#snippet selectedCourseItem(course: CartItemDetail)}
  <div
    data-hidden={course.hidden}
    class="
            my-1 flex p-1
            font-light
            data-[hidden=true]:text-neutral-500
        "
  >
    <div
      data-variant={variant}
      class="flex items-center justify-center data-[variant=simple]:hidden"
    >
      <IconButton
        class="bg-transparent hover:cursor-pointer"
        onclick={() => {
          updateCourse(course.id, { hidden: !course.hidden });
        }}
      >
        {#if course.hidden}
          <EyeOff class="stroke-neutral-500" />
        {:else}
          <Eye />
        {/if}
      </IconButton>
    </div>

    <div class="flex flex-1 flex-col justify-center overflow-hidden">
      <div class="flex flex-nowrap text-[0.6rem]">
        {course.courseNo}
      </div>
      <div class="truncate text-sm">
        {course.course.courseNameEn}
      </div>
    </div>

    <div
      data-variant={variant}
      class="flex flex-1 items-center justify-center px-2 data-[variant=detailed]:hidden"
    >
      <div class="flex-1 justify-center"></div>

      <div class="flex-1 justify-center">
        {course.course.credit} นก.
      </div>
    </div>

    <div class="flex items-center">
      <div
        data-variant={variant}
        class="flex w-12 text-sm data-[variant=simple]:hidden"
      >
        <Select.Root
          type="single"
          value={String(course.sectionNo)}
          onValueChange={(v) => {
            if (v) {
              updateCourse(course.id, { sectionNo: Number(v) });
            }
          }}
        >
          <Select.Trigger showArrow={false} class={cn('rounded-sm p-0')}>
            <div class="flex h-full w-full items-center justify-center text-xs">
              เซค {course.sectionNo}
            </div>
          </Select.Trigger>
          <Select.Content role="listbox">
            <Select.Group>
              {#each course.sections as section (section.sectionNo)}
                <Select.Item
                  value={String(section.sectionNo)}
                  label={`เซค ${section.sectionNo}`}
                  aria-label={`Sec ${section.sectionNo}`}
                  role="option"
                />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div
        data-variant={variant}
        class="flex items-center justify-center data-[variant=simple]:hidden"
      >
        <Button
          class={cn(
            'm-2 aspect-square rounded-lg border hover:ring-0',
            courseColorVariants[(course.color as ColorVariant) ?? 'neutral'],
          )}
          onclick={(e: MouseEvent) => {
            modalPosition.x = e.clientX;
            modalPosition.y = e.clientY;
            changeColorFor = course.id;
            showChangeColorModal = true;
            initialColorVariant = (course.color as ColorVariant) ?? 'neutral';
            currentColorVariant = (course.color as ColorVariant) ?? 'neutral';
          }}
        />
      </div>
      <div class="flex">
        <SortableList.ItemRemove onclick={handleRemoveClick}>
          <IconButton class="size-7 bg-transparent hover:cursor-pointer">
            <Trash2 class="mx-1 data-[hidden=true]:text-neutral-500" />
          </IconButton>
        </SortableList.ItemRemove>

        {#if variant === 'detailed'}
          <SortableList.ItemHandle>
            <IconButton class="size-7 bg-transparent hover:cursor-pointer">
              <Equal class="mx-1  data-[hidden=true]:text-neutral-500" />
            </IconButton>
          </SortableList.ItemHandle>
        {/if}
      </div>
    </div>
  </div>
{/snippet}

{#snippet changeColorModal()}
  <div
    class="fixed top-0 left-0 z-50 h-screen w-screen"
    role="button"
    tabindex="0"
    onclick={() => {
      showChangeColorModal = false;
    }}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        showChangeColorModal = false;
      }
    }}
  >
    <div
      class="fixed z-60"
      style="top: {modalPosition.y}px; left: {modalPosition.x}px;"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
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
        onChange={(option) => {
          if (changeColorFor) {
            updateCourse(changeColorFor, { color: option });
          }
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
