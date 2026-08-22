<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { api } from '$lib/api';
  import { tryCatch } from '$lib/async-handler';
  import { GOOGLE_FORM_URL } from '$lib/constants';
  import {
    getSemesterShortOptions,
    getYearOptions,
  } from '$lib/semesterOptions';
  import { getCartSelectionController } from '$lib/stores/cart-selection.svelte';
  import { useCartActions } from '$lib/stores/user-cart';
  import { convertReviewInfos } from '$lib/utils/reviews';
  import { convertSchedulesInfo } from '$lib/utils/scheduleInfo';
  import { convertUserInfo } from '$lib/utils/user';

  import { TriangleAlert } from '@lucide/svelte';
  import { onMount, untrack } from 'svelte';

  import { Modal } from '@cugetreg/ui/atoms/modal';
  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';
  import { EditPersonalInfo } from '@cugetreg/ui/organisms/edit-personal-info';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import { PersonalInfo } from '@cugetreg/ui/organisms/personal-info';
  import { RatingHistory } from '@cugetreg/ui/organisms/rating-history';
  import { ScheduleList } from '@cugetreg/ui/organisms/schedule-list';
  import {
    FACULTIES,
    type FacultyId,
    UNKNOWN_FACULTY,
  } from '@cugetreg/utils/faculty';
  import type { ReviewStatus } from '@cugetreg/zod-schemas';
  import {
    ListCartsResponseSchema,
    UpdateUserInfoResponseSchema,
    UserReviewResponseSchema,
  } from '@cugetreg/zod-schemas';

  import type { PageProps } from './$types';

  interface ScheduleItem {
    id: string;
    title: string;
    subtitle: string;
    year: number;
    semester: number;
    isPublic: boolean;
  }

  interface Review {
    code: string;
    name: string;
    tag: string | null;
    status: ReviewStatus;
    rating: number;
    term: string;
  }

  const { changeCartVisibility, deleteCart, createCart } = useCartActions();
  const cartSelection = getCartSelectionController();

  const { data }: PageProps = $props();
  let personalInfo = $state(untrack(() => data.user));

  let items = $state<ScheduleItem[]>([]);
  let reviews = $state<Review[]>([]);

  let editInfoPopupVisible = $state(false);
  let itemToDelete = $state<ScheduleItem | null>(null);
  let deleteItemPopupVisible = $state(false);
  let newDepartment = $state(untrack(() => personalInfo.department));
  let page = $state(1);
  const limit = 10;
  let hasMoreReviews = $state(true);
  let loadingReviews = $state(false);
  let loadingSchedules = $state(true);

  let showCreateScheduleModal = $state(false);

  let isMobile = $state(false);

  const faculty = $derived(
    FACULTIES[personalInfo.faculty as FacultyId] ?? UNKNOWN_FACULTY,
  );

  const parsedPersonalInfo = $derived({
    ...personalInfo,
    faculty: faculty.th,
  });

  async function updateUser() {
    const updatedUser = {
      name: personalInfo.name,
      faculty: personalInfo.faculty,
      department: newDepartment,
    };

    const [res, error] = await tryCatch(api.patch('/user', updatedUser));

    if (error || res.status !== 200) {
      console.error(error?.message);
      return;
    }

    const { user } = UpdateUserInfoResponseSchema.parse(res.data);
    personalInfo = convertUserInfo(user);
    editInfoPopupVisible = false;
  }

  async function fetchScheduleItems() {
    loadingSchedules = true;

    const [res, error] = await tryCatch(api.get('/carts'));

    if (error || res.status !== 200) {
      console.error(error?.message);
      loadingSchedules = false;
      return;
    }

    const { data } = ListCartsResponseSchema.parse(res.data);
    const fetchedItems = convertSchedulesInfo(data);
    items = fetchedItems;

    loadingSchedules = false;
  }

  async function changeVisibility(item: ScheduleItem, newChecked: boolean) {
    const ok = await changeCartVisibility(item.id, newChecked ? 'PUB' : 'PVT');
    if (!ok) item.isPublic = !newChecked;
  }

  async function deleteSchedule(id: string) {
    const ok = await deleteCart(id);
    if (!ok) return;

    items = items.filter((item) => item.id !== id);
    deleteItemPopupVisible = false;
    itemToDelete = null;
  }

  async function fetchReviews(pageToFetch: number, replace = false) {
    if (loadingReviews) return;
    if (!replace && !hasMoreReviews) return;

    loadingReviews = true;

    const queryParams = new URLSearchParams({
      page: pageToFetch.toString(),
      limit: limit.toString(),
    });
    const [res, error] = await tryCatch(
      api.get(`/user/reviews?${queryParams.toString()}`),
    );

    if (error || !res) {
      console.error(error?.message);
      loadingReviews = false;
      return;
    }

    const { totalReviews, reviews: data } = UserReviewResponseSchema.parse(
      res.data,
    );
    const newReviews = convertReviewInfos(data);

    if (replace) reviews = newReviews;
    else reviews.push(...newReviews);

    hasMoreReviews = totalReviews === limit;
    page = pageToFetch;

    loadingReviews = false;
  }

  function loadMoreReviews() {
    if (loadingReviews || !hasMoreReviews) return;
    fetchReviews(page + 1);
  }

  const onClickItem = async (item: ScheduleItem) => {
    try {
      const cart = await cartSelection.select(item.id);
      if (!cart) return;
      goto(resolve('/schedule'));
    } catch {
      console.error('redirect and switch cart failed');
    }
  };

  const onClickAddSchedule = () => {
    showCreateScheduleModal = true;
  };

  const toggleEditInfo = () => {
    editInfoPopupVisible = true;
  };

  const onCancelChange = () => {
    newDepartment = personalInfo.department;
    editInfoPopupVisible = false;
  };

  const onConfirmChange = async () => {
    await updateUser();
  };

  let onDeleteItem = (item: ScheduleItem) => {
    deleteItemPopupVisible = true;
    itemToDelete = item;
  };

  let onCancelDelete = () => {
    deleteItemPopupVisible = false;
    itemToDelete = null;
  };

  let onConfirmDelete = async () => {
    const id = itemToDelete?.id ?? '';
    await deleteSchedule(id);
  };

  $effect(() => {
    fetchScheduleItems();
  });

  onMount(() => {
    const isMobileQuery = window.matchMedia('(max-width: 768px)');
    isMobile = isMobileQuery.matches;

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      isMobile = event.matches;
    };

    isMobileQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      isMobileQuery.removeEventListener('change', handleMediaQueryChange);
    };
  });

  onMount(() => {
    fetchReviews(1, true);
  });
