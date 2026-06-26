<script lang="ts">
  import { api } from '$lib/api';
  import { tryCatch } from '$lib/async-handler';
  import { convertReviewInfos } from '$lib/utils/reviews';
  import { convertSchedulesInfo } from '$lib/utils/scheduleInfo';
  import { convertUserInfo } from '$lib/utils/user';

  import { TriangleAlert } from '@lucide/svelte';
  import { onMount } from 'svelte';

  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';
  import { EditPersonalInfo } from '@cugetreg/ui/organisms/edit-personal-info';
  import { PersonalInfo } from '@cugetreg/ui/organisms/personal-info';
  import { RatingHistory } from '@cugetreg/ui/organisms/rating-history';
  import { ScheduleList } from '@cugetreg/ui/organisms/schedule-list';
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

  const { data }: PageProps = $props();
  let personalInfo = $state(data.user);

  let items = $state<ScheduleItem[]>([]);
  let reviews = $state<Review[]>([]);

  let editInfoPopupVisible = $state(false);
  let itemToDelete = $state<ScheduleItem | null>(null);
  let deleteItemPopupVisible = $state(false);
  let newDepartment = $state(personalInfo.department);
  let page = $state(1);
  const limit = 10;
  let hasMoreReviews = $state(true);
  let loadingReviews = $state(false);
  let loadingSchedules = $state(false);

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

  async function changeVisibility(item: ScheduleItem) {
    const { id, isPublic } = item;

    console.log(id, isPublic);

    // TODO: Implement and use user-cart updateCartListMeta()
    const [res, error] = await tryCatch(
      api.patch(`/carts/${id}`, {
        visible: isPublic ? 'PUB' : 'PVT',
      }),
    );

    if (error || !res) {
      console.error(error.message);
      return;
    }
  }

  async function deleteSchedule(id: string) {
    // TODO: Implement and use user-cart deleteCart(id)
    const [res, error] = await tryCatch(api.delete(`/carts/${id}`));

    if (error || !res) {
      console.error(error.message);
      return;
    }

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
    fetchReviews(1, true);
  });
</script>

<div class="relative flex min-h-screen flex-col bg-white">
  <div class="container mx-auto flex justify-center gap-20 p-8">
    <div class="flex w-3/4 max-w-lg flex-col gap-10 px-6 py-8">
      <PersonalInfo onEdit={toggleEditInfo} {...personalInfo} />
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
      onDelete={onDeleteItem}
      onChangeVisibility={changeVisibility}
    />
  </div>
  {#if editInfoPopupVisible}
    <div
      class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black/50"
    >
      <EditPersonalInfo
        bind:department={newDepartment}
        accountEmail={personalInfo.accountEmail}
        accountProvider={personalInfo.accountProvider}
        faculty={personalInfo.faculty}
        firstName={personalInfo.firstName}
        lastName={personalInfo.lastName}
        username={personalInfo.username}
        onCancel={onCancelChange}
        onConfirm={onConfirmChange}
      />
    </div>
  {/if}
  {#if deleteItemPopupVisible}
    <ConfirmDeleteSchedule
      onCancel={onCancelDelete}
      onConfirm={onConfirmDelete}
      scheduleName={itemToDelete?.title}
    />
  {/if}
  <a
    class="fixed right-6 bottom-6 z-50 inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-blue-700 px-4 py-1"
    href="https://docs.google.com/forms/d/e/1FAIpQLScH2AZyifTnBVXiJBtyzM73MReGX2vpM1_I9IWQfABMduVgsg/viewform?usp=dialog"
    target="_blank"
    rel="noopener noreferrer"
  >
    <TriangleAlert width={16} height={16} color="#172554" />
    <span class="text-xs">แจ้งปัญหาการใช้งาน</span>
  </a>
</div>
