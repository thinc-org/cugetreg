<script lang="ts">
  import { browser } from '$app/environment';
  import { useSession } from '$lib/auth-client';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import ExamsList from '$lib/components/exams-list.svelte';
  import MyActivities from '$lib/components/my-activities.svelte';
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import TimetableActivityBlock from '$lib/components/timetable-activity-block.svelte';
  import TimetableBlockGroup from '$lib/components/timetable-block-group.svelte';
  import {
    getSemesterShortOptions,
    getYearOptions,
  } from '$lib/semesterOptions';
  import { getCartSelectionController } from '$lib/stores/cart-selection.svelte';
  import {
    CART_PROMISE_KEY,
    type CartPromise,
    getUserCartStore,
    useCartActions,
  } from '$lib/stores/user-cart';
  import {
    calculateCredit,
    createElementScreenshot,
    getDays,
    getEarliestTime,
    getLatestTime,
    getMaxCredit,
    getViewCourseData,
    TIMETABLE_DEFAULT_END,
    TIMETABLE_DEFAULT_START,
  } from '$lib/utils/schedule';

  import { BookMarked, Loader2, Menu, Plus, TreePine, X } from '@lucide/svelte';
  import { Copy, Download } from 'lucide-svelte';
  import { getContext, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { CustomizeScrollbar } from '@cugetreg/ui/atoms/customize-scrollbar';
  import { IconButton } from '@cugetreg/ui/atoms/icon-button';
  import { Input } from '@cugetreg/ui/atoms/input';
  import { Modal } from '@cugetreg/ui/atoms/modal';
  import { Switch } from '@cugetreg/ui/atoms/switch';
  import { TimeTable as Timetable } from '@cugetreg/ui/atoms/timetable';
  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';
  import { EditSchedule } from '@cugetreg/ui/molecules/edit-schedule';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import {
    type ActivityFormData,
    CreateActivity,
  } from '@cugetreg/ui/organisms/create-activity';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import { RenameSchedule } from '@cugetreg/ui/organisms/rename-schedule';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
  import {
    ViewActivity,
    type ViewActivityData,
  } from '@cugetreg/ui/organisms/view-activity';
  import { ViewCourse } from '@cugetreg/ui/organisms/view-course';
  import type { ColorVariant, Day } from '@cugetreg/utils/types';

  // ================ HOOKS ================

  const userCart = getUserCartStore();
  const {
    renameCart,
    copyCart,
    deleteCart,
    createCart,
    pinCart,
    updateCourse,
    removeCourse,
    updateCartMeta,
    createActivity,
    updateActivity,
    removeActivity,
  } = useCartActions();

  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);
  const cartSelection = getCartSelectionController();
  const session = useSession();

  // ================ STATES ================

  let timetableDiv = $state<HTMLElement | undefined>();
  let innerWidth = $state(1024);

  let showRenameScheduleModal = $state(false);
  let showCreateScheduleModal = $state(false);
  let showDeleteScheduleModal = $state(false);
  let showViewCourseModal = $state(false);
  let showCreateActivityModal = $state(false);
  let showViewActivityModal = $state(false);
  let creatingActivity = $state(false);

  let selectedCartItemId = $state<string | undefined>(undefined);
  let selectedActivityId = $state<string | undefined>(undefined);

  let scheduleTableRef = $state<HTMLElement | null>(null);

  let sidebarExpanded = $state(true);
  type SidebarPanel = 'sidebar' | 'selected_only' | 'activities_only';
  let openPanel = $state<SidebarPanel | null>(null);
  let activePanel = $state<SidebarPanel | null>(null);
  let selectedOpen = $state(true);
  let activitiesOpen = $state(true);

  // The activities header moves with the height of the course list above it,
  // so unlike the other rail icons its offset is measured, not fixed.
  const ACTIVITIES_ICON_DEFAULT_MARGIN = 18;
  let activitiesHeaderEl = $state<HTMLElement>();
  let activitiesIconEl = $state<HTMLElement>();
  let activitiesIconMargin = $state(ACTIVITIES_ICON_DEFAULT_MARGIN);
  let activeModal = $state<'selected' | null>(null);

  // ================ DERIVED ================

  const viewCourseData = $derived(
    getViewCourseData(
      selectedCartItemId,
      $userCart.currentCart,
      $userCart.exams,
    ),
  );

  const totalCredit = $derived(calculateCredit($userCart.currentCart.items));
  const maxCredit = $derived(
    getMaxCredit(
      $userCart.currentCart.semester,
      $session.data?.user.email.split('@')[0],
    ),
  );
  const publicCartURL = $derived(
    browser
      ? `${window.location.host}/schedule/${$userCart.currentCart.id}`
      : '',
  );

  const activityItems = $derived($userCart.currentCart.activityItems ?? []);

  const viewActivityData = $derived.by((): ViewActivityData | null => {
    const activity = activityItems.find((a) => a.id === selectedActivityId);
    if (!activity) return null;
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      dayOfWeek: activity.dayOfWeek as Day,
      periodStart: activity.periodStart,
      periodEnd: activity.periodEnd,
      color: (activity.color as ColorVariant | null) ?? 'primary',
      hidden: activity.hidden,
    };
  });

  const scheduleDays = $derived(
    getDays($userCart.currentCart.items, activityItems),
  );
  const scheduleStartTime = $derived(
    getEarliestTime(activityItems, TIMETABLE_DEFAULT_START),
  );
  const scheduleEndTime = $derived(
    getLatestTime(
      $userCart.currentCart.items,
      TIMETABLE_DEFAULT_END,
      activityItems,
    ),
  );

  function openActivity(activityId: string) {
    selectedActivityId = activityId;
    showViewActivityModal = true;
  }

  async function handleCreateActivity(activity: ActivityFormData) {
    creatingActivity = true;
    const { daysOfWeek, ...fields } = activity;
    const created = await createActivity(fields, daysOfWeek);
    creatingActivity = false;
    if (created) showCreateActivityModal = false;
  }

  function handleTimetableScreenshot() {
    createElementScreenshot(
      `${$userCart.currentCart.name}_timetable`,
      timetableDiv,
    );
  }

  function handlePublicToggle(isPublic: boolean) {
    updateCartMeta({
      visible: isPublic ? 'PUB' : 'PVT',
    });
  }

  function toggleSidebar() {
    if (sidebarExpanded) {
      sidebarExpanded = false;
      activePanel = null;
    } else {
      sidebarExpanded = true;
      activePanel = 'sidebar';
      openPanel = null;
      selectedOpen = true;
    }
  }

  function focusSelected() {
    if (sidebarExpanded && selectedOpen) {
      selectedOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    openPanel = null;
    selectedOpen = true;
    activePanel = 'selected_only';
  }

  function focusActivities() {
    if (sidebarExpanded && activitiesOpen) {
      activitiesOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    openPanel = null;
    activitiesOpen = true;
    activePanel = 'activities_only';
  }

  /** Line the rail icon up with the vertical centre of the section title. */
  function alignActivitiesIcon() {
    if (!activitiesIconEl) return;
    if (!activitiesHeaderEl) {
      activitiesIconMargin = ACTIVITIES_ICON_DEFAULT_MARGIN;
      return;
    }
    const TITLE_LINE_HEIGHT = 20;
    const headerCenter =
      activitiesHeaderEl.getBoundingClientRect().top + TITLE_LINE_HEIGHT / 2;
    const icon = activitiesIconEl.getBoundingClientRect();
    const iconCenter = icon.top + icon.height / 2;
    const next = Math.max(
      0,
      Math.round(activitiesIconMargin + headerCenter - iconCenter),
    );
    if (next !== activitiesIconMargin) activitiesIconMargin = next;
  }

  // Re-align whenever the panel content above the header changes size
  // (courses added, a section opened/closed, the slide transition running).
  $effect(() => {
    const header = activitiesHeaderEl;
    if (!header?.parentElement) {
      alignActivitiesIcon();
      return;
    }
    // Only watch what sits above the header; nothing here depends on the
    // rail, so moving the icon can't feed back into another resize.
    tick().then(alignActivitiesIcon);
    const observer = new ResizeObserver(() => alignActivitiesIcon());
    let el = header.previousElementSibling;
    while (el) {
      observer.observe(el);
      el = el.previousElementSibling;
    }
    return () => observer.disconnect();
  });
</script>

<svelte:window bind:innerWidth />

{#snippet screenshotButton(visibility: string)}
  <Button
    variant="outlined"
    color="neutral"
    class="m-0 gap-2 {visibility}"
    onclick={handleTimetableScreenshot}
  >
    <Download size={18} strokeWidth={2.5} />
    บันทึกภาพ
  </Button>
{/snippet}

<div class="relative flex h-full flex-col overflow-hidden bg-white">
  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showRenameScheduleModal}
  >
    <RenameSchedule
      initialName={$userCart.currentCart.name}
      onCancel={() => (showRenameScheduleModal = false)}
      onConfirm={(name) => {
        renameCart(name);
        showRenameScheduleModal = false;
      }}
    />
  </Modal>
  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showCreateScheduleModal}
  >
    <CreateTimetable
      yearOptions={getYearOptions()}
      semesterOptions={getSemesterShortOptions()}
      onConfirm={(schedule: TimetableMetaData) => {
        createCart(
          schedule.name,
          schedule.isPublic,
          schedule.semesterType,
          schedule.semester,
          schedule.academicYear,
        );
        showCreateScheduleModal = false;
      }}
      onCancel={() => (showCreateScheduleModal = false)}
    />
  </Modal>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    class="pt-16 md:pt-20"
    bind:show={showViewCourseModal}
  >
    <ViewCourse
      data={viewCourseData}
      onExit={() => (showViewCourseModal = false)}
      onHide={(itemId, hidden) => updateCourse(itemId, { hidden })}
      onRemove={(itemId) => {
        removeCourse(itemId);
        showViewCourseModal = false;
      }}
      onChangeColor={(itemId, color) => updateCourse(itemId, { color })}
      onChangeSection={(itemId, sectionNo) =>
        updateCourse(itemId, { sectionNo })}
    />
  </Modal>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    class="pt-16 md:pt-20"
    bind:show={showCreateActivityModal}
  >
    <CreateActivity
      submitting={creatingActivity}
      onCancel={() => (showCreateActivityModal = false)}
      onConfirm={handleCreateActivity}
    />
  </Modal>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    class="pt-16 md:pt-20"
    bind:show={showViewActivityModal}
  >
    <ViewActivity
      data={viewActivityData}
      onExit={() => (showViewActivityModal = false)}
      onUpdate={(id, fields) => updateActivity(id, fields)}
      onRemove={(id) => {
        removeActivity(id);
        showViewActivityModal = false;
      }}
    />
  </Modal>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showDeleteScheduleModal}
  >
    <ConfirmDeleteSchedule
      scheduleName={$userCart.currentCart.name}
      onCancel={() => (showDeleteScheduleModal = false)}
      onConfirm={() => {
        showDeleteScheduleModal = false;
        deleteCart($userCart.currentCartId);
      }}
    />
  </Modal>

  <div class="relative flex flex-1 overflow-hidden">
    <AppSidebar
      showSidebar={innerWidth >= 1024}
      panelWidth="490px"
      bind:expanded={sidebarExpanded}
      bind:openPanel
      bind:activePanel
    >
      {#snippet iconItems()}
        <!--
          Each icon is nudged with a fixed margin so it lines up with its
          section header in the panel. These are pure layout offsets: nothing
          recomputes them, so the icons never shift when a section is opened or
          closed. Tune the two values if the headers change height.
        -->
        <Sidebar.MenuItem>
          <div class="mt-[0px]">
            <Sidebar.MenuButton
              onclick={toggleSidebar}
              isActive={sidebarExpanded && activePanel === 'sidebar'}
              size="lg"
              tooltipContent="ตารางเรียน"
              class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <Menu size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <div class="mt-[18px]">
            <Sidebar.MenuButton
              onclick={focusSelected}
              isActive={activePanel === 'selected_only'}
              size="lg"
              tooltipContent="วิชาที่เลือก"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <BookMarked size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        {#if activityItems.length > 0}
          <Sidebar.MenuItem>
            <div
              bind:this={activitiesIconEl}
              style:margin-top="{activitiesIconMargin}px"
            >
              <Sidebar.MenuButton
                onclick={focusActivities}
                isActive={activePanel === 'activities_only'}
                size="lg"
                tooltipContent="กิจกรรมของฉัน"
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
              >
                <TreePine size="20" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </div>
          </Sidebar.MenuItem>
        {/if}
      {/snippet}
      {#snippet panelContent({ expanded })}
        {#if expanded}
          <div class="relative mb-6 flex flex-col gap-2">
            {#await cartPromise}
              <div
                class="flex items-center justify-center gap-2 px-2 py-8 text-gray-400"
              >
                <Loader2 class="animate-spin" size={24} />
                <span class="text-sm">กำลังโหลดตารางเรียน...</span>
              </div>
            {:then}
              <SelectTimetable
                class="px-2 pt-5"
                options={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                bind:value={
                  () => cartSelection.selectedId,
                  (id) => void cartSelection.select(id)
                }
                semester={$userCart.currentCart.semester}
                semesterType={$userCart.currentCart.studyProgram}
                academicYear={$userCart.currentCart.academicYear}
              />
            {:catch}
              <div
                class="flex items-center justify-center gap-2 px-2 py-8 text-sm text-red-400"
              >
                โหลดตารางเรียนไม่สำเร็จ
              </div>
            {/await}
          </div>
          <hr class="mb-6 border-t border-neutral-100" />

          {#if $userCart.currentCart}
            <div data-selected-section>
              <SelectedCourse
                headerDivider
                bind:open={selectedOpen}
                class={[
                  'border-b border-neutral-100',
                  activityItems.length > 0 && 'pb-6',
                ]}
              />
            </div>
            {#if activityItems.length > 0}
              <div bind:this={activitiesHeaderEl} class="mt-6">
                <MyActivities
                  headerDivider
                  bind:open={activitiesOpen}
                  class="border-b border-neutral-100 pb-4"
                  onSelect={openActivity}
                />
              </div>
            {/if}
          {/if}

          <div
            class="border-secondary text-on-secondary-container mt-8 rounded-2xl border px-5 py-4 text-center text-xs/[18px]"
          >
            <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span
            ><br />
            สามารถลงทะเบียนเรียนได้ที่
            <a
              href="https://www2.reg.chula.ac.th/"
              target="_blank"
              rel="noreferrer"
              class="underline">https://www2.reg.chula.ac.th/</a
            ><br />
            เพียงช่องทางเดียวเท่านั้น
          </div>
        {/if}
      {/snippet}
      <div class="flex min-h-full flex-col">
        <div class="mx-auto w-full max-w-[1200px] flex-1 p-4 md:p-8 lg:p-12">
          <div
            class="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex w-full items-center justify-between lg:w-auto">
              <h1
                class="text-xl font-bold text-[#4A70C6] md:text-4xl md:text-black"
              >
                ตารางเรียน
              </h1>
              <div class="lg:hidden">
                <Switch
                  checked={$userCart.currentCart.visible === 'PUB'}
                  onCheckedChange={handlePublicToggle}
                  label="เปิดเป็นสาธารณะ"
                />
              </div>
            </div>

            <div class="flex w-full items-center lg:w-auto">
              <EditSchedule
                class="gap-2 lg:gap-0"
                bind:currentScheduleId={
                  () => cartSelection.selectedId,
                  (id) => void cartSelection.select(id)
                }
                schedules={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                onRename={() => (showRenameScheduleModal = true)}
                onDuplicate={() => copyCart()}
                onAddSchedule={() => (showCreateScheduleModal = true)}
                onDelete={() => (showDeleteScheduleModal = true)}
                onPin={() => pinCart()}
              />
            </div>
          </div>
          <div
            class="bg-surface overflow-x-auto pt-4 pb-0 [scrollbar-width:none] lg:px-8 lg:py-8 [&::-webkit-scrollbar]:hidden"
            bind:this={timetableDiv}
            bind:this={scheduleTableRef}
          >
            <div class="min-w-150">
              <Timetable
                startTime={scheduleStartTime}
                periodPerDay={scheduleEndTime - scheduleStartTime}
                days={scheduleDays}
              >
                {#each $userCart.currentCart?.items as course (course.id)}
                  <TimetableBlockGroup
                    {course}
                    cartItems={$userCart.currentCart.items}
                    startTime={scheduleStartTime}
                    onclick={(id) => {
                      selectedCartItemId = id;
                      showViewCourseModal = true;
                    }}
                  />
                {/each}
                {#each activityItems as activity (activity.id)}
                  <TimetableActivityBlock
                    {activity}
                    startTime={scheduleStartTime}
                    onclick={openActivity}
                  />
                {/each}
              </Timetable>
            </div>
          </div>
          <CustomizeScrollbar target={scheduleTableRef} />
          <div
            class="my-4 flex items-center justify-between lg:mx-5 lg:mt-0 lg:mb-5"
          >
            <Button
              variant="outlined"
              color="primary"
              class="m-0 gap-1"
              onclick={() => (showCreateActivityModal = true)}
            >
              <Plus size={18} strokeWidth={2.5} />
              กิจกรรม
            </Button>
            <span class="hidden lg:inline lg:text-lg lg:font-bold">
              หน่วยกิตรวม {totalCredit} / {maxCredit}
            </span>
          </div>

          <div
            class="mt-4 flex w-full flex-col gap-2 lg:mt-0 lg:flex-row lg:items-center"
          >
            <div class="flex w-full items-center justify-between lg:w-auto">
              <Switch
                checked={$userCart.currentCart.visible === 'PUB'}
                onCheckedChange={handlePublicToggle}
                label="เปิดเป็นสาธารณะ"
              />
              {@render screenshotButton('lg:hidden')}
            </div>
            <div class="flex w-full items-center gap-2 lg:flex-1">
              <div class="relative flex flex-1">
                <Input
                  value={publicCartURL}
                  disabled={$userCart.currentCart.visible === 'PVT'}
                  readonly
                  class="w-full pr-10"
                  onfocus={(e: FocusEvent) =>
                    (e.target as HTMLInputElement).select()}
                />
                <IconButton
                  variant="ghost"
                  disabled={$userCart.currentCart.visible === 'PVT'}
                  class="absolute right-0 z-10 hover:cursor-pointer hover:bg-transparent"
                  onclick={() => {
                    if (publicCartURL) {
                      navigator.clipboard.writeText(publicCartURL);
                    }
                  }}
                >
                  <Copy />
                </IconButton>
              </div>
              <!-- <IconButton class="aspect-square"> -->
              <!--   <Share2 /> -->
              <!-- </IconButton> -->
              {@render screenshotButton('hidden lg:inline-flex')}
            </div>
          </div>
          <ExamsList cart={$userCart.currentCart} exams={$userCart.exams} />
        </div>
        <div class="mt-auto w-full border-t bg-white">
          <Footer />
        </div>
      </div>
    </AppSidebar>
  </div>
  <div class="lg:hidden">
    <!-- Hide the floating button while an activity modal is open so it
         doesn't cover the modal's action buttons. -->
    {#if !activeModal && !showCreateActivityModal && !showViewActivityModal}
      <div transition:fade={{ duration: 200 }}>
        <button
          type="button"
          aria-label="วิชาที่เลือก"
          class="fixed right-6 bottom-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A70C6] text-white shadow-lg transition-colors hover:bg-[#3f61ab]"
          onclick={() => (activeModal = 'selected')}
        >
          <BookMarked size={28} strokeWidth={2} />
        </button>
      </div>
    {/if}
  </div>
  {#if activeModal}
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      transition:fade={{ duration: 200 }}
    >
      <div
        class="custom-scrollbar relative flex max-h-[85vh] w-full max-w-[400px] flex-col overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          class="absolute top-7 right-5 bg-white"
          onclick={() => (activeModal = null)}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <SelectedCourse
          collapsible={false}
          class={[
            'border-b border-neutral-100',
            activityItems.length > 0 && 'pb-6',
          ]}
        />
        <MyActivities
          collapsible={false}
          class="mt-6 border-b border-neutral-100"
          onSelect={(id) => {
            activeModal = null;
            openActivity(id);
          }}
        />
      </div>
    </div>
  {/if}
</div>