</script>

<div class="bg-surface relative flex min-h-screen flex-col">
  <div
    class="container mx-auto flex flex-col items-center justify-center gap-4 p-5 pb-16 sm:p-8 sm:pb-8 lg:flex-row lg:items-start lg:gap-8 lg:gap-20"
  >
    <div
      class="flex w-full flex-col items-center gap-10 py-8 md:max-w-2xl lg:w-3/4 lg:max-w-lg lg:items-start lg:px-6"
    >
      <PersonalInfo onEdit={toggleEditInfo} {...parsedPersonalInfo} />
      <RatingHistory
        {reviews}
        hasMore={hasMoreReviews}
        loading={loadingReviews}
        onLoadMore={loadMoreReviews}
      />
    </div>
    <ScheduleList
      heading="ตารางเรียน"
      {items}
      loading={loadingSchedules}
      {onClickItem}
      onClickButton={onClickAddSchedule}
      onDelete={onDeleteItem}
      onChangeVisibility={changeVisibility}
    />
  </div>
  <div class="bg-surface mt-auto w-full border-t">
    <Footer />
  </div>
  <Modal centered dim bind:show={editInfoPopupVisible}>
    <EditPersonalInfo
      bind:department={newDepartment}
      accountEmail={personalInfo.accountEmail}
      accountProvider={personalInfo.accountProvider}
      faculty={FACULTIES[personalInfo.faculty as FacultyId].th ??
        UNKNOWN_FACULTY}
      firstName={personalInfo.firstName}
      lastName={personalInfo.lastName}
      username={personalInfo.username}
      onCancel={onCancelChange}
      onConfirm={onConfirmChange}
    />
  </Modal>
  <Modal centered dim bind:show={deleteItemPopupVisible}>
    <ConfirmDeleteSchedule
      onCancel={onCancelDelete}
      onConfirm={onConfirmDelete}
      scheduleName={itemToDelete?.title}
    />
  </Modal>
  <Modal centered dim bind:show={showCreateScheduleModal}>
    <CreateTimetable
      yearOptions={getYearOptions()}
      semesterOptions={getSemesterShortOptions()}
      onConfirm={async (schedule: TimetableMetaData) => {
        try {
          goto(resolve('/schedule'));
          await createCart(
            schedule.name,
            schedule.isPublic,
            schedule.semesterType,
            schedule.semester,
            schedule.academicYear,
          );
          showCreateScheduleModal = false;
        } catch (e) {
          console.error('create new timetable failed', e);
        }
      }}
      onCancel={() => (showCreateScheduleModal = false)}
    />
  </Modal>
  <a
    class="border-on-surface bg-surface-bright fixed right-6 bottom-6 z-50 inline-flex cursor-pointer items-center gap-1 rounded-full border-2 px-2 py-1 md:gap-2 md:px-4"
    href={GOOGLE_FORM_URL}
    target="_blank"
    rel="external noopener noreferrer"
  >
    <TriangleAlert
      class="text-on-surface"
      size={isMobile ? 16 : 20}
      strokeWidth={1.5}
    />
    <span class="text-on-surface text-[10px] md:text-xs"
      >แจ้งปัญหาการใช้งาน</span
    >
  </a>
</div>
