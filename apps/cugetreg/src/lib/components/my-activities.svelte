<script lang="ts">
  import { getUserCartStore, useCartActions } from '$lib/stores/user-cart';

  import { ChevronDown, Equal, Eye, EyeOff, Trash2 } from '@lucide/svelte';
  import {
    SortableList,
    sortItems,
  } from '@rodrigodagostino/svelte-sortable-list';
  import type { ClassValue } from 'clsx';
  import { tick } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { MediaQuery } from 'svelte/reactivity';
  import { slide } from 'svelte/transition';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { IconButton } from '@cugetreg/ui/atoms/icon-button';
  import { defineMessages, useTranslations } from '@cugetreg/ui/i18n';
  import { ColorPicker } from '@cugetreg/ui/molecules/colorpicker';
  import { cn } from '@cugetreg/utils';
  import { courseColorVariants } from '@cugetreg/utils/constants';
  import type { ColorVariant } from '@cugetreg/utils/types';
  import type { ActivityItem } from '@cugetreg/zod-schemas/activity-response';

  interface MyActivitiesProp {
    class?: ClassValue;
    open?: boolean;
    /** Show a divider between the header and the body while expanded. */
    headerDivider?: boolean;
    /** When false, the section can't collapse (no chevron) and stays open. */
    collapsible?: boolean;
    /** Called when an activity's title is clicked. */
    onSelect?: (activityId: string) => void;
  }

  let {
    class: className = undefined,
    open = $bindable(true),
    headerDivider = false,
    collapsible = true,
    onSelect = () => {},
  }: MyActivitiesProp = $props();

  const t = useTranslations(
    defineMessages({
      th: {
        title: 'กิจกรรมของฉัน',
        show: 'แสดงในตาราง',
        hide: 'ซ่อนจากตาราง',
        pickColor: 'เลือกสีในตาราง',
        remove: 'ลบกิจกรรม',
      },
      en: {
        title: 'My activities',
        show: 'Show in timetable',
        hide: 'Hide from timetable',
        pickColor: 'Choose timetable color',
        remove: 'Remove activity',
      },
    }),
  );

  const isMobile = new MediaQuery('max-width: 767px', false);
  const modalGap = 8;
  const viewportMargin = 16;

  const userCart = getUserCartStore();
  const { updateActivity, removeActivity } = useCartActions();

  const activities = $derived($userCart.currentCart?.activityItems ?? []);
  const bodyOpen = $derived(collapsible ? open : true);

  let showChangeColorModal = $state(false);
  let currentColorVariant = $state<ColorVariant>('primary');
  let initialColorVariant = $state<ColorVariant>('primary');
  let changeColorFor = $state<string | undefined>();
  let colorPickerAnchor = $state<HTMLElement>();
  let colorPickerElement = $state<HTMLDivElement>();
  let modalPosition = $state({ x: 0, y: 0 });

  function handleDragEnd(e: SortableList.RootEvents['ondragend']) {
    const { draggedItemIndex, targetItemIndex, isCanceled } = e;
    if (
      !isCanceled &&
      typeof targetItemIndex === 'number' &&
      draggedItemIndex !== targetItemIndex
    ) {
      const newItems = sortItems(activities, draggedItemIndex, targetItemIndex);
      const movedItem = newItems[targetItemIndex];
      const prevId = newItems[targetItemIndex - 1]?.id;
      const nextId = newItems[targetItemIndex + 1]?.id;

      updateActivity(movedItem.id, { prevId, nextId });
    }
  }

  function handleRemoveClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const item = target.closest<HTMLLIElement>('.ssl-item');
    const itemIndex = Number(item?.dataset.itemIndex);
    if (!item || itemIndex < 0) return;

    removeActivity(activities[itemIndex].id);
  }

  function updateModalPosition() {
    if (isMobile.current || !colorPickerAnchor || !colorPickerElement) return;

    const anchorRect = colorPickerAnchor.getBoundingClientRect();
    const modalRect = colorPickerElement.getBoundingClientRect();
    const maxX = Math.max(
      viewportMargin,
      window.innerWidth - modalRect.width - viewportMargin,
    );
    const maxY = Math.max(
      viewportMargin,
      window.innerHeight - modalRect.height - viewportMargin,
    );

    let x = anchorRect.right + modalGap;
    let y = anchorRect.top;

    if (x + modalRect.width > window.innerWidth - viewportMargin) {
      x = anchorRect.left - modalRect.width - modalGap;
    }
    if (y + modalRect.height > window.innerHeight - viewportMargin) {
      y = anchorRect.bottom - modalRect.height;
    }

    modalPosition.x = Math.min(Math.max(x, viewportMargin), maxX);
    modalPosition.y = Math.min(Math.max(y, viewportMargin), maxY);
  }

  async function handleColorPickerClick(e: MouseEvent, activity: ActivityItem) {
    colorPickerAnchor = e.currentTarget as HTMLElement;

    const anchorRect = colorPickerAnchor.getBoundingClientRect();
    modalPosition.x = anchorRect.right + modalGap;
    modalPosition.y = anchorRect.top;
    changeColorFor = activity.id;
    initialColorVariant = (activity.color as ColorVariant | null) ?? 'primary';
    currentColorVariant = initialColorVariant;
    showChangeColorModal = true;

    await tick();
    updateModalPosition();
  }
