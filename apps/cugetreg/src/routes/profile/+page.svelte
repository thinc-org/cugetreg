<script lang="ts">
  import { TriangleAlert } from '@lucide/svelte';

  import { EditPersonalInfo } from '@cugetreg/ui/organisms/edit-personal-info';
  import { PersonalInfo } from '@cugetreg/ui/organisms/personal-info';
  import { RatingHistory } from '@cugetreg/ui/organisms/rating-history';
  import { ScheduleList } from '@cugetreg/ui/organisms/schedule-list';
  import { ConfirmDeleteSchedule } from '@cugetreg/ui/molecules/confirm-delete-schedule';

  interface ScheduleItem {
    id: string;
    title: string;
    subtitle: string;
    isPublic: boolean;
  }

  let personalInfo = $state({
    username: '6534344444',
    firstName: 'Wanrudee',
    lastName: 'Kittichaiyakorn',
    faculty: 'วิศวกรรมศาสตร์',
    department: '',
    accountProvider: 'Google',
    accountEmail: '6534344444@student.chula.ac.th',
  });

  let items = $state<ScheduleItem[]>([
    {
      id: '1',
      title: 'ทวิภาค 2567 ภาคต้น',
      subtitle: 'ทวิภาค 2567 / ภาคต้น',
      isPublic: true,
    },
    {
      id: '2',
      title: 'ทวิภาค 2566 ภาคต้น',
      subtitle: 'ทวิภาค 2566 / ภาคต้น',
      isPublic: false,
    },
    {
      id: '3',
      title: 'ทวิภาค 2566 ภาคต้น',
      subtitle: 'ทวิภาค 2566 / ภาคต้น',
      isPublic: false,
    },
    {
      id: '4',
      title: 'ทวิภาค 2566 ภาคต้น',
      subtitle: 'ทวิภาค 2566 / ภาคต้น',
      isPublic: true,
    },
    {
      id: '5',
      title: 'OK',
      subtitle: 'ทวิภาค 2567 / ภาคปลาย',
      isPublic: true,
    },
    {
      id: '6',
      title: 'yyyyy',
      subtitle: 'ทวิภาค 2568 / ภาคต้น',
      isPublic: true,
    },
  ]);

  let selectedTerm = $state('ทวิภาค 2567 ภาคต้น');
  let editInfoPopupVisible = $state(false);
  let itemToDelete = $state<ScheduleItem | null>(null);
  let deleteItemPopupVisible = $state(false);
  let newDepartment = $state(personalInfo.department);

  let terms = $derived([
    ...new Set(
      items.map(({ subtitle }) => {
        const [studyProgram, academicYear, _, semester] = subtitle.split(' ');
        return [studyProgram, academicYear, semester].join(' ');
      }),
    ),
  ]);

  const toggleEditInfo = () => {
    editInfoPopupVisible = true;
  };

  const onCancelChange = () => {
    newDepartment = personalInfo.department;
    editInfoPopupVisible = false;
  };

  const onConfirmChange = () => {
    newDepartment = newDepartment || '-';
    personalInfo.department = newDepartment;
    editInfoPopupVisible = false;
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

  let onConfirmDelete = () => {
    const id = itemToDelete?.id;
    items = items.filter((item) => item.id !== id);
    deleteItemPopupVisible = false;
    itemToDelete = null;
  };
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
      onInsert={() => {}}
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
