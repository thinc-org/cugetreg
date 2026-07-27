<script lang="ts">
  import { browser } from '$app/environment';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import ExamsList from '$lib/components/exams-list.svelte';
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import TimetableBlockGroup from '$lib/components/timetable-block-group.svelte';
  import {
    getSemesterShortOptions,
    getYearOptions,
  } from '$lib/semesterOptions';
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
    getLatestTime,
    getViewCourseData,
    TIMETABLE_DEFAULT_END,
    TIMETABLE_DEFAULT_START,
  } from '$lib/utils/schedule';

  import { BookMarked, Loader2, Menu, X } from '@lucide/svelte';
  import { Copy, Download } from 'lucide-svelte';
  import { getContext } from 'svelte';
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
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import { RenameSchedule } from '@cugetreg/ui/organisms/rename-schedule';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
  import { ViewCourse } from '@cugetreg/ui/organisms/view-course';

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
    switchCart,
    updateCartMeta,
  } = useCartActions();

  const cartPromise = getContext<CartPromise>(CART_PROMISE_KEY);

  // ================ STATES ================

  let timetableDiv = $state<HTMLElement | undefined>();
  let innerWidth = $state(1024);

  let showRenameScheduleModal = $state(false);
  let showCreateScheduleModal = $state(false);
  let showDeleteScheduleModal = $state(false);
  let showViewCourseModal = $state(false);

  let selectedCartItemId = $state<string | undefined>(undefined);

  let scheduleTableRef = $state<HTMLElement | null>(null);

  let sidebarExpanded = $state(true);
  let openPanel = $state<'sidebar' | 'selected_only' | null>(null);
  let activePanel = $state<'sidebar' | 'selected_only' | null>(null);
  let selectedOpen = $state(true);
  let activeModal = $state<'selected' | null>(null);

  let previousCartId = $state($userCart.currentCartId);

  // ================ DERIVED ================

  const viewCourseData = $derived(
    getViewCourseData(
      selectedCartItemId,
      $userCart.currentCart,
      $userCart.exams,
    ),
  );

  const totalCredit = $derived(calculateCredit($userCart.currentCart.items));
  const publicCartURL = $derived(
    browser
      ? `${window.location.host}/schedule/${$userCart.currentCart.id}`
      : '',
  );

  const scheduleDays = $derived(getDays($userCart.currentCart.items));
  const scheduleEndTime = $derived(
    getLatestTime($userCart.currentCart.items, TIMETABLE_DEFAULT_END),
  );

  $effect(() => {
    if ($userCart.currentCartId && $userCart.currentCartId !== previousCartId) {
      previousCartId = $userCart.currentCartId;
      switchCart($userCart.currentCartId);
    }
  });

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
</script>

<svelte:window bind:innerWidth />

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
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            onclick={toggleSidebar}
            isActive={sidebarExpanded && activePanel === 'sidebar'}
            size="lg"
            tooltipContent="ตารางเรียน"
            class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
          >
            <Menu size="20" strokeWidth={2.5} />
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            onclick={focusSelected}
            isActive={activePanel === 'selected_only'}
            size="lg"
            tooltipContent="วิชาที่เลือก"
            class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
          >
            <BookMarked size="20" strokeWidth={2.5} />
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
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
                class="border-b border-neutral-100 px-2 py-5"
                options={$userCart.cartList?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) ?? []}
                bind:value={$userCart.currentCartId}
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
                class="border-b border-neutral-100"
              />
            </div>
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
                bind:currentScheduleId={$userCart.currentCartId}
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
                startTime={TIMETABLE_DEFAULT_START}
                periodPerDay={scheduleEndTime - TIMETABLE_DEFAULT_START}
                days={scheduleDays}
              >
                {#each $userCart.currentCart?.items as course (course.id)}
                  <TimetableBlockGroup
                    {course}
                    cartItems={$userCart.currentCart.items}
                    onclick={(id) => {
                      selectedCartItemId = id;
                      showViewCourseModal = true;
                    }}
                  />
                {/each}
              </Timetable>
            </div>
          </div>
          <CustomizeScrollbar target={scheduleTableRef} />
          <div
            class="hidden lg:mx-5 lg:mb-5 lg:flex lg:justify-end lg:text-lg lg:font-bold"
          >
            หน่วยกิตรวม {totalCredit} / 22
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
              {#if innerWidth < 1024}
                <Button
                  class="m-0 flex items-center gap-1 border border-gray-200 bg-white"
                  onclick={handleTimetableScreenshot}
                >
                  <Download
                    size={20}
                    strokeWidth={2.5}
                    class="text-[#353745]"
                  />
                  <span class="font-medium text-[#353745]">บันทึกภาพ</span>
                </Button>
              {/if}
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
              {#if innerWidth >= 1024}
                <Button class="m-0" onclick={handleTimetableScreenshot}>
                  บันทึกเป็นภาพ
                </Button>
              {/if}
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
    {#if !activeModal}
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
          class="border-b border-neutral-100"
        />
      </div>
    </div>
  {/if}
</div>