</script>

<svelte:window
  onresize={() => {
    if (showChangeColorModal) {
      requestAnimationFrame(updateModalPosition);
    }
  }}
  onkeydown={(e) => {
    if (e.key === 'Escape' && showChangeColorModal) {
      showChangeColorModal = false;
    }
  }}
/>

{#if activities.length > 0}
  <div class={cn(className)}>
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
            {#each activities as activity, index (activity.id)}
              <SortableList.Item id={activity.id} {index} class="my-0">
                <div class="ssl-item-content">
                  {@render activityItem(activity)}
                </div>
              </SortableList.Item>
            {/each}
          </SortableList.Root>
        </div>
      {/if}
    </div>
    {#if showChangeColorModal}
      {@render changeColorModal()}
    {/if}
  </div>
{/if}

{#snippet sectionHeader()}
  {#if collapsible}
    <button
      type="button"
      onclick={() => (open = !open)}
      aria-expanded={open}
      class="mb-4 flex w-full items-center justify-between"
    >
      {@render sectionTitle()}
      <ChevronDown
        size={20}
        class="text-gray-400 transition-transform duration-200 {open
          ? 'rotate-180'
          : ''}"
      />
    </button>
  {:else}
    <div class="mb-4 flex w-full items-center justify-between">
      {@render sectionTitle()}
    </div>
  {/if}
{/snippet}

{#snippet sectionTitle()}
  <h2 class="text-on-surface text-lg/[20px] font-medium">{t('title')}</h2>
{/snippet}

{#snippet activityItem(activity: ActivityItem)}
  <div
    data-hidden={activity.hidden}
    class="my-1 flex p-1 font-light data-[hidden=true]:text-neutral-500"
  >
    <div class="flex items-center justify-center">
      <IconButton
        class="bg-transparent hover:cursor-pointer"
        aria-label={activity.hidden ? t('show') : t('hide')}
        onclick={() => {
          updateActivity(activity.id, { hidden: !activity.hidden });
        }}
      >
        {#if activity.hidden}
          <EyeOff class="stroke-neutral-500" />
        {:else}
          <Eye />
        {/if}
      </IconButton>
    </div>

    <button
      type="button"
      class="flex min-w-0 flex-1 cursor-pointer flex-col justify-center overflow-hidden text-left"
      onclick={() => onSelect(activity.id)}
    >
      <div class="truncate text-sm">{activity.title}</div>
    </button>

    <div class="flex items-center">
      <Button
        class={cn(
          'm-2 aspect-square rounded-lg border hover:ring-0',
          courseColorVariants[
            (activity.color as ColorVariant | null) ?? 'primary'
          ],
        )}
        aria-label={t('pickColor')}
        onclick={(e: MouseEvent) => handleColorPickerClick(e, activity)}
      />
      <div class="flex">
        <SortableList.ItemRemove onclick={handleRemoveClick}>
          <IconButton
            class="size-7 bg-transparent hover:cursor-pointer"
            aria-label={t('remove')}
          >
            <Trash2 class="mx-1" />
          </IconButton>
        </SortableList.ItemRemove>

        <SortableList.ItemHandle>
          <IconButton class="size-7 bg-transparent hover:cursor-pointer">
            <Equal class="mx-1" />
          </IconButton>
        </SortableList.ItemHandle>
      </div>
    </div>
  </div>
{/snippet}

{#snippet changeColorModal()}
  <div
    class="fixed inset-0 z-50"
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
      bind:this={colorPickerElement}
      class="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-60 max-h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] overflow-y-auto md:inset-x-auto md:bottom-auto md:max-h-[calc(100dvh-2rem)]"
      style:top={isMobile.current ? undefined : `${modalPosition.y}px`}
      style:left={isMobile.current ? undefined : `${modalPosition.x}px`}
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
        class="bg-surface w-full md:w-[350px]"
        options={courseColorVariants}
        bind:value={currentColorVariant}
        onCancel={() => {
          if (changeColorFor && currentColorVariant !== initialColorVariant) {
            updateActivity(changeColorFor, { color: initialColorVariant });
          }
          currentColorVariant = initialColorVariant;
          showChangeColorModal = false;
        }}
        onChange={(option) => {
          if (changeColorFor) {
            updateActivity(changeColorFor, { color: option });
          }
        }}
        onConfirmSelected={() => {
          showChangeColorModal = false;
        }}
      />
    </div>
  </div>
{/snippet}
