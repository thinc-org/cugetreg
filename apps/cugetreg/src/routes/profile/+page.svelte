<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  import { api } from '$lib/api';
  import { tryCatch } from '$lib/async-handler';
  import { convertSchedulesInfo } from '$lib/utils/scheduleInfo';
  import { convertUserInfo } from '$lib/utils/user';

  import { TriangleAlert } from '@lucide/svelte';

  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';
  import { EditPersonalInfo } from '@cugetreg/ui/organisms/edit-personal-info';
  import { PersonalInfo } from '@cugetreg/ui/organisms/personal-info';
  import { RatingHistory } from '@cugetreg/ui/organisms/rating-history';
  import { ScheduleList } from '@cugetreg/ui/organisms/schedule-list';
  import {
    ListCartsResponseSchema,
    UpdateUserInfoResponseSchema,
  } from '@cugetreg/zod-schemas';

  import type { PageProps } from './$types';

  interface ScheduleItem {
    id: string;
    title: string;
    subtitle: string;
    isPublic: boolean;
  }

  const { data }: PageProps = $props();
  let personalInfo = $state(data.user);

  let items = $state<ScheduleItem[]>([]);

  let terms = [
    '2569 ภาคฤดูร้อน',
    '2569 ภาคปลาย',
    '2569 ภาคต้น',
    '2568 ภาคฤดูร้อน',
    '2568 ภาคปลาย',
    '2568 ภาคต้น',
    '2567 ภาคฤดูร้อน',
    '2567 ภาคปลาย',
    '2567 ภาคต้น',
    '2566 ภาคฤดูร้อน',
    '2566 ภาคปลาย',
    '2566 ภาคต้น',
    '2565 ภาคปลาย',
  ];

  let selectedTerm = $state('2569 ภาคต้น');
  let editInfoPopupVisible = $state(false);
  let itemToDelete = $state<ScheduleItem | null>(null);
  let deleteItemPopupVisible = $state(false);
  let newDepartment = $state(personalInfo.department);

  async function updateUser() {
    const updatedUser = {
      name: personalInfo.name,
      faculty: personalInfo.faculty,
      department: newDepartment,
    };

    const [res, error] = await tryCatch(
      api.patch(`${PUBLIC_API_URL}/api/v1/user`, updatedUser),
    );

    if (error || res.status !== 200) {
      console.error(error?.message);
      return;
    }

    const { user } = UpdateUserInfoResponseSchema.parse(res.data);
    personalInfo = convertUserInfo(user);
    editInfoPopupVisible = false;
  }

  async function fetchScheduleItems() {
    const [academicYear, semester] = selectedTerm.split(' ');

    const semesters: Record<string, string> = {
      ภาคต้น: 'FIRST',
      ภาคปลาย: 'SECOND',
      ภาคฤดูร้อน: 'SUMMER',
    };

    const query = new URLSearchParams({
      academicYear,
      semester: semesters[semester],
    });
    const [res, error] = await tryCatch(
      api.get(`${PUBLIC_API_URL}/api/v1/carts?${query.toString()}`),
    );

    if (error || res.status !== 200) {
      console.error(error?.message);
      return;
    }

    const { data } = ListCartsResponseSchema.parse(res.data);
    const fetchedItems = convertSchedulesInfo(data);
    items = fetchedItems;
  }

  async function changeVisibility(item: ScheduleItem) {
    const { id, isPublic } = item;

    console.log(id, isPublic);

    const [res, error] = await tryCatch(
      api.patch(`${PUBLIC_API_URL}/api/v1/carts/${id}`, {
        visible: isPublic ? 'PUB' : 'PVT',
      }),
    );

    if (error || !res) {
      console.error(error.message);
      return;
    }
  }

  async function deleteSchedule(id: string) {
    const [res, error] = await tryCatch(
      api.delete(`${PUBLIC_API_URL}/api/v1/carts/${id}`),
    );

    if (error || !res) {
      console.error(error.message);
      return;
    }

    items = items.filter((item) => item.id !== id);
    deleteItemPopupVisible = false;
    itemToDelete = null;
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

  const onSelectTerm = (term: string) => {
    selectedTerm = term;
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
    selectedTerm;
    items;
    fetchScheduleItems();
  });
</script>

<div class="relative flex min-h-screen flex-col bg-white">
  <div class="container mx-auto flex justify-center gap-20 p-8">
    <div class="flex w-3/4 max-w-lg flex-col gap-10 px-6 py-8">
      <PersonalInfo onEdit={toggleEditInfo} {...personalInfo} />
      <RatingHistory />
    </div>
    <ScheduleList
      heading="ตารางเรียน"
      {items}
      {terms}
      bind:selectedTerm
      {onSelectTerm}
      onDelete={onDeleteItem}
      onChangeVisibility={changeVisibility}
    />
  </div>
  {#if editInfoPopupVisible}
    <div
      class="absolute inset-0 z-10 flex items-center justify-center bg-black/50"
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
  <div
    class="fixed right-6 bottom-6 z-50 inline-flex cursor-default items-center gap-2 rounded-full border-2 border-blue-700 px-6 py-1"
  >
    <TriangleAlert width={16} height={16} color="#172554" />
    <span class="text-xs">แจ้งปัญหาการใช้งาน</span>
  </div>
</div>
