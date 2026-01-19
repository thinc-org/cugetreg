<script lang="ts">
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import { PersonalInfo } from '@cugetreg/ui/organisms/personal-info'
  import { EditPersonalInfo } from '@cugetreg/ui/organisms/edit-personal-info'
  import { RatingHistory } from '@cugetreg/ui/organisms/rating-history'
  import { ScheduleList } from '@cugetreg/ui/organisms/schedule-list'

  let isEditOpen = $state(false)
  let department = $state('-')
  let editDepartment = $state(department)
</script>

<div class="min-h-screen bg-surface">
  <Navbar isLoggedIn name="Wanrudee Kittichaiyakorn" id="6534344444" />
  <main class="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="flex flex-col gap-8">
        <PersonalInfo
          name="Wanrudee Kittichaiyakorn"
          id="6534344444"
          username="6534344444"
          firstName="Wanrudee"
          lastName="Kittichaiyakorn"
          faculty="วิศวกรรมศาสตร์"
          department={department}
          accountEmail="6534344444@student.chula.ac.th"
          onEdit={() => {
            editDepartment = department
            isEditOpen = true
          }}
        />
        <RatingHistory  />
      </div>
      <div class="flex flex-col gap-4">
        <ScheduleList
          heading="ตารางเรียน"
          selectedTerm="ทวิภาค 2566 ภาคต้น"
          terms={[
            'ตารางที่ 1',
            'ลองสร้าง ถ้าชื่อยาวเกินไปรอ?...',
            'ตารางที่ 4',
            'ทวิภาค 2566 ภาคต้น',
          ]}
        />
      </div>
    </div>
  </main>
</div>

{#if isEditOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-500/60 p-4"
    role="presentation"
    onclick={() => (isEditOpen = false)}
  >
    <div role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
      <EditPersonalInfo
        username="6534344444"
        firstName="Wanrudee"
        lastName="Kittichaiyakorn"
        faculty="วิศวกรรมศาสตร์"
        bind:department={editDepartment}
        accountEmail="6534344444@student.chula.ac.th"
        onCancel={() => {
          editDepartment = department
          isEditOpen = false
        }}
        onConfirm={() => {
          department = editDepartment || '-'
          isEditOpen = false
        }}
      />
    </div>
  </div>
{/if}